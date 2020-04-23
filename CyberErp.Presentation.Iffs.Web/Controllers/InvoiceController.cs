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

namespace CyberErp.Presentation.Iffs.Web.Controllers
{
    public class InvoiceController : DirectController
    {
        #region Members

        private readonly DbContext _context;
        private readonly BaseModel<iffsInvoiceHeader> _invoiceHeader;
        private readonly BaseModel<iffsInvoiceDetail> _invoiceDetail;
        private readonly BaseModel<iffsDocumentNoSetting> _documentNoSetting;
        private readonly BaseModel<iffsServiceRate> _serviceRate;
        private readonly BaseModel<iffsNotification> _notification;
        private readonly BaseModel<iffsInvoiceOperation> _invoiceOperation;
        #endregion

        #region Constructor

        public InvoiceController()
        {
            _context = new ErpEntities(Constants.ConnectionString);
            _invoiceHeader = new BaseModel<iffsInvoiceHeader>(_context);
            _invoiceDetail = new BaseModel<iffsInvoiceDetail>(_context);
            _documentNoSetting = new BaseModel<iffsDocumentNoSetting>(_context);
            _serviceRate = new BaseModel<iffsServiceRate>(_context);
            _notification = new BaseModel<iffsNotification>(_context);
            _invoiceOperation = new BaseModel<iffsInvoiceOperation>(_context);
      
        }

        #endregion

