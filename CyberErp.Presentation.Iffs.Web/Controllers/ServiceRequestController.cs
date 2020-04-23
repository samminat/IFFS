using CyberErp.Business.Component.Iffs;
using CyberErp.Data.Model;
using CyberErp.Presentation.Iffs.Web.Classes;
using Ext.Direct.Mvc;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Data.Entity;
using System.IO;
using System.Linq;
using System.Transactions;
using System.Web;
using System.Web.Mvc;
using Newtonsoft.Json;
using SwiftTederash.Business;

namespace CyberErp.Presentation.Iffs.Web.Controllers
{
    public class ServiceRequestController : DirectController
    {
        #region Members 

        private readonly DbContext _context;
        private readonly BaseModel<iffsServiceRequest> _serviceRequest;
        private readonly BaseModel<iffsDocumentNoSetting> _documentNoSetting;
        private readonly BaseModel<iffsServiceRequestDocuments> _serviceRequestDocs;
        private readonly BaseModel<iffsServiceRequestDetail> _serviceRequestDetails; 
        #endregion

        #region Constractor 
        public ServiceRequestController()
        {
            _context = new ErpEntities(Constants.ConnectionString);
            _serviceRequest = new BaseModel<iffsServiceRequest>(_context);
            _documentNoSetting = new BaseModel<iffsDocumentNoSetting>(_context);
            _serviceRequestDocs = new BaseModel<iffsServiceRequestDocuments>(_context);
            _serviceRequestDetails = new BaseModel<iffsServiceRequestDetail>(_context);
        }

        #endregion

        #region Actions 
        public ActionResult Get(int id)
        {
            var obj = _serviceRequest.Get(c => c.Id == id);

            var serviceRequest = new
            {
              
                obj.Id,
                obj.RequestNo,
                obj.CustomerId,
                Customer = obj.iffsCustomer.Name,
                obj.PreparedDate,
                obj.RequesterFirstName,
                obj.RequesterLastName,
                obj.CommodityType,
                obj.Address,
                obj.RequestDate,
                obj.CommodityDescription,
                obj.PreparedById,
                obj.CheckedById,
                obj.CheckedDate,
                obj.ApprovedById,
                obj.ApprovalDate,
                obj.CanBeHandled,
                obj.ResponseDate,
                obj.HasAgreement,
                obj.ServiceAgreementId,
                obj.Remark,

            };
            return this.Json(new
            {
                success = true,
                data = serviceRequest
            });
        }

