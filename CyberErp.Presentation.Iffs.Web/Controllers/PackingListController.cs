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
using System.ComponentModel;
using System.Data.SqlClient;

namespace CyberErp.Presentation.Iffs.Web.Controllers
{
    public class PackingListController : DirectController
    {
        #region Members

        private readonly DbContext _context;
        private readonly BaseModel<iffsDocumentNoSetting> _documentNoSetting;
        private readonly Utility _utils = new Utility();
        private readonly BaseModel<iffsPackingListSetting> _PackingListSetting;
        private readonly BaseModel<iffsUserOperationTypeMapping> _userOperationMapping;

        #endregion

        #region Constructor

        public PackingListController()
        {
            _context = new ErpEntities(Constants.ConnectionString);
            _documentNoSetting = new BaseModel<iffsDocumentNoSetting>(_context);
            _userOperationMapping = new BaseModel<iffsUserOperationTypeMapping>(_context);
            _PackingListSetting = new BaseModel<iffsPackingListSetting>(_context);
        }

        #endregion

        #region Actions

        private bool HasChild(int id)
        {
            var packingList = _PackingListSetting.GetAll().AsQueryable().Where(r => r.ParentId == id);
            if (packingList.Any())
                return false;
            else
                return true;
        }
        public ActionResult PopulatePackingList(object node)
        {
            var hashtable = JsonConvert.DeserializeObject<Hashtable>(JsonConvert.SerializeObject(node));
            string nodeIdString = (hashtable["node"].ToString());

            var filtered = new ArrayList();
            if (nodeIdString == "root")
            {
                var packingList = _PackingListSetting.GetAll().AsQueryable().Where(r => r.ParentId == null);

                foreach (var item in packingList)
                {
                    bool isLeaf = HasChild(item.Id);
                    filtered.Add(new
                    {
                        id = item.Id,
                        text = item.Name,
                        href = string.Empty,
                        leaf = isLeaf,
                        iconCls = isLeaf ? "icon-green-bullet" : "",
                    });
                }
            }
            else
            {
                int nodeId = 0;
                int.TryParse(nodeIdString, out nodeId);
                var packingList = _PackingListSetting.GetAll().AsQueryable().Where(r => r.ParentId == nodeId);
                foreach (var item in packingList)
                {
                    bool isLeaf = HasChild(item.Id);
                    filtered.Add(new
                    {
                        id = item.Id,
                        text = item.Name,
                        href = string.Empty,
                        leaf = isLeaf,
                        iconCls = isLeaf ? "icon-green-bullet" : ""
                    });
                }

            }
            return this.Json(filtered.ToArray());

        }


        public ActionResult GetAllSettings(int start, int limit, string sort, string dir, string param)
        {
            var hashtable = JsonConvert.DeserializeObject<Hashtable>(param);
            var searchText = hashtable["searchText"].ToString();
            int parentId = 0;
            string parentIdString = hashtable["ParentId"].ToString();
            if (parentIdString != "Root")
                int.TryParse(hashtable["ParentId"].ToString(), out parentId);

            var records = parentId == 0 ? _PackingListSetting.GetAll().AsQueryable().Where(p => p.ParentId == null).ToList() :
                _PackingListSetting.GetAll().AsQueryable().Where(p => p.ParentId == parentId).ToList();
            records = searchText != "" ? records.Where(p => p.Name.ToUpper().Contains(searchText.ToUpper()) ||
                p.Code.ToUpper().Contains(searchText.ToUpper())).ToList() : records.ToList();

            //Filter the PackingList Grid with the selected operatin
            var count = records.Count();
            records = records.OrderBy(o => o.Name).Skip(start).Take(limit).ToList();

            var PackingLists = records.Select(item => new
            {
                item.Id,
                item.Name,
                item.Code,
                item.ParentId
            }).ToList();
            var result = new { total = count, data = PackingLists };
            return this.Json(result);
        }

