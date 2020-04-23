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
    public class JobOrderTemplateController : DirectController
    {
        #region Members

        private readonly DbContext _context;
        private readonly BaseModel<iffsJobOrderTemplate> _jobOrderTemplate;

        #endregion

        #region Constructor

        public JobOrderTemplateController()
        {
            _context = new ErpEntities(Constants.ConnectionString);
            _jobOrderTemplate = new BaseModel<iffsJobOrderTemplate>(_context);
        }

        #endregion

        #region Actions

        public ActionResult Get(int id)
        {
            var objJobOrderTemplate = _jobOrderTemplate.Get(c=>c.Id == id);
            
            var jobOrderTemplate = new
            {
                objJobOrderTemplate.Id,
                objJobOrderTemplate.OperationTypeId,
                objJobOrderTemplate.FieldCategory,
                objJobOrderTemplate.Field,
                objJobOrderTemplate.DefaultValue
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
            int operationTypeId;
            int.TryParse(hashtable["operationTypeId"].ToString(), out operationTypeId);

            var searchText = hashtable["searchText"].ToString();

            var records = _jobOrderTemplate.GetAll().Where(o=>o.OperationTypeId == operationTypeId);
            records = searchText != "" ? records.Where(p => p.iffsLupOperationType.Name.ToUpper().Contains(searchText.ToUpper())) : records;

            if (sort == "OperationType")
            {
                records = dir == "ASC" ? records.OrderBy(r => r.iffsLupOperationType.Name) : records.OrderByDescending(r => r.iffsLupOperationType.Name);
            }
            else
            {
                records = dir == "ASC" ? records.OrderBy(r => r.GetType().GetProperty(sort).GetValue(r, null)) : records.OrderByDescending(r => r.GetType().GetProperty(sort).GetValue(r, null));
            }

            var count = records.Count();
            records = records.Skip(start).Take(limit);

            var details = records.Select(item => new
            {
                item.Id,
                item.FieldCategory,
                item.Field,
                item.DefaultValue
            }).ToList();
            var result = new { total = count, data = details };
            return this.Json(result);
        }

        public ActionResult GetGridDetails(int start, int limit, string sort, string dir, string record)
        {
            var hashtable = JsonConvert.DeserializeObject<Hashtable>(record);
            int operationTypeId;
            int.TryParse(hashtable["operationTypeId"].ToString(), out operationTypeId);

            var filtered = _jobOrderTemplate.GetAll().AsQueryable().Where(o => o.OperationTypeId == operationTypeId);
            var count = filtered.Count();
            filtered = filtered.OrderBy(o => o.FieldCategory).Skip(start).Take(limit);

            var details = filtered.Select(item => new
            {
                item.Id,
                item.FieldCategory,
                item.Field,
                item.DefaultValue
            }).ToList();
            var result = new { total = count, data = details };
            return this.Json(result);
        }

        [FormHandler]
        public ActionResult Save(iffsJobOrderTemplate jobOrderTemplate)
        {
            if (jobOrderTemplate.Id.Equals(0))
            {
                _jobOrderTemplate.AddNew(jobOrderTemplate);
            }
            else
            {
                _jobOrderTemplate.Edit(jobOrderTemplate);
            }

            return this.Json(new { success = true, data = "Data has been saved successfully!" });
        }

        public ActionResult Delete(int id)
        {
            try
            {
                _jobOrderTemplate.Delete(c=>c.Id == id);
                
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