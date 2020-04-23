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
using System.Transactions;
using CyberErp.Business.Component.Iffs;

namespace CyberErp.Presentation.Iffs.Web.Controllers
{
    public class ShipmentTypeController : DirectController
    {
        #region Members

        private readonly DbContext _context;
        private readonly BaseModel<iffsShipmentType> _ShipmentType;
        private readonly BaseModel<iffsDocumentNoSetting> _documentNoSetting;
        private readonly Utility _utils = new Utility();
        private readonly Lookups _lookup;

        private readonly BaseModel<iffsUserOperationTypeMapping> _userOperationMapping;

        #endregion

        #region Constructor

        public ShipmentTypeController()
        {
            _context = new ErpEntities(Constants.ConnectionString);
            _ShipmentType = new BaseModel<iffsShipmentType>(_context);
            _documentNoSetting = new BaseModel<iffsDocumentNoSetting>(_context);
            _lookup = new Lookups(_context);
        }

        #endregion

        #region Actions

        public ActionResult Get(int id)
        {
            var obj = _ShipmentType.Get(c => c.Id == id);

            var ShipmentTypeTemplate = new
            {
                obj.Id,
                obj.Name,
                obj.Code,
                obj.Type
            };
            return this.Json(new
            {
                success = true,
                data = ShipmentTypeTemplate
            });
        }


        public ActionResult GetAll(int start, int limit, string sort, string dir, string param)
        {
            var hashtable = JsonConvert.DeserializeObject<Hashtable>(param);
            var searchText = hashtable["searchText"].ToString();

            var records = _ShipmentType.GetAll().AsQueryable().ToList();
            records = searchText != "" ? records.Where(p => p.Name.ToUpper().Contains(searchText.ToUpper()) ||
                p.Code.ToUpper().Contains(searchText.ToUpper()) || p.Type.ToUpper().Contains(searchText.ToUpper())).ToList() : records.ToList();

            var count = records.Count();
            records = records.OrderBy(o => o.Name).ThenByDescending(o => o.Type).Skip(start).Take(limit).ToList();

            var ShipmentTypes = records.Select(item => new
            {
                item.Id,
                item.Name,
                item.Code,
                item.Type
            }).ToList();
            var result = new { total = count, data = ShipmentTypes };
            return this.Json(result);
        }



        [FormHandler]
        public DirectResult Save(iffsShipmentType shipmentType)
        {
            using (var transaction = new TransactionScope((TransactionScopeOption.Required), new TransactionOptions { IsolationLevel = IsolationLevel.ReadCommitted }))
            {
                _context.Database.Connection.Open();
                _context.Database.CommandTimeout = int.MaxValue;
                try
                {

                    if (shipmentType.Id.Equals(0))
                    {
                        _ShipmentType.AddNew(shipmentType);
                    }
                    else
                    {

                        _ShipmentType.Edit(shipmentType);
                    }


                    _context.SaveChanges();
                    transaction.Complete();
                    return this.Json(new { success = true, data = "Shipment Type has been saved Successfully!" });
                }
                catch (Exception exception)
                {
                    return this.Json(new { success = false, data = exception.InnerException != null ? exception.InnerException.Message : exception.Message });
                }
            }
        }
        public ActionResult Delete(int id)
        {
            try
            {
                _ShipmentType.Delete(c => c.Id == id);

                return this.Json(new { success = true, data = "Record has been successfully deleted!" });
            }
            catch (Exception)
            {
                return this.Json(new { success = false, data = "Could not delete the selected record!" });
            }
        }
        public void ExportToExcel()
        {
            var searchText = Request.QueryString["st"].ToString();

            var records = _ShipmentType.GetAll().AsQueryable();
            records = searchText != "" ? records.Where(p => p.Name.ToUpper().Contains(searchText.ToUpper()) ||
                p.Code.ToUpper().Contains(searchText.ToUpper()) ||
                p.Type.ToUpper().Contains(searchText.ToUpper())) : records;

            var ShipmentTypes = records.Select(record => new
            {
                record.Id,
                record.Name,
                record.Code,
                record.Type
            }).ToList().Select(record => new
            {
                record.Id,
                record.Name,
                record.Code,
                record.Type
            });

            var exportToExcelHelper = new ExportToExcelHelper();
            exportToExcelHelper.ToExcel(Response, ShipmentTypes);
        }

        #endregion
    }
}