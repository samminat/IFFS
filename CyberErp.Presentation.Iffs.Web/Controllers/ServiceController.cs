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
    public class ServiceController : DirectController
    {
        #region Members

        private readonly DbContext _context;
        private readonly BaseModel<iffsService> _service;

        #endregion

        #region Constructor

        public ServiceController()
        {
            _context = new ErpEntities(Constants.ConnectionString);
            _service = new BaseModel<iffsService>(_context);
        }

        #endregion

        #region Actions

        public ActionResult Get(int id)
        {
            var objService = _service.Get(c=>c.Id == id);
            
            var service = new
            {
                objService.Id,
                objService.Name,
                objService.Description,
                objService.Code,
                objService.IsTaxable
            };
            return this.Json(new
            {
                success = true,
                data = service
            });
        }

        public ActionResult GetAll(int start, int limit, string sort, string dir, string param)
        {
            var hashtable = JsonConvert.DeserializeObject<Hashtable>(param);
            var searchText = hashtable["searchText"].ToString();

            var records = _service.GetAll();
            records = searchText != "" ? records.Where(p => p.Name.ToUpper().Contains(searchText.ToUpper()) || 
                (p.Description == null ? false : p.Description.ToUpper().Contains(searchText.ToUpper())) ||
                p.Code.ToUpper().Contains(searchText.ToUpper())) : records;

            records = dir == "ASC" ? records.OrderBy(r => r.GetType().GetProperty(sort).GetValue(r, null)) : records.OrderByDescending(r => r.GetType().GetProperty(sort).GetValue(r, null));

            var count = records.Count();
            records = records.Skip(start).Take(limit);
            var services = records.Select(record => new
            {
                record.Id,
                record.Name,
                record.Description,
                record.Code,
                record.IsTaxable

            }).Cast<object>().ToList();
            var result = new { total = count, data = services };
            return this.Json(result);
        }

        [FormHandler]
        public ActionResult Save(iffsService service)
        {
            if (Request.Params["IsTaxable"] != null)
                service.IsTaxable = true;

            if (service.Id.Equals(0))
            {
                _service.AddNew(service);
            }
            else
            {
                _service.Edit(service);
            }
            return this.Json(new { success = true, data = "Data has been saved successfully!" });
        }

        public ActionResult Delete(int id)
        {
            try
            {
                _service.Delete(c=>c.Id == id);
                
                return this.Json(new { success = true, data = "record has been successfully deleted!" });
            }
            catch (Exception)
            {
                return this.Json(new { success = false, data = "Could not delete the selected record!" });
            }
        }

        public void ExportToExcel()
        {
            var searchText = Request.QueryString["st"];

            var records = _service.GetAll();
            records = searchText != "" ? records.Where(p => p.Name.ToUpper().Contains(searchText.ToUpper()) ||
                (p.Description == null ? false : p.Description.ToUpper().Contains(searchText.ToUpper())) ||
                p.Code.ToUpper().Contains(searchText.ToUpper())) : records;

            var services = records.Select(record => new
            {
                record.Id,
                record.Name,
                record.Description,
                record.Code,
                record.IsTaxable

            }).Cast<object>().ToList();

            var exportToExcelHelper = new ExportToExcelHelper();
            exportToExcelHelper.ToExcel(Response, services);
        }

        #endregion  
    }
}
