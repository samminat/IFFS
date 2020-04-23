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
    public class JobOrderController : DirectController
    {
        #region Members

        private readonly DbContext _context;
        private readonly BaseModel<iffsJobOrderHeader> _jobOrderHeader;
        private readonly BaseModel<iffsJobOrderDetail> _jobOrderDetail;
        private readonly BaseModel<iffsJobOrderTemplate> _jobOrderTemplate;
        private readonly BaseModel<iffsQuotationHeader> _quotationHeader;
        private readonly BaseModel<iffsDocumentNoSetting> _documentNoSetting;
        private readonly BaseModel<iffsJobOrderQuotation> _jobOrderQuotation;
        private readonly BaseModel<iffsNotification> _notification;
        private readonly BaseModel<iffsJobOrderHistoryHeader> _historyHeader;
        private readonly BaseModel<iffsJobOrderHistoryDetail> _historyDetail;
        private readonly Utility _utils = new Utility();
        private readonly Lookups _lookup;

        private readonly BaseModel<iffsUserOperationTypeMapping> _userOperationMapping;

        #endregion

        #region Constructor

        public JobOrderController()
        {
            _context = new ErpEntities(Constants.ConnectionString);
            _jobOrderHeader = new BaseModel<iffsJobOrderHeader>(_context);
            _jobOrderDetail = new BaseModel<iffsJobOrderDetail>(_context);
            _jobOrderTemplate = new BaseModel<iffsJobOrderTemplate>(_context);
            _quotationHeader = new BaseModel<iffsQuotationHeader>(_context);
            _documentNoSetting = new BaseModel<iffsDocumentNoSetting>(_context);
            _lookup = new Lookups(_context);
            _jobOrderQuotation = new BaseModel<iffsJobOrderQuotation>(_context);
            _notification = new BaseModel<iffsNotification>(_context);
            _historyHeader = new BaseModel<iffsJobOrderHistoryHeader>(_context);
            _historyDetail = new BaseModel<iffsJobOrderHistoryDetail>(_context);
            _userOperationMapping = new BaseModel<iffsUserOperationTypeMapping>(_context);
        }

        #endregion

        #region Actions

        public ActionResult Get(int id)
        {
            var objJobOrder = _jobOrderHeader.Get(c => c.Id == id);

            var jobOrderTemplate = new
            {
                objJobOrder.Id,
                objJobOrder.OperationTypeId,
                objJobOrder.Quotations,
                QuotationRecs = GetQuotationRecs(objJobOrder.Id),
                objJobOrder.JobOrderNo,
                objJobOrder.ReceivingClient,
                objJobOrder.UltimateClient,
                objJobOrder.Remark,
                objJobOrder.ContactPersonForeign,
                objJobOrder.ContactPersonLocal,
                objJobOrder.ValidityDate,
                objJobOrder.PreparedById,
                objJobOrder.PreparedDate,
                objJobOrder.Status,
                objJobOrder.CheckedById,
                objJobOrder.CheckedDate,
                CheckedBy = objJobOrder.CheckedById != null ? objJobOrder.hrmsEmployee1.corePerson.FirstName + " " + objJobOrder.hrmsEmployee1.corePerson.FatherName : "",
                objJobOrder.ApprovedById,
                ApprovedBy = objJobOrder.ApprovedById != null ? objJobOrder.hrmsEmployee2.corePerson.FirstName + " " + objJobOrder.hrmsEmployee2.corePerson.FatherName : "",
                objJobOrder.ApprovalDate,
                objJobOrder.ParentJobOrderId,
                objJobOrder.Version,
                objJobOrder.IsRequiredDocumentsSubmited,
                objJobOrder.IsViewed
            };
            return this.Json(new
            {
                success = true,
                data = jobOrderTemplate
            });
        }

        public string GetQuotationRecs(int jobOrderId)
        {
            string recs ="";
            var objJobOrder = _jobOrderQuotation.GetAll().AsQueryable().Where(o => o.JobOrderId == jobOrderId).ToList();
            foreach (var j in objJobOrder)
            {
                recs += j.QuotationId + ";";
            }
            return recs;
        }

        public ActionResult GetAll(int start, int limit, string sort, string dir, string param)
        {
            var hashtable = JsonConvert.DeserializeObject<Hashtable>(param);
            var searchText = hashtable["searchText"].ToString();
            DateTime date = new DateTime();
            bool isDatestring = DateTime.TryParse(searchText, out date);


            var records = _jobOrderHeader.GetAll().AsQueryable();
            if( searchText != "")
            records =records.Where(p =>
               
                p.JobOrderNo.ToUpper().Contains(searchText.ToUpper()) ||
                p.ReceivingClient.ToUpper().Contains(searchText.ToUpper()) ||
                p.Status.ToUpper().Contains(searchText.ToUpper())||
                (p.hrmsEmployee.corePerson.FirstName + " " + p.hrmsEmployee.corePerson.FatherName).ToUpper().Contains(searchText.ToUpper())||
                ( p.CheckedById.HasValue? (p.hrmsEmployee1.corePerson.FirstName + " " + p.hrmsEmployee1.corePerson.FatherName).ToUpper().Contains(searchText.ToUpper()):false) ||
                (p.ApprovedById.HasValue ? (p.hrmsEmployee2.corePerson.FirstName + " " + p.hrmsEmployee2.corePerson.FatherName).ToUpper().Contains(searchText.ToUpper()) : false) ||
                (isDatestring ? p.PreparedDate>= date.Date: false) ||
                (isDatestring?p.ValidityDate>=date:false)||
                (isDatestring ? p.CheckedDate.HasValue ? p.CheckedDate.Value >= date : false : false) ||
                (isDatestring ? p.ApprovalDate.HasValue ? p.ApprovalDate.Value >= date : false : false)
                );
        
            switch (sort)
            {
                case "Id":
                    records = dir == "ASC" ? records.OrderByDescending(u => u.Id) : records.OrderByDescending(u => u.Id);
                    break;
                case "JobOrderNo":
                    records = dir == "ASC" ? records.OrderBy(u => u.JobOrderNo) : records.OrderByDescending(u => u.JobOrderNo);
                    break;
                case "Status":
                    records = dir == "ASC" ? records.OrderBy(u => u.Status) : records.OrderByDescending(u => u.Status);
                    break;
              
                case "ReceivingClient":
                    records = dir == "ASC" ? records.OrderBy(u => u.ReceivingClient) : records.OrderByDescending(u => u.ReceivingClient);
                    break;
                         case "ApprovedBy":
                    records = dir == "ASC" ? records.OrderBy(u => u.ApprovedById.HasValue ? u.hrmsEmployee2.corePerson.FirstName + " " + u.hrmsEmployee2.corePerson.FatherName : "") : records.OrderByDescending(u => u.ApprovedById.HasValue ? u.hrmsEmployee2.corePerson.FirstName + " " + u.hrmsEmployee2.corePerson.FatherName : "");
                    break;
                case "CheckedBy":
                    records = dir == "ASC" ? records.OrderBy(u => u.hrmsEmployee1.corePerson.FirstName + " " + u.hrmsEmployee1.corePerson.FatherName) : records.OrderByDescending(u => u.hrmsEmployee1.corePerson.FirstName + " " + u.hrmsEmployee1.corePerson.FatherName);
                    break;
                case "PreparedBy":
                    records = dir == "ASC" ? records.OrderBy(u => u.CheckedById.HasValue ? u.hrmsEmployee.corePerson.FirstName + " " + u.hrmsEmployee.corePerson.FatherName : "") : records.OrderByDescending(u => u.CheckedById.HasValue ? u.hrmsEmployee.corePerson.FirstName + " " + u.hrmsEmployee.corePerson.FatherName : "");
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
          
            var jobOrders = records.Select(record => new
            {
                record.Id,
                record.JobOrderNo,
                record.Version,
                record.OperationTypeId,
                ReceivingClient = record.ReceivingClient,
                UltimateClient = record.UltimateClient,
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
                record.ApprovalDate,
                record.IsRequiredDocumentsSubmited,
                record.Status
                //IsRevised = CheckRevised(record.Id)
            }).ToList().Select(record => new
            {
                record.Id,
                record.JobOrderNo,
                record.Version,
                record.OperationTypeId,
                record.ReceivingClient,
                record.UltimateClient,
                record.IsChecked,
                record.IsApproved,
                PreparedBy = record.PreparedByFirst + " " + record.PreparedByFather,
                CheckedBy = record.CheckedByFirst + " " + record.CheckedByFather,
                ApprovedBy = record.ApprovedByFirst + " " + record.ApprovedByFather,
                PreparedDate = string.Format("{0:MMMM dd, yyyy}", record.PreparedDate),
                CheckedDate = string.Format("{0:MMMM dd, yyyy}", record.CheckedDate),
                ApprovalDate = string.Format("{0:MMMM dd, yyyy}", record.ApprovalDate),
                record.IsRequiredDocumentsSubmited,
                record.Status
                //record.IsRevised
            });
            var result = new { total = count, data = jobOrders };
            return this.Json(result);
        }

        public bool CheckRevised(int joborderid)
        {
            bool isrevised = false;
            var objJobOrders = _jobOrderHeader.GetAll().AsQueryable().Where(o => o.ParentJobOrderId == joborderid).ToList();
            if (objJobOrders.Any())
            {
                isrevised = true;
            }
            return isrevised;
        }

        public ActionResult GetGridDetails(int start, int limit, string sort, string dir, string record)
        {
            var hashtable = JsonConvert.DeserializeObject<Hashtable>(record);
            int operationTypeId;
            int.TryParse(hashtable["operationTypeId"].ToString(), out operationTypeId);
            var source = hashtable["source"].ToString();

            if (source == "New")
            {
                var filtered = _jobOrderTemplate.GetAll().AsQueryable().Where(o => o.OperationTypeId == operationTypeId);
                var count = filtered.Count();
               
              //  filtered = filtered.OrderBy(o => o.FieldCategory).Skip(start).Take(limit);
              //  filtered = filtered.OrderBy(o => o.FieldCategory);
                var details = filtered.Select(item => new
                {
                    item.Id,
                    item.FieldCategory,
                    item.Field,
                    Value = item.DefaultValue
                }).ToList();
                var result = new { total = count, data = details };
                return this.Json(result);
            }
            else
            {
                var filtered = _jobOrderDetail.GetAll().AsQueryable().Where(o => o.JobOrderHeaderId == operationTypeId);
                var count = filtered.Count();
               // filtered = filtered.OrderBy(o => o.FieldCategory).Skip(start).Take(limit);
               // filtered = filtered.OrderBy(o => o.FieldCategory);

                var details = filtered.Select(item => new
                {
                    item.Id,
                    item.FieldCategory,
                    item.Field,
                    item.Value
                }).ToList();
                var result = new { total = count, data = details };
                return this.Json(result);
            }
        }

        [FormHandler]
        public DirectResult Save(iffsJobOrderHeader jobOrderHeader)
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

                    var hashtable = JsonConvert.DeserializeObject<Hashtable>(Request.Params["record"]);
                    var voucherDetailsString = hashtable["templateDetails"].ToString();
                    voucherDetailsString = voucherDetailsString.Remove(voucherDetailsString.Length - 1);
                    var voucherDetails = voucherDetailsString.Split(new[] { ';' });
                    string action = hashtable["action"].ToString();
                    var jobOrderNo = jobOrderHeader.JobOrderNo;
                    if (Request.Params["IsViewed"] != null)
                        jobOrderHeader.IsViewed = true;


                    if (jobOrderHeader.Id.Equals(0))
                    {
                        jobOrderHeader.PreparedById = employeeId;
                        jobOrderHeader.PreparedDate = DateTime.Now;

                        
                        /* ***************************************************
                        * Concurrency controlling scheme using global locking                                              
                        * ***************************************************/
                        if(jobOrderNo=="Auto-Generated")
                        {
                            var objOperationType = _lookup.GetAll((Lookups.LupOperationType)).Where(o => o.Id == jobOrderHeader.OperationTypeId).FirstOrDefault();
                            CyberErp.Presentation.Iffs.Web.MvcApplication httpapplication = HttpContext.ApplicationInstance as CyberErp.Presentation.Iffs.Web.MvcApplication;
                            httpapplication.Application.Lock();
                            jobOrderHeader.JobOrderNo = objOperationType.Code + "/" + GetDocumentNumber("JobOrder");
                            jobOrderHeader.Version = "000";
                            _jobOrderHeader.AddNew(jobOrderHeader);
                            UpdateDocumentNumber("JobOrder");
                            httpapplication.Application.UnLock();
     
                        }
                        else
                        {
                            _jobOrderHeader.AddNew(jobOrderHeader);
        
                        }
                      }
                    else
                    {
                        if (action == "Revised")
                        {
                            var objJobOrder = _jobOrderHeader.Get(j => j.Id == jobOrderHeader.ParentJobOrderId);
                            var objJobHistories = _historyHeader.GetAll().Where(h => h.ParentJobOrderId == jobOrderHeader.ParentJobOrderId);
                            var objJobDetail = _jobOrderDetail.GetAll().Where(o => o.JobOrderHeaderId == jobOrderHeader.ParentJobOrderId);
                            int versionint = 0;
                            string version = "";
                            if (objJobHistories.Any())
                            {
                                var lastVersion = objJobHistories.LastOrDefault().Version;
                                versionint = Convert.ToInt32(lastVersion);
                                versionint = versionint + 1;
                                version = "00" + versionint.ToString();
                            }
                            else
                            {
                                version = "001";
                            }

                            //Make the copy of the previous joborder in history table

                            iffsJobOrderHistoryHeader history = new iffsJobOrderHistoryHeader();
                            history.Quotations = objJobOrder.Quotations;
                            history.JobOrderNo = objJobOrder.JobOrderNo;
                            history.OperationTypeId = objJobOrder.OperationTypeId;
                            history.ParentJobOrderId = objJobOrder.Id;
                            history.Version = version;
                            history.ValidityDate = objJobOrder.ValidityDate;
                            history.UltimateClient = objJobOrder.UltimateClient;
                            history.ReceivingClient = objJobOrder.ReceivingClient;
                            history.ContactPersonForeign = objJobOrder.ContactPersonForeign;
                            history.ContactPersonLocal = objJobOrder.ContactPersonLocal;
                            history.PreparedById = objJobOrder.PreparedById;
                            history.PreparedDate = objJobOrder.PreparedDate;
                            history.CheckedById = objJobOrder.CheckedById;
                            history.CheckedDate = objJobOrder.CheckedDate;
                            history.ApprovedById = objJobOrder.ApprovedById;
                            history.ApprovedDate = objJobOrder.ApprovalDate;
                            history.Status = objJobOrder.Status;
                            history.IsViewed = objJobOrder.IsViewed;
                            history.Remark = objJobOrder.Remark;
                            history.IsRequiredDocumentsSubmited = objJobOrder.IsRequiredDocumentsSubmited;
                            _historyHeader.AddNew(history);

                            foreach (var d in objJobDetail)
                            {
                                iffsJobOrderHistoryDetail historyDetail = new iffsJobOrderHistoryDetail();
                                historyDetail.JobOrderHeaderId = history.Id;
                                historyDetail.FieldCategory = d.FieldCategory;
                                historyDetail.Field = d.Field;
                                historyDetail.Value = d.Value;
                                _historyDetail.AddNew(historyDetail);
                            }
                            _context.Entry(objJobOrder).State = EntityState.Detached;

                            jobOrderHeader.CheckedById = null;
                            jobOrderHeader.CheckedDate = null;
                            jobOrderHeader.ApprovedById = null;
                            jobOrderHeader.ApprovalDate = null;
                        }
                        _jobOrderHeader.Edit(jobOrderHeader);
                    }

                    var quotations = Request.Form["QuotationRecs"];
                    quotations = quotations.Remove(quotations.Length - 1);
                    var quotationDetails = quotations.Split(new[] { ';' });

                    SaveJobOrderDetails(jobOrderHeader, voucherDetails.ToList(), action, quotationDetails.ToList());

                    //if (action != "Revised")
                    //{
                    //    var quotations = Request.Form["QuotationRecs"];
                    //    quotations = quotations.Remove(quotations.Length - 1);
                    //    var quotationDetails = quotations.Split(new[] { ';' });

                    //    SaveJobOrderDetails(jobOrderHeader, voucherDetails.ToList(), action, quotationDetails.ToList());
                    //}
                    //else
                    //{
                    //    SaveJobOrderDetails(jobOrderHeader, voucherDetails.ToList(), action, null);
          
                    //}

                    _context.SaveChanges();
                    transaction.Complete();
                    return this.Json(new { success = true, data = "Job Order has been saved Successfully!" });
                }
                catch (Exception exception)
                {
                    return this.Json(new { success = false, data = exception.InnerException != null ? exception.InnerException.Message : exception.Message });
                }
            }
        }

        public ActionResult GetAllApprovedJOs(int start, int limit, string sort, string dir, string record)
        {
            var hashtable = JsonConvert.DeserializeObject<Hashtable>(record);
            var searchText = hashtable["searchText"].ToString();

            var filtered = _jobOrderHeader.GetAll().AsQueryable().Where(o=> o.ApprovedById != null);
            filtered = searchText != "" ? filtered.Where(p => p.JobOrderNo.ToUpper().Contains(searchText.ToUpper())) : filtered;



            var count = filtered.Count();
            filtered = filtered.OrderByDescending(o => o.PreparedDate).ThenByDescending(o => o.JobOrderNo).Skip(start).Take(limit);
            var jobOrders = filtered.Select(item => new
            {
                item.Id,
                item.JobOrderNo,
                OperationType = item.iffsLupOperationType.Name,
                ReceivingClient = item.ReceivingClient,
                item.IsViewed,
                item.PreparedDate
            }).ToList().Select(item => new
            {
                item.Id,
                item.JobOrderNo,
                item.IsViewed,
                item.ReceivingClient,
                Date = string.Format("{0:MMMM dd, yyyy}", item.PreparedDate)
            });
            var result = new { total = count, data = jobOrders };
            return this.Json(result);
        }

        public DirectResult ChangeViewStatus(int jobOrderId)
        {
            using (var transaction = new TransactionScope((TransactionScopeOption.Required), new TransactionOptions { IsolationLevel = IsolationLevel.ReadCommitted }))
            {
                _context.Database.Connection.Open();
                _context.Database.CommandTimeout = int.MaxValue;
                try
                {

                    var jo = _jobOrderHeader.Get(o => o.Id == jobOrderId);
                    jo.IsViewed = true;


                    _context.SaveChanges();
                    transaction.Complete();
                    return this.Json(new { success = true, data = "Status changed successfully!" });
                }
                catch (Exception exception)
                {
                    return
                        this.Json(
                            new
                            {
                                success = false,
                                data =
                                    exception.InnerException != null
                                        ? exception.InnerException.Message
                                        : exception.Message
                            });
                }
            }
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

                var objJobOrder = _jobOrderHeader.Get(j => j.Id == docConfirmation.Id);

                if (docConfirmation.Type == Constants.DOCUMENT_CONFIRM)
                {
                    objJobOrder.CheckedById = currentEmployeeId;
                    objJobOrder.CheckedDate = DateTime.Now;
                    _context.SaveChanges();

                    return this.Json(new { success = true, data = "Record successfully checked!" });
                }
                else
                {
                    //Send to notification table
                    _notification.AddNew(new iffsNotification
                    {
                        Operation = Constants.NTF_OPN_JOB_ORDER,
                        ObjectId = objJobOrder.Id,
                        ActorId = objJobOrder.PreparedById,
                        Date = DateTime.Now,
                        Message = docConfirmation.Comment,
                        IsViewed = false
                    });
                    return this.Json(new { success = true, data = "Reject notification sent for a person who prepares the selected document!" });
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

                var objJobOrder = _jobOrderHeader.Get(j => j.Id == docConfirmation.Id);

                if (docConfirmation.Type == Constants.DOCUMENT_CONFIRM)
                {
                    objJobOrder.ApprovedById = currentEmployeeId;
                    objJobOrder.ApprovalDate = DateTime.Now;
                    _context.SaveChanges();

                    var userOPMapping =
                        _userOperationMapping.GetAll().Where(p => p.OperationTypeId == objJobOrder.OperationTypeId);

                    foreach (var uom in userOPMapping)
                    {
                        //Send to notification table
                        _notification.AddNew(new iffsNotification
                        {
                            Operation = Constants.NTF_OPN_JOB_ORDER,
                            ObjectId = objJobOrder.Id,
                            ActorId = uom.UserId,
                            Date = DateTime.Now,
                            Message = Constants.NTF_OPN_MESSAGE_APPROVED,
                            IsViewed = false
                        });
                    }
                    
                    return this.Json(new { success = true, data = "Record successfully approved!" });
                }
                else
                {
                    //Send to notification table
                    _notification.AddNew(new iffsNotification
                    {
                        Operation = Constants.NTF_OPN_JOB_ORDER,
                        ObjectId = objJobOrder.Id,
                        ActorId = objJobOrder.PreparedById,
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

        public void SaveJobOrderDetails(iffsJobOrderHeader jobOrderHeader, IList<string> voucherDetails, string action, IList<string> quotationDetails)
        {
            var jobOrderHeaderId = jobOrderHeader.Id;

            if (action == "Add")
            {
                for (var i = 0; i < voucherDetails.Count(); i++)
                {
                    var row = voucherDetails[i].Split(new[] { ':' });
                    var fieldCategory = row[0].ToString();
                    var field = row[1].ToString();
                    var value = row[2].ToString();

                    var jobDetail = new iffsJobOrderDetail();
                    jobDetail.Id = 0;
                    jobDetail.JobOrderHeaderId = jobOrderHeaderId;
                    jobDetail.FieldCategory = fieldCategory;
                    jobDetail.Field = row[1] != null ? field : "";
                    jobDetail.Value = row[2] != null ? value : "";

                    _jobOrderDetail.AddNew(jobDetail);
                    _context.SaveChanges();
                }

                //Save Job Order Quotations
                for (var j = 0; j < quotationDetails.Count(); j++)
                {
                    var rowquote = quotationDetails[j].Split(new[] { ':' });
                    var quotationId = int.Parse(rowquote[0]);

                    var jobOrderQuotation = new iffsJobOrderQuotation();
                    jobOrderQuotation.Id = 0;
                    jobOrderQuotation.JobOrderId = jobOrderHeaderId;
                    jobOrderQuotation.QuotationId = quotationId;

                    _jobOrderQuotation.AddNew(jobOrderQuotation);
                    _context.SaveChanges();
                }
            }
            else if (action == "Edit")
            {
                _jobOrderDetail.Delete(s => s.JobOrderHeaderId == jobOrderHeaderId);
                for (int i = 0; i < voucherDetails.Count(); i++)
                {
                    var row = voucherDetails[i].Split(new[] { ':' });
                    var fieldCategory = row[0].ToString();
                    var field = row[1].ToString();
                    var value = row[2].ToString();

                    var jobDetail = new iffsJobOrderDetail();
                    jobDetail.Id = 0;
                    jobDetail.JobOrderHeaderId = jobOrderHeaderId;
                    jobDetail.FieldCategory = fieldCategory;
                    jobDetail.Field = row[1] != null ? field : "";
                    jobDetail.Value = row[2] != null ? value : "";

                    _jobOrderDetail.AddNew(jobDetail);
                    _context.SaveChanges();
                }

                _jobOrderQuotation.Delete(q => q.JobOrderId == jobOrderHeaderId);
                //Save Job Order Quotations
                for (var j = 0; j < quotationDetails.Count(); j++)
                {
                    var rowquote = quotationDetails[j].Split(new[] { ':' });
                    var quotationId = int.Parse(rowquote[0]);

                    var jobOrderQuotation = new iffsJobOrderQuotation();
                    jobOrderQuotation.Id = 0;
                    jobOrderQuotation.JobOrderId = jobOrderHeaderId;
                    jobOrderQuotation.QuotationId = quotationId;

                    _jobOrderQuotation.AddNew(jobOrderQuotation);
                    _context.SaveChanges();
                }
            }
            else if (action  == "Revised")
            {
                _jobOrderDetail.Delete(j => j.JobOrderHeaderId == jobOrderHeaderId);
                for (var i = 0; i < voucherDetails.Count(); i++)
                {
                    var row = voucherDetails[i].Split(new[] { ':' });
                    var fieldCategory = row[0].ToString();
                    var field = row[1].ToString();
                    var value = row[2].ToString();

                    var jobDetail = new iffsJobOrderDetail();
                    jobDetail.Id = 0;
                    jobDetail.JobOrderHeaderId = jobOrderHeaderId;
                    jobDetail.FieldCategory = fieldCategory;
                    jobDetail.Field = field;
                    jobDetail.Value = value;

                    _jobOrderDetail.AddNew(jobDetail);
                    _context.SaveChanges();
                }

                _jobOrderQuotation.Delete(q => q.JobOrderId == jobOrderHeaderId);
                //Save Job Order Quotations
                for (var j = 0; j < quotationDetails.Count(); j++)
                {
                    var rowquote = quotationDetails[j].Split(new[] { ':' });
                    var quotationId = int.Parse(rowquote[0]);

                    var jobOrderQuotation = new iffsJobOrderQuotation();
                    jobOrderQuotation.Id = 0;
                    jobOrderQuotation.JobOrderId = jobOrderHeaderId;
                    jobOrderQuotation.QuotationId = quotationId;

                    _jobOrderQuotation.AddNew(jobOrderQuotation);
                    _context.SaveChanges();
                }
            }
        }

        //public DirectResult GetActiveQuotations(int start, int limit, string sort, string dir, string record)
        //{
        //    var filtered = _quotationHeader.GetAll().AsQueryable().Where(q => q.IsAccepted == true && q.ValidityDate.Date >= DateTime.Now.Date.Date);
        //    var count = filtered.Count();
        //    filtered = filtered.OrderBy(o => o.Id);
        //    var quotations = filtered.Select(item => new
        //    {
        //        item.Id,
        //        item.QuotationNo,
        //        item.ValidityDate
        //    }).ToList().Select(item => new
        //    {
        //        item.Id,
        //        item.QuotationNo,
        //        ValidtyDate = string.Format("{0:MMMM dd, yyyy}", item.ValidityDate)
        //    });
        //    var result = new { total = count, data = quotations };
        //    return this.Json(result);
        //}
        public ActionResult GetActiveQuotations(int start, int limit, string sort, string dir, string record)
        {
            var ht = JsonConvert.DeserializeObject<Hashtable>(record);
            var searchText = ht["searchText"] != null ? ht["searchText"].ToString() : "";
            DateTime date = new DateTime();
            bool isDatestring = DateTime.TryParse(searchText, out date);

            var today = DateTime.Now.Date;
            var filtered = _quotationHeader.GetAll().AsQueryable().Where(q => q.IsAccepted == true && (q.ValidityDate >= today));
            if (searchText != "")
            {
                filtered = filtered.Where(o => o.QuotationNo.ToUpper().Contains(searchText.ToUpper()) ||
                    o.PrevQuotationNumber.ToUpper().Contains(searchText.ToUpper()) ||
                    o.iffsServiceRequest.iffsCustomer.Name.ToUpper().Contains(searchText.ToUpper())
                    //||
                    //isDatestring?o.Date==date:true||
                    //isDatestring?o.ValidityDate==date:true
                    );

            }
            switch (sort)
            {
                case "QuotationNo":
                    filtered = dir == "ASC" ? filtered.OrderBy(u => u.QuotationNo) : filtered.OrderByDescending(u => u.QuotationNo);
                    break;
                case "PrevQuotationNumber":
                    filtered = dir == "ASC" ? filtered.OrderBy(u => u.PrevQuotationNumber) : filtered.OrderByDescending(u => u.PrevQuotationNumber);
                    break;
              
                case "Date":
                    filtered = dir == "ASC" ? filtered.OrderBy(u => u.Date) : filtered.OrderByDescending(u => u.Date);
                    break;
                case "ValidtyDate":
                    filtered = dir == "ASC" ? filtered.OrderBy(u => u.ValidityDate) : filtered.OrderByDescending(u => u.ValidityDate);
                    break;
            }
            var count = filtered.Count();
            filtered = filtered.Skip(start).Take(limit);

            var quotations = filtered.Select(item => new
            {
                item.Id,
                item.QuotationNo,
                item.PrevQuotationNumber,
                item.ValidityDate
            }).ToList().Select(item => new
            {
                item.Id,
                item.QuotationNo,
                ValidtyDate = string.Format("{0:MMMM dd, yyyy}", item.ValidityDate)
            });
            var result = new
            {
                total = count,
                data = quotations
            };
            return this.Json(result);

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

        public void ExportToExcel()
        {
            var searchText = Request.QueryString["st"];

            var records = _jobOrderHeader.GetAll().AsQueryable().Where(j => j.ParentJobOrderId == null);
            records = searchText != "" ? records.Where(p => p.JobOrderNo.ToUpper().Contains(searchText.ToUpper()) ||
                p.UltimateClient.ToUpper().Contains(searchText.ToUpper()) ||
                p.ReceivingClient.ToUpper().Contains(searchText.ToUpper())) : records;

            var jobOrders = records.Select(record => new
            {
                record.Id,
                record.JobOrderNo,
                ReceivingClient = record.ReceivingClient,
                record.PreparedDate,
                IsChecked = record.CheckedById == null ? false : true,
                IsApproved = record.ApprovedById == null ? false : true
            }).ToList().Select(record => new
            {
                record.Id,
                record.JobOrderNo,
                record.ReceivingClient,
                Date = string.Format("{0:MMMM dd, yyyy}", record.PreparedDate),
                record.IsChecked,
                record.IsApproved
            });

            var exportToExcelHelper = new ExportToExcelHelper();
            exportToExcelHelper.ToExcel(Response, jobOrders);
        }

        #endregion
    }
}