        #region Actions
         public ActionResult Get(int id)
        {
            var objInvoice = _invoiceHeader.Get(c => c.Id == id);

            var invoice = new
            {
                objInvoice.Id,
                objInvoice.ApprovalDate,
                objInvoice.ApprovedById,
                objInvoice.BL_AWB,
                objInvoice.Carrier,
                ApprovedBy =objInvoice.ApprovedById.HasValue? objInvoice.hrmsEmployee2.corePerson.FirstName + " " + objInvoice.hrmsEmployee2.corePerson.FatherName:"",
                objInvoice.CheckedById,
                CheckedBy =objInvoice.CheckedById.HasValue? objInvoice.hrmsEmployee1.corePerson.FirstName + " " + objInvoice.hrmsEmployee1.corePerson.FatherName:"",          
                objInvoice.CheckedDate,
                Date=objInvoice.Date.ToShortDateString(),
                objInvoice.PreparedById,
                PreparedBy = objInvoice.hrmsEmployee.corePerson.FirstName + " " + objInvoice.hrmsEmployee.corePerson.FatherName,
                objInvoice.PreparedDate,
                objInvoice.PaymentMode,
                objInvoice.WithHoldingApplied,
                objInvoice.InvoiceNo,
                objInvoice.Remark,
                objInvoice.Container,
                objInvoice.NoofContainer,
                objInvoice.CustomerId,
                objInvoice.CustomerReferenceNo,
                Customer=objInvoice.iffsCustomer.Name,
                objInvoice.OperationTypeId,
                OperationType=objInvoice.iffsLupOperationType.Name,
                objInvoice.ExchangeRate,
                objInvoice.FsNo,
                objInvoice.HBL,
                objInvoice.OperationNo,
                OperationIds=string.Join(", ", objInvoice.iffsInvoiceOperation.Select(o=>o.OperationId).DefaultIfEmpty(0)),
                JobOrderIds = string.Join(", ", objInvoice.iffsInvoiceOperation.Select(o => o.iffsOperation.JobOrderId).DefaultIfEmpty(0)),
         
            };
            return this.Json(new
            {
                success = true,
                data = invoice
            });
        }
        public ActionResult GetAll(int start, int limit, string sort, string dir, string param)
        {
            var hashtable = JsonConvert.DeserializeObject<Hashtable>(param);
            var searchText = hashtable["searchText"].ToString();

            var records = _invoiceHeader.GetAll().AsQueryable().OrderByDescending(o => o.Date).AsQueryable();
            records = searchText != "" ? records.
                Where(p => 
                            p.InvoiceNo.ToUpper().Contains(searchText.ToUpper())||
                            p.iffsCustomer.Name.ToUpper().Contains(searchText.ToUpper()) ||
                            p.OperationNo.ToUpper().Contains(searchText.ToUpper()) ||
                            p.iffsLupOperationType.Name.ToUpper().Contains(searchText.ToUpper()) ||
                            p.FsNo.ToUpper().Contains(searchText.ToUpper())||
                            (p.hrmsEmployee.corePerson.FirstName + " " + p.hrmsEmployee.corePerson.FatherName).ToUpper().Contains(searchText.ToUpper())
                            ) : records;

             switch (sort)
            {
                case "InvoiceNo":
                     records = dir == "ASC" ? records.OrderBy(u => u.InvoiceNo) : records.OrderByDescending(u => u.InvoiceNo);
                     break;
                case "FsNo":
                     records = dir == "ASC" ? records.OrderBy(u => u.FsNo) : records.OrderByDescending(u => u.FsNo);
                     break;             
                case "Customer":
                    records = dir == "ASC" ? records.OrderBy(u => u.iffsCustomer.Name) : records.OrderByDescending(u => u.iffsCustomer.Name);
                    break;
                case "Date":
                    records = dir == "ASC" ? records.OrderBy(u => u.Date) : records.OrderByDescending(u => u.Date);
                    break;
                case "CustomerReferenceNo":
                    records = dir == "ASC" ? records.OrderBy(u => u.CustomerReferenceNo) : records.OrderByDescending(u => u.CustomerReferenceNo);
                    break;
                case "PreparedBy":
                    records = dir == "ASC" ? records.OrderBy(u => u.hrmsEmployee.corePerson.FirstName + " " + u.hrmsEmployee.corePerson.FatherName) : records.OrderByDescending(u => u.hrmsEmployee.corePerson.FirstName + " " + u.hrmsEmployee.corePerson.FatherName);
                    break;

            }
            var count = records.Count();
            records = records.Skip(start).Take(limit);
            var invoices = records.Select(record => new
            {
                record.Id,
                record.ApprovalDate,
                record.ApprovedById,
                ApprovedBy =record.ApprovedById.HasValue? record.hrmsEmployee2.corePerson.FirstName + " " + record.hrmsEmployee2.corePerson.FatherName:"",
                record.CheckedById,
                CheckedBy = record.hrmsEmployee1.corePerson.FirstName + " " + record.hrmsEmployee1.corePerson.FatherName,
                record.CheckedDate,
                record.Date,
                record.BL_AWB,
                record.Carrier,
                record.PaymentMode,
                record.WithHoldingApplied,
              
                record.PreparedById,
                PreparedBy =record.CheckedById.HasValue? record.hrmsEmployee.corePerson.FirstName + " " + record.hrmsEmployee.corePerson.FatherName:"",
                record.PreparedDate,
                record.InvoiceNo,
                record.Remark,
                record.Container,
                record.CustomerId,
                record.CustomerReferenceNo,
                Customer=record.iffsCustomer.Name,
                record.OperationTypeId,
                OperationType=record.iffsLupOperationType.Name,
                record.ExchangeRate,
                record.FsNo,
                record.HBL,
                record.OperationNo,
                IsChecked = record.CheckedById == null ? false : true,
                IsApproved = record.ApprovedById == null ? false : true
            }).ToList().Select(record => new
            {
                record.Id,
                ApprovalDate = String.Format("{0:MMMM dd, yyyy HH:mm}", record.ApprovalDate),
                record.ApprovedById,
                record.ApprovedBy,
                record.CheckedById,
                record.CheckedBy,
                CheckedDate = String.Format("{0:MMMM dd, yyyy HH:mm}", record.CheckedDate),
                Date = String.Format("{0:MMMM dd, yyyy HH:mm}", record.Date),
                record.BL_AWB,
                record.Carrier,
                record.PaymentMode,
                record.WithHoldingApplied,
              
                record.PreparedById,
                record.PreparedBy,
                PreparedDate = String.Format("{0:MMMM dd, yyyy HH:mm}", record.PreparedDate),
                record.InvoiceNo,
                record.Remark,
                 record.Container,
                record.CustomerId,
                record.CustomerReferenceNo,
                Customer = record.Customer,
                record.OperationTypeId,
                OperationType = record.OperationType,
                record.ExchangeRate,
                record.FsNo,
                record.HBL,
                record.OperationNo,
                IsChecked = record.IsChecked,
                IsApproved = record.IsApproved
         
            });

            var result = new { total = count, data = invoices };
            return this.Json(result);
        }
        public ActionResult GetAllDetail(int start, int limit, string sort, string dir, string param)
        {
            var hashtable = JsonConvert.DeserializeObject<Hashtable>(param);
            int invoiceHeaderId = 0;
            if (hashtable["invoiceId"] != null)
                int.TryParse(hashtable["invoiceId"].ToString(), out invoiceHeaderId);
            var records = _invoiceDetail.GetAll().AsQueryable().Where(o => o.InvoiceId == invoiceHeaderId);
            var count = 0;
            var customers = records.Select(record => new
            {
                record.Id,
                record.ServiceId,
                Service=record.iffsService.Name,
                record.ServiceDescription,
                record.CurrencyId,
                ServiceUnitType=record.iffsLupServiceUnitType.Name,
                record.Quantity,
                record.InvoiceId,
                record.Remark,
                record.ServiceUnitTypeId,
                record.UnitPrice,
                 Currency = record.iffsLupCurrency.Name,
                Name = record.iffsService.Name,
                Code = record.iffsService.Code,

            }).ToList();
            var result = new { total = count, data = customers };
            return this.Json(result);
        }
        public ActionResult GetDocumentNo()
        {
            var Number = "Auto-Genereted";
            
            var Permirmition = (List<Permission>)Session[Constants.UserPermission];
            var currentuser = (coreUser)Session[Constants.CurrentUser];
            var user = currentuser.FirstName + " " + currentuser.LastName;
            var EmployeeId = (int)currentuser.EmployeeId;
             var Constantsfields = new
            {
                Number = Number,
                user = user,
                userId = EmployeeId
            };
            var result = new
            {
                total = 1,
                data = Constantsfields,

            };
            return this.Json(result);


        }
        public ActionResult getServiceRateByCustomerGroup(int customerGroupId,int serviceId)
        {
            var record = _serviceRate.GetAll().AsQueryable().Where(o=> o.ServiceId==serviceId).FirstOrDefault();
            var serviceRate =record!=null? new
            {
                record.Id,
                UnitType=record.iffsLupServiceUnitType.Name,
                record.ServiceUnitTypeId,
                record.Rate

            }:null;
            var result = new
            {
                data = serviceRate
            };
            return this.Json(result);
        }
        
