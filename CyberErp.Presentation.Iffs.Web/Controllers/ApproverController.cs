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
    public class ApproverController : DirectController
    {
        #region Members

        private readonly DbContext _context;
        private readonly BaseModel<iffsApprover> _approver;

        #endregion

        #region Constructor

        public ApproverController()
        {
            _context = new ErpEntities(Constants.ConnectionString);
            _approver = new BaseModel<iffsApprover>(_context);
        }

        #endregion

        #region Actions

        public ActionResult Get(int id)
        {
            var objApprover = _approver.Get(c=>c.Id == id);
            
            var approver = new
            {
                objApprover.Id,
                objApprover.EmployeeId,
                Employee = objApprover.hrmsEmployee != null ? (objApprover.hrmsEmployee.corePerson.FirstName + " " + objApprover.hrmsEmployee.corePerson.FatherName) : ""
            };
            return this.Json(new
            {
                success = true,
                data = approver
            });
        }

        public ActionResult GetAll(int start, int limit, string sort, string dir, string param)
        {
            var records = _approver.GetAll();

            records = dir == "ASC" ? records.OrderBy(r => r.hrmsEmployee.corePerson.FirstName) : records.OrderByDescending(r => r.hrmsEmployee.corePerson.FirstName);

            var count = records.Count();
            records = records.Skip(start).Take(limit);
            var approvers = records.Select(record => new
            {
                record.Id,
                FullName = record.hrmsEmployee != null ? (record.hrmsEmployee.corePerson.FirstName + " " + record.hrmsEmployee.corePerson.FatherName) : "",
                Position = record.hrmsEmployee.corePosition.corePositionClass.Name
            }).Cast<object>().ToList();
            var result = new { total = count, data = approvers };
            return this.Json(result);
        }

        [FormHandler]
        public ActionResult Save(iffsApprover approver)
        {
            var objApprover = _approver.Find(c => (c.EmployeeId == approver.EmployeeId && c.Id != approver.Id));
            if (objApprover != null)
            {
                var result = new { success = false, data = "The selected Approver is already on the list!" };
                return this.Json(result);
            }

            if (approver.Id.Equals(0))
            {
                _approver.AddNew(approver);
            }
            else
            {
                _approver.Edit(approver);
            }
            return this.Json(new { success = true, data = "Data has been saved successfully!" });
        }

        public ActionResult Delete(int id)
        {
            try
            {
                _approver.Delete(c=>c.Id == id);
                
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
