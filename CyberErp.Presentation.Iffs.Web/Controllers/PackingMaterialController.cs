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
    public class PackingMaterialController : DirectController
    {
        #region Members

        private readonly DbContext _context;
        private readonly BaseModel<iffsPackingMaterialHeader> _PackingMaterialHeader;
        private readonly BaseModel<iffsPackingMaterialDetail> _PackingMaterialDetail;
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

        public PackingMaterialController()
        {
            _context = new ErpEntities(Constants.ConnectionString);
            _PackingMaterialHeader = new BaseModel<iffsPackingMaterialHeader>(_context);
            _PackingMaterialDetail = new BaseModel<iffsPackingMaterialDetail>(_context);
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

        public ActionResult Get(int id)
        {
            var obj = _PackingMaterialHeader.Get(c => c.Id == id);

            var PackingMaterialTemplate = new
            {
                obj.Id,
                obj.SurveyId,
                obj.RequestedDate,
                obj.Number,
                obj.OperationId,
                obj.PreparedDate,
                obj.PreparedById,
                obj.RequestedDept,
                obj.ToDept,
            };
            return this.Json(new
            {
                success = true,
                data = PackingMaterialTemplate
            });
        }
        public DirectResult GetOperations()
        {
            var filtered = _operation.GetAll().Where(o => !o.IsDeleted);
            var count = filtered.Count();
            var Surveys = filtered.Select(record => new
            {
                record.Id,
                Number = record.OperationNo,
            });
            var result = new
            {
                total = count,
                data = Surveys
            };
            return Json(result);
        }
        public ActionResult GetAll(int start, int limit, string sort, string dir, string param)
        {
            var hashtable = JsonConvert.DeserializeObject<Hashtable>(param);
            var searchText = hashtable["searchText"].ToString();
            int operationId = 0;
            int.TryParse(hashtable["OperationId"].ToString(), out operationId);

            var records = _PackingMaterialHeader.GetAll().AsQueryable().ToList();
            records = searchText != "" ? records.Where(p => p.Number.ToUpper().Contains(searchText.ToUpper()) ||
                 p.ToDept.ToUpper().Contains(searchText.ToUpper()) ||
               p.RequestedDept.ToUpper().Contains(searchText.ToUpper())).ToList() : records.ToList();

            //Filter Packing Materials With Their operation Id
            records = operationId != 0 ? records.Where(r => r.OperationId == operationId).ToList() : records.ToList();

            var count = records.Count();
            records = records.OrderBy(o => o.PreparedDate).Skip(start).Take(limit).ToList();

            var PackingMaterials = records.Select(item => new
            {
                item.Id,
                item.Number,
                PreparedBy = GetFullName(item.PreparedById),
                CheckedBy = item.CheckedById.HasValue ? GetFullName(item.CheckedById.Value) : "",
                ApprovedBy = item.ApprovedById.HasValue ? GetFullName(item.ApprovedById.Value) : "",
                item.ApprovalDate,
                item.CheckedDate,
                item.PreparedDate,
                item.ToDept,
                item.RequestedDept,
                item.RequestedDate,
                item.IsViewed
            }).ToList();
            var result = new { total = count, data = PackingMaterials };
            return this.Json(result);
        }
        private string GetFullName(int empId)
        {
            string fullName = "";
            var employee = _employee.Get(e => e.Id == empId);
            if (employee != null)
            {
                fullName = employee.corePerson.FirstName + " " + employee.corePerson.FatherName + " " + employee.corePerson.GrandFatherName;
            }
            return fullName;
        }
        public ActionResult GetAllDetail(int start, int limit, string sort, string dir, string param)
        {
            var hashtable = JsonConvert.DeserializeObject<Hashtable>(param);
            int headerId = 0;
            int.TryParse(hashtable["HeaderId"].ToString(), out headerId);

            var records = _PackingMaterialDetail.GetAll().AsQueryable().ToList();
            records = records.Where(p => p.HeaderId.Equals(headerId)).ToList();

            var count = records.Count();
            records = records.OrderBy(o => o.Description).Skip(start).Take(limit).ToList();

            var PackingMaterialDetails = records.Select(item => new
            {
                item.Id,
                HeaderId = item.HeaderId,
                item.Description,
                item.MeasurmentUnit,
                item.GRNNumber,
                item.Qty,
                item.Remark
            }).ToList();
            var result = new { total = count, data = PackingMaterialDetails };
            return this.Json(result);
        }

        [FormHandler]
        public DirectResult Save(iffsPackingMaterialHeader PackingMaterial)
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
                    if (PackingMaterial.Id.Equals(0))
                    {
                        PackingMaterial.PreparedById = employeeId;
                        PackingMaterial.PreparedDate = DateTime.Now;

                        /* ***************************************************
                        * Concurrency controlling scheme using global locking                                              
                        * ***************************************************/

                        //  var objOperationType = _lookup.GetAll((Lookups.LupOperationType)).Where(o => o.Id == PackingMaterial.Id).FirstOrDefault();
                        CyberErp.Presentation.Iffs.Web.MvcApplication httpapplication = HttpContext.ApplicationInstance as CyberErp.Presentation.Iffs.Web.MvcApplication;
                        httpapplication.Application.Lock();
                        PackingMaterial.Number = GetDocumentNumber("PackingMaterial");//objOperationType.Code + "/" + 
                        _PackingMaterialHeader.AddNew(PackingMaterial);
                        UpdateDocumentNumber("PackingMaterial");
                        httpapplication.Application.UnLock();
                    }
                    else
                    {
                        _PackingMaterialHeader.Edit(PackingMaterial);
                    }
                    _context.SaveChanges();
                    transaction.Complete();
                    return this.Json(new { success = true, HeaderId = PackingMaterial.Id, data = "Packing Request has been saved Successfully!" });
                }
                catch (Exception exception)
                {
                    return this.Json(new { success = false, data = exception.InnerException != null ? exception.InnerException.Message : exception.Message });
                }
            }
        }
        public ActionResult SaveDetail(int headerId, List<iffsPackingMaterialDetail> PackingMaterialDetail)
        {
            using (var transaction = new TransactionScope())
            {
                _context.Database.Connection.Open();
                try
                {
                    foreach (var item in PackingMaterialDetail)
                    {
                        item.HeaderId = headerId;
                        if (item.Id.Equals(0))
                        {
                            _PackingMaterialDetail.AddNew(item);
                        }
                        else
                        {
                            _PackingMaterialDetail.Edit(item);
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
            using (var transaction = new TransactionScope())
            {
                _context.Database.Connection.Open();
                try
                {
                    var detail = _PackingMaterialDetail.GetAll().Where(d => d.HeaderId == id).Select(item => new { item.Id }).ToList();
                    foreach (var item in detail)
                    {
                        _PackingMaterialDetail.Delete(c => c.Id == item.Id);
                    }
                    _PackingMaterialHeader.Delete(c => c.Id == id);
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
        public ActionResult DeleteDetial(int id)
        {
            try
            {
                _PackingMaterialDetail.Delete(c => c.Id == id);

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

            var records = _PackingMaterialHeader.GetAll().AsQueryable();
            records = searchText != "" ? records.Where(p => p.Number.ToUpper().Contains(searchText.ToUpper()) ||
                p.ToDept.ToUpper().Contains(searchText.ToUpper()) ||
                p.RequestedDept.ToUpper().Contains(searchText.ToUpper())) : records;

            var PackingMaterials = records.Select(record => new
            {
                record.Number,
                PreparedBy = GetFullName(record.PreparedById),
                CheckedBy = record.CheckedById.HasValue ? GetFullName(record.CheckedById.Value) : "",
                ApprovedBy = record.ApprovedById.HasValue ? GetFullName(record.ApprovedById.Value) : "",
                record.ApprovalDate,
                record.CheckedDate,
                record.PreparedDate,
                record.ToDept,
                record.RequestedDept,
                record.RequestedDate,
            }).ToList().Select(record => new
            {
                record.Number,
                record.ToDept,
                record.RequestedDept,
                record.RequestedDate,
                record.PreparedBy,
                record.CheckedBy,
                record.ApprovedBy,
                record.ApprovalDate,
                record.CheckedDate,
                record.PreparedDate,

            });

            var exportToExcelHelper = new ExportToExcelHelper();
            exportToExcelHelper.ToExcel(Response, PackingMaterials);
        }

        #endregion
    }

}