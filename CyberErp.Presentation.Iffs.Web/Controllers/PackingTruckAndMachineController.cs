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
    public class PackingTruckAndMachineController : DirectController
    {
        #region Members

        private readonly DbContext _context;
        private readonly BaseModel<iffsPackingTruckAndMachine> _PackingTruckAndMachine;
        private readonly Utility _utils = new Utility();
        private readonly Lookups _lookup;

        private readonly BaseModel<iffsUserOperationTypeMapping> _userOperationMapping;

        #endregion

        #region Constructor

        public PackingTruckAndMachineController()
        {
            _context = new ErpEntities(Constants.ConnectionString);
            _PackingTruckAndMachine = new BaseModel<iffsPackingTruckAndMachine>(_context);
            _lookup = new Lookups(_context);
        }

        #endregion

        #region Actions

        public DirectResult GetTruckTypes()
        {
            var lookup = _lookup.GetAll(Lookups.TruckType).OrderBy(l => l.Code);
            var result = new
            {
                total = lookup.Count(),
                data = lookup
            };
            return this.Json(result);
        }
        public ActionResult GetAll(int start, int limit, string sort, string dir, string param)
        {
            var hashtable = JsonConvert.DeserializeObject<Hashtable>(param);
            int headerId = 0;
            int.TryParse(hashtable["HeaderId"].ToString(), out headerId);

            var records = _PackingTruckAndMachine.GetAll().AsQueryable().ToList();

            //Filter the PackingTruckAndMachine Grid with the selected operatin
            records = headerId != 0 ? records.Where(r => r.HeaderId == headerId).ToList() : records.ToList();
            var count = records.Count();
            records = records.OrderBy(o => o.iffsLupTruckType.Name).Skip(start).Take(limit).ToList();

            var PackingTruckAndMachines = records.Select(item => new
            {
                item.Id,
                item.HeaderId,
                item.TruckType,
                TruckTypeName = item.iffsLupTruckType.Name,
                item.NumberOfTrip,
                item.EstimatedKmCovered,
                item.Remark
            }).ToList();
            var result = new { total = count, data = PackingTruckAndMachines };
            return this.Json(result);
        }

        public ActionResult Save(int headerId, List<iffsPackingTruckAndMachine> PackingTruckAndMachine)
        {
            using (var transaction = new TransactionScope())
            {
                _context.Database.Connection.Open();
                try
                {
                    foreach (var item in PackingTruckAndMachine)
                    {
                        item.HeaderId = headerId;
                        if (item.Id.Equals(0))
                        {
                            _PackingTruckAndMachine.AddNew(item);
                        }
                        else
                        {
                            _PackingTruckAndMachine.Edit(item);
                        }
                    }
                    _context.SaveChanges();
                    transaction.Complete();
                    return this.Json(new { success = true, data = " Packing Truck And Machine  has been saved successfully!" });
                }
                catch (Exception exception)
                {
                    return this.Json(new { success = false, data = exception.InnerException.Message });
                }
            }
        }

        public ActionResult Delete(int id)
        {
            try
            {
                _PackingTruckAndMachine.Delete(c => c.Id == id);

                return this.Json(new { success = true, data = "Record has been successfully deleted!" });
            }
            catch (Exception)
            {
                return this.Json(new { success = false, data = "Could not delete the selected record!" });
            }
        }

        public void ExportToExcel()
        {
            //int headerId = 0;
            //int.TryParse(Request.QueryString["HeaderId"].ToString(), out headerId);
            //var records = _PackingTruckAndMachine.GetAll().AsQueryable();
            //records = headerId != 0 ? records.Where(r => r.HeaderId == headerId).ToList() : records.ToList();

            //var PackingTruckAndMachines = records.Select(record => new
            //{
            //    record.Id,
            //    TruckOrMachineType = record.iffsLupTruckType.Name,
            //    record.NumberOfTrip,
            //    record.EstimatedKmCovered,
            //    record.Remark,
            //}).ToList().Select(record => new
            //{
            //    record.Id,
            //    record.TruckOrMachineType,
            //    record.NumberOfTrip,
            //    record.EstimatedKmCovered,
            //    record.Remark,

            //});

            //var exportToExcelHelper = new ExportToExcelHelper();
            //exportToExcelHelper.ToExcel(Response, PackingTruckAndMachines);
        }

        #endregion
    }

}