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
    public class ScheduleController : DirectController
    {
        #region Members

        private readonly DbContext _context;
        private readonly BaseModel<iffsSchedule> _Schedule;
        private readonly BaseModel<iffsJobOrderHeader> _jobOrderHeader;
        private readonly BaseModel<iffsQuotationHeader> _quotationHeader;
        private readonly BaseModel<iffsSurveyRequest> _SurveyRequest;
        private readonly BaseModel<iffsPackingSurveyHeader> _PackingSurvey;

        #endregion

        #region Constructor

        public ScheduleController()
        {
            _context = new ErpEntities(Constants.ConnectionString);
            _Schedule = new BaseModel<iffsSchedule>(_context);
            _jobOrderHeader = new BaseModel<iffsJobOrderHeader>(_context);
            _quotationHeader = new BaseModel<iffsQuotationHeader>(_context);
            _SurveyRequest = new BaseModel<iffsSurveyRequest>(_context);
            _PackingSurvey = new BaseModel<iffsPackingSurveyHeader>(_context);
        }

        #endregion

        #region Actions

        public ActionResult Get(int id)
        {
            var obj = _Schedule.Get(c => c.Id == id);

            var customer = new
            {
                obj.Id,
                obj.Title,
                obj.Location,
                obj.PreparedById,
                obj.ScheduleType,
                obj.ScheduleTypeId,
                obj.EndDate,
                obj.IsAllDAy

            };
            return this.Json(new
            {
                success = true,
                data = customer
            });
        }
        public ActionResult GetCalanderTypes()
        {
            int currentEmployeeId = 0;
            var objUser = (coreUser)Session[Constants.CurrentUser];
            if (objUser != null && objUser.EmployeeId != null)
            {
                currentEmployeeId = (int)objUser.EmployeeId;
            }
            var records = _SurveyRequest.GetAll().Where(o => o.ProposedSurveyDate >= DateTime.Now);
            var count = records.Count();
            var requests = records.Select(record => new
            {
                record.Id,
                CalendarId = 1,
                Title = record.Number,
                record.PreparedById
            }).Cast<object>().ToList();
            var result = new { total = count, data = requests };
            return this.Json(result);
        }
        public ActionResult GetScheduleByUser()
        {
            int currentEmployeeId = 0;
            var objUser = (coreUser)Session[Constants.CurrentUser];
            if (objUser != null && objUser.EmployeeId != null)
            {
                currentEmployeeId = (int)objUser.EmployeeId;
            }
            var records = _Schedule.GetAll().Where(o => o.PreparedById == currentEmployeeId);
            var count = records.Count();

            var customers = records.Select(record => new
            {
                record.Id,
                CalendarId = record.ScheduleType == Constants.SURVEYREQUEST ? 1 : 2,
                EventId = record.Id,
                record.Title,
                record.StartDate,
                record.EndDate,
                record.StartTime,
                record.EndTime,
                record.IsAllDAy,
                record.Notes,
                record.IsNew,
                record.Location,
                Reminder = "",
                Url = "",
                record.ScheduleType,
                record.ScheduleTypeId,
                record.PreparedById
            }).Cast<object>().ToList();
            var result = new { total = count, data = customers };
            return this.Json(result);
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

        //[FormHandler]
        public DirectResult Save(iffsSchedule schedule)
        {
            using (var transaction = new TransactionScope((TransactionScopeOption.Required), new TransactionOptions { IsolationLevel = IsolationLevel.ReadCommitted }))
            {
                _context.Database.Connection.Open();
                _context.Database.CommandTimeout = int.MaxValue;
                try
                {
                    // Request.Params[""]
                    int employeeId = 0;
                    schedule.StartTime = schedule.StartDate.TimeOfDay;
                    schedule.EndTime = schedule.EndDate.TimeOfDay;
                    var objUser = (coreUser)Session[Constants.CurrentUser];
                    if (objUser != null && objUser.EmployeeId != null)
                    {
                        employeeId = (int)objUser.EmployeeId;
                    }
                    if (schedule.Id.Equals(0))
                    {
                        schedule.PreparedById = employeeId;

                        /* ***************************************************
                        * Concurrency controlling scheme using global locking                                              
                        * ***************************************************/

                        //  var objOperationType = _lookup.GetAll((Lookups.LupOperationType)).Where(o => o.Id == Packing.Id).FirstOrDefault();
                        CyberErp.Presentation.Iffs.Web.MvcApplication httpapplication = HttpContext.ApplicationInstance as CyberErp.Presentation.Iffs.Web.MvcApplication;
                        httpapplication.Application.Lock();
                        //  Packing.Number = GetDocumentNumber("Packing");//objOperationType.Code + "/" + 
                        _Schedule.AddNew(schedule);
                        // UpdateDocumentNumber("Packing");
                        httpapplication.Application.UnLock();
                    }
                    else
                    {
                        _Schedule.Edit(schedule);
                    }
                    _context.SaveChanges();
                    transaction.Complete();
                    return this.Json(new { success = true, data = "Schedule has been saved Successfully!" });
                }
                catch (Exception exception)
                {
                    return this.Json(new { success = false, data = exception.InnerException != null ? exception.InnerException.Message : exception.Message });
                }
            }
        }
        #endregion
    }
}
