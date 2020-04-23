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
    public class SurveyRequestController : DirectController
    {
        #region Members

        private readonly DbContext _context;
        private readonly SurveyRequest _SurveyRequest;
        private readonly DocumentNoSetting _documentNoSetting;
        private readonly BaseModel<iffsShipmentType> _shipmentType;
        private readonly ReceivingClient _ReceivingClient;
        private readonly Utility _utils = new Utility();
        private readonly Lookups _lookup;
        private readonly BaseModel<iffsNotification> _notification;
        private readonly BaseModel<iffsUserOperationTypeMapping> _userOperationMapping;

        #endregion

        #region Constructor

        public SurveyRequestController()
        {
            _context = new ErpEntities(Constants.ConnectionString);
            _SurveyRequest = new SurveyRequest(_context);
            _documentNoSetting = new DocumentNoSetting(_context);
            _lookup = new Lookups(_context);
            _shipmentType = new BaseModel<iffsShipmentType>(_context);
            _userOperationMapping = new BaseModel<iffsUserOperationTypeMapping>(_context);
            _ReceivingClient = new ReceivingClient(_context);
            _notification = new BaseModel<iffsNotification>(_context);
        }

        #endregion

        #region Actions

        public ActionResult Get(int id)
        {
            return this.Json(_SurveyRequest.Get(id));
        }
        public DirectResult GetSurveyRequests()
        {
            var result = _SurveyRequest.GetSurveyRequests();
            return this.Json(result);
        }
        public ActionResult GetAll(int start, int limit, string sort, string dir, string param)
        {
            var hashtable = JsonConvert.DeserializeObject<Hashtable>(param);
            var searchText = hashtable["searchText"].ToString();

            var result = _SurveyRequest.GetAll(start, limit, sort, dir, searchText);
            return this.Json(result);
        }
        public DirectResult GetReceivingClients()
        {
            var result = _ReceivingClient.GetAll();
            return this.Json(result);
        }
        public DirectResult GetShipmentTypes()
        {
            var records = _shipmentType.GetAll().AsQueryable().ToList();
            var count = records.Count();
            records = records.OrderBy(o => o.Name).ThenByDescending(o => o.Type).ToList();//.Skip(start).Take(limit).ToList();
            var shipmentTypes = records.Select(item => new
            {
                item.Id,
                item.Name,
                item.Code,
                item.Type
            }).ToList();
            var result = new { total = count, data = shipmentTypes };
            return this.Json(result);
        }

        [FormHandler]
        public DirectResult SaveSchedule(iffsSurveyRequest surveyRequest)
        {
            try
            {
                var survey = _SurveyRequest.Single(s => s.Id == surveyRequest.Id);
                survey.ScheduleDate = surveyRequest.ScheduleDate;
                _SurveyRequest.SaveChanges();
                _context.SaveChanges();
                return this.Json(new { success = true, data = "Survey Scheduled successfully!!" });
            }
            catch (Exception exception)
            {
                return this.Json(new { success = false, data = exception.InnerException != null ? exception.InnerException.Message : exception.Message });
            }
        }

        [FormHandler]
        public DirectResult Save(iffsSurveyRequest SurveyRequest)
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
                    if (SurveyRequest.Id.Equals(0))
                    {
                        SurveyRequest.PreparedById = employeeId;
                        SurveyRequest.Date = DateTime.Now;

                        /* ***************************************************
                        * Concurrency controlling scheme using global locking                                              
                        * ***************************************************/

                        var objOperationType = _lookup.GetAll((Lookups.LupOperationType)).Where(o => o.Id == SurveyRequest.Id).FirstOrDefault();
                        CyberErp.Presentation.Iffs.Web.MvcApplication httpapplication = HttpContext.ApplicationInstance as CyberErp.Presentation.Iffs.Web.MvcApplication;
                        httpapplication.Application.Lock();
                        SurveyRequest.Number = _documentNoSetting.GetDocumentNumber("SurveyRequest");//objOperationType.Code + "/" + 
                        _SurveyRequest.Add(SurveyRequest);
                        _documentNoSetting.SaveChanges();
                        httpapplication.Application.UnLock();

                        _notification.AddNew(new iffsNotification
                        {
                            Operation = Constants.SURVEYREQUEST,
                            ObjectId = SurveyRequest.Id,
                            ActorId = SurveyRequest.PreparedById,
                            Date = DateTime.Now,
                            Message = "Ordering Client Address: " + SurveyRequest.OrderingClientId + " Receiving Client Address: " + SurveyRequest.ReceivingClientId,
                            IsViewed = false
                        });
                    }
                    else
                    {
                        _SurveyRequest.Edit(SurveyRequest);
                    }
                    _context.SaveChanges();
                    transaction.Complete();
                    return this.Json(new { success = true, data = "Survey Request has been saved Successfully!" });
                }
                catch (Exception exception)
                {
                    return this.Json(new { success = false, data = exception.InnerException != null ? exception.InnerException.Message : exception.Message });
                }
            }
        }


        public ActionResult ChangeStatus(int id)
        {
            return this.Json(_SurveyRequest.ChangeViewStatus(id));
        }
        public ActionResult Delete(int id)
        {
            try
            {
                _SurveyRequest.Delete(c => c.Id == id);

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
            var exportToExcelHelper = new ExportToExcelHelper();
            exportToExcelHelper.ToExcel(Response, _SurveyRequest.ExportToExcel(searchText));
        }

        #endregion
    }
}