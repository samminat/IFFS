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
    public class OperationExpenseController : DirectController
    {
        #region Members

        private readonly DbContext _context;
        private readonly BaseModel<iffsOperationExpense> _operationExpense;
        private readonly BaseModel<iffsOperationExpenseTemplate> _operationExpenseTemplate;
        private readonly BaseModel<iffsOperation> _operation;
        #endregion

        #region Constructor

        public OperationExpenseController()
        {
            _context = new ErpEntities(Constants.ConnectionString);
            _operationExpense = new BaseModel<iffsOperationExpense>(_context);
            _operationExpenseTemplate = new BaseModel<iffsOperationExpenseTemplate>(_context);
            _operation = new BaseModel<iffsOperation>(_context);
   
        }

        #endregion

        #region Actions

        public ActionResult GetAll(int start, int limit, string sort, string dir, string param)
        {
            var hashtable = JsonConvert.DeserializeObject<Hashtable>(param);
            int operationId;
            int.TryParse(hashtable["operationId"].ToString(), out operationId);
            int operationTypeId;
            int.TryParse(hashtable["operationTypeId"].ToString(), out operationTypeId);
            var operationExpenseTemplateRecords = _operationExpenseTemplate.GetAll().AsQueryable().Where(o => o.OperationTypeId == operationTypeId);         
            
            var records =_operationExpense.GetAll().AsQueryable().Where(o => o.OperationId == operationId);
            var count = operationExpenseTemplateRecords.Count();

            operationExpenseTemplateRecords = operationExpenseTemplateRecords.OrderBy(o => o.Id).Skip(start).Take(limit);         
          
            var operations = operationExpenseTemplateRecords.Select(record => new
            {
                record.Id,
                OperationId = operationId,
                record.ExpenseTypeId,
                Expense = record.iffsLupExpenseType.Name,
                Amount = records.Where(o => o.OperationId == operationId && o.ExpenseTypeId == record.ExpenseTypeId).Any() ? records.Where(o => o.OperationId == operationId && o.ExpenseTypeId == record.ExpenseTypeId).FirstOrDefault().Amount : 0,
                CurrencyId = records.Where(o => o.OperationId == operationId && o.ExpenseTypeId == record.ExpenseTypeId).Any() ? records.Where(o => o.OperationId == operationId && o.ExpenseTypeId == record.ExpenseTypeId).FirstOrDefault().CurrencyId : 0,
                ExchangeRate = records.Where(o => o.OperationId == operationId && o.ExpenseTypeId == record.ExpenseTypeId).Any() ? records.Where(o => o.OperationId == operationId && o.ExpenseTypeId == record.ExpenseTypeId).FirstOrDefault().ExchangeRate : 0,
                Currency = records.Where(o => o.OperationId == operationId && o.ExpenseTypeId == record.ExpenseTypeId).Any() ? records.Where(o => o.OperationId == operationId && o.ExpenseTypeId == record.ExpenseTypeId).FirstOrDefault().iffsLupCurrency.Name : "",
   
            }).ToList();
            var result = new { total = count, data = operations };
            return this.Json(result);
        }

        public ActionResult GetAllOperation(int start, int limit, string sort, string dir, string param)
        {
            var hashtable = JsonConvert.DeserializeObject<Hashtable>(param);
            
            var searchText = hashtable["searchText"].ToString();

            var records = _operation.GetAll().AsQueryable();
                records = searchText != "" ? records.Where(p => p.OperationNo.ToUpper().Contains(searchText.ToUpper()) ||
                 p.iffsJobOrderHeader.JobOrderNo.ToUpper().Contains(searchText.ToUpper()) ||
                 p.iffsJobOrderHeader.UltimateClient.ToUpper().Contains(searchText.ToUpper()) ||
                
                 p.iffsJobOrderHeader.iffsLupOperationType.Name.ToUpper().Contains(searchText.ToUpper())) : records;

            var count = records.Count();
            records = records.OrderByDescending(o => o.Date).Skip(start).Take(limit);
            var jobOrders = records.Select(record => new
            {
                record.Id,
                record.OperationNo,
                record.iffsJobOrderHeader.JobOrderNo,
                Customer = record.iffsJobOrderHeader.UltimateClient,
                record.iffsJobOrderHeader.OperationTypeId,
                OperationType=record.iffsJobOrderHeader.iffsLupOperationType.Name,
                record.Date
            }).ToList().Select(record => new
            {
                record.Id,
                record.OperationNo,
                record.JobOrderNo,
                record.Customer,
                record.OperationTypeId,
                record.OperationType,
                Date = string.Format("{0:MMMM dd, yyyy}", record.Date),
                
            });
            var result = new { total = count, data = jobOrders };
            return this.Json(result);
        }

        public ActionResult GetExpense(object query)
        {
            var hashtable = JsonConvert.DeserializeObject<Hashtable>(JsonConvert.SerializeObject(query));
            int start;
            int.TryParse(hashtable["start"].ToString(), out start);
            int limit;
            int.TryParse(hashtable["limit"].ToString(), out limit);
            int operationTypeId=0;
            if (hashtable["operationTypeId"]!=null)
            int.TryParse(hashtable["operationTypeId"].ToString(), out operationTypeId);

            var queryparam = hashtable["query"].ToString();
            var filtered = _operationExpenseTemplate.GetAll().AsQueryable().Where(o =>o.OperationTypeId==operationTypeId && o.iffsLupExpenseType.Name.ToUpper().Contains(queryparam.ToUpper()) || o.iffsLupExpenseType.Code.ToUpper().Contains(queryparam.ToUpper()));
            filtered = filtered.OrderBy(o => o.iffsLupExpenseType.Name);
            var expensees = filtered.Select(item => new
            {
                item.Id,
                item.iffsLupExpenseType.Name,
                item.iffsLupExpenseType.Code,
            }).ToList();
            var result = new
            {
                total = filtered.Count(),
                data = expensees
            };
            return this.Json(result);
        }

        public DirectResult SaveExpense(int operationId, string rec)
        {
            _operationExpense.Delete(f => f.OperationId==operationId);

            var expenseString = rec;
            expenseString = expenseString.Remove(expenseString.Length - 1);
            var expensees = expenseString.Split(new[] { ';' });
            for (var i = 0; i < expensees.Count(); i++)
            {
                var expense = expensees[i].Split(new[] { ':' });
                var operationExpense = new iffsOperationExpense
                {
                    OperationId = operationId,
                    ExpenseTypeId = int.Parse(expense[0]),
                    CurrencyId = int.Parse(expense[1]),
                    ExchangeRate = decimal.Parse(expense[2]),
                    Amount = decimal.Parse(expense[3]),
                };
                _operationExpense.AddNew(operationExpense);
            }
            return this.Json(new { success = true, data = "Operation expense have been saved successfully!" });
        }


        #endregion
    }
}