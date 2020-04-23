
using CyberErp.Business.Component.Iffs;
using CyberErp.Data.Model;
using CyberErp.Presentation.Iffs.Web.Classes;
using Ext.Direct.Mvc;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Newtonsoft.Json;
using SwiftTederash.Business;

namespace CyberErp.Presentation.Iffs.Web.Controllers
{
    public class UserOperationTypeMappingController : DirectController
    {
        #region Members 

        private readonly DbContext _context;
        private readonly BaseModel<iffsUserOperationTypeMapping> _userMapping;

       

        #endregion

        #region Constractor 
        public UserOperationTypeMappingController()
        {
            _context = new ErpEntities(Constants.ConnectionString);
            _userMapping = new BaseModel<iffsUserOperationTypeMapping>(_context);
        }

        #endregion

        #region Actions 
        public ActionResult Get(int id)
        {
            var objUserMapping = _userMapping.Get(c => c.Id == id);

            var userMapping = new
            {
              

                objUserMapping.Id,
                objUserMapping.UserId,
                objUserMapping.OperationTypeId,
                objUserMapping.IsDeleted,
             

            };
            return this.Json(new
            {
                success = true,
                data = userMapping
            });
        }

        public ActionResult GetAll(int start, int limit, string sort, string dir, string record)
        {
            var hashtable = JsonConvert.DeserializeObject<Hashtable>(record);
         

            var records = _userMapping.GetAll();
   

            var count = records.Count();
            records = records.Skip(start).Take(limit);
            var userMapping = records.Select(item => new
            {
                item.Id,
                item.UserId,
                item.iffsLupOperationType.Name,
                item.OperationTypeId,
               

            }).Cast<object>().ToList();
            var result = new { total = count, data = userMapping };
            return this.Json(result);
        }

        public ActionResult GetAllByUser(int start, int limit, string sort, string dir, string record, int userId)
        {
            var hashtable = JsonConvert.DeserializeObject<Hashtable>(record);


            var records = _userMapping.GetAll().Where(o=> o.UserId == userId);


            var count = records.Count();
            records = records.Skip(start).Take(limit);
            var userMapping = records.Select(item => new
            {
                item.Id,
                item.UserId,
                item.iffsLupOperationType.Code,
                item.iffsLupOperationType.Name,
                item.OperationTypeId,


            }).Cast<object>().ToList();
            var result = new { total = count, data = userMapping };
            return this.Json(result);
        }

        public ActionResult GetAllByOperation(int start, int limit, string sort, string dir, string record, int operationId)
        {
            var hashtable = JsonConvert.DeserializeObject<Hashtable>(record);


            var records = _userMapping.GetAll().Where(o => o.OperationTypeId == operationId);


            var count = records.Count();
            records = records.Skip(start).Take(limit);
            var userMapping = records.Select(item => new
            {
                
                Id = item.UserId,
                item.coreUser.UserName,
                item.coreUser.FirstName,
                item.coreUser.LastName,
                //em.iffsLupOperationType.Code,
                //em.iffsLupOperationType.Name,
                item.OperationTypeId,


            }).Cast<object>().ToList();
            var result = new { total = count, data = userMapping };
            return this.Json(result);
        }
        [FormHandler]
        public ActionResult Save(iffsUserOperationTypeMapping userMapping)
        {
            


            if (userMapping.Id.Equals(0))
            {
                
                _userMapping.AddNew(userMapping);
            }
            else
            {
                _userMapping.Edit(userMapping);
            }
            return this.Json(new { success = true, data = "Data has been saved successfully!" });
        }

        public ActionResult SaveMapping(IList<string> attachmentDetails, int operationId)
        {
            try
            {
               
                var attachmentDetail = attachmentDetails[0].Split(new[] { ';' });
              

                for (var i = 0; i < attachmentDetail.Count(); i++)
                {
                    if (attachmentDetail[i] != "")
                    {
                      
                        var objVoucherDetail = new iffsUserOperationTypeMapping
                        {
                            UserId = Convert.ToInt32(attachmentDetail[i]) ,
                            OperationTypeId = operationId,
                          

                        };
                        var filtered = _userMapping.GetAll().Where(o => o.UserId == Convert.ToInt32(attachmentDetail[i]) & o.OperationTypeId == operationId);
                        var transInstance = new iffsUserOperationTypeMapping();


                        if (filtered.Any())
                        {
                            continue;
                        }
                        _userMapping.AddNew(objVoucherDetail);
                    }

                }

                return this.Json(new { success = true, data = "Data has been saved successfully!" });
            }
            catch (Exception ex)
            {
                return this.Json(new { success = false, data = "Data has been saved successfully!" });
            }

        }

        public DirectResult DeleteMapping(IList<string> selectedEmps, int operationTypeId)
        {
            try
            {
                string[] selectedEmpList = selectedEmps[0].Split(':');

                foreach (var s in selectedEmpList)
                {
                    if (s == "")
                        continue;
                    var empId = int.Parse(s);
                   
                    var filtered =_userMapping.GetAll().Where(p => p.UserId == empId && p.OperationTypeId == operationTypeId).ToList();


                    foreach (var filt in filtered)
                    {
                        _userMapping.Delete(c => c.Id == filt.Id);
                    }
                }
                return this.Json(new { success = true, data = "removed successfully!" });
            }
            catch (Exception exception)
            {
                return this.Json(new { success = false, data = "Error!" });
            }
        }
        public ActionResult Delete(int id)
        {
            try
            {
                _userMapping.Delete(c => c.Id == id);

                return this.Json(new { success = true, data = "Record has been successfully deleted!" });
            }
            catch (Exception)
            {
                return this.Json(new { success = false, data = "Could not delete the selected record!" });
            }
        }

        #endregion

    }
}