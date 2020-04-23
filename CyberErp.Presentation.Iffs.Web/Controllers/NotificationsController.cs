using CyberErp.Data.Model;
using CyberErp.Presentation.Iffs.Web.Classes;
using Ext.Direct.Mvc;
using Newtonsoft.Json;
using SwiftTederash.Business;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Data.Entity;
using System.IO;
using System.Linq;
using System.Text;
using System.Transactions;
using System.Web;
using System.Web.Mvc;
using System.Web.UI;
using System.Xml;
using System.Xml.Serialization;

namespace CyberErp.Presentation.Iffs.Web.Controllers
{
    public class NotificationsController : DirectController
    {
        #region Members

        private readonly DbContext _context;
        private readonly BaseModel<iffsNotification> _notifications;
        private readonly BaseModel<iffsJobOrderHeader> _jobOrderHeader;
        private readonly BaseModel<iffsQuotationHeader> _quotationHeader;
        private readonly BaseModel<iffsSurveyRequest> _SurveyRequest;
        private readonly BaseModel<iffsPackingSurveyHeader> _PackingSurvey;

        #endregion

        #region Constructor

        public NotificationsController()
        {
            _context = new ErpEntities(Constants.ConnectionString);
            _notifications = new BaseModel<iffsNotification>(_context);
            _jobOrderHeader = new BaseModel<iffsJobOrderHeader>(_context);
            _quotationHeader = new BaseModel<iffsQuotationHeader>(_context);
            _SurveyRequest = new BaseModel<iffsSurveyRequest>(_context);
            _PackingSurvey = new BaseModel<iffsPackingSurveyHeader>(_context);
        }

        #endregion

        #region Actions

        public ActionResult Get(int id)
        {
            var objCustomer = _notifications.Get(c => c.Id == id);

            var customer = new
            {
                objCustomer.Id,
                objCustomer.Operation,
                objCustomer.ObjectId,
                objCustomer.ActorId,
                Date = string.Format("{0:MMMM dd, yyyy}", objCustomer.Date),
                objCustomer.Message,
                objCustomer.IsViewed,

            };
            return this.Json(new
            {
                success = true,
                data = customer
            });
        }

        public ActionResult GetAll(int start, int limit, string sort, string dir, string param)
        {
            var hashtable = JsonConvert.DeserializeObject<Hashtable>(param);
            var searchText = hashtable["searchText"].ToString();

            var records = _notifications.GetAll();


            var count = records.Count();

            records = records.Skip(start).Take(limit);
            var customers = records.Select(record => new
            {
                record.Id,
                record.Operation,
                record.ObjectId,
                record.ActorId,
                Date = string.Format("{0:MMMM dd, yyyy}", record.Date),
                record.Message,
                record.IsViewed,

            }).Cast<object>().ToList();
            var result = new { total = count, data = customers };
            return this.Json(result);
        }
        public ActionResult GetAllByUser(int start, int limit, string sort, string dir, string param)
        {
            var hashtable = JsonConvert.DeserializeObject<Hashtable>(param);
            var searchText = hashtable["searchText"].ToString();


            int currentEmployeeId = 0;
            var objUser = (coreUser)Session[Constants.CurrentUser];
            if (objUser != null && objUser.EmployeeId != null)
            {
                currentEmployeeId = (int)objUser.EmployeeId;
            }

            var records = _notifications.GetAll().Where(o => o.ActorId == currentEmployeeId);


            var count = records.Count();

            records = records.Skip(start).Take(limit);
            var customers = records.Select(record => new
            {
                record.Id,
                record.Operation,
                record.ObjectId,
                DocumentNo = GetDocumnetNo(record),//record.Operation == Constants.NTF_OPN_JOB_ORDER ? _jobOrderHeader.Get(o => o.Id == record.ObjectId).JobOrderNo : (record.Operation == Constants.NTF_OPN_QUOTATION ? _quotationHeader.Get(o => o.Id == record.ObjectId).QuotationNo : ""),
                PreparedById = GetPreparedBy(record),//record.Operation == Constants.NTF_OPN_JOB_ORDER ? _jobOrderHeader.Get(o => o.Id == record.ObjectId).PreparedById : (record.Operation == Constants.NTF_OPN_QUOTATION ? _quotationHeader.Get(o => o.Id == record.ObjectId).PreparedById : 0),
                record.ActorId,
                Date = string.Format("{0:MMMM dd, yyyy}", record.Date),
                record.Message,
                record.IsViewed,

            }).Cast<object>().ToList();
            var result = new { total = count, data = customers };
            return this.Json(result);
        }
        private string GetDocumnetNo(iffsNotification not)
        {
            string res = "";
            switch (not.Operation)
            {
                case Constants.NTF_OPN_JOB_ORDER:
                    res = _jobOrderHeader.Get(o => o.Id == not.ObjectId).JobOrderNo;
                    break;
                case Constants.NTF_OPN_QUOTATION:
                    res = _quotationHeader.Get(o => o.Id == not.ObjectId).QuotationNo;
                    break;
                case Constants.SURVEYREQUEST:
                    res = _SurveyRequest.Get(o => o.Id == not.ObjectId).Number;
                    break;
                case Constants.PACKINGSURVEY:
                    res = _PackingSurvey.Get(o => o.Id == not.ObjectId).iffsSurveyRequest.Number;
                    break;
            }
            return res;
        }
        private int GetPreparedBy(iffsNotification not)
        {
            int res = 0;
            switch (not.Operation)
            {
                case Constants.NTF_OPN_JOB_ORDER:
                    res = _jobOrderHeader.Get(o => o.Id == not.ObjectId).PreparedById;
                    break;
                case Constants.NTF_OPN_QUOTATION:
                    res = _quotationHeader.Get(o => o.Id == not.ObjectId).PreparedById;
                    break;
                case Constants.SURVEYREQUEST:
                    res = _SurveyRequest.Get(o => o.Id == not.ObjectId).PreparedById;
                    break;
            }
            return res;

        }
        public ActionResult GetUserNotificationsCount()
        {
            int currentEmployeeId = 0;
            var objUser = (coreUser)Session[Constants.CurrentUser];
            if (objUser != null && objUser.EmployeeId != null)
            {
                currentEmployeeId = (int)objUser.EmployeeId;
            }

            var records = _notifications.GetAll().Where(o => o.ActorId == currentEmployeeId && !o.IsViewed);


            var count = records.Count();
            var surveyRequestCount = _SurveyRequest.GetAll().Where(s => !s.IsViewed).Count();


            var result = new { total = count, SurveyRequest = surveyRequestCount, success = true };

            return this.Json(result);

        }
        public DirectResult ChangeViewStatus(int notificationId)
        {
            using (var transaction = new TransactionScope((TransactionScopeOption.Required), new TransactionOptions { IsolationLevel = IsolationLevel.ReadCommitted }))
            {
                _context.Database.Connection.Open();
                _context.Database.CommandTimeout = int.MaxValue;
                try
                {

                    var jo = _notifications.Get(o => o.Id == notificationId);
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
    }
}
