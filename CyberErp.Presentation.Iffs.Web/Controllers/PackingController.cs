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
    public class PackingController : DirectController
    {
        #region Members

        private readonly DbContext _context;
        private readonly BaseModel<iffsPackingHeader> _PackingHeader;
        private readonly BaseModel<iffsPackingDetail> _PackingDetail;
        private readonly BaseModel<iffsPackingList> _packingList;
        private readonly BaseModel<iffsPackingStaff> _PackingStaff;
        private readonly BaseModel<iffsDocumentNoSetting> _documentNoSetting;
        private readonly BaseModel<iffsLupClientStatus> _ClientStatus;
        private readonly BaseModel<iffsLupRoomType> _RoomType;
        private readonly BaseModel<iffsOperation> _operation;
        private readonly BaseModel<hrmsEmployee> _employee;
        private readonly Utility _utils = new Utility();
        private readonly Lookups _lookup;

        private readonly BaseModel<iffsUserOperationTypeMapping> _userOperationMapping;

        #endregion

        #region Constructor

        public PackingController()
        {
            _context = new ErpEntities(Constants.ConnectionString);
            _PackingHeader = new BaseModel<iffsPackingHeader>(_context);
            _PackingDetail = new BaseModel<iffsPackingDetail>(_context);
            _packingList = new BaseModel<iffsPackingList>(_context);
            _PackingStaff = new BaseModel<iffsPackingStaff>(_context);
            _documentNoSetting = new BaseModel<iffsDocumentNoSetting>(_context);
            _lookup = new Lookups(_context);
            _ClientStatus = new BaseModel<iffsLupClientStatus>(_context);
            _userOperationMapping = new BaseModel<iffsUserOperationTypeMapping>(_context);
            _operation = new BaseModel<iffsOperation>(_context);
            _RoomType = new BaseModel<iffsLupRoomType>(_context);
            _employee = new BaseModel<hrmsEmployee>(_context);
        }

        #endregion

        #region Actions

        public ActionResult Get(int id)
        {
            var obj = _PackingHeader.Get(c => c.Id == id);

            var PackingTemplate = new
            {
                obj.Id,
                obj.OperationId,
                obj.SurveyId,
                obj.ActivityType,
                obj.SupervisorId,
                obj.ActualVolume,
                obj.ActualWeight,
                obj.StartDate,
                obj.EndDate,
                obj.NumberofStaff,
                obj.PreparedBy,
                obj.PreparedDate,
                obj.EstimatedVolume,
                obj.LunchProvided,
                obj.OtherRelatedCost,
                Supervisor = GetFullName(obj.SupervisorId),
                obj.Remark
            };
            return this.Json(new
            {
                success = true,
                data = PackingTemplate
            });
        }
        public DirectResult GetOperations()
        {
            var filtered = _operation.GetAll().Where(o => !o.IsDeleted);
            var count = filtered.Count();
            var Surveys = filtered.Select(record => new
            {
                record.Id,
                Number = record.OperationNo,
            });
            var result = new
            {
                total = count,
                data = Surveys
            };
            return Json(result);
        }
        public DirectResult GetLabels()
        {
            var lookup = _lookup.GetAll(Lookups.DamageType).OrderBy(l => l.Code);
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
            var searchText = hashtable["searchText"].ToString();
            int operationId = 0;
            int.TryParse(hashtable["OperationId"].ToString(), out operationId);

            var records = _PackingHeader.GetAll().AsQueryable().ToList();
            records = searchText != "" ? records.Where(p => p.ActivityType.ToUpper().Contains(searchText.ToUpper()) ||
                   p.hrmsEmployee.corePerson.FatherName.ToUpper().Contains(searchText.ToUpper()) ||
                p.hrmsEmployee.corePerson.FatherName.ToUpper().Contains(searchText.ToUpper()) ||
                p.hrmsEmployee.corePerson.GrandFatherName.ToUpper().Contains(searchText.ToUpper())).ToList() : records.ToList();

            //Filter the Packing Grid with the selected operatin
            records = operationId != 0 ? records.Where(r => r.OperationId == operationId).ToList() : records.ToList();
            var count = records.Count();
            records = records.OrderBy(o => o.PreparedDate).Skip(start).Take(limit).ToList();

            var Packings = records.Select(item => new
            {
                item.Id,
                item.OperationId,
                item.iffsOperation.OperationNo,
                SurveyNumber = item.iffsSurveyRequest.Number,
                item.ActivityType,
                Supervisor = GetFullName(item.SupervisorId),
                PreparedBy = GetFullName(item.PreparedBy),
                item.NumberofStaff,
                item.ActualVolume,
                item.ActualWeight,
                item.StartDate,
                item.EndDate,
                item.PreparedDate
            }).ToList();
            var result = new { total = count, data = Packings };
            return this.Json(result);
        }
        public ActionResult GetPackingList(int start, int limit, string sort, string dir, string param)
        {
            var hashtable = JsonConvert.DeserializeObject<Hashtable>(param);
            int headerId = 0;
            int.TryParse(hashtable["HeaderId"].ToString(), out headerId);

            var records = _packingList.GetAll().AsQueryable().ToList();
            records = records.Where(p => p.HeaderId.Equals(headerId)).ToList();

            var count = records.Count();
            records = records.OrderBy(o => o.Description).Skip(start).Take(limit).ToList();

            var PackingDetails = records.Select(item => new
            {
                item.Id,
                item.HeaderId,
                item.Description,
                item.CartonNumber,
                item.CrateNumber,
                item.OperationId,
                item.Weight,
                item.Value,
                item.LabelId
            }).ToList();
            var result = new { total = count, data = PackingDetails };
            return this.Json(result);
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
        public ActionResult GetAllDetail(int start, int limit, string sort, string dir, string param)
        {
            var hashtable = JsonConvert.DeserializeObject<Hashtable>(param);
            int headerId = 0;
            int.TryParse(hashtable["HeaderId"].ToString(), out headerId);

            var records = _PackingDetail.GetAll().AsQueryable().ToList();
            records = records.Where(p => p.HeaderId.Equals(headerId)).ToList();

            var count = records.Count();
            records = records.OrderBy(o => o.hrmsEmployee.corePerson.FirstName).Skip(start).Take(limit).ToList();

            var PackingDetails = records.Select(item => new
            {
                item.Id,
                item.HeaderId,
                item.PackersId,
                item.iffsPackingHeader.StartDate,
                item.iffsPackingHeader.EndDate,
                Packers = GetFullName(item.PackersId)
            }).ToList();
            var result = new { total = count, data = PackingDetails };
            return this.Json(result);
        }
        public ActionResult GetAllAbsentDays(int start, int limit, string sort, string dir, string param)
        {
            var hashtable = JsonConvert.DeserializeObject<Hashtable>(param);
            int headerId = 0;
            int.TryParse(hashtable["HeaderId"].ToString(), out headerId);

            var records = _PackingStaff.GetAll().AsQueryable().ToList();
            records = records.Where(p => p.StaffId.Equals(headerId)).ToList();

            var count = records.Count();
            records = records.OrderBy(o => o.Date).Skip(start).Take(limit).ToList();

            var PackingStaff = records.Select(item => new
            {
                item.Id,
                item.StaffId,
                item.Date
            }).ToList();
            var result = new { total = count, data = PackingStaff };
            return this.Json(result);
        }
        [FormHandler]
        public DirectResult Save(iffsPackingHeader Packing)
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
                    if (Packing.Id.Equals(0))
                    {
                        Packing.PreparedBy = employeeId;
                        Packing.PreparedDate = DateTime.Now;

                        /* ***************************************************
                        * Concurrency controlling scheme using global locking                                              
                        * ***************************************************/

                        //  var objOperationType = _lookup.GetAll((Lookups.LupOperationType)).Where(o => o.Id == Packing.Id).FirstOrDefault();
                        CyberErp.Presentation.Iffs.Web.MvcApplication httpapplication = HttpContext.ApplicationInstance as CyberErp.Presentation.Iffs.Web.MvcApplication;
                        httpapplication.Application.Lock();
                        //  Packing.Number = GetDocumentNumber("Packing");//objOperationType.Code + "/" + 
                        _PackingHeader.AddNew(Packing);
                        // UpdateDocumentNumber("Packing");
                        httpapplication.Application.UnLock();
                    }
                    else
                    {
                        _PackingHeader.Edit(Packing);
                    }
                    _context.SaveChanges();
                    transaction.Complete();
                    return this.Json(new { success = true, HeaderId = Packing.Id, data = "Packing has been saved Successfully!" });
                }
                catch (Exception exception)
                {
                    return this.Json(new { success = false, data = exception.InnerException != null ? exception.InnerException.Message : exception.Message });
                }
            }
        }
        public ActionResult SaveDetail(int headerId, List<iffsPackingDetail> PackingDetail)
        {
            using (var transaction = new TransactionScope())
            {
                _context.Database.Connection.Open();
                try
                {
                    foreach (var item in PackingDetail)
                    {
                        //iffsPackingDetail detail = new iffsPackingDetail();
                        //detail.Id = item.Id;
                        item.HeaderId = headerId;
                        //detail.PackersId = item.PackersId;
                        if (item.Id.Equals(0))
                        {
                            _PackingDetail.AddNew(item);
                        }
                        else
                        {
                            _PackingDetail.Edit(item);
                        }
                    }
                    _context.SaveChanges();
                    transaction.Complete();
                    return this.Json(new { success = true, data = " Packing Details has been saved successfully!" });
                }
                catch (Exception exception)
                {
                    return this.Json(new { success = false, data = exception.InnerException.Message });
                }
            }
        }
        public ActionResult SavePackingList(int headerId, int operationId, List<iffsPackingList> PackingList)
        {
            using (var transaction = new TransactionScope())
            {
                _context.Database.Connection.Open();
                try
                {
                    foreach (var item in PackingList)
                    {
                        item.HeaderId = headerId;
                        item.OperationId = operationId;
                        if (item.Id.Equals(0))
                        {
                            _packingList.AddNew(item);
                        }
                        else
                        {
                            _packingList.Edit(item);
                        }
                    }
                    _context.SaveChanges();
                    transaction.Complete();
                    return this.Json(new { success = true, data = " Packing List has been saved successfully!" });
                }
                catch (Exception exception)
                {
                    return this.Json(new { success = false, data = exception.InnerException.Message });
                }
            }
        }

        public ActionResult SaveAbsentDays(int headerId, List<iffsPackingStaff> StaffDetail)
        {
            using (var transaction = new TransactionScope())
            {
                _context.Database.Connection.Open();
                try
                {
                    foreach (var item in StaffDetail)
                    {
                        //iffsPackingDetail detail = new iffsPackingDetail();
                        //detail.Id = item.Id;
                        item.StaffId = headerId;
                        //detail.PackersId = item.PackersId;
                        if (item.Id.Equals(0))
                        {
                            _PackingStaff.AddNew(item);
                        }
                        else
                        {
                            _PackingStaff.Edit(item);
                        }
                    }
                    _context.SaveChanges();
                    transaction.Complete();
                    return this.Json(new { success = true, data = " Packing Staff Absent Dates has been saved successfully!" });
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
                    var PackingDetail = _PackingDetail.GetAll().Where(p => p.HeaderId == id).Select(item => new { item.Id }).ToList();
                    foreach (var item in PackingDetail)
                    {
                        _packingList.Delete(d => d.Id == item.Id);
                    }

                    _PackingHeader.Delete(c => c.Id == id);
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
                _PackingDetail.Delete(c => c.Id == id);

                return this.Json(new { success = true, data = "Record has been successfully deleted!" });
            }
            catch (Exception)
            {
                return this.Json(new { success = false, data = "Could not delete the selected record!" });
            }
        }

        public ActionResult DeletePackingList(int id)
        {
            try
            {
                _packingList.Delete(c => c.Id == id);

                return this.Json(new { success = true, data = "Record has been successfully deleted!" });
            }
            catch (Exception)
            {
                return this.Json(new { success = false, data = "Could not delete the selected record!" });
            }
        }

        public ActionResult DeleteAbsentDays(int id)
        {
            try
            {
                _PackingStaff.Delete(c => c.Id == id);

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

            var records = _PackingHeader.GetAll().AsQueryable();
            records = searchText != "" ? records.Where(p => p.ActivityType.ToUpper().Contains(searchText.ToUpper()) ||
                   p.hrmsEmployee.corePerson.FatherName.ToUpper().Contains(searchText.ToUpper()) ||
                p.hrmsEmployee.corePerson.FatherName.ToUpper().Contains(searchText.ToUpper()) ||
                p.hrmsEmployee.corePerson.GrandFatherName.ToUpper().Contains(searchText.ToUpper())) : records;

            var Packings = records.Select(record => new
            {
                record.ActivityType,
                Supervisor = GetFullName(record.SupervisorId),
                PreparedBy = GetFullName(record.PreparedBy),
                record.ActualVolume,
                record.ActualWeight,
                record.StartDate,
                record.EndDate,
                Date = record.PreparedDate
            }).ToList().Select(record => new
            {
                record.ActivityType,
                record.Supervisor,
                record.PreparedBy,
                record.ActualVolume,
                record.ActualWeight,
                record.StartDate,
                record.EndDate,
                record.Date

            });

            var exportToExcelHelper = new ExportToExcelHelper();
            exportToExcelHelper.ToExcel(Response, Packings);
        }

        #endregion
    }

}