        [FormHandler]
        public ActionResult Save(iffsInvoiceHeader invoiceHeader)
        {
             using (var transaction = new TransactionScope((TransactionScopeOption.Required), new TransactionOptions { IsolationLevel = IsolationLevel.ReadCommitted }))
            {
                _context.Database.Connection.Open();
                _context.Database.CommandTimeout = int.MaxValue;

                var hashtable = JsonConvert.DeserializeObject<Hashtable>(Request.Params["record"]);
                string action = hashtable["action"].ToString();
                 try
                {
                    if (Request.Params["WithHoldingApplied"] != null && Request.Params["WithHoldingApplied"].ToString().Equals("on"))
                        invoiceHeader.WithHoldingApplied = true;
                    else
                        invoiceHeader.WithHoldingApplied = false;

                    if (invoiceHeader.Id == 0)
                    {

                        invoiceHeader.PreparedDate = DateTime.Now;                     
                        CyberErp.Presentation.Iffs.Web.MvcApplication httpapplication = HttpContext.ApplicationInstance as CyberErp.Presentation.Iffs.Web.MvcApplication;
                        httpapplication.Application.Lock();
                        if (action == "Add" && invoiceHeader.InvoiceNo == "Auto-Genereted")
                            invoiceHeader.InvoiceNo = GetDocumentNumber("Invoice");
                        _invoiceHeader.AddNew(invoiceHeader);
                        if (action == "Add" && invoiceHeader.InvoiceNo == "Auto-Genereted")
                            UpdateDocumentNumber("Invoice");
                        httpapplication.Application.UnLock();
                       
                     
                    }
                    else
                    {
                        _invoiceHeader.Edit(invoiceHeader);
                    }
                  var servicesString = hashtable["services"].ToString();
                  var operationIds = hashtable["operationIds"].ToString();

                  SaveInvoiceOperations(operationIds, invoiceHeader.Id);
                  saveDetail(servicesString, invoiceHeader.Id);
                 _context.SaveChanges();
                 transaction.Complete();
                 return this.Json(new { success = true, data = "Data has been saved successfully!", invoiceId = invoiceHeader.Id });
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
                _invoiceDetail.Delete(c => c.InvoiceId == id);
                _invoiceHeader.Delete(c => c.Id == id);

                return this.Json(new { success = true, data = "record has been successfully deleted!" });
            }
            catch (Exception)
            {
                return this.Json(new { success = false, data = "Could not delete the selected record!" });
            }
        }
        public void ExportToExcel()
        {
            var searchText = Request.QueryString["st"];

             var records = _invoiceHeader.GetAll().AsQueryable().OrderByDescending(o => o.Date).AsQueryable();
            records = searchText != "" ? records.
                Where(p =>
                        p.InvoiceNo.ToUpper().Contains(searchText.ToUpper()) ||
                        p.iffsCustomer.Name.ToUpper().Contains(searchText.ToUpper()) ||
                        p.OperationNo.ToUpper().Contains(searchText.ToUpper()) ||
                        p.iffsLupOperationType.Name.ToUpper().Contains(searchText.ToUpper()) ||
                        p.FsNo.ToUpper().Contains(searchText.ToUpper()) ||
                        (p.hrmsEmployee.corePerson.FirstName + " " + p.hrmsEmployee.corePerson.FatherName).ToUpper().Contains(searchText.ToUpper())
                        ) : records;

            var customers = records.Select(record => new
            {
                record.Id,
                OperationType = record.iffsLupOperationType.Name,
                record.InvoiceNo,
                record.Date,
                Customer = record.iffsCustomer.Name,
                record.FsNo,
                record.CustomerReferenceNo,            
                record.BL_AWB,
                record.Carrier,
                 record.Remark,
                record.Container,
                record.ExchangeRate,
                record.HBL,
                record.OperationNo,
                PreparedBy = record.CheckedById.HasValue ? record.hrmsEmployee.corePerson.FirstName + " " + record.hrmsEmployee.corePerson.FatherName : "",
                record.PreparedDate,
             
                IsChecked = record.CheckedById == null ? false : true,
                IsApproved = record.ApprovedById == null ? false : true
             
              

            }).ToList();

            var exportToExcelHelper = new ExportToExcelHelper();
            exportToExcelHelper.ToExcel(Response, customers);
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

                var objInvoice = _invoiceHeader.Get(j => j.Id == docConfirmation.Id);

                if (docConfirmation.Type == Constants.DOCUMENT_CONFIRM)
                {
                    objInvoice.CheckedById = currentEmployeeId;
                    objInvoice.CheckedDate = DateTime.Now;
                    _context.SaveChanges();

                    return this.Json(new { success = true, data = "Record successfully checked!" });
                }
                else
                {
                    //Send to notification table
                    _notification.AddNew(new iffsNotification
                    {
                        Operation = Constants.NTF_OPN_QUOTATION,
                        ObjectId = objInvoice.Id,
                        ActorId = objInvoice.PreparedById,
                        Date = DateTime.Now,
                        Message = docConfirmation.Comment,
                        IsViewed = false
                    });
                    return this.Json(new { success = false, data = "Reject notification sent for a person who prepares the selected document!" });
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

                var objInvoice = _invoiceHeader.Get(j => j.Id == docConfirmation.Id);

                if (docConfirmation.Type == Constants.DOCUMENT_CONFIRM)
                {
                    objInvoice.ApprovedById = currentEmployeeId;
                    objInvoice.ApprovalDate = DateTime.Now;
                    _context.SaveChanges();

                    return this.Json(new { success = true, data = "Record successfully checked!" });
                }
                else
                {
                    //Send to notification table
                    _notification.AddNew(new iffsNotification
                    {
                        Operation = Constants.NTF_OPN_QUOTATION,
                        ObjectId = objInvoice.Id,
                        ActorId = objInvoice.PreparedById,
                        Date = DateTime.Now,
                        Message = docConfirmation.Comment,
                        IsViewed = false
                    });
                    return this.Json(new { success = false, data = "Reject notification sent for a person who prepares the selected document!" });
                }
            }
            catch (Exception exception)
            {
                return this.Json(new { success = false, data = exception.Message });
            }

        }
#endregion

        #region Methods

        public void SaveInvoiceOperations(string operationIds,int invoiceId)
        {
            var operationId = 0;
            var operationIdCollection = operationIds.Split(new[] { ',' });
            _invoiceOperation.Delete(q => q.InvoiceHeaderId == invoiceId);
            IList<iffsInvoiceOperation> invoiceQuotationList = new List<iffsInvoiceOperation>();

            for (var i = 0; i < operationIdCollection.Count(); i++)
            {
                int.TryParse(operationIdCollection[i], out operationId);
                var objInvoiceQuotation = new iffsInvoiceOperation { InvoiceHeaderId = invoiceId, OperationId = operationId };
                _invoiceOperation.AddNew(objInvoiceQuotation);

            
            }


        }
   
        public void saveDetail(string servicesString, int tinvoiceId)
        {
            servicesString = servicesString.Remove(servicesString.Length - 1);
            var servicesCollection = servicesString.Split(new[] { ';' });
            _invoiceDetail.Delete(o => o.InvoiceId == tinvoiceId);
            for (var i = 0; i < servicesCollection.Count(); i++)
            {
                var service = servicesCollection[i].Split(new[] { ':' });

                var objinvoiceDetail = new iffsInvoiceDetail();
                objinvoiceDetail.CurrencyId = int.Parse(service[1]);             
                objinvoiceDetail.Quantity = decimal.Parse(service[2]);
                objinvoiceDetail.InvoiceId = tinvoiceId;
                objinvoiceDetail.Remark = service[4];
                objinvoiceDetail.ServiceUnitTypeId = int.Parse(service[5]);
                objinvoiceDetail.UnitPrice = decimal.Parse(service[6]);
                objinvoiceDetail.ServiceId = int.Parse(service[7]);
                objinvoiceDetail.ServiceDescription = service[8];             
                _invoiceDetail.AddNew(objinvoiceDetail);
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
            catch (Exception e)
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
    }
}
