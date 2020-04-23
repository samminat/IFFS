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
    public class OperationDocumentTemplateController : DirectController
    {
        #region Members

        private readonly DbContext _context;
        private readonly BaseModel<iffsOperationDocumentTemplate> _OperationDocumentTemplate;

        #endregion

        #region Constructor

        public OperationDocumentTemplateController()
        {
            _context = new ErpEntities(Constants.ConnectionString);
            _OperationDocumentTemplate = new BaseModel<iffsOperationDocumentTemplate>(_context);
        }

        #endregion

        #region Actions

        public ActionResult Get(int id)
        {
            var objOperationDocumentTemplate = _OperationDocumentTemplate.Get(c=>c.Id == id);
            
            var OperationDocumentTemplate = new
            {
                objOperationDocumentTemplate.Id,
                objOperationDocumentTemplate.OperationTypeId,
                objOperationDocumentTemplate.DocumentTypeId,
            };
            return this.Json(new
            {
                success = true,
                data = OperationDocumentTemplate
            });
        }

        public ActionResult GetAll(int start, int limit, string sort, string dir, string param)
        {
            var hashtable = JsonConvert.DeserializeObject<Hashtable>(param);
            int operationTypeId = 0;
            var searchText = "";
            if (hashtable["operationTypeId"] != null)
                int.TryParse(hashtable["operationTypeId"].ToString(), out operationTypeId);
            if (hashtable["searchText"] != null)
                searchText = hashtable["searchText"].ToString();
         
            var records = _OperationDocumentTemplate.GetAll().Where(o => o.OperationTypeId == operationTypeId);           
            records = searchText != "" ? records.Where(p => p.iffsLupDocumentType.Name.ToUpper().Contains(searchText.ToUpper())) : records;
            var count = records.Count();

            records = records.OrderBy(t => t.iffsLupDocumentType.Name).Skip(start).Take(limit);       
            var operationDocuments = records.Select(record => new
            {
                record.Id,
                record.OperationTypeId,
                record.DocumentTypeId,
                OperationType = record.iffsLupOperationType.Name,
                DocumentType = record.iffsLupDocumentType.Name,

            }).Cast<object>().ToList();
            var result = new { total = count, data = operationDocuments };
            return this.Json(result);
        }
        public ActionResult GetAllDetail(int start, int limit, string sort, string dir, string param)
        {
            var hashtable = JsonConvert.DeserializeObject<Hashtable>(param);
            int operationTypeId = 0;
            if (hashtable["operationTypeId"] != null)
                int.TryParse(hashtable["operationTypeId"].ToString(), out operationTypeId);
            var records = _OperationDocumentTemplate.GetAll().Where(o => o.OperationTypeId == operationTypeId);
            records = records.OrderBy(t => t.iffsLupDocumentType.Name);
            var count = records.Count();
            var operationDocuments = records.Select(record => new
            {
                record.Id,
                record.OperationTypeId,
                record.DocumentTypeId,
                OperationType = record.iffsLupOperationType.Name,
                DocumentType = record.iffsLupDocumentType.Name,

            }).Cast<object>().ToList();
            var result = new { total = count, data = operationDocuments };
            return this.Json(result);
        }
        public ActionResult Save(string operationTypes, int operationTypeId)
        {
            operationTypes = operationTypes.Remove(operationTypes.Length - 1);
            var servicesCollection = operationTypes.Split(new[] { ';' });

            _OperationDocumentTemplate.Delete(o => o.OperationTypeId == operationTypeId);
            for (var i = 0; i < servicesCollection.Count(); i++)
            {
                var service = servicesCollection[i].Split(new[] { ':' });
                var objOperationDocumentTemplate = new iffsOperationDocumentTemplate();
                objOperationDocumentTemplate.DocumentTypeId = int.Parse(service[0]);
                objOperationDocumentTemplate.OperationTypeId = operationTypeId;

                _OperationDocumentTemplate.AddNew(objOperationDocumentTemplate);
            }
            return this.Json(new { success = true, data = "Data has been saved successfully!" });
        }

        public ActionResult Delete(int id)
        {
            try
            {
                _OperationDocumentTemplate.Delete(c=>c.Id == id);
                
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
