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

namespace CyberErp.Presentation.Iffs.Web.Controllers
{
    public class OperationExpenseTemplateController : DirectController
    {
        #region Members

        private readonly DbContext _context;
        private readonly BaseModel<iffsOperationExpenseTemplate> _operationExpenseTemplate;

        #endregion

        #region Constructor

        public OperationExpenseTemplateController()
        {
            _context = new ErpEntities(Constants.ConnectionString);
            _operationExpenseTemplate = new BaseModel<iffsOperationExpenseTemplate>(_context);
        }

        #endregion

        #region Actions

        public ActionResult Get(int id)
        {
            var objOperationExpenseTemplate = _operationExpenseTemplate.Get(c => c.Id == id);

            var operationExpenseTemplate = new
            {
                objOperationExpenseTemplate.Id,
                objOperationExpenseTemplate.OperationTypeId,
                objOperationExpenseTemplate.ExpenseTypeId
            };
            return this.Json(new
            {
                success = true,
                data = operationExpenseTemplate
            });
        }

        public ActionResult GetAll(int start, int limit, string sort, string dir, string param)
        {
            var hashtable = JsonConvert.DeserializeObject<Hashtable>(param);

            int operationTypeId;
            int.TryParse(hashtable["operationTypeId"].ToString(), out operationTypeId);

            var records = _operationExpenseTemplate.GetAll().Where(o=>o.OperationTypeId == operationTypeId);

            if (sort == "OperationType")
            {
                records = dir == "ASC" ? records.OrderBy(r => r.iffsLupOperationType.Name) : records.OrderByDescending(r => r.iffsLupOperationType.Name);
            }
            else if (sort == "ExpenseType")
            {
                records = dir == "ASC" ? records.OrderBy(r => r.iffsLupExpenseType.Name) : records.OrderByDescending(r => r.iffsLupExpenseType.Name);
            }
            else
            {
                records = dir == "ASC" ? records.OrderBy(r => r.GetType().GetProperty(sort).GetValue(r, null)) : records.OrderByDescending(r => r.GetType().GetProperty(sort).GetValue(r, null));
            }

            var count = records.Count();
            records = records.Skip(start).Take(limit);

            var operationExpenses = records.Select(record => new
            {
                record.Id,
                record.OperationTypeId,
                OperationType= record.iffsLupOperationType.Name,
                record.ExpenseTypeId,
                ExpenseType = record.iffsLupExpenseType.Name
            }).Cast<object>().ToList();
            var result = new { total = count, data = operationExpenses };
            return this.Json(result);
        }
        
        [FormHandler]
        public ActionResult Save(iffsOperationExpenseTemplate operationExpenseTemplate)
        {
            if (operationExpenseTemplate.Id.Equals(0))
            {
                _operationExpenseTemplate.AddNew(operationExpenseTemplate);
            }
            else
            {
                _operationExpenseTemplate.Edit(operationExpenseTemplate);
            }

            return this.Json(new { success = true, data = "Data has been saved successfully!" });
        }

        public ActionResult Delete(int id)
        {
            try
            {
                _operationExpenseTemplate.Delete(c => c.Id == id);

                return this.Json(new { success = true, data = "record has been successfully deleted!" });
            }
            catch (Exception)
            {
                return this.Json(new { success = false, data = "Could not delete the selected record!" });
            }
        }

        #endregion
    }
}
