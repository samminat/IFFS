using CyberErp.Data.Model;
using CyberErp.Presentation.Iffs.Web.Classes;
using Ext.Direct.Mvc;
using Newtonsoft.Json;
using System;
using SwiftTederash.Business;
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
    public class OperationController : DirectController
    {
        #region Members

        private readonly DbContext _context;
        private readonly BaseModel<iffsOperation> _operation;
        private readonly BaseModel<iffsDocumentNoSetting> _documentNoSetting;
        private readonly BaseModel<iffsJobOrderHeader> _jobOrderHeader;
        private readonly BaseModel<iffsNotification> _notification;
        private readonly BaseModel<hrmsEmployee> _employee;
        private readonly Utility _utils = new Utility();
        private readonly Lookups _lookup;

        #endregion

        #region Constructor

        public OperationController()
        {
            _context = new ErpEntities(Constants.ConnectionString);
            _operation = new BaseModel<iffsOperation>(_context);
            _documentNoSetting = new BaseModel<iffsDocumentNoSetting>(_context);
            _jobOrderHeader = new BaseModel<iffsJobOrderHeader>(_context);
            _notification = new BaseModel<iffsNotification>(_context);
            _employee = new BaseModel<hrmsEmployee>(_context);
            _lookup = new Lookups(_context);
        }

        #endregion

        #region Actions

        public ActionResult Get(int id)
        {
            var objJobOrder = _operation.Get(c => c.Id == id);

            var jobOrderTemplate = new
            {
                objJobOrder.Id,
                objJobOrder.JobOrderId,
                JobOrder = objJobOrder.iffsJobOrderHeader.JobOrderNo,
                OperationTypeId = objJobOrder.iffsJobOrderHeader.OperationTypeId,
                objJobOrder.OperationNo,
                objJobOrder.Date,
                objJobOrder.PreparedById,
                objJobOrder.PreparedDate,
                objJobOrder.CheckedById,
                objJobOrder.CheckedDate,
                CheckedBy = objJobOrder.CheckedById != null ? objJobOrder.hrmsEmployee1.corePerson.FirstName + " " + objJobOrder.hrmsEmployee1.corePerson.FatherName : "",
                objJobOrder.ApprovedById,
                ApprovedBy = objJobOrder.ApprovedById != null ? objJobOrder.hrmsEmployee2.corePerson.FirstName + " " + objJobOrder.hrmsEmployee2.corePerson.FatherName : "",
                objJobOrder.ApprovalDate,
                objJobOrder.ClientReferenceNo,
                objJobOrder.GoodsDescription,
                objJobOrder.MBLNo,
                objJobOrder.HBLNo,
                objJobOrder.SSLine,
                objJobOrder.Vessel,
                objJobOrder.Voyage,
                objJobOrder.PortOfOriginId,
                objJobOrder.PortOfDestinationId,
                objJobOrder.ETAPort,
                objJobOrder.PortDischargeDate,
                objJobOrder.NumberOfContainers,
                objJobOrder.NumberOfPackages,
                objJobOrder.Weight,
                objJobOrder.Volume,
                objJobOrder.LoadingPortId,
                objJobOrder.OperationManagerId,
                OperationManager = objJobOrder.OperationManagerId != null ? objJobOrder.hrmsEmployee3.corePerson.FirstName + " " + objJobOrder.hrmsEmployee3.corePerson.FatherName : "",
                objJobOrder.TransitorId,
                Transitor = objJobOrder.TransitorId != null ? objJobOrder.hrmsEmployee4.corePerson.FirstName + " " + objJobOrder.hrmsEmployee4.corePerson.FatherName : "",
                objJobOrder.FinanceOfficerId,
                FinanceOfficer = objJobOrder.FinanceOfficerId != null ? objJobOrder.hrmsEmployee5.corePerson.FirstName + " " + objJobOrder.hrmsEmployee5.corePerson.FatherName : "",
                objJobOrder.MarketingOfficerId,
                MarketingOfficer = objJobOrder.MarketingOfficerId != null ? objJobOrder.hrmsEmployee6.corePerson.FirstName + " " + objJobOrder.hrmsEmployee6.corePerson.FatherName : "",
                objJobOrder.CargoAgentId,
                CargoAgent = objJobOrder.CargoAgentId != null ? objJobOrder.hrmsEmployee7.corePerson.FirstName + " " + objJobOrder.hrmsEmployee7.corePerson.FatherName : "",
                objJobOrder.BoxFile,
                objJobOrder.FileNo,
                objJobOrder.MAWBNo,
                objJobOrder.HAWBNo,
                objJobOrder.Carrier,
                objJobOrder.FlightNo,
                objJobOrder.LoadingAir,
                objJobOrder.ETD,
                objJobOrder.ETA,
                objJobOrder.Remarks,
                objJobOrder.OpeningLocationId
            };
            return this.Json(new
            {
                success = true,
                data = jobOrderTemplate
            });
        }

        public ActionResult GetAll(int start, int limit, string sort, string dir, string param)
        {
            var hashtable = JsonConvert.DeserializeObject<Hashtable>(param);
            var searchText = hashtable["searchText"].ToString();
            DateTime date = new DateTime();
            bool isDatestring = DateTime.TryParse(searchText, out date);

            var records = _operation.GetAll().AsQueryable();
            records = searchText != "" ? records.Where(p => p.OperationNo.ToUpper().Contains(searchText.ToUpper())||
                (isDatestring ? p.Date >= date.Date : false)
                ) : records;

            switch (sort)
            {
                case "Id":
                    records = dir == "ASC" ? records.OrderByDescending(u => u.Id) : records.OrderByDescending(u => u.Id);
                    break;
                case "OperationNo":
                    records = dir == "ASC" ? records.OrderBy(u => u.OperationNo) : records.OrderByDescending(u => u.OperationNo);
                    break;
                case "Date":
                    records = dir == "ASC" ? records.OrderBy(u => u.Date) : records.OrderByDescending(u => u.Date);
                    break;
            }
            var count = records.Count();
            records = records.Skip(start).Take(limit);
            var jobOrders = records.Select(record => new
            {
                record.Id,
                record.OperationNo,
                record.Date,
                record.iffsJobOrderHeader.OperationTypeId,
                IsChecked = record.CheckedById == null ? false : true,
                IsApproved = record.ApprovedById == null ? false : true,
                PreparedByFirst = record.hrmsEmployee.corePerson.FirstName,
                PreparedByFather = record.hrmsEmployee.corePerson.FatherName,
                CheckedByFirst = record.CheckedById != null ? record.hrmsEmployee1.corePerson.FirstName : "",
                CheckedByFather = record.CheckedById != null ? record.hrmsEmployee1.corePerson.FatherName : "",
                ApprovedByFirst = record.ApprovedById != null ? record.hrmsEmployee2.corePerson.FirstName : "",
                ApprovedByFather = record.ApprovedById != null ? record.hrmsEmployee2.corePerson.FatherName : "",
                record.PreparedDate,
                record.CheckedDate,
                record.ApprovalDate
            }).ToList().Select(record => new
            {
                record.Id,
                record.OperationNo,
                Date = string.Format("{0:MMMM dd, yyyy}", record.Date),
                record.IsChecked,
                record.OperationTypeId,
                record.IsApproved,
                PreparedBy = record.PreparedByFirst + " " + record.PreparedByFather,
                CheckedBy = record.CheckedByFirst + " " + record.CheckedByFather,
                ApprovedBy = record.ApprovedByFirst + " " + record.ApprovedByFather,
                PreparedDate = string.Format("{0:MMMM dd, yyyy}", record.PreparedDate),
                CheckedDate = string.Format("{0:MMMM dd, yyyy}", record.CheckedDate),
                ApprovalDate = string.Format("{0:MMMM dd, yyyy}", record.ApprovalDate)
            });
            var result = new { total = count, data = jobOrders };
            return this.Json(result);
        }
        public ActionResult GetActiveOperation(int start, int limit, string sort, string dir, string param)
        {
            var hashtable = JsonConvert.DeserializeObject<Hashtable>(param);
            int customerId = 0, operationTypeId = 0;
            if( hashtable["customerId"]!=null)
            {
                 int.TryParse(hashtable["customerId"].ToString(), out customerId);
            }
            if (hashtable["operationTypeId"] != null)
            {
                int.TryParse(hashtable["operationTypeId"].ToString(), out operationTypeId);
            }
            var records = _operation.GetAll().AsQueryable().Where(o=>o.iffsJobOrderHeader.iffsJobOrderQuotation.Where(f=>f.iffsJobOrderHeader.OperationTypeId==operationTypeId && f.iffsQuotationHeader.iffsServiceRequest.CustomerId==customerId).Any());
          
            var count = records.Count();
            records = records.OrderByDescending(o => o.Date).Skip(start).Take(limit);
            var operations = records.ToList().Select(record => new
            {
                record.Id,
                record.OperationNo,
                record.JobOrderId,
                record.NumberOfContainers,
                Containers = string.Join(", ", record.iffsContainer.Select(o=>o.ContainerNo).DefaultIfEmpty("")),
                record.Date,
                Carrier=record.Carrier!=null?record.Carrier:"",
                HBL = record.HBLNo != null ? record.HBLNo : "",
                BL_AWB=record.MBLNo!=null?record.MBLNo:record.MAWBNo!=null?record.MAWBNo:"",
                CustomerReferenceNo = record.ClientReferenceNo != null ? record.ClientReferenceNo : record.ClientReferenceNo != null ? record.ClientReferenceNo : "",
           
            }).ToList();
            var result = new { total = count, data = operations };
            return this.Json(result);
        }

        public ActionResult GetFilteredEmployee(object query)
        {
            var hashtable = JsonConvert.DeserializeObject<Hashtable>(JsonConvert.SerializeObject(query));
            int start;
            int.TryParse(hashtable["start"].ToString(), out start);
            int limit;
            int.TryParse(hashtable["limit"].ToString(), out limit);
            var queryparam = hashtable["query"].ToString();

            var filtered = _employee.GetAll().AsQueryable().Where(o => o.corePerson.FirstName.ToUpper().Contains(queryparam.ToUpper()) || o.IdentityNumber.ToUpper().Contains(queryparam.ToUpper()));
            var count = filtered.Count();
            filtered = filtered.OrderBy(o => o.corePerson.FirstName).Skip(start).Take(limit);
            var stores = filtered.Select(item => new
            {
                item.Id,
                item.corePerson.FirstName,
                item.corePerson.FatherName,
                Position = item.corePosition.corePositionClass.Name,
                item.IdentityNumber
            }).ToList().Select(item => new
            {
                item.Id,
                Name = item.FirstName + " " + item.FatherName,
                item.Position,
                IdentityNo = item.IdentityNumber
            });
            var result = new
            {
                total = count,
                data = stores
            };
            return this.Json(result);
        }

        public ActionResult GetFilteredJobOrders(object query)
        {
            var hashtable = JsonConvert.DeserializeObject<Hashtable>(JsonConvert.SerializeObject(query));
            int start;
            int.TryParse(hashtable["start"].ToString(), out start);
            int limit;
            int.TryParse(hashtable["limit"].ToString(), out limit);
            var queryparam = hashtable["query"].ToString();

            var filtered = _jobOrderHeader.GetAll().AsQueryable().Where(o => o.ApprovedById != null && (o.ValidityDate.Value.Day >= DateTime.Now.Day && o.ValidityDate.Value.Year >= DateTime.Now.Year) && (o.JobOrderNo.ToUpper().Contains(queryparam.ToUpper())));
            var count = filtered.Count();
            filtered = filtered.OrderBy(o => o.Id).Skip(start).Take(limit);
            var stores = filtered.Select(item => new
            {
                item.Id,
                Name = item.JobOrderNo,
                item.OperationTypeId,
                OperationType = item.iffsLupOperationType.Name
            }).ToList().Select(item => new
            {
                item.Id,
                item.Name,
                item.OperationTypeId,
                item.OperationType
            });
            var result = new
            {
                total = count,
                data = stores
            };
            return this.Json(result);
        }

        [FormHandler]
        public ActionResult Save(iffsOperation operation)
        {
            using (var transaction = new TransactionScope((TransactionScopeOption.Required), new TransactionOptions { IsolationLevel = IsolationLevel.ReadCommitted }))
            {
                _context.Database.Connection.Open();
                _context.Database.CommandTimeout = int.MaxValue;
                try
                {
                    int employeeId = 0;
                    var objUser = (coreUser)Session[Constants.CurrentUser];
                    if (objUser != null && objUser.EmployeeId != null)
                    {
                        employeeId = (int)objUser.EmployeeId;
                    }

                    
                    if (operation.Id.Equals(0))
                    {
                        operation.PreparedById = employeeId;
                        operation.PreparedDate = DateTime.Now;

                        CyberErp.Presentation.Iffs.Web.MvcApplication httpapplication = HttpContext.ApplicationInstance as CyberErp.Presentation.Iffs.Web.MvcApplication;
                        httpapplication.Application.Lock();
                        //operation.OperationNo = GetDocumentNumber("Operation");
                        _operation.AddNew(operation);
                        //UpdateDocumentNumber("Operation");
                        httpapplication.Application.UnLock();
                    }
                    else
                    {
                        _operation.Edit(operation);
                    }

                    _context.SaveChanges();
                    transaction.Complete();
                    return this.Json(new { success = true, data = "Data has been saved successfully!" });
                }
                catch (Exception exception)
                {
                    return this.Json(new { success = false, data = exception.InnerException != null ? exception.InnerException.Message : exception.Message });
                }
            } 
        }

        public ActionResult Delete(int id)
        {
            try
            {
                _operation.Delete(c => c.Id == id);

                return this.Json(new { success = true, data = "record has been successfully deleted!" });
            }
            catch (Exception)
            {
                return this.Json(new { success = false, data = "Could not delete the selected record!" });
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

        #endregion

        #region Methods

        public void ExportToExcel()
        {
            var searchText = Request.QueryString["st"];

            var records = _operation.GetAll().AsQueryable();
            records = searchText != "" ? records.Where(p => p.OperationNo.ToUpper().Contains(searchText.ToUpper())) : records;

            var jobOrders = records.Select(record => new
            {
                record.Id,
                record.OperationNo,
                record.Date,
                IsChecked = record.CheckedById == null ? false : true,
                IsApproved = record.ApprovedById == null ? false : true,
                PreparedByFirst = record.hrmsEmployee.corePerson.FirstName,
                PreparedByFather = record.hrmsEmployee.corePerson.FatherName,
                CheckedByFirst = record.CheckedById != null ? record.hrmsEmployee1.corePerson.FirstName : "",
                CheckedByFather = record.CheckedById != null ? record.hrmsEmployee1.corePerson.FatherName : "",
                ApprovedByFirst = record.ApprovedById != null ? record.hrmsEmployee2.corePerson.FirstName : "",
                ApprovedByFather = record.ApprovedById != null ? record.hrmsEmployee2.corePerson.FatherName : "",
                record.PreparedDate,
                record.CheckedDate,
                record.ApprovalDate
            }).ToList().Select(record => new
            {
                record.Id,
                record.OperationNo,
                Date = string.Format("{0:MMMM dd, yyyy}", record.Date),
                record.IsChecked,
                record.IsApproved,
                PreparedBy = record.PreparedByFirst + " " + record.PreparedByFather,
                CheckedBy = record.CheckedByFirst + " " + record.CheckedByFather,
                ApprovedBy = record.ApprovedByFirst + " " + record.ApprovedByFather,
                PreparedDate = string.Format("{0:MMMM dd, yyyy}", record.PreparedDate),
                CheckedDate = string.Format("{0:MMMM dd, yyyy}", record.CheckedDate),
                ApprovalDate = string.Format("{0:MMMM dd, yyyy}", record.ApprovalDate)
            });

            var exportToExcelHelper = new ExportToExcelHelper();
            exportToExcelHelper.ToExcel(Response, jobOrders);
        }

        #endregion

        #region Approval Process

        [FormHandler]
        public DirectResult Check(docConfirmation docConfirmation)
        {

            try
            {
                int currentEmployeeId = 0;
                var objUser = (coreUser)Session[Constants.CurrentUser];
                if (objUser != null && objUser.EmployeeId != null)
                {
                    currentEmployeeId = (int)objUser.EmployeeId;
                }

                var objOperation = _operation.Get(j => j.Id == docConfirmation.Id);

                if (docConfirmation.Type == Constants.DOCUMENT_CONFIRM)
                {

                    objOperation.CheckedById = currentEmployeeId;
                    objOperation.CheckedDate = DateTime.Now;
                    _context.SaveChanges();

                    return this.Json(new { success = true, data = "Record successfully checked!" });
                }
                else
                {
                    //Send to notification table
                    _notification.AddNew(new iffsNotification
                    {
                        Operation = Constants.NTF_OPN_OPERATION,
                        ObjectId = objOperation.Id,
                        ActorId = objOperation.PreparedById,
                        Date = DateTime.Now,
                        Message = docConfirmation.Comment,
                        IsViewed = false
                    });
                    return this.Json(new { success = false, data = "Rejection notification sent for a person who prepares the selected document!" });
                }

            }
            catch (Exception exception)
            {
                return this.Json(new { success = false, data = exception.Message });
            }

        }

        [FormHandler]
        public DirectResult Approve(docConfirmation docConfirmation)
        {
            try
            {
                int currentEmployeeId = 0;
                var objUser = (coreUser)Session[Constants.CurrentUser];
                if (objUser != null && objUser.EmployeeId != null)
                {
                    currentEmployeeId = (int)objUser.EmployeeId;
                }

                var objOperation = _operation.Get(j => j.Id == docConfirmation.Id);

                if (docConfirmation.Type == Constants.DOCUMENT_CONFIRM)
                {
                    objOperation.ApprovedById = currentEmployeeId;
                    objOperation.ApprovalDate = DateTime.Now;
                    _context.SaveChanges();

                    return this.Json(new { success = true, data = "Record successfully approved!" });
                }
                else
                {
                    //Send to notification table
                    _notification.AddNew(new iffsNotification
                    {
                        Operation = Constants.NTF_OPN_JOB_ORDER,
                        ObjectId = objOperation.Id,
                        ActorId = objOperation.PreparedById,
                        Date = DateTime.Now,
                        Message = docConfirmation.Comment,
                        IsViewed = false
                    });
                    return this.Json(new { success = false, data = "Rejection notification sent for a person who prepares the selected document!" });
                }
            }
            catch (Exception exception)
            {
                return this.Json(new { success = false, data = exception.Message });
            }

        }

        #endregion
    }
}