        public ActionResult GetAll(int start, int limit, string sort, string dir, string param)
        {
            var hashtable = JsonConvert.DeserializeObject<Hashtable>(param);
            var searchText="";
            if(hashtable["searchText"]!=null)
             searchText = hashtable["searchText"].ToString();
            DateTime date = new DateTime();
            bool isDatestring = DateTime.TryParse(searchText, out date);

            var records = _serviceRequest.GetAll().AsQueryable();

            records = searchText != "" ? records.Where(p => 
                p.iffsCustomer.Name.ToUpper().Contains(searchText.ToUpper()) ||
                p.RequesterFirstName.ToUpper().Contains(searchText.ToUpper()) ||
                p.RequesterLastName.ToUpper().Contains(searchText.ToUpper()) ||
                p.RequestNo.ToUpper().Contains(searchText.ToUpper())||
                (isDatestring ? p.RequestDate >= date : false) 
              
                ) : records;
           
            switch (sort)
            {
                 case "Id":
                 records = dir == "ASC" ? records.OrderByDescending(r => r.Id) : records.OrderByDescending(r => r.Id);
                  break;
                case "RequestNo":
                      records = dir == "ASC" ? records.OrderBy(r => r.RequestNo) : records.OrderByDescending(r => r.RequestNo);
                 break;
                case "CustomerName":
                     records = dir == "ASC" ? records.OrderBy(r => r.iffsCustomer.Name) : records.OrderByDescending(r => r.iffsCustomer.Name);
                  break;
                 case "ApprovedBy":
                    records = dir == "ASC" ? records.OrderBy(u => u.ApprovedById.HasValue ? u.hrmsEmployee2.corePerson.FirstName + " " + u.hrmsEmployee2.corePerson.FatherName : "") : records.OrderByDescending(u => u.ApprovedById.HasValue ? u.hrmsEmployee2.corePerson.FirstName + " " + u.hrmsEmployee2.corePerson.FatherName : "");
                    break;
                case "CheckedBy":
                    records = dir == "ASC" ? records.OrderBy(u => u.hrmsEmployee1.corePerson.FirstName + " " + u.hrmsEmployee1.corePerson.FatherName) : records.OrderByDescending(u => u.hrmsEmployee1.corePerson.FirstName + " " + u.hrmsEmployee1.corePerson.FatherName);
                    break;
                case "PreparedBy":
                    records = dir == "ASC" ? records.OrderBy(u => u.CheckedById.HasValue ? u.hrmsEmployee.corePerson.FirstName + " " + u.hrmsEmployee.corePerson.FatherName : "") : records.OrderByDescending(u => u.CheckedById.HasValue ? u.hrmsEmployee.corePerson.FirstName + " " + u.hrmsEmployee.corePerson.FatherName : "");
                    break;
                case "PreparedDate":
                    records = dir == "ASC" ? records.OrderBy(u => u.PreparedDate) : records.OrderByDescending(u => u.PreparedDate);
                    break;
                case "ApprovalDate":
                    records = dir == "ASC" ? records.OrderBy(u => u.ApprovalDate) : records.OrderByDescending(u => u.ApprovalDate);
                    break;

                case "CheckedDate":
                    records = dir == "ASC" ? records.OrderBy(u => u.CheckedDate) : records.OrderByDescending(u => u.CheckedDate);
                    break;

                case "RequestDate":
                    records = dir == "ASC" ? records.OrderBy(u => u.RequestDate) : records.OrderByDescending(u => u.RequestDate);
                    break;
                case "RequesterFirstName":
                    records = dir == "ASC" ? records.OrderBy(u => u.RequesterFirstName) : records.OrderByDescending(u => u.RequesterFirstName);
                    break;
                case "RequesterLastName":
                    records = dir == "ASC" ? records.OrderBy(u => u.RequesterLastName) : records.OrderByDescending(u => u.RequesterLastName);
                    break;
                case "CanBeHandled":
                    records = dir == "ASC" ? records.OrderBy(u => u.CanBeHandled) : records.OrderByDescending(u => u.CanBeHandled);
                    break;
            }


            var count = records.Count();
            records = records.Skip(start).Take(limit);
            var serviceRequests = records.Select(record => new
            {
                record.Id,
                record.CustomerId,
                record.RequestNo,
                CustomerName = record.iffsCustomer.Name,
                record.RequesterFirstName,
                record.RequesterLastName,
                record.CommodityDescription,
                record.CommodityType,
                record.Address,
                RequestDate =  record.RequestDate,
                record.PreparedById,
                record.PreparedDate,
                record.CheckedById,
                record.CheckedDate,
                record.ApprovedById,
                record.ApprovalDate,
                record.CanBeHandled,
                record.ResponseDate,
                record.HasAgreement,
                record.ServiceAgreementId,
                record.Remark,

            }).ToList().Select(record => new
            {
                record.Id,
                record.CustomerId,
                record.RequestNo,
                CustomerName = record.CustomerName,
                record.RequesterFirstName,
                record.RequesterLastName,
                record.CommodityDescription,
                record.CommodityType,
                record.Address,
                RequestDate = string.Format("{0:MMMM dd, yyyy}", record.RequestDate),
                record.PreparedById,
                record.PreparedDate,
                record.CheckedById,
                record.CheckedDate,
                record.ApprovedById,
                record.ApprovalDate,
                record.CanBeHandled,
                record.ResponseDate,
                record.HasAgreement,
                record.ServiceAgreementId,
                record.Remark,

            }).ToList();
            var result = new { total = count, data = serviceRequests };
            return this.Json(result);
        }

        public ActionResult GetAllDocsByRequest(int start, int limit, string sort, string dir, int requestId)
        {

            var filtered = _serviceRequestDocs.GetAll().Where(o => o.RequestId == requestId);
               
            var count = filtered.Count();
          
            filtered = filtered.Skip(start).Take(limit);
            var serviceRequest = filtered.Select(item => new
            {
                item.Id,
                item.RequestId,
                item.DocumentUrl
               
            }).Cast<object>().ToList();
            return this.Json(new
            {
                success = true,
                data = serviceRequest
            });

        }


