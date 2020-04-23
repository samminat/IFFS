using CyberErp.Data.Model;
using CyberErp.Presentation.Iffs.Web.Classes;
using Ext.Direct.Mvc;
using Newtonsoft.Json;
using SwiftTederash.Business;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Transactions;
using CyberErp.Business.Component.Iffs;

namespace CyberErp.Presentation.Iffs.Web.Controllers
{
    public class PackingSurveyController : DirectController
    {
        #region Members

        private readonly DbContext _context;
        private readonly PackingSurvey _PackingSurvey;
        private readonly BaseModel<iffsPackingSurveyDetail> _PackingSurveyDetail;
        private readonly BaseModel<iffsPackingMaterial> _PackingMaterialSurvey;
        private readonly BaseModel<iffsSurveyServiceRequest> _SurveyServiceRequest;
        private readonly BaseModel<iffsLupClientStatus> _ClientStatus;
        private readonly BaseModel<iffsLupRoomType> _RoomType;
        private readonly BaseModel<iffsSurveyRequest> _SurveyRequest;
        private readonly Utility _utils = new Utility();
        private readonly Lookups _lookup;

        private readonly BaseModel<iffsUserOperationTypeMapping> _userOperationMapping;

        #endregion

        #region Constructor

        public PackingSurveyController()
        {
            _context = new ErpEntities(Constants.ConnectionString);
            _PackingSurvey = new PackingSurvey(_context);
            _PackingSurveyDetail = new BaseModel<iffsPackingSurveyDetail>(_context);
            _lookup = new Lookups(_context);
            _ClientStatus = new BaseModel<iffsLupClientStatus>(_context);
            _userOperationMapping = new BaseModel<iffsUserOperationTypeMapping>(_context);
            _SurveyRequest = new BaseModel<iffsSurveyRequest>(_context);
            _RoomType = new BaseModel<iffsLupRoomType>(_context);
            _SurveyServiceRequest = new BaseModel<iffsSurveyServiceRequest>(_context);
            _PackingMaterialSurvey = new BaseModel<iffsPackingMaterial>(_context);
        }

        #endregion

        #region Actions

        public ActionResult Get(int id)
        {
            return this.Json(_PackingSurvey.Get(id));
        }
        //public DirectResult GetSurveyRequests()
        //{
        //    var filtered = _SurveyRequest.GetAll().Where(o => !o.IsDeleted);
        //    var count = filtered.Count();
        //    var Surveys = filtered.Select(record => new
        //    {
        //        record.Id,
        //        record.Number,
        //        OrderingClient = record.iffsCustomer.Name
        //    });
        //    var result = new
        //    {
        //        total = count,
        //        data = Surveys
        //    };
        //    return Json(result);
        //}
        public DirectResult GetClientStatus()
        {
            var filtered = _ClientStatus.GetAll().Where(o => !o.IsDeleted);
            var count = filtered.Count();
            var clientsStatus = filtered.Select(record => new
            {
                record.Id,
                record.Name,
                record.Code
            });
            var result = new
            {
                total = count,
                data = clientsStatus
            };
            return Json(result);
        }
        public DirectResult GetRoomTypes()
        {
            var filtered = _RoomType.GetAll().Where(o => !o.IsDeleted);
            var count = filtered.Count();
            var roomTypes = filtered.Select(record => new
            {
                record.Id,
                record.Name,
                record.Code
            });
            var result = new
            {
                total = count,
                data = roomTypes
            };
            return Json(result);
        }
        public ActionResult GetAll(int start, int limit, string sort, string dir, string param)
        {
            var hashtable = JsonConvert.DeserializeObject<Hashtable>(param);
            var searchText = hashtable["searchText"].ToString();

            var result = _PackingSurvey.GetAll(start, limit, sort, dir, searchText);
            return this.Json(result);
        }


