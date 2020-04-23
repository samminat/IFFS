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
    public class JobOrderStatusController : DirectController
    {
        #region Members

        private readonly DbContext _context;
        private readonly BaseModel<iffsOperationStatus> _operationStatus;
        private readonly BaseModel<iffsOperationStatusTemplate> _status;
        private readonly BaseModel<iffsOperation> _operation;
        private readonly BaseModel<iffsOperationStatusTemplate> _operationStatusTemplate;
        private readonly BaseModel<iffsJobOrderHeader> _jobOrderHeader;
        private readonly BaseModel<coreUserRole> _userRole;

        #endregion

        #region Constructor

        public JobOrderStatusController()
        {
            _context = new ErpEntities(Constants.ConnectionString);
            _operationStatus = new BaseModel<iffsOperationStatus>(_context);
            _status = new BaseModel<iffsOperationStatusTemplate>(_context);
            _operation = new BaseModel<iffsOperation>(_context);
            _operationStatusTemplate = new BaseModel<iffsOperationStatusTemplate>(_context);
            _jobOrderHeader = new BaseModel<iffsJobOrderHeader>(_context);
            _userRole = new BaseModel<coreUserRole>(_context);
        }

        #endregion

        #region Actions

        public ActionResult GetOperations(int start, int limit, string sort, string dir, string param)
        {
            var hashtable = JsonConvert.DeserializeObject<Hashtable>(param);
            var searchText = hashtable["searchText"].ToString();

            var records = _operation.GetAll().AsQueryable();
            records = searchText != "" ? records.Where(p => p.OperationNo.ToUpper().Contains(searchText.ToUpper()) || p.iffsJobOrderHeader.JobOrderNo.ToUpper().Contains(searchText.ToUpper()) ) : records;

            var count = records.Count();

            records = records.OrderBy(o => o.iffsJobOrderHeader.JobOrderNo).ThenByDescending(o => o.OperationNo);
            records = records.Skip(start).Take(limit);
            
            var jobOrders = records.Select(record => new
            {
                record.Id,
                JobOrderHeaderId = record.iffsJobOrderHeader.Id,
                record.OperationNo,
                record.iffsJobOrderHeader.JobOrderNo,
                record.iffsJobOrderHeader.Version,
                record.iffsJobOrderHeader.OperationTypeId,
                OperationType = record.iffsJobOrderHeader.iffsLupOperationType.Name,
                ReceivingClient = record.iffsJobOrderHeader.ReceivingClient,
                UltimateClient = record.iffsJobOrderHeader.UltimateClient,
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
                record.iffsJobOrderHeader.IsRequiredDocumentsSubmited
            }).ToList().Select(record => new
            {
                record.Id,
                record.JobOrderHeaderId,
                record.OperationNo,
                record.JobOrderNo,
                record.Version,
                record.OperationTypeId,
                record.OperationType,
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
                record.IsRequiredDocumentsSubmited
            });
            var result = new { total = count, data = jobOrders };
            return this.Json(result);
        }

  
        public ActionResult GetAll(int start, int limit, string sort, string dir, string param)
        {
            var hashtable = JsonConvert.DeserializeObject<Hashtable>(param);
            var searchText = "";
            if (hashtable["searchText"] != null)
                searchText = hashtable["searchText"].ToString();
            int operationId;
            int.TryParse(hashtable["operationId"].ToString(), out operationId);

            var records = _operationStatus.GetAll().AsQueryable().Where(o => o.OperationId == operationId);
            var objOperation = _operation.Get(h => h.Id == operationId);
            var statusTemplates =_operationStatusTemplate.GetAll().AsQueryable().Where(o => o.OperationTypeId == objOperation.iffsJobOrderHeader.OperationTypeId && !records.Where(f => f.StatusId == o.Id).Any());
            if (!statusTemplates.Any())
            return this.Json(new { success = false, data = "Operation Status template not yet defined for the selected Job Order!" });
              
            var filtered = records.Select(record => new
                {
                    record.Id,
                    record.OperationId,
                    record.StatusId,
                    Status = record.iffsOperationStatusTemplate.Name,
                    StatusCode = record.iffsOperationStatusTemplate.Code,
                    DataType = record.iffsOperationStatusTemplate.iffsLupDataType.Name,
                    record.iffsOperationStatusTemplate.PlannedDuration,
                    record.iffsOperationStatusTemplate.RoleId,
                    record.Value,
                    record.Remark
                }).Concat(
                    statusTemplates. Select(item => new
                    {
                        Id = 0,
                        OperationId = objOperation.Id,
                        StatusId = item.Id,
                        Status = item.Name,
                        StatusCode = item.Code,
                        DataType = item.iffsLupDataType.Name,
                        item.PlannedDuration,
                        item.RoleId,
                        Value = "",
                        Remark = ""
                    }));
            if (searchText != "")
            {
                filtered = filtered.Where(i =>

                    i.Status.ToUpper().Contains(searchText.ToUpper()) ||
                    i.StatusCode.ToUpper().Contains(searchText.ToUpper()) 
              );
            }
            switch (sort)
            {
                case "Id":
                    filtered = dir == "ASC" ? filtered.OrderBy(u => u.Id) : filtered.OrderByDescending(u => u.Id);
                    break;
                case "Status":
                    filtered = dir == "ASC" ? filtered.OrderBy(u => u.Status) : filtered.OrderByDescending(u => u.Status);
                    break;
                case "StatusCode":
                    filtered = dir == "ASC" ? filtered.OrderBy(u => u.StatusCode) : filtered.OrderByDescending(u => u.StatusCode);
                    break;
                  case "DataType":
                    filtered = dir == "ASC" ? filtered.OrderBy(u => u.DataType) : filtered.OrderByDescending(u => u.DataType);
                    break;
                  case "Value":
                    filtered = dir == "ASC" ? filtered.OrderBy(u => u.Value) : filtered.OrderByDescending(u => u.Value);
                    break;
                  case "Remark":
                    filtered = dir == "ASC" ? filtered.OrderBy(u => u.Remark) : filtered.OrderByDescending(u => u.Remark);
                    break;
            }
            var Permirmition = (List<Permission>)Session[Constants.UserPermission];
            var currentuser = (coreUser)Session[Constants.CurrentUser];
            var user = currentuser.FirstName + " " + currentuser.LastName;
            var roles =_userRole.GetAll().AsQueryable().Where(d=>d.UserId==currentuser.Id);
            if (!roles.Where(o=>o.RoleId==1).Any())
            filtered = filtered.Where(o => roles.Where(f => f.RoleId == o.RoleId).Any());
            var count = filtered.Count();
             filtered = filtered.Skip(start).Take(limit);

            var results= filtered.ToList() ;
            var returnResult = new { total = count, data = results };
                return this.Json(returnResult);
        }


        public DirectResult SaveStatus(string param)
        {
            try
            {
                var statuses = JsonConvert.DeserializeObject<List<object>>(param);
                int id;
                
                for (var i = 0; i < statuses.Count(); i++)
                {
                    var hashtable = JsonConvert.DeserializeObject<Hashtable>(statuses[i].ToString());

                    int.TryParse(hashtable["Id"].ToString(), out id);

                    if (id == 0)
                    {
                        _operationStatus.AddNew(new iffsOperationStatus
                        {
                            OperationId = int.Parse(hashtable["OperationId"].ToString()),
                            StatusId = int.Parse(hashtable["StatusId"].ToString()),
                            Value = hashtable["Value"].ToString(),
                            Remark = hashtable["Remark"].ToString()
                        });
                    }
                    else
                    {
                        _operationStatus.Edit(new iffsOperationStatus
                        {
                            Id = id,
                            OperationId = int.Parse(hashtable["OperationId"].ToString()),
                            StatusId = int.Parse(hashtable["StatusId"].ToString()),
                            Value = hashtable["Value"].ToString(),
                            Remark = hashtable["Remark"].ToString()
                        });
                    }
                }
                return this.Json(new { success = true, data = "Operation Status have been saved successfully!" });
            }
            catch (Exception ex)
            {
                return this.Json(new { success = false, data = ex.InnerException != null ? ex.InnerException.Message : ex.Message });
            
            }
        }


        #endregion
    }

    
}