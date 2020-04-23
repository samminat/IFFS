using CyberErp.Business.Component.Iffs;
using CyberErp.Data.Infrastructure;
using CyberErp.Data.Model;
using CyberErp.Presentation.Iffs.Web.Classes;
using Ext.Direct.Mvc;
using Newtonsoft.Json;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace CyberErp.Presentation.Iffs.Web.Controllers
{
    public class LookupController : DirectController
    {
        #region Members

        private readonly DbContext _context;
        private readonly Lookups _lookup;

        #endregion

        #region Constructor

        public LookupController()
        {
            _context = new ErpEntities(Constants.ConnectionString);
            _lookup = new Lookups(_context);
        }

        #endregion

        #region Actions

        public DirectResult Get(int id, string table)
        {
            var objLookup = _lookup.Get(id, table);
            var lookup = new
            {
                objLookup.Id,
                objLookup.Name,
                objLookup.Code
            };
            return this.Json(new { success = true, data = lookup });
        }

        public DirectResult GetAll(int start, int limit, string sort, string dir, string record)
        {
            try
            {
                var hashtable = JsonConvert.DeserializeObject<Hashtable>(record);
                string tableName = hashtable["tableName"].ToString();
                if (tableName != "")
                {
                    var filtered = (IEnumerable<coreLookup>)_lookup.GetAll(tableName);
                    filtered = dir == "ASC" ? filtered.OrderBy(l => l.GetType().GetProperty(sort).GetValue(l, null)) : filtered.OrderByDescending(l => l.GetType().GetProperty(sort).GetValue(l, null));
                    var count = filtered.Count();
                    filtered = filtered.Skip(start).Take(limit);
                    var lookup = filtered.Select(item => new
                    {
                        item.Id,
                        item.Name,
                        item.Code
                    }).Cast<object>().ToList();
                    return this.Json(new { total = count, data = lookup });
                }
                else
                {
                    return this.Json(new { total = 0, data = new List<coreLookup>() });
                }
            }
            catch (Exception exception)
            {
                return this.Json(new { success = false, data = exception.InnerException == null ? exception.Message : exception.InnerException.Message });
            }
        }

        public DirectResult PopulateLookupCategoryTree(string nodeId, string type)
        {
            int selectedNodeId;
            var id = nodeId.Split(new[] { ':' })[0];
            int.TryParse(id, out selectedNodeId);
            ArrayList treeNodeList = null;
            if (type == "root")
            {
                treeNodeList = Lookups.GetLookupCategories();
            }

            var nodes = treeNodeList != null ? treeNodeList.ToArray() : default(IEnumerable<object>);
            return this.Json(nodes);
        }

        [FormHandler]
        public ActionResult Save(coreLookup lookup)
        {
            var record = Request.Params["record"];
            var hashtable = JsonConvert.DeserializeObject<Hashtable>(record);
            string tableName = hashtable["tableName"].ToString() ?? string.Empty;
            if (lookup.Id.Equals(0))
            {
                _lookup.AddNew(lookup, tableName);
            }
            else
            {
                _lookup.Edit(lookup, tableName);
            }
            return this.Json(new { success = true, data = "Lookup item has been saved successfully!" });
        }

        public ActionResult Delete(int id, string tableName)
        {
            if (tableName != "lupAbsentReason" && id != 1)
                _lookup.Delete(id, tableName);
            return this.Json("Lookup item has been deleted successfully!");
        }

        #endregion

        #region Methods

        

        #endregion
    }
}
