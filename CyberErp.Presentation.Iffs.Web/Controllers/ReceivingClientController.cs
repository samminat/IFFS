using CyberErp.Data.Model;
using CyberErp.Presentation.Iffs.Web.Classes;
using Ext.Direct.Mvc;
using Newtonsoft.Json;
using SwiftTederash.Business;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Data.Entity;
using System.IO;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.Mvc;
using System.Web.UI;
using System.Xml;
using System.Xml.Serialization;

namespace CyberErp.Presentation.Iffs.Web.Controllers
{
    public class ReceivingClientController : DirectController
    {
        #region Members

        private readonly DbContext _context;
        private readonly BaseModel<iffsReceivingClient> _ReceivingClient;
        private readonly BaseModel<iffsDocumentNoSetting> _documentNoSetting;
        #endregion

        #region Constructor

        public ReceivingClientController()
        {
            _context = new ErpEntities(Constants.ConnectionString);
            _ReceivingClient = new BaseModel<iffsReceivingClient>(_context);
            _documentNoSetting = new BaseModel<iffsDocumentNoSetting>(_context);
        }

        #endregion

        #region Actions

        public ActionResult Get(int id)
        {
            var obj = _ReceivingClient.Get(c => c.Id == id);

            var ReceivingClient = new
            {
                obj.Id,
                obj.Name,
                obj.ContactPerson,
                obj.Telephone,
                obj.Mobile,
                obj.Email,
                obj.AlternativeEmail,
                obj.Address
            };
            return this.Json(new
            {
                success = true,
                data = ReceivingClient
            });
        }

        public ActionResult GetAll(int start, int limit, string sort, string dir, string param)
        {
            var hashtable = JsonConvert.DeserializeObject<Hashtable>(param);
            var searchText = hashtable["searchText"].ToString();

            var records = _ReceivingClient.GetAll();
            records = searchText != "" ? records.Where(p => p.Name.ToUpper().Contains(searchText.ToUpper()) ||
                p.ContactPerson.ToUpper().Contains(searchText.ToUpper()) ||
                  p.Address.ToUpper().Contains(searchText.ToUpper()) ||
                p.Telephone.ToUpper().Contains(searchText.ToUpper())) : records;

            if (sort == "ContactPerson")
            {
                records = dir == "ASC" ? records.OrderBy(r => r.ContactPerson) : records.OrderByDescending(r => r.ContactPerson);

            }
            if (sort == "Name")
            {
                records = dir == "ASC" ? records.OrderBy(r => r.Name) : records.OrderByDescending(r => r.Name);
            }
            else
            {
                records = dir == "ASC" ? records.OrderBy(r => r.GetType().GetProperty(sort).GetValue(r, null)) : records.OrderByDescending(r => r.GetType().GetProperty(sort).GetValue(r, null));
            }

            var count = records.Count();

            records = records.Skip(start).Take(limit);
            var ReceivingClients = records.Select(obj => new
            {
                obj.Id,
                obj.Name,
                obj.ContactPerson,
                obj.Telephone,
                obj.Mobile,
                obj.Email,
                obj.AlternativeEmail

            }).Cast<object>().ToList();
            var result = new { total = count, data = ReceivingClients };
            return this.Json(result);
        }

        [FormHandler]
        public ActionResult Save(iffsReceivingClient ReceivingClient)
        {

            if (ReceivingClient.Id.Equals(0))
            {
                _ReceivingClient.AddNew(ReceivingClient);
            }
            else
            {
                _ReceivingClient.Edit(ReceivingClient);
            }
            return this.Json(new { success = true, ReceivingClientId = ReceivingClient.Id, data = "Data has been saved successfully!" });
        }

        public ActionResult Delete(int id)
        {
            try
            {
                _ReceivingClient.Delete(c => c.Id == id);

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

            var records = _ReceivingClient.GetAll();
            records = searchText != "" ? records.Where(p => p.Name.ToUpper().Contains(searchText.ToUpper()) ||
                p.ContactPerson.ToUpper().Contains(searchText.ToUpper()) ||
                p.Address.ToUpper().Contains(searchText.ToUpper()) ||
                  p.Telephone.ToUpper().Contains(searchText.ToUpper())) : records;

            var ReceivingClients = records.Select(obj => new
            {
                obj.Id,
                obj.Name,
                obj.ContactPerson,
                obj.Telephone,
                obj.Mobile,
                obj.Email,
                obj.AlternativeEmail,
                obj.Address

            }).Cast<object>().ToList();

            var exportToExcelHelper = new ExportToExcelHelper();
            exportToExcelHelper.ToExcel(Response, ReceivingClients);
        }

        #endregion
    }
}