        public DirectResult SaveSetting(int parentId, IList<iffsPackingListSetting> PackingListSettings)
        {
            using (var transaction = new TransactionScope((TransactionScopeOption.Required), new TransactionOptions { IsolationLevel = IsolationLevel.ReadCommitted }))
            {
                _context.Database.Connection.Open();
                _context.Database.CommandTimeout = int.MaxValue;
                try
                {
                    foreach (var item in PackingListSettings)
                    {
                        // Request.Params[""]
                        int employeeId = 0;
                        var objUser = (coreUser)Session[Constants.CurrentUser];
                        if (objUser != null && objUser.EmployeeId != null)
                        {
                            employeeId = (int)objUser.EmployeeId;
                        }
                        if (parentId != 0)
                            item.ParentId = parentId;
                        if (item.Id.Equals(0))
                        {

                            /* ***************************************************
                            * Concurrency controlling scheme using global locking                                              
                            * ***************************************************/

                            //  var objOperationType = _lookup.GetAll((Lookups.LupOperationType)).Where(o => o.Id == PackingList.Id).FirstOrDefault();
                            CyberErp.Presentation.Iffs.Web.MvcApplication httpapplication = HttpContext.ApplicationInstance as CyberErp.Presentation.Iffs.Web.MvcApplication;
                            httpapplication.Application.Lock();
                            //  PackingList.Number = GetDocumentNumber("PackingList");//objOperationType.Code + "/" + 
                            _PackingListSetting.AddNew(item);
                            // UpdateDocumentNumber("PackingList");
                            httpapplication.Application.UnLock();
                        }
                        else
                        {
                            _PackingListSetting.Edit(item);
                        }
                    }
                    _context.SaveChanges();
                    transaction.Complete();
                    return this.Json(new { success = true, data = "PackingList has been saved Successfully!" });
                }
                //catch (SQLException Ex)
                //{

                //}
                catch (Exception ex)
                {
                    if (ex.InnerException.InnerException is SqlException)
                    {
                        SqlException sqlException = ex.InnerException.InnerException as SqlException;
                        if (sqlException.Number == 2601)
                            return this.Json(new { success = false, data = "The items that are entered are already exist!! " });
                        return this.Json(new { success = false, data = ex.InnerException != null ? ex.InnerException.Message : ex.Message });

                    }
                    return this.Json(new { success = false, data = ex.InnerException != null ? ex.InnerException.Message : ex.Message });
                }
            }
        }
        public DirectResult Save(iffsPackingListSetting PackingList)
        {
            using (var transaction = new TransactionScope((TransactionScopeOption.Required), new TransactionOptions { IsolationLevel = IsolationLevel.ReadCommitted }))
            {
                _context.Database.Connection.Open();
                _context.Database.CommandTimeout = int.MaxValue;
                try
                {
                    // Request.Params[""]
                    int employeeId = 0;
                    var objUser = (coreUser)Session[Constants.CurrentUser];
                    if (objUser != null && objUser.EmployeeId != null)
                    {
                        employeeId = (int)objUser.EmployeeId;
                    }
                    if (PackingList.Id.Equals(0))
                    {

                        /* ***************************************************
                        * Concurrency controlling scheme using global locking                                              
                        * ***************************************************/

                        //  var objOperationType = _lookup.GetAll((Lookups.LupOperationType)).Where(o => o.Id == PackingList.Id).FirstOrDefault();
                        CyberErp.Presentation.Iffs.Web.MvcApplication httpapplication = HttpContext.ApplicationInstance as CyberErp.Presentation.Iffs.Web.MvcApplication;
                        httpapplication.Application.Lock();
                        //  PackingList.Number = GetDocumentNumber("PackingList");//objOperationType.Code + "/" + 
                        _PackingListSetting.AddNew(PackingList);
                        // UpdateDocumentNumber("PackingList");
                        httpapplication.Application.UnLock();
                    }
                    else
                    {
                        _PackingListSetting.Edit(PackingList);
                    }
                    _context.SaveChanges();
                    transaction.Complete();
                    return this.Json(new { success = true, HeaderId = PackingList.Id, data = "PackingList has been saved Successfully!" });
                }
                catch (Exception exception)
                {
                    return this.Json(new { success = false, data = exception.InnerException != null ? exception.InnerException.Message : exception.Message });
                }
            }
        }

        public ActionResult DeleteDetail(int id)
        {
            try
            {
                _PackingListSetting.Delete(c => c.Id == id);

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

            var records = _PackingListSetting.GetAll().AsQueryable();
            records = searchText != "" ? records.Where(p => p.Code.ToUpper().Contains(searchText.ToUpper()) ||
                p.Name.ToUpper().Contains(searchText.ToUpper())) : records;

            var PackingLists = records.Select(record => new
            {
                record.Name,
                record.Code,
            }).ToList().Select(record => new
            {
                record.Name,
                record.Code,
            });

            var exportToExcelHelper = new ExportToExcelHelper();
            exportToExcelHelper.ToExcel(Response, PackingLists);
        }

        #endregion
    }

}