        [FormHandler]
        public ActionResult Save(iffsServiceRequest serviceRequest)
        {
            using (
                var transaction = new TransactionScope((TransactionScopeOption.Required),
                    new TransactionOptions {IsolationLevel = IsolationLevel.ReadCommitted}))
            {
                _context.Database.Connection.Open();
                _context.Database.CommandTimeout = int.MaxValue;
                try
                {
                    var hashtable = JsonConvert.DeserializeObject<Hashtable>(Request.Params["record"]);
                    var voucherDetailsString = hashtable["serviceRequestDetails"].ToString();
                    voucherDetailsString = voucherDetailsString.Remove(voucherDetailsString.Length - 1);
                    var voucherDetails = voucherDetailsString.Split(new[] { ';' });
                    string action = hashtable["action"].ToString();

                    if (Request.Params["CanBeHandled"] != null)
                        serviceRequest.CanBeHandled = true;

                    if (Request.Params["HasAgreement"] != null)
                        serviceRequest.HasAgreement = true;


                    if (serviceRequest.Id.Equals(0))
                    {
                        var currentUser = Session[Constants.CurrentUser] as coreUser;

                        if (currentUser != null)
                            if (currentUser.EmployeeId != null)
                            {
                                serviceRequest.PreparedById = (int) currentUser.EmployeeId;
                                serviceRequest.PreparedDate = DateTime.Now;
                            }
                        serviceRequest.RequestNo = GetDocumentNumber("Service Request");
                        _serviceRequest.AddNew(serviceRequest);
                        UpdateDocumentNumber("Service Request");
                        
                    }
                    else
                    {
                        _serviceRequest.Edit(serviceRequest);
                    }

                    SaveServiceRequestDetails(serviceRequest, voucherDetails.ToList(), action);
                    _context.SaveChanges();
                    transaction.Complete();
                    return this.Json(new { success = true, data = "Service Request has been saved Successfully!", Id = serviceRequest.Id });
                }
                catch (Exception exception)
                {
                    return
                        this.Json(
                            new
                            {
                                success = false,
                                data =
                                    exception.InnerException != null
                                        ? exception.InnerException.Message
                                        : exception.Message
                            });
                }
            }
        }

        [FormHandler]
        public ActionResult Upload(iffsServiceRequestDocuments serviceRequestDocs)
        {
            try
            {
                string msg = "";
                string docUrl = "";
                string fileExtension;
                string filePath;
              

                var hashtable = JsonConvert.DeserializeObject<Hashtable>(Request.Params["record"]);

                if (hashtable["docUrl"].ToString() != "")
                    docUrl = hashtable["docUrl"].ToString().Replace(",", "");
               
                string appPath = HttpContext.Request.ApplicationPath;
                string physicalPath = HttpContext.Request.MapPath(appPath);
                string location = physicalPath + "\\Upload\\ServiceRequestDocs\\";
                HttpPostedFileBase postedFile = Request.Files["DocumentUrl"];
             
                var requestF = serviceRequestDocs.RequestId + "\\";
                string serviceRequestDocPath = System.IO.Path.Combine(location, requestF);
                System.IO.Directory.CreateDirectory(serviceRequestDocPath);

                serviceRequestDocs.DocumentUrl = Path.GetFileName(postedFile.FileName); ;
                if ((postedFile != null) && (postedFile.ContentLength > 0))
                {
                    fileExtension = System.IO.Path.GetExtension(postedFile.FileName);
                    filePath = serviceRequestDocPath + Path.GetFileName(postedFile.FileName);
                    postedFile.SaveAs(filePath);

                }

                if (serviceRequestDocs.Id.Equals(0))
                {
                    serviceRequestDocs.DocumentUrl = Path.GetFileName(docUrl);

                    _serviceRequestDocs.AddNew(serviceRequestDocs);
                }

                return this.Json(new { success = true, data = "File has has been uploaded successfully!" });
            }
            catch (System.Exception ex)
            {
                return this.Json(new { success = false, data = "Unable to upload file!" });
            }
        }
        public ActionResult Delete(int id)
        {
            try
            {
                _serviceRequest.Delete(c => c.Id == id);

                return this.Json(new { success = true, data = "Record has been successfully deleted!" });
            }
            catch (Exception)
            {
                return this.Json(new { success = false, data = "Could not delete the selected record!" });
            }
        }


