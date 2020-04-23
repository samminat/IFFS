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
    public class ServiceRateController : DirectController
    {
        #region Members

        private readonly DbContext _context;
        private readonly BaseModel<iffsServiceRate> _serviceRate;

        #endregion

        #region Constructor

        public ServiceRateController()
        {
            _context = new ErpEntities(Constants.ConnectionString);
            _serviceRate = new BaseModel<iffsServiceRate>(_context);
        }

        #endregion

        #region Actions

        public ActionResult Get(int id)
        {
            var objServiceRate = _serviceRate.Get(c=>c.Id == id);
            
            var serviceRate = new
            {
                objServiceRate.Id,
                objServiceRate.CurrencyId,
                objServiceRate.ServiceId,
                objServiceRate.ServiceUnitTypeId,
                objServiceRate.Rate,
                objServiceRate.ComparingSign,
                objServiceRate.Description,
                objServiceRate.OperationTypeId,
            };
            return this.Json(new
            {
                success = true,
                data = serviceRate
            });
        }

        public ActionResult GetAll(int start, int limit, string sort, string dir, string param)
        {
            var hashtable = JsonConvert.DeserializeObject<Hashtable>(param);
            var searchText =hashtable["searchText"]!=null? hashtable["searchText"].ToString():"";
            int serviceId = 0;
            if (hashtable["serviceId"] != null)
                int.TryParse(hashtable["serviceId"].ToString(), out serviceId);

            var records = _serviceRate.GetAll().Where(o => o.ServiceId == serviceId);
            records = searchText != "" ? records.Where(p => p.iffsLupCurrency.Name.ToUpper().Contains(searchText.ToUpper()) || 
                p.iffsService.Name.ToUpper().Contains(searchText.ToUpper())) : records;

            switch (sort)
            {
                case "OperationType":
                    records = dir == "ASC" ? records.OrderBy(u => u.iffsLupOperationType.Name) : records.OrderByDescending(u => u.iffsLupOperationType.Name);
                    break;
              
                case "Service":
                    records = dir == "ASC" ? records.OrderBy(u => u.iffsService.Name) : records.OrderByDescending(u => u.iffsService.Name);
                    break;
                case "ServiceUnitType":
                    records = dir == "ASC" ? records.OrderBy(u => u.iffsLupServiceUnitType.Name) : records.OrderByDescending(u => u.iffsLupServiceUnitType.Name);
                    break;
                case "Currency":
                    records = dir == "ASC" ? records.OrderBy(u => u.iffsLupCurrency.Name) : records.OrderByDescending(u => u.iffsLupCurrency.Name);
                    break;
            }  
            var count = records.Count();
            records = records.Skip(start).Take(limit);
            var customers = records.Select(record => new
            {
                record.Id,
                record.ServiceId,
                Currency=record.iffsLupCurrency.Name,
                ServiceUnitType = record.iffsLupServiceUnitType.Name,
                OperationType=record.OperationTypeId.HasValue? record.iffsLupOperationType.Name:"",
                record.ComparingSign,
                record.Description,
             
                record.Rate,

            }).Cast<object>().ToList();
            var result = new { total = count, data = customers };
            return this.Json(result);
        }

        [FormHandler]
        public ActionResult Save(iffsServiceRate serviceRate)
        {
            try
            {
                var objServiceRate = _serviceRate.Find(o => o.Id != serviceRate.Id && o.ServiceId == serviceRate.ServiceId &&
                                                        o.CurrencyId == serviceRate.CurrencyId &&
                                                        o.OperationTypeId == serviceRate.OperationTypeId &&
                                                        o.ServiceUnitTypeId == serviceRate.ServiceUnitTypeId &&
                                                        o.ComparingSign == serviceRate.ComparingSign &&
                                                        o.Description == serviceRate.Description
                                                        );
                if (objServiceRate != null)
                {
                    return this.Json(new { success = false, data = "service Rate has already been registered!" });
                }
                if (serviceRate.Id.Equals(0))
                {
                    _serviceRate.AddNew(serviceRate);
                }
                else
                {
                    _serviceRate.Edit(serviceRate);
                }
                return this.Json(new { success = true, data = "Data has been saved successfully!" });

            }
            catch (Exception ex)
            {
                return this.Json(new { success = false, data = ex.InnerException != null ? ex.InnerException.Message : ex.Message });
            }
        }

        public ActionResult Delete(int id)
        {
            try
            {

                _serviceRate.Delete(c=>c.Id == id);
                
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
