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
    public class PackingCrateAndBoxRequestController : DirectController
    {
        #region Members

        private readonly DbContext _context;
        private readonly BaseModel<iffsCrateAndBoxRequestHeader> _CrateAndBoxRequestHeader;
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

        public PackingCrateAndBoxRequestController()
        {
            _context = new ErpEntities(Constants.ConnectionString);
            _CrateAndBoxRequestHeader = new BaseModel<iffsCrateAndBoxRequestHeader>(_context);
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

        public ActionResult Get(int id)
        {
            var obj = _CrateAndBoxRequestHeader.Get(c => c.Id == id);

            var PackingCrateAndBoxRequestTemplate = new
            {
                obj.Id,
                obj.OperationId,
                obj.SurveyId,
                obj.OrderNumber,
                obj.PrevOrderNumber,
                obj.PreparedDate,
                obj.RequestedDate,
                obj.PreparedBy,
                obj.IsIronSheetCover,
                obj.ExpectedDelivery,
                obj.Remark
            };
            return this.Json(new
            {
                success = true,
                data = PackingCrateAndBoxRequestTemplate
            });
        }
        public ActionResult GetBoxTypes()
        {
            var lookup = _lookup.GetAll(Lookups.BoxType).OrderBy(l => l.Code);
            var result = new
            {
                total = lookup.Count(),
                data = lookup
            };
            return this.Json(result);
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
            int.TryParse(hashtable["OperationId"].ToString(),out operationId);

            var records = _CrateAndBoxRequestHeader.GetAll().AsQueryable().ToList();
            records = searchText != "" ? records.Where(p => p.OrderNumber.ToUpper().Contains(searchText.ToUpper()) ||
                   p.hrmsEmployeeApprovedBy.corePerson.FatherName.ToUpper().Contains(searchText.ToUpper()) ||
                p.hrmsEmployeePreparedBy.corePerson.GrandFatherName.ToUpper().Contains(searchText.ToUpper())).ToList() : records.ToList();

            //Filter Packing Materials With Their operation Id
            records = operationId != 0 ? records.Where(r => r.OperationId == operationId).ToList() : records.ToList();

            var count = records.Count();
            records = records.OrderBy(o => o.PreparedDate).Skip(start).Take(limit).ToList();

            var PackingCrateAndBoxRequests = records.Select(item => new
            {
                item.Id,
                item.iffsOperation.OperationNo,

                item.OperationId,
                item.OrderNumber,
                item.PrevOrderNumber,
                item.PreparedDate,
                item.RequestedDate,
                item.PreparedBy,
                item.IsIronSheetCover,
                item.ExpectedDelivery,
                item.Remark
            }).ToList();
            var result = new { total = count, data = PackingCrateAndBoxRequests };
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

            var records = _CrateAndBoxRequestDetail.GetAll().AsQueryable().ToList();
            records = records.Where(p => p.HeaderId.Equals(headerId)).ToList();

            var count = records.Count();
            records = records.Skip(start).Take(limit).ToList();

            var PackingCrateAndBoxRequestDetails = records.Select(item => new
            {
                item.Id,
                item.BoxType,
                item.HeaderId,
                item.Height,
                item.Length,
                item.MeasurmentId,
                item.Qty,
                item.Width,
                item.Remark
            }).ToList();
            var result = new { total = count, data = PackingCrateAndBoxRequestDetails };
            return this.Json(result);
        }

        [FormHandler]
        public DirectResult Save(iffsCrateAndBoxRequestHeader PackingCrateAndBoxRequest)
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
                    if (PackingCrateAndBoxRequest.Id.Equals(0))
                    {
                        PackingCrateAndBoxRequest.PreparedBy = employeeId;
                        PackingCrateAndBoxRequest.PreparedDate = DateTime.Now;

                        /* ***************************************************
                        * Concurrency controlling scheme using global locking                                              
                        * ***************************************************/

                        //  var objOperationType = _lookup.GetAll((Lookups.LupOperationType)).Where(o => o.Id == PackingCrateAndBoxRequest.Id).FirstOrDefault();
                        CyberErp.Presentation.Iffs.Web.MvcApplication httpapplication = HttpContext.ApplicationInstance as CyberErp.Presentation.Iffs.Web.MvcApplication;
                        httpapplication.Application.Lock();
                        PackingCrateAndBoxRequest.OrderNumber = GetDocumentNumber("PackingCrateAndBoxRequest");//objOperationType.Code + "/" + 
                        _CrateAndBoxRequestHeader.AddNew(PackingCrateAndBoxRequest);
                        UpdateDocumentNumber("PackingCrateAndBoxRequest");
                        httpapplication.Application.UnLock();
                    }
                    else
                    {
                        _CrateAndBoxRequestHeader.Edit(PackingCrateAndBoxRequest);
                    }
                    _context.SaveChanges();
                    transaction.Complete();
                    return this.Json(new { success = true, HeaderId = PackingCrateAndBoxRequest.Id, data = "Crate And Box Request has been saved Successfully!" });
                }
                catch (Exception exception)
                {
                    return this.Json(new { success = false, data = exception.InnerException != null ? exception.InnerException.Message : exception.Message });
                }
            }
        }
        public ActionResult SaveDetail(int headerId, List<iffsCrateAndBoxRequestDetail> PackingCrateAndBoxRequestDetail)
        {
            using (var transaction = new TransactionScope())
            {
                _context.Database.Connection.Open();
                try
                {
                    foreach (var item in PackingCrateAndBoxRequestDetail)
                    {
                        item.HeaderId = headerId;
                        if (item.Id.Equals(0))
                        {
                            _CrateAndBoxRequestDetail.AddNew(item);
                        }
                        else
                        {
                            _CrateAndBoxRequestDetail.Edit(item);
                        }
                    }
                    _context.SaveChanges();
                    transaction.Complete();
                    return this.Json(new { success = true, data = "Crate And Box Request Details has been saved successfully!" });
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
                    var detail = _CrateAndBoxRequestDetail.GetAll().Where(d => d.HeaderId == id).Select(item => new { item.Id }).ToList();
                    foreach (var item in detail)
                    {
                        _CrateAndBoxRequestDetail.Delete(d => d.Id == item.Id);
                    }
                    _CrateAndBoxRequestHeader.Delete(c => c.Id == id);
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
        public ActionResult DeleteDetail(int id)
        {
            try
            {
                _CrateAndBoxRequestDetail.Delete(c => c.Id == id);

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

            var records = _CrateAndBoxRequestHeader.GetAll().AsQueryable();
            records = searchText != "" ? records.Where(p => p.OrderNumber.ToUpper().Contains(searchText.ToUpper()) ||
                   p.hrmsEmployeeApprovedBy.corePerson.FatherName.ToUpper().Contains(searchText.ToUpper()) ||
                p.hrmsEmployeePreparedBy.corePerson.GrandFatherName.ToUpper().Contains(searchText.ToUpper())) : records;

            var PackingCrateAndBoxRequests = records.Select(record => new
            {
                record.Id,
                record.OperationId,
                record.OrderNumber,
                record.PrevOrderNumber,
                record.PreparedDate,
                record.RequestedDate,
                record.PreparedBy,
                record.IsIronSheetCover,
                record.Remark
            }).ToList().Select(record => new
            {
                record.Id,
                record.OperationId,
                record.OrderNumber,
                record.PrevOrderNumber,
                record.PreparedDate,
                record.RequestedDate,
                record.PreparedBy,
                record.IsIronSheetCover,
                record.Remark

            });

            var exportToExcelHelper = new ExportToExcelHelper();
            exportToExcelHelper.ToExcel(Response, PackingCrateAndBoxRequests);
        }

        #endregion
    }

}