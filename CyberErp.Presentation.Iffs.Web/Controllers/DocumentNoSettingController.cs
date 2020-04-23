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
    public class DocumentNoSettingController : DirectController
    {
        #region Members

        private readonly DbContext _context;
        private readonly BaseModel<iffsDocumentNoSetting> _documentNoSetting;

        #endregion

        #region Constructor

        public DocumentNoSettingController()
        {
            _context = new ErpEntities(Constants.ConnectionString);
            _documentNoSetting = new BaseModel<iffsDocumentNoSetting>(_context);
        }

        #endregion

        #region Actions

        public ActionResult Get(int id)
        {
            var objDocumentNoSetting = _documentNoSetting.Get(c=>c.Id == id);
            
            var documentNoSetting = new
            {
                objDocumentNoSetting.Id,
                objDocumentNoSetting.Prefix,
                objDocumentNoSetting.SurFix,
                objDocumentNoSetting.Year,
                objDocumentNoSetting.DocumentType,
                objDocumentNoSetting.CurrentNo,
                objDocumentNoSetting.NoOfDigit,
            };
            return this.Json(new
            {
                success = true,
                data = documentNoSetting
            });
        }

        public ActionResult GetAll(int start, int limit, string sort, string dir, string param)
        {
            var hashtable = JsonConvert.DeserializeObject<Hashtable>(param);
            var searchText = hashtable["searchText"].ToString();

            var records = _documentNoSetting.GetAll();
            records = searchText != "" ? records.Where(p => p.DocumentType.ToUpper().Contains(searchText.ToUpper())) : records;

        //    records = dir == "ASC" ? records.OrderBy(r => r.GetType().GetProperty(sort).GetValue(r, null)) : records.OrderByDescending(r => r.GetType().GetProperty(sort).GetValue(r, null));

            var count = records.Count();
            records = records.Skip(start).Take(limit);
            var documentNoSettings = records.Select(record => new
            {
                record.Id,
                record.Prefix,
                record.SurFix,
                record.Year,
                record.DocumentType,
                record.CurrentNo,
                record.NoOfDigit

            }).Cast<object>().ToList();
            var result = new { total = count, data = documentNoSettings };
            return this.Json(result);
        }

        [FormHandler]
        public ActionResult Save(iffsDocumentNoSetting documentNoSetting)
        {
            if (documentNoSetting.Id.Equals(0))
            {
                _documentNoSetting.AddNew(documentNoSetting);
            }
            else
            {
                _documentNoSetting.Edit(documentNoSetting);
            }
            return this.Json(new { success = true, data = "Data has been saved successfully!" });
        }

        public ActionResult Delete(int id)
        {
            try
            {
                _documentNoSetting.Delete(c=>c.Id == id);
                
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
