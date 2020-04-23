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
    public class TermsAndConditionsTemplateController : DirectController
    {
        #region Members

        private readonly DbContext _context;
        private readonly BaseModel<iffsTermsAndConditionsTemplate> _termsAndConditionsTemplate;

        #endregion

        #region Constructor

        public TermsAndConditionsTemplateController()
        {
            _context = new ErpEntities(Constants.ConnectionString);
            _termsAndConditionsTemplate = new BaseModel<iffsTermsAndConditionsTemplate>(_context);
        }

        #endregion

        #region Actions

        public ActionResult Get(int id)
        {
            var objTermsAndConditionsTemplate = _termsAndConditionsTemplate.Get(c=>c.Id == id);
            
            var termsAndConditionsTemplate = new
            {
                objTermsAndConditionsTemplate.Id,
                objTermsAndConditionsTemplate.Title,
                objTermsAndConditionsTemplate.Description,
            };
            return this.Json(new
            {
                success = true,
                data = termsAndConditionsTemplate
            });
        }

        public ActionResult GetAll(int start, int limit, string sort, string dir, string param)
        {
            var hashtable = JsonConvert.DeserializeObject<Hashtable>(param);
            var searchText = hashtable["searchText"].ToString();

            var records = _termsAndConditionsTemplate.GetAll();
            records = searchText != "" ? records.Where(p => p.Title.ToUpper().Contains(searchText.ToUpper()) || 
                (p.Description == null ? false : p.Description.ToUpper().Contains(searchText.ToUpper())) ||
                p.Description.ToUpper().Contains(searchText.ToUpper())) : records;

            //records = dir == "ASC" ? records.OrderBy(r => r.GetType().GetProperty(sort).GetValue(r, null)) : records.OrderByDescending(r => r.GetType().GetProperty(sort).GetValue(r, null));

            var count = records.Count();
            records = records.Skip(start).Take(limit);
            var customers = records.Select(record => new
            {
                record.Id,
                record.Title,
                record.Description,

            }).Cast<object>().ToList();
            var result = new { total = count, data = customers };
            return this.Json(result);
        }

        [FormHandler]
        [ValidateInput(false)]
        public ActionResult Save(iffsTermsAndConditionsTemplate termsAndConditionsTemplate)
        {
            if (termsAndConditionsTemplate.Id.Equals(0))
            {
                _termsAndConditionsTemplate.AddNew(termsAndConditionsTemplate);
            }
            else
            {
                _termsAndConditionsTemplate.Edit(termsAndConditionsTemplate);
            }
            return this.Json(new { success = true, data = "Data has been saved successfully!" });
        }

        public ActionResult Delete(int id)
        {
            try
            {
                _termsAndConditionsTemplate.Delete(c=>c.Id == id);
                
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
