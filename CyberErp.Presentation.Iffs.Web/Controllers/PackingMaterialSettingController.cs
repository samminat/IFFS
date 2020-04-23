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
    public class PackingMaterialSettingController : DirectController
    {
        #region Members

        private readonly DbContext _context;
        private readonly BaseModel<iffsPackingMaterialList> _PackingMaterialSetting;

        #endregion

        #region Constructor

        public PackingMaterialSettingController()
        {
            _context = new ErpEntities(Constants.ConnectionString);
            _PackingMaterialSetting = new BaseModel<iffsPackingMaterialList>(_context);
        }

        #endregion

        #region Actions

        public ActionResult GetAll(int start, int limit, string sort, string dir, string record)
        {
            var hashtable = JsonConvert.DeserializeObject<Hashtable>(record);
            var searchText = hashtable["SearchText"].ToString();
            int Type = 0;
            int.TryParse(hashtable["MaterialType"].ToString(), out Type);
            if (Type == 0)
                return this.Json(new { total = 0, data = "" });
            MaterialType materialType = Type == 1 ? MaterialType.Standard : MaterialType.CrateAndBox;
            var records = _PackingMaterialSetting.FindAllQueryable(p => p.MaterialType == materialType);
            records = searchText != "" ? records.Where(p => p.Name.ToUpper().Contains(searchText.ToUpper()) ||
                 p.Description.ToUpper().Contains(searchText.ToUpper())) :
                 _PackingMaterialSetting.FindAllQueryable(p => p.MaterialType == materialType);

            var count = records.Count();
            records = records.OrderBy(o => o.Name).Skip(start).Take(limit);

            var PackingMaterialSettings = records.Select(item => new
            {
                item.Id,
                item.MeasurmentUnit,
                MeasurmentUnitRaw = item.lupMeasurementUnit.Name,
                item.Name,
                item.Remark,
                item.Width,
                item.Length,
                item.Height,
                item.SizeCMB,
                item.MaterialType,
                item.Description
            }).ToList();
            var result = new { total = count, data = PackingMaterialSettings };
            return this.Json(result);
        }


        public ActionResult SaveDetail(int headerId, List<iffsPackingMaterialList> PackingMaterialSettingDetail)
        {
            using (var transaction = new TransactionScope())
            {
                _context.Database.Connection.Open();
                try
                {
                    foreach (var item in PackingMaterialSettingDetail)
                    {
                        item.MaterialType = headerId == 1 ? MaterialType.Standard : MaterialType.CrateAndBox;
                        if (item.Id.Equals(0))
                        {
                            _PackingMaterialSetting.AddNew(item);
                        }
                        else
                        {
                            _PackingMaterialSetting.Edit(item);
                        }
                    }
                    _context.SaveChanges();
                    transaction.Complete();
                    return this.Json(new { success = true, data = " Packing Survey Details has been saved successfully!" });
                }
                catch (Exception exception)
                {
                    return this.Json(new { success = false, data = exception.InnerException.Message });
                }
            }
        }

        public ActionResult Delete(IList<iffsPackingMaterialList> packingMaterialList)
        {
            using (var transaction = new TransactionScope())
            {
                _context.Database.Connection.Open();
                try
                {
                    //var detail = _PackingMaterialSetting.GetAll().Where(d =>  d.Id == id).Select(item => new { item.Id }).ToList();
                    foreach (var item in packingMaterialList)
                    {
                        _PackingMaterialSetting.Delete(c => c.Id == item.Id);
                    }
                    _context.SaveChanges();
                    transaction.Complete();
                    return this.Json(new { success = true, data = "Record has been successfully deleted!" });
                }
                catch (Exception)
                {
                    return this.Json(new { success = false, data = "Could not delete the selected record!" });
                }
            }
        }

        public void ExportToExcel()
        {
            var searchText = Request.QueryString["st"].ToString();
            var Type = int.Parse(Request.QueryString["Type"].ToString());
            MaterialType materialType = Type == 1 ? MaterialType.Standard : MaterialType.CrateAndBox;
            var records = _PackingMaterialSetting.FindAllQueryable(p => p.MaterialType == materialType);
            records = searchText != "" ? records.Where(p => p.Name.ToUpper().Contains(searchText.ToUpper()) ||
                p.Description.ToUpper().Contains(searchText.ToUpper())) : records;

            var PackingMaterialSettings = records.Select(record => new
            {
                record.Name,
                record.Description,
                record.MeasurmentUnit,
                record.Length,
                record.Width,
                record.Height,
                record.SizeCMB,
                record.MaterialType,
                record.Remark
            }).ToList().Select(record => new
            {
                record.Name,
                record.Description,
                record.MeasurmentUnit,
                record.Length,
                record.Width,
                record.Height,
                record.SizeCMB,
                record.MaterialType,
                record.Remark
            });

            var exportToExcelHelper = new ExportToExcelHelper();
            exportToExcelHelper.ToExcel(Response, PackingMaterialSettings);
        }

        #endregion
    }

}