        public ActionResult GetAllMaterials(int start, int limit, string sort, string dir, string param)
        {
            var hashtable = JsonConvert.DeserializeObject<Hashtable>(param);
            int headerId = 0, TypeId = 0;
            int.TryParse(hashtable["HeaderId"].ToString(), out headerId);
            //int.TryParse(hashtable["TypeId"].ToString(), out TypeId);
            //MaterialType materialType = TypeId == 1 ? MaterialType.Standard : MaterialType.CrateAndBox;
            var filtered = _PackingMaterialSurvey.FindAllQueryable(p => p.SurveyId.Equals(headerId));

            var count = filtered.Count();
            filtered = filtered.OrderBy(o => o.iffsPackingMaterialList.Name).Skip(start).Take(limit);

            var records = filtered.Select(item => new
            {
                item.Id,
                item.iffsPackingMaterialList.Name,
                item.iffsPackingMaterialList.Description,
                item.iffsPackingMaterialList.MeasurmentUnit,
                MeasurmentUnitRaw = item.iffsPackingMaterialList.lupMeasurementUnit.Name,
                item.iffsPackingMaterialList.SizeCMB,
                item.iffsPackingMaterialList.Length,
                item.iffsPackingMaterialList.Width,
                item.iffsPackingMaterialList.Height,
                item.iffsPackingMaterialList.MaterialType,
                item.Quantity,
                item.Remark
            }).ToList();
            var result = new { total = count, data = records };
            return this.Json(result);
        }
        public ActionResult GetAllDetail(int start, int limit, string sort, string dir, string param)
        {
            var hashtable = JsonConvert.DeserializeObject<Hashtable>(param);
            int headerId = 0;
            int.TryParse(hashtable["HeaderId"].ToString(), out headerId);

            var result = _PackingSurvey.GetAllDetial(start, limit, sort, dir, headerId);
            return this.Json(result);
        }

        [FormHandler]
        public DirectResult Save(iffsPackingSurveyHeader PackingSurvey)
        {
            using (var transaction = new TransactionScope((TransactionScopeOption.Required), new TransactionOptions { IsolationLevel = IsolationLevel.ReadCommitted }))
            {
                _context.Database.Connection.Open();
                _context.Database.CommandTimeout = int.MaxValue;
                try
                {
                    // Request.Params[""]
                    int employeeId = 0;
                    var objUser = (coreUser)Session[Constants.CurrentUser];
                    if (objUser != null && objUser.EmployeeId != null)
                    {
                        employeeId = (int)objUser.EmployeeId;
                    }
                    if (PackingSurvey.Id.Equals(0))
                    {
                        PackingSurvey.SurveyedById = employeeId;
                        PackingSurvey.SurveyDate = DateTime.Now;

                        /* ***************************************************
                        * Concurrency controlling scheme using global locking                                              
                        * ***************************************************/

                        var objOperationType = _lookup.GetAll((Lookups.LupOperationType)).Where(o => o.Id == PackingSurvey.Id).FirstOrDefault();
                        CyberErp.Presentation.Iffs.Web.MvcApplication httpapplication = HttpContext.ApplicationInstance as CyberErp.Presentation.Iffs.Web.MvcApplication;
                        httpapplication.Application.Lock();
                        //  PackingSurvey.Number = GetDocumentNumber("PackingSurvey");//objOperationType.Code + "/" + 
                        _PackingSurvey.Add(PackingSurvey);
                        // UpdateDocumentNumber("PackingSurvey");
                        httpapplication.Application.UnLock();
                    }
                    else
                    {
                        _PackingSurvey.Edit(PackingSurvey);
                    }
                    _context.SaveChanges();
                    transaction.Complete();
                    return this.Json(new { success = true, HeaderId = PackingSurvey.Id, data = "Packing Request has been saved Successfully!" });
                }
                catch (Exception exception)
                {
                    return this.Json(new { success = false, data = exception.InnerException != null ? exception.InnerException.Message : exception.Message });
                }
            }
        }
        public ActionResult SaveMaterial(int headerId, IList<iffsPackingMaterial> packingMaterail)
        {
            using (var transaction = new TransactionScope())
            {
                _context.Database.Connection.Open();
                try
                {
                    foreach (var item in packingMaterail)
                    {
                        item.SurveyId = headerId;
                        if (item.Id.Equals(0))
                        {
                            _PackingMaterialSurvey.AddNew(item);
                        }
                        else
                        {
                            _PackingMaterialSurvey.Edit(item);
                        }
                    }
                    _context.SaveChanges();
                    transaction.Complete();
                    return this.Json(new { success = true, data = " Packing Survey Details has been saved successfully!" });
                }
                catch (Exception exception)
                {
                    return this.Json(new { success = false, data = exception.InnerException.Message });
                }
            }
        }
        public ActionResult SaveDetail(int headerId, List<iffsPackingSurveyDetail> PackingSurveyDetail)
        {
            using (var transaction = new TransactionScope())
            {
                _context.Database.Connection.Open();
                try
                {
                    foreach (var item in PackingSurveyDetail)
                    {
                        item.HeaderId = headerId;
                        if (item.Id.Equals(0))
                        {
                            _PackingSurveyDetail.AddNew(item);
                        }
                        else
                        {
                            _PackingSurveyDetail.Edit(item);
                        }
                    }
                    _context.SaveChanges();
                    transaction.Complete();
                    return this.Json(new { success = true, data = " Packing Survey Details has been saved successfully!" });
                }
                catch (Exception exception)
                {
                    return this.Json(new { success = false, data = exception.InnerException.Message });
                }
            }
        }