        public ActionResult GetDetailByRequestHeader(int start, int limit, string sort, string dir, string record)
        {
            var hashtable = JsonConvert.DeserializeObject<Hashtable>(record);
            int headerId;
            int.TryParse(hashtable["requestId"].ToString(), out headerId);
            var filtered = _serviceRequestDetails.GetAll().Where(a => a.HeaderId == headerId);

            int count = filtered.Count();
            filtered = filtered.Skip(start).Take(limit);

            var _serviceDetails = filtered.Select(item => new
            {

                item.Id,
                OperationType = item.iffsLupOperationType.Name,
                item.OperationTypeId,
                CommodityType = item.iffsLupCommodityType.Name,
                item.CommodityTypeId,
                item.Volume,
                item.Weight,
                item.Pcs,
                item.TareWeight,
                item.Description,
                item.ContainerTypeId,
                ContainerType = item.iffsLupContainerType.Name,
                item.POD,
                item.POE

            }).Cast<object>().ToList();

            var result = new {total = count, data= _serviceDetails};

            return this.Json(result);

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
            catch (Exception e)
            {
                return string.Empty;
            }
        }

        public void SaveServiceRequestDetails(iffsServiceRequest serviceRequestHeader, IList<string> serviceRequestDetails, string action)
        {
            var serviceRequestHeaderId = serviceRequestHeader.Id;

            if (action == "Add")
            {
                for (var i = 0; i < serviceRequestDetails.Count(); i++)
                {
                    var row = serviceRequestDetails[i].Split(new[] { ':' });
                    var operationTypeId = int.Parse(row[0]);
                    int? commodityTypeId = int.Parse(row[1]);
                    decimal volume = Convert.ToDecimal(row[2].ToString());
                    decimal weight = Convert.ToDecimal(row[3].ToString());
                    var pcs = row[4].ToString();
                    var containerTypeId = int.Parse(row[5]);
                    var poe = row[6].ToString();
                    var pod = row[7].ToString();
                    var description = row[8] != null && row[8] != "undefined" ? row[8].ToString() : "";
                    var tareWeight = row[9] != null && row[9] != "undefined" ? row[9].ToString() : "";


                    var sr = new iffsServiceRequestDetail
                    {
                        HeaderId = serviceRequestHeaderId,
                        OperationTypeId = operationTypeId,
                        CommodityTypeId = commodityTypeId == 0 ? null : commodityTypeId,
                        Volume = volume,
                        Weight = weight,
                        Pcs = pcs,
                        ContainerTypeId = containerTypeId,
                        POE = poe,
                        POD = pod,
                        Description=description,
                        TareWeight=tareWeight
                    };


                    _serviceRequestDetails.AddNew(sr);
                    _context.SaveChanges();
                }

                
            }
            else if (action == "Edit")
            {
                _serviceRequestDetails.Delete(s => s.HeaderId == serviceRequestHeaderId);
                for (int i = 0; i < serviceRequestDetails.Count(); i++)
                {
                    var row = serviceRequestDetails[i].Split(new[] { ':' });
                    var operationTypeId = int.Parse(row[0]);
                    int? commodityTypeId = int.Parse(row[1]);
                    decimal volume = Convert.ToDecimal(row[2].ToString());
                    decimal weight = Convert.ToDecimal(row[3].ToString());
                    var pcs = row[4].ToString();
                    var containerTypeId = int.Parse(row[5]);
                    var poe = row[6].ToString();
                    var pod = row[7].ToString();
                    var description = row[8] != null && row[8] != "undefined" ? row[8].ToString() : "";
                    var tareWeight = row[9] != null && row[9] != "undefined" ? row[9].ToString() : "";



                    var sr = new iffsServiceRequestDetail
                    {
                        HeaderId = serviceRequestHeaderId,
                        OperationTypeId = operationTypeId,
                        CommodityTypeId = commodityTypeId == 0 ? null : commodityTypeId,
                        Volume = volume,
                        Weight = weight,
                        Pcs = pcs,
                        ContainerTypeId = containerTypeId,
                        POE = poe,
                        POD = pod,
                        Description = description,
                        TareWeight = tareWeight
               
                
                    };


                    _serviceRequestDetails.AddNew(sr);
                    _context.SaveChanges();
                }

               
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
        #endregion

    }
}