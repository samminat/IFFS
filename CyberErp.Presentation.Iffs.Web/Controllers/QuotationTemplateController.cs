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
    public class QuotationTemplateController : DirectController
    {
        #region Members

        private readonly DbContext _context;
        private readonly BaseModel<iffsQuotationTemplate> _quotationTemplate;

        #endregion

        #region Constructor

        public QuotationTemplateController()
        {
            _context = new ErpEntities(Constants.ConnectionString);
            _quotationTemplate = new BaseModel<iffsQuotationTemplate>(_context);
        }

        #endregion

        #region Actions

        public ActionResult Get(int id)
        {
            var objQuotationTemplate = _quotationTemplate.Get(c=>c.Id == id);
            
            var quotationTemplate = new
            {
                objQuotationTemplate.Id,
                objQuotationTemplate.OperationTypeId,
                objQuotationTemplate.ServiceId
            };
            return this.Json(new
            {
                success = true,
                data = quotationTemplate
            });
        }

        public ActionResult GetAll(int start, int limit, string sort, string dir, string param)
        {
            var hashtable = JsonConvert.DeserializeObject<Hashtable>(param);
            int operationTypeId = 0; var searchText = "";
            if (hashtable["operationTypeId"] != null)
                int.TryParse(hashtable["operationTypeId"].ToString(), out operationTypeId);
            if (hashtable["searchText"] != null)
              searchText= hashtable["searchText"].ToString(); 
        
            var records = _quotationTemplate.GetAll().Where(o => o.OperationTypeId == operationTypeId);
            records = searchText != "" ? records.Where(p => p.iffsService.Name.ToUpper().Contains(searchText.ToUpper())) : records;

            var count = records.Count();
            records = records.OrderBy(o=>o.iffsService.Name).Skip(start).Take(limit);
            var customers = records.Select(record => new
            {
                record.Id,
                record.OperationTypeId,
                record.ServiceId,
                OperationType = record.iffsLupOperationType.Name,
                Name = record.iffsService.Name,
                Code = record.iffsService.Code,

            }).Cast<object>().ToList();
            var result = new { total = count, data = customers };
            return this.Json(result);
        }
         public ActionResult Save(string services, int operationTypeId)
        {
            services = services.Remove(services.Length - 1);
            var servicesCollection = services.Split(new[] { ';' });

            _quotationTemplate.Delete(o => o.OperationTypeId == operationTypeId);
            for (var i = 0; i < servicesCollection.Count(); i++)
            {
                var service = servicesCollection[i].Split(new[] { ':' });
                var objquotationTemplate = new iffsQuotationTemplate();
                objquotationTemplate.ServiceId=int.Parse(service[0]);
                objquotationTemplate.OperationTypeId = operationTypeId;
              
                _quotationTemplate.AddNew(objquotationTemplate);
            }           
            return this.Json(new { success = true, data = "Data has been saved successfully!" });
        }

        public ActionResult Delete(int id)
        {
            try
            {
                _quotationTemplate.Delete(c=>c.Id == id);
                
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