        public ActionResult DeleteDetail(int id)
        {
            try
            {
                _PackingSurveyDetail.Delete(c => c.Id == id);

                return this.Json(new { success = true, data = "Record has been successfully deleted!" });
            }
            catch (Exception)
            {
                return this.Json(new { success = false, data = "Could not delete the selected record!" });
            }
        }
        public ActionResult SaveSurveyServiceRequest(int PackingId, int serviceId)
        {
            try
            {
                var any = _SurveyServiceRequest.GetAll().Where(s => s.ServiceRequestId == serviceId && s.PackingSurveyId == PackingId && !s.IsDeleted).FirstOrDefault();
                if (any == null)
                {
                    var surveyServiceRequest = new iffsSurveyServiceRequest();
                    surveyServiceRequest.PackingSurveyId = PackingId;
                    surveyServiceRequest.ServiceRequestId = serviceId;
                    _SurveyServiceRequest.AddNew(surveyServiceRequest);
                }

                return this.Json(new { success = true, data = "" });

            }
            catch (Exception ex)
            {
                return this.Json(new { success = false, data = ex.Message });
            }
        }
        public ActionResult Delete(int id)
        {
            using (var transaction = new TransactionScope((TransactionScopeOption.Required), new TransactionOptions { IsolationLevel = IsolationLevel.ReadCommitted }))
            {
                _context.Database.Connection.Open();
                _context.Database.CommandTimeout = int.MaxValue;
                try
                {
                    var details = _PackingSurveyDetail.GetAll().Where(d => d.HeaderId == id);
                    foreach (var item in details)
                    {
                        _PackingSurveyDetail.Delete(d => d.Id == item.Id);
                    }
                    _PackingSurvey.Delete(c => c.Id == id);
                    _context.SaveChanges();
                    transaction.Complete();
                    return this.Json(new { success = true, data = "Record has been successfully deleted!" });
                }
                catch (Exception)
                {
                    return this.Json(new { success = false, data = "Could not delete the selected record!" });
                }
            }
        }
        public void ExportToExcel()
        {
            var searchText = Request.QueryString["st"].ToString();

            var exportToExcelHelper = new ExportToExcelHelper();
            exportToExcelHelper.ToExcel(Response, _PackingSurvey.ExportToExcel(searchText));
        }

        #endregion
    }

}