using CyberErp.Data.Model;
using CyberErp.Presentation.Iffs.Web.Classes;
using Ext.Direct.Mvc;
using SwiftTederash.Business;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace CyberErp.Presentation.Iffs.Web.Controllers
{
    public class RoleSettingController : DirectController
    {
        #region Members

        private readonly DbContext _context;
        private readonly BaseModel<iffsRoleSetting> _roleSetting;

        #endregion

        #region Constructor

        public RoleSettingController()
        {
            _context = new ErpEntities(Constants.ConnectionString);
            _roleSetting = new BaseModel<iffsRoleSetting>(_context);
        }

        #endregion

        #region Actions

        public ActionResult Get(int id)
        {
            var objRoleSetting = _roleSetting.Get(c => c.Id == id);

            var roleSetting = new
            {
                objRoleSetting.Id,
                objRoleSetting.RoleId,
                Role = objRoleSetting.coreRole.Name
            };
            return this.Json(new
            {
                success = true,
                data = roleSetting
            });
        }

        public ActionResult GetAll(int start, int limit, string sort, string dir, string param)
        {
            var records = _roleSetting.GetAll();

            records = dir == "ASC" ? records.OrderBy(r => r.coreRole.Name) : records.OrderByDescending(r => r.coreRole.Name);

            var count = records.Count();
            records = records.Skip(start).Take(limit);
            var roleSettings = records.Select(record => new
            {
                record.Id,
                record.RoleId,
                Role = record.coreRole.Name
            }).Cast<object>().ToList();
            var result = new { total = count, data = roleSettings };
            return this.Json(result);
        }

        [FormHandler]
        public ActionResult Save(iffsRoleSetting roleSetting)
        {
            var objroleSetting = _roleSetting.Find(c => (c.RoleId == roleSetting.RoleId && c.Id != roleSetting.Id));
            if (objroleSetting != null)
            {
                var result = new { success = false, data = "The selected Role is already on the list!" };
                return this.Json(result);
            }

            if (roleSetting.Id.Equals(0))
            {
                _roleSetting.AddNew(roleSetting);
            }
            else
            {
                _roleSetting.Edit(roleSetting);
            }
            return this.Json(new { success = true, data = "Data has been saved successfully!" });
        }

        public ActionResult Delete(int id)
        {
            try
            {
                _roleSetting.Delete(c => c.Id == id);

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
