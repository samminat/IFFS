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
    public class PackingDamageReportController : DirectController
    {
        #region Members

        private readonly DbContext _context;
        private readonly BaseModel<iffsPackingDamageReportHeader> _PackingDamageReport;
        private readonly BaseModel<iffsPackingDamageReportDetail> _PackingDamageReportDetail;
        private readonly BaseModel<iffsPackingList> _PackingList;
        private readonly BaseModel<iffsPackingHeader> _PackingHeader;
        private readonly BaseModel<iffsDocumentNoSetting> _documentNoSetting;
        private readonly BaseModel<iffsShipmentType> _shipmentType;
        private readonly BaseModel<iffsReceivingClient> _ReceivingClient;
        private readonly BaseModel<hrmsEmployee> _employee;
        private readonly Utility _utils = new Utility();
        private readonly Lookups _lookup;

        private readonly BaseModel<iffsUserOperationTypeMapping> _userOperationMapping;

        #endregion

        #region Constructor

        public PackingDamageReportController()
        {
            _context = new ErpEntities(Constants.ConnectionString);
            _PackingDamageReport = new BaseModel<iffsPackingDamageReportHeader>(_context);
            _PackingDamageReportDetail = new BaseModel<iffsPackingDamageReportDetail>(_context);
            _PackingList = new BaseModel<iffsPackingList>(_context);
            _PackingHeader = new BaseModel<iffsPackingHeader>(_context);
            _employee = new BaseModel<hrmsEmployee>(_context);
            _documentNoSetting = new BaseModel<iffsDocumentNoSetting>(_context);
            _lookup = new Lookups(_context);
            _shipmentType = new BaseModel<iffsShipmentType>(_context);
            _userOperationMapping = new BaseModel<iffsUserOperationTypeMapping>(_context);
            _ReceivingClient = new BaseModel<iffsReceivingClient>(_context);
        }

        #endregion

        #region Actions

        public ActionResult Get(int id)
        {
            var obj = _PackingDamageReport.Get(c => c.Id == id);

            var PackingDamageReportTemplate = new
            {
                obj.Id,
                obj.ShippersName,
                obj.ClientId,
                obj.SuprvisorId,
                obj.OriginCountry,
                obj.OperationId,
                obj.DeliveryAddress,
                Suprvisor = GetFullName(obj.SuprvisorId),
                ClientName = obj.iffsCustomer.Name,
                obj.Remarks
            };
            return this.Json(new
            {
                success = true,
                data = PackingDamageReportTemplate
            });
        }
        private string GetFullName(int empId)
        {
            string fullName = "";
            var employee = _employee.Get(e => e.Id == empId);
            if (employee != null)
            {
                fullName = employee.corePerson.FirstName + " " + employee.corePerson.FatherName + " " + employee.corePerson.GrandFatherName;
            }
            return fullName;
        }
        public ActionResult GetAll(int start, int limit, string sort, string dir, string param)
        {
            var hashtable = JsonConvert.DeserializeObject<Hashtable>(param);
            var searchText = hashtable["searchText"].ToString();

            var records = _PackingDamageReport.GetAll().AsQueryable().ToList();
            //records = searchText != "" ? records.Where(p => p.Number.ToUpper().Contains(searchText.ToUpper()) ||
            //    p.iffsPackingDamageReportDetail.Name.ToUpper().Contains(searchText.ToUpper()) || p.iffsReceivingClient.Name.ToUpper().Contains(searchText.ToUpper())).ToList() : records.ToList();

            var count = records.Count();
            // records = records.OrderBy(o => o.Number).ThenByDescending(o => o.iffsCustomer.Name).ThenByDescending(o => o.iffsReceivingClient.Name).Skip(start).Take(limit).ToList();

            var PackingDamageReports = records.Select(item => new
            {
                item.Id,
                item.ShippersName,
                item.ClientId,
                item.SuprvisorId,
                item.OriginCountry,
                item.OperationId,
                item.DeliveryAddress,
                Suprvisor = GetFullName(item.SuprvisorId),
                ClientName = item.iffsCustomer.Name,
                OperationNumber = item.iffsOperation.OperationNo,
            }).ToList();
            var result = new { total = count, data = PackingDamageReports };
            return this.Json(result);
        }
        public ActionResult GetAllDetail(int start, int limit, string sort, string dir, string param)
        {
            var hashtable = JsonConvert.DeserializeObject<Hashtable>(param);
            int headerId = 0;
            int.TryParse(hashtable["HeaderId"].ToString(), out headerId);

            var records = _PackingDamageReportDetail.GetAll().AsQueryable().ToList();
            records = records.Where(p => p.iffsPackingDamageReportHeader.Id.Equals(headerId)).ToList();

            var count = records.Count();
            records = records.OrderBy(o => o.DamagedItems).Skip(start).Take(limit).ToList();

            var damageReports = records.Select(item => new
            {
                item.Id,
                item.HeaderId,
                item.DamagedItems,
                item.DamageType,
            }).ToList();
            var result = new { data = damageReports };
            return this.Json(result);
        }
        public DirectResult GetPackingHeader()
        {
            var records = _PackingHeader.GetAll().AsQueryable().ToList();
            var count = records.Count();
            records = records.OrderBy(o => o.StartDate).ToList();//.Skip(start).Take(limit).ToList();
            var clients = records.Select(item => new
            {
                item.Id,
                item.ActivityType
            }).ToList();
            var result = new { total = count, data = clients };
            return this.Json(result);
        }
        public DirectResult GetPackingLists(int headerId)
        {
            var records = _PackingList.GetAll().AsQueryable().ToList();
            records = records.Where(p => p.HeaderId == headerId).ToList();
            var count = records.Count();
            records = records.OrderBy(o => o.Description).ToList();//.Skip(start).Take(limit).ToList();
            var clients = records.Select(item => new
            {
                item.Id,
                item.Description
            }).ToList();
            var result = new { total = count, data = clients };
            return this.Json(result);
        }
        public DirectResult GetShipmentTypes()
        {
            var records = _shipmentType.GetAll().AsQueryable().ToList();
            var count = records.Count();
            records = records.OrderBy(o => o.Name).ThenByDescending(o => o.Type).ToList();//.Skip(start).Take(limit).ToList();
            var shipmentTypes = records.Select(item => new
            {
                item.Id,
                item.Name,
                item.Code,
                item.Type
            }).ToList();
            var result = new { total = count, data = shipmentTypes };
            return this.Json(result);
        }

        [FormHandler]
        public DirectResult Save(iffsPackingDamageReportHeader PackingDamageReport)
        {
            using (var transaction = new TransactionScope((TransactionScopeOption.Required), new TransactionOptions { IsolationLevel = IsolationLevel.ReadCommitted }))
            {
                _context.Database.Connection.Open();
                _context.Database.CommandTimeout = int.MaxValue;
                try
                {
                    int employeeId = 0;
                    var objUser = (coreUser)Session[Constants.CurrentUser];
                    if (objUser != null && objUser.EmployeeId != null)
                    {
                        employeeId = (int)objUser.EmployeeId;
                    }
                    if (PackingDamageReport.Id.Equals(0))
                    {
                        //PackingDamageReport.PreparedById = employeeId;
                        //PackingDamageReport.Date = DateTime.Now;

                        /* ***************************************************
                        * Concurrency controlling scheme using global locking                                              
                        * ***************************************************/

                        //var objOperationType = _lookup.GetAll((Lookups.LupOperationType)).Where(o => o.Id == PackingDamageReport.Id).FirstOrDefault();
                        CyberErp.Presentation.Iffs.Web.MvcApplication httpapplication = HttpContext.ApplicationInstance as CyberErp.Presentation.Iffs.Web.MvcApplication;
                        httpapplication.Application.Lock();
                        //  PackingDamageReport.Number = GetDocumentNumber("PackingDamageReport");//objOperationType.Code + "/" + 
                        _PackingDamageReport.AddNew(PackingDamageReport);
                        //  UpdateDocumentNumber("PackingDamageReport");
                        httpapplication.Application.UnLock();
                    }
                    else
                    {
                        _PackingDamageReport.Edit(PackingDamageReport);
                    }
                    _context.SaveChanges();
                    transaction.Complete();
                    return this.Json(new { success = true, data = "Damage Item Report  has been saved Successfully!", HeaderId = PackingDamageReport.Id });
                }
                catch (Exception exception)
                {
                    return this.Json(new { success = false, data = exception.InnerException != null ? exception.InnerException.Message : exception.Message });
                }
            }
        }
        public ActionResult SaveDetail(int headerId, List<iffsPackingDamageReportDetail> PackingDetail)
        {
            using (var transaction = new TransactionScope())
            {
                _context.Database.Connection.Open();
                try
                {
                    foreach (var item in PackingDetail)
                    {
                        item.HeaderId = headerId;
                        if (item.Id.Equals(0))
                        {
                            _PackingDamageReportDetail.AddNew(item);
                        }
                        else
                        {
                            _PackingDamageReportDetail.Edit(item);
                        }
                    }
                    _context.SaveChanges();
                    transaction.Complete();
                    return this.Json(new { success = true, data = " Damage Item Report  Details has been saved successfully!" });
                }
                catch (Exception exception)
                {
                    return this.Json(new { success = false, data = exception.InnerException.Message });
                }
            }
        }
        public string GetDocumentNumber(string documentType)
        {
            try
            {
                var objDocumentNoSetting = _documentNoSetting.GetAll().Where(o => o.DocumentType == documentType).FirstOrDefault();
                var format = GetDocumentFormat(objDocumentNoSetting.NoOfDigit);
                var documentNo = string.Format(format, objDocumentNoSetting.CurrentNo);
                documentNo = objDocumentNoSetting.Prefix + "/" + documentNo;
                if (objDocumentNoSetting.Year != null && objDocumentNoSetting.Year > 0)
                    documentNo = documentNo + "/" + objDocumentNoSetting.Year;
                if (objDocumentNoSetting.SurFix != null && objDocumentNoSetting.SurFix != "")
                    documentNo = documentNo + "/" + objDocumentNoSetting.SurFix;
                return documentNo;
            }
            catch (Exception)
            {
                return string.Empty;
            }
        }

        public void UpdateDocumentNumber(string documentType)
        {
            var objDocumentNoSetting = _documentNoSetting.GetAll().Where(o => o.DocumentType == documentType).FirstOrDefault();
            if (objDocumentNoSetting != null)
            {
                objDocumentNoSetting.CurrentNo += 1;
            }
            _context.SaveChanges();
        }

        public string GetDocumentFormat(int numberOfDigits)
        {
            var format = "{0:";
            for (var i = 0; i < numberOfDigits; i++)
            {
                format += "0";
            }
            format += "}";
            return format;
        }
        public ActionResult Delete(int id)
        {
            using (var transaction = new TransactionScope())
            {
                _context.Database.Connection.Open();
                try
                {
                    var Detail = _PackingDamageReportDetail.GetAll().Where(p => p.HeaderId == id).Select(item => new { item.Id }).ToList();
                    foreach (var item in Detail)
                    {
                        _PackingDamageReportDetail.Delete(d => d.Id == item.Id);
                    }
                    _PackingDamageReport.Delete(c => c.Id == id);
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
        public ActionResult DeleteDetail(int id)
        {
            try
            {
                _PackingDamageReportDetail.Delete(c => c.Id == id);

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

            var records = _PackingDamageReport.GetAll().AsQueryable();
            //records = searchText != "" ? records.Where(p => p.Number.ToUpper().Contains(searchText.ToUpper()) ||
            //    p.iffsCustomer.Name.ToUpper().Contains(searchText.ToUpper()) ||
            //    p.iffsReceivingClient.Name.ToUpper().Contains(searchText.ToUpper())) : records;

            var PackingDamageReports = records.Select(record => new
            {
                record.Id,
                record.Remarks,
            }).ToList().Select(record => new
            {
                record.Id,
                record.Remarks,
            });

            var exportToExcelHelper = new ExportToExcelHelper();
            exportToExcelHelper.ToExcel(Response, PackingDamageReports);
        }

        #endregion
    }
}