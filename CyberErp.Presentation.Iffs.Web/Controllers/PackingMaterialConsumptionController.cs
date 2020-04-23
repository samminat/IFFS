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
    public class PackingMaterialConsumptionController : DirectController
    {
        #region Members

        private readonly DbContext _context;
        private readonly BaseModel<iffsPackingMaterialConsumption> _PackingMaterialConsumption;
        private readonly BaseModel<iffsPackingMaterialHeader> _PackingMaterial;
        private readonly BaseModel<iffsPackingMaterialDetail> _PackingMaterialDetail;
        private readonly BaseModel<iffsPackingCrateAndBoxConsumption> _CrateAndBoxConsumption;
        private readonly BaseModel<iffsCrateAndBoxRequestDetail> _CrateAndBoxRequestDetail;
        private readonly BaseModel<iffsDocumentNoSetting> _documentNoSetting;
        private readonly BaseModel<iffsLupClientStatus> _ClientStatus;
        private readonly BaseModel<iffsLupRoomType> _RoomType;
        private readonly BaseModel<iffsOperation> _operation;
        private readonly BaseModel<hrmsEmployee> _employee;
        private readonly Utility _utils = new Utility();
        private readonly Lookups _lookup;

        private readonly BaseModel<iffsUserOperationTypeMapping> _userOperationMapping;

        #endregion

        #region Constructor

        public PackingMaterialConsumptionController()
        {
            _context = new ErpEntities(Constants.ConnectionString);
            _PackingMaterial = new BaseModel<iffsPackingMaterialHeader>(_context);
            _PackingMaterialDetail = new BaseModel<iffsPackingMaterialDetail>(_context);
            _PackingMaterialConsumption = new BaseModel<iffsPackingMaterialConsumption>(_context);
            _CrateAndBoxConsumption = new BaseModel<iffsPackingCrateAndBoxConsumption>(_context);
            _CrateAndBoxRequestDetail = new BaseModel<iffsCrateAndBoxRequestDetail>(_context);
            _documentNoSetting = new BaseModel<iffsDocumentNoSetting>(_context);
            _lookup = new Lookups(_context);
            _ClientStatus = new BaseModel<iffsLupClientStatus>(_context);
            _userOperationMapping = new BaseModel<iffsUserOperationTypeMapping>(_context);
            _operation = new BaseModel<iffsOperation>(_context);
            _RoomType = new BaseModel<iffsLupRoomType>(_context);
            _employee = new BaseModel<hrmsEmployee>(_context);
        }

        #endregion

        #region Actions

        public ActionResult GetAllMaterial(int start, int limit, string sort, string dir, string param)
        {
            var hashtable = JsonConvert.DeserializeObject<Hashtable>(param);
            var searchText = hashtable["searchText"].ToString();

            var records = _PackingMaterial.GetAll().AsQueryable().ToList();
            records = searchText != "" ? records.Where(p => p.Number.ToUpper().Contains(searchText.ToUpper()) ||
                 p.ToDept.ToUpper().Contains(searchText.ToUpper()) ||
               p.RequestedDept.ToUpper().Contains(searchText.ToUpper())).ToList() : records.ToList();

            var count = records.Count();
            records = records.OrderBy(o => o.PreparedDate).Skip(start).Take(limit).ToList();

            var PackingMaterialConsumptions = records.Select(item => new
            {
                item.Id,
                item.Number,
                item.ToDept,
                item.RequestedDept,
                item.RequestedDate,
                item.IsViewed
            }).ToList();
            var result = new { total = count, data = PackingMaterialConsumptions };
            return this.Json(result);
        }
        public ActionResult GetMeasurementUnits(object query)
        {
            var ht = JsonConvert.DeserializeObject<Hashtable>(query.ToString());
            var quarystring = "";
            if (ht != null && ht["query"] != null)
                quarystring = ht["query"].ToString();
            var lookup = quarystring != "" ? _lookup.GetAll(Lookups.MeasurementUnit).Where(t => t.Name.ToUpper().StartsWith(quarystring.ToUpper())).OrderBy(l => l.Code) :
                _lookup.GetAll(Lookups.MeasurementUnit).OrderBy(l => l.Code);
            var result = new
            {
                total = lookup.Count(),
                data = lookup
            };
            return this.Json(result);
        }
        public ActionResult GetAllMaterialDetail(int start, int limit, string sort, string dir, string param)
        {
            var hashtable = JsonConvert.DeserializeObject<Hashtable>(param);
            int headerId = 0;
            int.TryParse(hashtable["HeaderId"].ToString(), out headerId);

            var records = _PackingMaterialConsumption.GetAll().AsQueryable().ToList();
            records = records.Where(p => p.iffsPackingMaterialDetail.HeaderId.Equals(headerId)).ToList();

            var materials = _PackingMaterialDetail.GetAll().AsQueryable().ToList();
            materials = materials.Where(p => p.HeaderId.Equals(headerId)).ToList();
            //var count = records.Count();
            //records = records.OrderBy(o => o.iffsPackingMaterialDetail.Description).Skip(start).Take(limit).ToList();


            var PackingMaterialConsumption = from mat in materials
                                             join rec in records
                                     on mat.Id equals rec.PackingMaterialId into matConsumptions
                                             where mat.HeaderId == headerId

                                             from matConsumption in matConsumptions.DefaultIfEmpty()
                                             select new
                                             {
                                                 Id = GetMatId(matConsumption),
                                                 PackingMaterialId = mat.Id,
                                                 mat.Description,
                                                 Requested = mat.Qty,
                                                 Consumed = matConsumption != null ? matConsumption.Consumed : 0,
                                                 Returned = matConsumption != null ? matConsumption.Returned : 0,
                                                 Remarks = matConsumption != null ? matConsumption.Remarks : "",
                                                 MeasurmentUnit = mat.MeasurmentUnit,
                                             }
                                            ;
            //var PackingMaterialConsumption = records.Select(item => new
            //{
            //    item.Id,
            //    item.PackingMaterialId,
            //    item.iffsPackingMaterialDetail.Description,
            //    item.Date,
            //    item.Requested,
            //    item.Consumed,
            //    item.Returned,
            //    item.Reamrks,
            //    MeasurmentUnit = item.lupMeasurementUnit.Name
            //}).ToList();
            var result = new { data = PackingMaterialConsumption };
            return this.Json(result);
        }
        public ActionResult GetAllCrateAndBoxDetail(int start, int limit, string sort, string dir, string param)
        {
            var hashtable = JsonConvert.DeserializeObject<Hashtable>(param);
            int headerId = 0;
            int.TryParse(hashtable["HeaderId"].ToString(), out headerId);

            var records = _CrateAndBoxConsumption.GetAll().AsQueryable().ToList();
            records = records.Where(p => p.iffsCrateAndBoxRequestDetail.HeaderId.Equals(headerId)).ToList();

            var materials = _CrateAndBoxRequestDetail.GetAll().AsQueryable().ToList();
            materials = materials.Where(p => p.HeaderId.Equals(headerId)).ToList();
            //var count = records.Count();
            //records = records.OrderBy(o => o.iffsPackingMaterialDetail.Description).Skip(start).Take(limit).ToList();


            var filtered = from mat in materials
                           join rec in records
                           on mat.Id equals rec.CrateAndBoxDetailId into matConsumptions
                           where mat.HeaderId == headerId
                           from matConsumption in matConsumptions.DefaultIfEmpty()
                           select new
                           {
                               Id = GetCrateAndBoxId(matConsumption),
                               CrateAndBoxDetailId = mat.Id,
                               BoxType = mat.iffsLupBoxType.Name,
                               Requested = mat.Qty,
                               mat.Length,
                               mat.Width,
                               mat.Height,
                               Consumed = matConsumption != null ? matConsumption.Consumed : 0,
                               Returned = matConsumption != null ? matConsumption.Returned : 0,
                               Remarks = matConsumption != null ? matConsumption.Remarks : "",
                               MeasurmentUnit = mat.MeasurmentId,
                           };
            var result = new { data = filtered };
            return this.Json(result);
        }
        private object GetCrateAndBoxId(iffsPackingCrateAndBoxConsumption obj)
        {
            if (obj != null)
                return obj.Id;
            else
                return null;
        }
        private object GetMatId(iffsPackingMaterialConsumption obj)
        {
            if (obj != null)
                return obj.Id;
            else
                return null;
        }
        [FormHandler]
        public DirectResult Save(iffsPackingMaterialConsumption PackingMaterialConsumption)
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
                    if (PackingMaterialConsumption.Id.Equals(0))
                    {
                        //PackingMaterialConsumption.PreparedById = employeeId;
                        //PackingMaterialConsumption.PreparedDate = DateTime.Now;

                        /* ***************************************************
                        * Concurrency controlling scheme using global locking                                              
                        * ***************************************************/

                        //  var objOperationType = _lookup.GetAll((Lookups.LupOperationType)).Where(o => o.Id == PackingMaterialConsumption.Id).FirstOrDefault();
                        CyberErp.Presentation.Iffs.Web.MvcApplication httpapplication = HttpContext.ApplicationInstance as CyberErp.Presentation.Iffs.Web.MvcApplication;
                        httpapplication.Application.Lock();
                        // PackingMaterialConsumption.Number = GetDocumentNumber("PackingMaterialConsumption");//objOperationType.Code + "/" + 
                        _PackingMaterialConsumption.AddNew(PackingMaterialConsumption);
                        // UpdateDocumentNumber("PackingMaterialConsumption");
                        httpapplication.Application.UnLock();
                    }
                    else
                    {
                        _PackingMaterialConsumption.Edit(PackingMaterialConsumption);
                    }
                    _context.SaveChanges();
                    transaction.Complete();
                    return this.Json(new { success = true, HeaderId = PackingMaterialConsumption.Id, data = "Packing Material Consumption has been saved Successfully!" });
                }
                catch (Exception exception)
                {
                    return this.Json(new { success = false, data = exception.InnerException != null ? exception.InnerException.Message : exception.Message });
                }
            }
        }
        public ActionResult SaveMaterialConsumption(int PackingId, List<iffsPackingMaterialConsumption> PackingMaterialConsumption)
        {
            using (var transaction = new TransactionScope())
            {
                _context.Database.Connection.Open();
                try
                {
                    foreach (var item in PackingMaterialConsumption)
                    {
                        item.Date = DateTime.Now;
                        item.HeaderId = PackingId;
                        if (item.Id.Equals(0))
                        {
                            _PackingMaterialConsumption.AddNew(item);
                        }
                        else
                        {
                            _PackingMaterialConsumption.Edit(item);
                        }
                    }
                    _context.SaveChanges();
                    transaction.Complete();
                    return this.Json(new { success = true, data = " Packing Material Consumption has been saved successfully!" });
                }
                catch (Exception exception)
                {
                    return this.Json(new { success = false, data = exception.InnerException.Message });
                }
            }
        }
        public ActionResult SaveCrateAndBoxConsumption(int PackingId, List<iffsPackingCrateAndBoxConsumption> PackingMaterialConsumption)
        {
            using (var transaction = new TransactionScope())
            {
                _context.Database.Connection.Open();
                try
                {
                    foreach (var item in PackingMaterialConsumption)
                    {
                        item.Date = DateTime.Now;
                        item.HeaderId = PackingId;
                        if (item.Id.Equals(0))
                        {
                            _CrateAndBoxConsumption.AddNew(item);
                        }
                        else
                        {
                            _CrateAndBoxConsumption.Edit(item);
                        }
                    }
                    _context.SaveChanges();
                    transaction.Complete();
                    return this.Json(new { success = true, data = " Packing Material Consumption has been saved successfully!" });
                }
                catch (Exception exception)
                {
                    return this.Json(new { success = false, data = exception.InnerException.Message });
                }
            }
        }

        public string GetDocumentNumber(string documentType)
        {
            try
            {
                var objDocumentNoSetting = _documentNoSetting.GetAll().Where(o => o.DocumentType == documentType).FirstOrDefault();
                var format = GetDocumentFormat(objDocumentNoSetting.NoOfDigit);
                var documentNo = string.Format(format, objDocumentNoSetting.CurrentNo);
                documentNo = objDocumentNoSetting.Prefix + "/" + documentNo;
                if (objDocumentNoSetting.Year != null && objDocumentNoSetting.Year > 0)
                    documentNo = documentNo + "/" + objDocumentNoSetting.Year;
                if (objDocumentNoSetting.SurFix != null && objDocumentNoSetting.SurFix != "")
                    documentNo = documentNo + "/" + objDocumentNoSetting.SurFix;
                return documentNo;
            }
            catch (Exception)
            {
                return string.Empty;
            }
        }

        public void UpdateDocumentNumber(string documentType)
        {
            var objDocumentNoSetting = _documentNoSetting.GetAll().Where(o => o.DocumentType == documentType).FirstOrDefault();
            if (objDocumentNoSetting != null)
            {
                objDocumentNoSetting.CurrentNo += 1;
            }
            _context.SaveChanges();
        }

        public string GetDocumentFormat(int numberOfDigits)
        {
            var format = "{0:";
            for (var i = 0; i < numberOfDigits; i++)
            {
                format += "0";
            }
            format += "}";
            return format;
        }
        public ActionResult Delete(int id)
        {
            try
            {
                _PackingMaterialConsumption.Delete(c => c.Id == id);

                return this.Json(new { success = true, data = "Record has been successfully deleted!" });
            }
            catch (Exception)
            {
                return this.Json(new { success = false, data = "Could not delete the selected record!" });
            }
        }
        public void ExportToExcel()
        {
            var searchText = Request.QueryString["st"].ToString();

            var records = _PackingMaterialConsumption.GetAll().AsQueryable();
            records = searchText != "" ? records.Where(p => p.iffsPackingMaterialDetail.Description.ToUpper().Contains(searchText.ToUpper())) : records;

            var PackingMaterialConsumptions = records.Select(record => new
            {

                record.iffsPackingMaterialDetail.Description,
                record.Date,
                record.Requested,
                record.Consumed,
                record.Returned,
                record.Remarks,
                MeasurmentUnit = record.iffsPackingMaterialDetail.lupMeasurementUnit.Name
            }).ToList().Select(record => new
            {
                record.Description,
                record.Date,
                record.Requested,
                record.Consumed,
                record.Returned,
                record.Remarks,
                record.MeasurmentUnit

            });

            var exportToExcelHelper = new ExportToExcelHelper();
            exportToExcelHelper.ToExcel(Response, PackingMaterialConsumptions);
        }

        #endregion
    }

}