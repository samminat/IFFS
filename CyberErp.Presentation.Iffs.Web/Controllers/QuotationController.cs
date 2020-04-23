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
    public class QuotationController : DirectController
    {
        #region Members

        private readonly DbContext _context;
        private readonly BaseModel<iffsQuotationHeader> _quotationHeader;
        private readonly BaseModel<iffsQuotationDetail> _quotationDetail;
        private readonly BaseModel<iffsDocumentNoSetting> _documentNoSetting;
        private readonly BaseModel<iffsServiceRate> _serviceRate;
        private readonly BaseModel<iffsNotification> _notification;
        private readonly BaseModel<iffsQuotationTermandCondition> _quotationTermandCondition;

        #endregion

        #region Constructor

        public QuotationController()
        {
            _context = new ErpEntities(Constants.ConnectionString);
            _quotationHeader = new BaseModel<iffsQuotationHeader>(_context);
            _quotationDetail = new BaseModel<iffsQuotationDetail>(_context);
            _documentNoSetting = new BaseModel<iffsDocumentNoSetting>(_context);
            _serviceRate = new BaseModel<iffsServiceRate>(_context);
            _notification = new BaseModel<iffsNotification>(_context);
            _quotationTermandCondition = new BaseModel<iffsQuotationTermandCondition>(_context);

        }

        #endregion

        #region Actions
        public ActionResult GetCustomerResponse(int id)
        {
            var objCustomerResponse = _quotationHeader.Get(c => c.Id == id);
            var service = new
            {
                objCustomerResponse.Id,
                CustomerResponseDate =objCustomerResponse.CustomerResponseDate.HasValue? objCustomerResponse.CustomerResponseDate.Value.ToShortDateString():"",
                objCustomerResponse.CustomerResponseRemark,
                objCustomerResponse.IsAccepted
            };
            return this.Json(new
            {
                success = true,
                data = service
            });
        }
        public ActionResult Get(int id)
        {
            var objQuotation = _quotationHeader.Get(c => c.Id == id);

            var quotation = new
            {
                objQuotation.Id,
                objQuotation.ApprovalDate,
                objQuotation.ApprovedById,
                objQuotation.PrevQuotationId,
                objQuotation.PrevQuotationNumber,
                ApprovedBy =objQuotation.ApprovedById.HasValue? objQuotation.hrmsEmployee2.corePerson.FirstName + " " + objQuotation.hrmsEmployee2.corePerson.FatherName:"",
                objQuotation.CheckedById,
                CheckedBy =objQuotation.CheckedById.HasValue? objQuotation.hrmsEmployee1.corePerson.FirstName + " " + objQuotation.hrmsEmployee1.corePerson.FatherName:"",          
                objQuotation.CheckedDate,
                Date=objQuotation.Date.ToShortDateString(),
                objQuotation.PreparedById,
                PreparedBy = objQuotation.hrmsEmployee.corePerson.FirstName + " " + objQuotation.hrmsEmployee.corePerson.FatherName,
                objQuotation.PreparedDate,
                objQuotation.QuotationNo,
                objQuotation.Remark,
                objQuotation.ServiceRequestId,
                //TermsAndConditions = HttpUtility.UrlDecode(objQuotation.TermsAndConditions),
                ValidityDate=objQuotation.ValidityDate.ToShortDateString(),
                objQuotation.iffsServiceRequest.CustomerId,
                Customer=objQuotation.iffsServiceRequest.iffsCustomer.Name,
                objQuotation.iffsServiceRequest.iffsCustomer.CustomerGroupId,
                CustomerGroup=objQuotation.iffsServiceRequest.iffsCustomer.iffsLupCustomerGroup.Name,
                ServiceRequest = objQuotation.iffsServiceRequest.iffsCustomer.Name + " " + objQuotation.iffsServiceRequest.RequestNo,
                objQuotation.IsAccepted,
                objQuotation.ParentQuotationId,              
                objQuotation.Version,

            };
            return this.Json(new
            {
                success = true,
                data = quotation
            });
        }

        public ActionResult GetTermAndCondition(int id)
        {
            var returnValue ="";
            var objQuotation =_quotationTermandCondition.GetAll().AsQueryable().Where(c => c.QuotationId == id).FirstOrDefault();
            if(objQuotation!=null)
            {
                returnValue = HttpUtility.UrlDecode(objQuotation.TermsAndConditions);
            }

            return this.Json(new
            {
                success = true,
                data = returnValue
            });
        }


        public ActionResult GetAll(int start, int limit, string sort, string dir, string param)
        {
            var hashtable = JsonConvert.DeserializeObject<Hashtable>(param);
            var searchText = hashtable["searchText"].ToString();
            DateTime date = new DateTime();
            bool isDatestring = DateTime.TryParse(searchText, out date);

            var records = _quotationHeader.GetAll().AsQueryable().OrderByDescending(o => o.Date).AsQueryable();
            records = searchText != "" ? records.Where(p => 
               
                p.QuotationNo.ToUpper().Contains(searchText.ToUpper())||
                p.iffsServiceRequest.iffsCustomer.Name.ToUpper().Contains(searchText.ToUpper())||
                p.PrevQuotationNumber.ToUpper().Contains(searchText.ToUpper())         ||
                (p.hrmsEmployee.corePerson.FirstName + " " + p.hrmsEmployee.corePerson.FatherName).ToUpper().Contains(searchText.ToUpper()) ||
                (p.CheckedById.HasValue ? (p.hrmsEmployee1.corePerson.FirstName + " " + p.hrmsEmployee1.corePerson.FatherName).ToUpper().Contains(searchText.ToUpper()) : false) ||
                (p.ApprovedById.HasValue ? (p.hrmsEmployee2.corePerson.FirstName + " " + p.hrmsEmployee2.corePerson.FatherName).ToUpper().Contains(searchText.ToUpper()) : false) ||
                (isDatestring ? p.PreparedDate >= date.Date : false) ||
                (isDatestring ? p.ValidityDate >= date : false) ||
                (isDatestring ? p.CheckedDate.HasValue ? p.CheckedDate.Value >= date : false : false) ||
                (isDatestring ? p.ApprovalDate.HasValue ? p.ApprovalDate.Value >= date : false : false)
  
                ) : records;

             switch (sort)
            {
                /* case "QuotationNo":
                     records = dir == "ASC" ? records.OrderBy(u => u.QuotationNo) : records.OrderByDescending(u => u.QuotationNo);
                     break;*/
                case "Customer":
                    records = dir == "ASC" ? records.OrderBy(u => u.iffsServiceRequest.iffsCustomer.Name) : records.OrderByDescending(u => u.iffsServiceRequest.iffsCustomer.Name);
                    break;
                case "Date":
                    records = dir == "ASC" ? records.OrderBy(u => u.Date) : records.OrderByDescending(u => u.Date);
                    break;
                case "IsAccepted":
                    records = dir == "ASC" ? records.OrderBy(u => u.IsAccepted) : records.OrderByDescending(u => u.IsAccepted);
                    break;
                case "PrevQuotationNumber":
                    records = dir == "ASC" ? records.OrderBy(u => u.PrevQuotationNumber) : records.OrderByDescending(u => u.PrevQuotationNumber);
                    break;
                case "ApprovedBy":
                    records = dir == "ASC" ? records.OrderBy(u => u.ApprovedById.HasValue ? u.hrmsEmployee2.corePerson.FirstName + " " + u.hrmsEmployee2.corePerson.FatherName : "") : records.OrderByDescending(u => u.ApprovedById.HasValue ? u.hrmsEmployee2.corePerson.FirstName + " " + u.hrmsEmployee2.corePerson.FatherName : "");
                    break;
                case "CheckedBy":
                    records = dir == "ASC" ? records.OrderBy(u => u.hrmsEmployee1.corePerson.FirstName + " " + u.hrmsEmployee1.corePerson.FatherName) : records.OrderByDescending(u => u.hrmsEmployee1.corePerson.FirstName + " " + u.hrmsEmployee1.corePerson.FatherName);
                    break;
                case "PreparedBy":
                    records = dir == "ASC" ? records.OrderBy(u =>u.CheckedById.HasValue? u.hrmsEmployee.corePerson.FirstName + " " + u.hrmsEmployee.corePerson.FatherName:"") : records.OrderByDescending(u =>u.CheckedById.HasValue? u.hrmsEmployee.corePerson.FirstName + " " + u.hrmsEmployee.corePerson.FatherName:"");
                    break;
                case "PreparedDate":
                    records = dir == "ASC" ? records.OrderBy(u => u.PreparedDate) : records.OrderByDescending(u => u.PreparedDate);
                    break;
                case "ApprovalDate":
                    records = dir == "ASC" ? records.OrderBy(u => u.ApprovalDate) : records.OrderByDescending(u => u.ApprovalDate);
                    break;

                case "CheckedDate":
                    records = dir == "ASC" ? records.OrderBy(u => u.CheckedDate) : records.OrderByDescending(u => u.CheckedDate);
                    break;
           
                case "ValidityDate":
                    records = dir == "ASC" ? records.OrderBy(u => u.ValidityDate) : records.OrderByDescending(u => u.ValidityDate);
                    break;
            

            }
            var count = records.Count();
            records = records.Skip(start).Take(limit);
            var quotations = records.Select(record => new
            {
                record.Id,
                record.ApprovalDate,
                record.ApprovedById,
                ApprovedBy =record.ApprovedById.HasValue? record.hrmsEmployee2.corePerson.FirstName + " " + record.hrmsEmployee2.corePerson.FatherName:"",
                record.CheckedById,
                CheckedBy =record.CheckedById.HasValue? record.hrmsEmployee1.corePerson.FirstName + " " + record.hrmsEmployee1.corePerson.FatherName:"",
                record.CheckedDate,
                record.Date,
                record.ValidityDate,
                record.PreparedById,
                record.PrevQuotationNumber,
                PreparedBy = record.hrmsEmployee.corePerson.FirstName + " " + record.hrmsEmployee.corePerson.FatherName,
                record.PreparedDate,
                record.QuotationNo,
                record.Remark,
                record.ServiceRequestId,
                record.iffsServiceRequest.CustomerId,
                record.Version,
                Customer = record.iffsServiceRequest.iffsCustomer.Name,
                record.IsAccepted,
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
                record.PrevQuotationNumber,
                CheckedDate = String.Format("{0:MMMM dd, yyyy HH:mm}", record.CheckedDate),
                Date = String.Format("{0:MMMM dd, yyyy HH:mm}", record.Date),
                record.PreparedById,
                record.PreparedBy,
                PreparedDate = String.Format("{0:MMMM dd, yyyy HH:mm}", record.PreparedDate),
                record.QuotationNo,
                record.Version,
                record.Remark,
                record.ServiceRequestId,
                ValidityDate= String.Format("{0:MMMM dd, yyyy HH:mm}", record.ValidityDate),
                record.CustomerId,
                record.Customer,
                record.IsAccepted,
                record.IsChecked,
                record.IsApproved
            });

            var result = new { total = count, data = quotations };
            return this.Json(result);
        }
        public ActionResult GetAllDetail(int start, int limit, string sort, string dir, string param)
        {
            var hashtable = JsonConvert.DeserializeObject<Hashtable>(param);
            int quotationHeaderId = 0;
            if (hashtable["quotationId"] != null)
                int.TryParse(hashtable["quotationId"].ToString(), out quotationHeaderId);
            var records = _quotationDetail.GetAll().AsQueryable().Where(o => o.QuotationId == quotationHeaderId);
              //   records = dir == "ASC" ? records.OrderBy(r => r.GetType().GetProperty(sort).GetValue(r, null)) : records.OrderByDescending(r => r.GetType().GetProperty(sort).GetValue(r, null));
            var count = records.Count();
            // records = records.Skip(start).Take(limit);
            var customers = records.Select(record => new
            {
                record.Id,
                record.OperationTypeId,
                record.ServiceId,
                Service=record.iffsService.Name,
                record.ServiceDescription,
                record.CurrencyId,
                record.ComparingSign,
                ServiceUnitType=record.iffsLupServiceUnitType.Name,
                record.Quantity,
                record.QuotationId,
                record.Remark,
                record.ServiceUnitTypeId,
                ServiceRequestDetailId = record.ServiceRequestDetailId.HasValue ? record.ServiceRequestDetailId : 0,
                record.UnitPrice,
                OperationType =record.ServiceRequestDetailId.HasValue? record.iffsServiceRequestDetail.iffsLupOperationType.Name+" "+record.iffsServiceRequestDetail.Description: record.iffsLupOperationType.Name,
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
        [ValidateInput(false)]
        public ActionResult Save(iffsQuotationHeaderExt quotationExt)
        {
             using (var transaction = new TransactionScope((TransactionScopeOption.Required), new TransactionOptions { IsolationLevel = IsolationLevel.ReadCommitted }))
            {
                _context.Database.Connection.Open();
                _context.Database.CommandTimeout = int.MaxValue;
                
                var hashtable = JsonConvert.DeserializeObject<Hashtable>(quotationExt.record);
                string action = hashtable["action"].ToString();
                iffsQuotationHeader quotation = new iffsQuotationHeader();
                Utility.CopyObject(quotationExt, quotation);
                var quotationNo = quotation.QuotationNo;
                try
                {
                    if (quotation.Id == 0)
                    {

                        quotation.PreparedDate = DateTime.Now;                     
                        CyberErp.Presentation.Iffs.Web.MvcApplication httpapplication = HttpContext.ApplicationInstance as CyberErp.Presentation.Iffs.Web.MvcApplication;
                        httpapplication.Application.Lock();
                        if (action == "Add" && quotationNo == "Auto-Genereted")
                            quotation.QuotationNo = GetDocumentNumber("Quotation");                      
                        _quotationHeader.AddNew(quotation);
                        if (action == "Add" && quotationNo == "Auto-Genereted")
                            UpdateDocumentNumber("Quotation");
                        httpapplication.Application.UnLock();
                       
                     
                    }
                    else
                    {
                        _quotationHeader.Edit(quotation);
                    }
                  var servicesString = hashtable["services"].ToString();
                  saveDetail(servicesString, quotation.Id);
                 _context.SaveChanges();
                 transaction.Complete();
                 return this.Json(new { success = true, data = "Data has been saved successfully!", quotationId = quotation.Id });
               }
                catch (Exception exception)
                {
                    return this.Json(new { success = false, data = exception.InnerException != null ? exception.InnerException.Message : exception.Message });
                }
           }
        }

        [FormHandler]
        public ActionResult SaveCustomerResponse()
        {
            var id = 0;
            var customerResponseDate = new DateTime();
            var isAccepted = false;
            var CustomerResponseRemark = "";
            if (Request.Params["IsAccepted"] != null && Request.Params["IsAccepted"].ToString().Equals("on"))
                isAccepted = true;
            else
                isAccepted = false;
            if (Request.Params["CustomerResponseDate"] != null)
                customerResponseDate = DateTime.Parse(Request.Params["CustomerResponseDate"].ToString());
            if (Request.Params["CustomerResponseRemark"] != null)
                CustomerResponseRemark = Request.Params["CustomerResponseRemark"].ToString();
            if (Request.Params["Id"] != null)
                id =int.Parse( Request.Params["Id"].ToString());

            var objQuotation = _quotationHeader.Get(o=>o.Id==id);
            objQuotation.CustomerResponseDate = customerResponseDate;
            objQuotation.IsAccepted = isAccepted;
            objQuotation.CustomerResponseRemark = CustomerResponseRemark;
            _context.SaveChanges();
            return this.Json(new { success = true, data = "Data has been saved successfully!" });
        }
        public ActionResult SaveTermAndCondition(string termandCondition, int quotationId)
        {

            var objTermandCondition = _quotationTermandCondition.GetAll().AsQueryable().Where(o => o.QuotationId == quotationId).FirstOrDefault();
            if (objTermandCondition!=null)
            {
                objTermandCondition.TermsAndConditions = termandCondition;
            }
            else
            {
                var record = new iffsQuotationTermandCondition();
                record.QuotationId = quotationId;
                record.TermsAndConditions = termandCondition;
                _quotationTermandCondition.AddNew(record);
            }
            _context.SaveChanges();
            return this.Json(new { success = true, data = "Data has been saved successfully!" });
      
           }
        public ActionResult Delete(int id)
        {
            try
            {
                _quotationDetail.Delete(c => c.QuotationId == id);
                _quotationHeader.Delete(c => c.Id == id);

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

            var records =_quotationHeader.GetAll();
            records = searchText != "" ? records.Where(p => p.iffsServiceRequest.iffsCustomer.Name.ToUpper().Contains(searchText.ToUpper()) ||
                p.QuotationNo.ToUpper().Contains(searchText.ToUpper())) : records;

            var customers = records.Select(record => new
            {
                record.Id,
                record.QuotationNo,
                Customer = record.iffsServiceRequest.iffsCustomer.Name,              
                record.Date,
                PreparedBy = record.hrmsEmployee.corePerson.FirstName + " " + record.hrmsEmployee.corePerson.FatherName,
                record.Remark,
               // record.TermsAndConditions,
                record.ValidityDate,
                record.IsAccepted,
                ApprovedBy =record.ApprovedById.HasValue? record.hrmsEmployee2.corePerson.FirstName + " " + record.hrmsEmployee2.corePerson.FatherName:"",
                record.ApprovalDate,              
                CheckedBy =record.CheckedById.HasValue? record.hrmsEmployee1.corePerson.FirstName + " " + record.hrmsEmployee1.corePerson.FatherName:"",
                record.CheckedDate,
                IsChecked = record.CheckedById == null ? false : true,
                IsApproved = record.ApprovedById == null ? false : true,
             
              

            }).Cast<object>().ToList();

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

                var objQuotation = _quotationHeader.Get(j => j.Id == docConfirmation.Id);

                if (docConfirmation.Type == Constants.DOCUMENT_CONFIRM)
                {
                    objQuotation.CheckedById = currentEmployeeId;
                    objQuotation.CheckedDate = DateTime.Now;
                    _context.SaveChanges();

                    return this.Json(new { success = true, data = "Record successfully checked!" });
                }
                else
                {
                    //Send to notification table
                    _notification.AddNew(new iffsNotification
                    {
                        Operation = Constants.NTF_OPN_QUOTATION,
                        ObjectId = objQuotation.Id,
                        ActorId = objQuotation.PreparedById,
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

                var objQuotation = _quotationHeader.Get(j => j.Id == docConfirmation.Id);

                if (docConfirmation.Type == Constants.DOCUMENT_CONFIRM)
                {
                    objQuotation.ApprovedById = currentEmployeeId;
                    objQuotation.ApprovalDate = DateTime.Now;
                    _context.SaveChanges();

                    return this.Json(new { success = true, data = "Record successfully checked!" });
                }
                else
                {
                    //Send to notification table
                    _notification.AddNew(new iffsNotification
                    {
                        Operation = Constants.NTF_OPN_QUOTATION,
                        ObjectId = objQuotation.Id,
                        ActorId = objQuotation.PreparedById,
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
        public void saveDetail(string servicesString, int tquotationId)
        {
            servicesString = servicesString.Remove(servicesString.Length - 1);
            var servicesCollection = servicesString.Split(new[] { ';' });
            _quotationDetail.Delete(o => o.QuotationId == tquotationId);
            for (var i = 0; i < servicesCollection.Count(); i++)
            {
                var service = servicesCollection[i].Split(new[] { ':' });

                var objquotationDetail = new iffsQuotationDetail();
                objquotationDetail.OperationTypeId = int.Parse(service[1]);
                objquotationDetail.CurrencyId = int.Parse(service[2]);             
                objquotationDetail.Quantity = decimal.Parse(service[3]);
                objquotationDetail.QuotationId = tquotationId;
                objquotationDetail.Remark = service[5];
                objquotationDetail.ServiceUnitTypeId = int.Parse(service[6]);
                objquotationDetail.UnitPrice = decimal.Parse(service[7]);
                objquotationDetail.ServiceId = int.Parse(service[8]);
                objquotationDetail.ServiceDescription = service[9];
                objquotationDetail.ComparingSign = service[10];
                if (service[11] != null && service[11] != "undefined" && service[11] != "" && int.Parse( service[11])!=0)
                objquotationDetail.ServiceRequestDetailId =int.Parse(service[11]); 
              
               
                
                _quotationDetail.AddNew(objquotationDetail);
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
