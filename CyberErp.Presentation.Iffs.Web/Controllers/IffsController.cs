using CyberErp.Business.Component.Iffs;
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
using System.Web.Script.Serialization;

namespace CyberErp.Presentation.Iffs.Web.Controllers
{
    public class IffsController : DirectController
    {
        #region Member

        private readonly DbContext _context;
        private readonly Lookups _lookup;
        private readonly BaseModel<iffsService> _service;
        private readonly BaseModel<iffsCustomer> _customer;
        private readonly BaseModel<hrmsEmployee> _employee;
        private readonly BaseModel<iffsServiceRequest> _serviceRequest;
        private readonly BaseModel<iffsTermsAndConditionsTemplate> _termsAndConditionsTemplate;
        private readonly BaseModel<iffsQuotationTemplate> _quotationTemplate;
        private readonly BaseModel<iffsServiceRate> _serviceRate;
        private readonly BaseModel<iffsQuotationHeader> _quotationHeader;
        private readonly BaseModel<iffsJobOrderHeader> _jobOrder;
        private readonly BaseModel<iffsRoleSetting> _iffsRoleSetting;
        
        private readonly BaseModel<coreUser> _users;
        private readonly BaseModel<coreRole> _role;
        private readonly BaseModel<iffsServiceRequestDetail> _serviceRequestDetail;
        private readonly BaseModel<iffsQuotationDetail> _quotationDetail;
        #endregion

        #region Constructor

        public IffsController()
        {
            _context = new ErpEntities(Constants.ConnectionString);
            _lookup = new Lookups(_context);
            _service = new BaseModel<iffsService>(_context);
            _employee = new BaseModel<hrmsEmployee>(_context);
            _serviceRequest = new BaseModel<iffsServiceRequest>(_context);
            _termsAndConditionsTemplate = new BaseModel<iffsTermsAndConditionsTemplate>(_context);
            _quotationTemplate = new BaseModel<iffsQuotationTemplate>(_context);
            _serviceRate = new BaseModel<iffsServiceRate>(_context);
            _customer = new BaseModel<iffsCustomer>(_context);
            _jobOrder = new BaseModel<iffsJobOrderHeader>(_context);
            _quotationHeader = new BaseModel<iffsQuotationHeader>(_context);
            _iffsRoleSetting = new BaseModel<iffsRoleSetting>(_context);
            _users = new BaseModel<coreUser>(_context);
            _role = new BaseModel<coreRole>(_context);
            _serviceRequestDetail = new BaseModel<iffsServiceRequestDetail>(_context);
            _quotationDetail = new BaseModel<iffsQuotationDetail>(_context);
            
        }

        #endregion

        #region Lookups

        private ActionResult GetAll(string table)
        {
            var lookup = _lookup.GetAll(table).OrderBy(l => l.Code);
            var result = new
            {
                total = lookup.Count(),
                data = lookup
            };
            return this.Json(result);
        }
        public ActionResult GetCustomerGroup()
        {
            return GetAll(Lookups.LupCustomerGroup);
        }
        public ActionResult GetCurrency()
        {
            return GetAll(Lookups.LupCurrency);
        }
        public ActionResult GetServiceUnitType()
        {
            return GetAll(Lookups.LupServiceUnitType);
        }
        public ActionResult GetOperationType()
        {
            return GetAll(Lookups.LupOperationType);
        }
        public ActionResult GetOperationStatusCategory()
        {
            return GetAll(Lookups.LupOperationStatusCategory);
        }
        public ActionResult GetDataTypes()
        {
            return GetAll(Lookups.LupDataType);
        }
        public ActionResult GetCommodityType()
        {
            return GetAll(Lookups.LupCommodityType);
        }
        public ActionResult GetContainerType()
        {
            return GetAll(Lookups.LupContainerType);
        }
        public ActionResult GetPOE()
        {
            return GetAll(Lookups.LupPOE);
        }
        public ActionResult GetSizeUnitType()
        {
            return GetAll(Lookups.LupSizeUnitType);
        }
        public ActionResult GetWeightUnitType()
        {
            return GetAll(Lookups.LupWeightUnitType);
        }
        public ActionResult GetRemainingDocType()
        {
            return GetAll(Lookups.LupDocumentType);
        }
        public ActionResult GetExpenseTypes()
        {
            return GetAll(Lookups.LupExpenseType);
        }
        public ActionResult GetPortOfOrigin()
        {
            return GetAll(Lookups.LupPOO);
        }
        public ActionResult GetPortOfDestination()
        {
            return GetAll(Lookups.LupPOD);
        }
        public ActionResult GetLoadingPort()
        {
            return GetAll(Lookups.LupLoadingPort);
        }
        public ActionResult GetOperationOpeningLocation()
        {
            return GetAll(Lookups.LupOperationOpeningLocation);
        }

        #endregion

        #region Actions

        
        public ActionResult GetService()
        {
            var records = _service.GetAll();
            var services = records.Select(record => new
            {
                record.Id,
                record.Name,
                record.Code

            }).Cast<object>().ToList();
            var result = new
            {
                total = records.Count(),
                data = services
            };
            return this.Json(result);
        }
        public ActionResult GetPagedService(int start, int limit, string sort, string dir, string param)
        {
            var ht = JsonConvert.DeserializeObject<Hashtable>(param);
            var searchText = ht["searchText"] != null ? ht["searchText"].ToString() : "";
            DateTime date = new DateTime();
            bool isDatestring = DateTime.TryParse(searchText, out date);
            var records = _service.GetAll();
            records = searchText != "" ? records.Where(p => p.Name.ToUpper().Contains(searchText.ToUpper()) ||
                p.Code.ToUpper().Contains(searchText.ToUpper())) : records;


            switch (sort)
            {
                case "Name":
                    records = dir == "ASC" ? records.OrderBy(u => u.Name) : records.OrderByDescending(u => u.Name);
                    break;
                case "Code":
                    records = dir == "ASC" ? records.OrderBy(u => u.Code) : records.OrderByDescending(u => u.Code);
                    break;
            }
            var count = records.Count();
            records = records.Skip(start).Take(limit);

            var services = records.Select(record => new
            {
                record.Id,
                record.Name,
                record.Code

            }).Cast<object>().ToList();
            var result = new
            {
                total = count,
                data = services
            };
            return this.Json(result);
        }
        public ActionResult GetPagedCustomers(int start, int limit, string sort, string dir, string param)
        {
            var ht = JsonConvert.DeserializeObject<Hashtable>(param);
            var searchText = ht["searchText"] != null ? ht["searchText"].ToString() : "";
            DateTime date = new DateTime();
            bool isDatestring = DateTime.TryParse(searchText, out date);
            var records = _customer.GetAll().AsQueryable();
            records = searchText != "" ? records.Where(p => p.Name.ToUpper().Contains(searchText.ToUpper()) ||
                p.Code.ToUpper().Contains(searchText.ToUpper()) ||
                p.iffsLupCustomerGroup.Name.ToUpper().Contains(searchText.ToUpper())
               ) : records;


            switch (sort)
            {
                case "Name":
                    records = dir == "ASC" ? records.OrderBy(u => u.Name) : records.OrderByDescending(u => u.Name);
                    break;
                case "Code":
                    records = dir == "ASC" ? records.OrderBy(u => u.Code) : records.OrderByDescending(u => u.Code);
                    break;
                case "CustomerGroup":
                    records = dir == "ASC" ? records.OrderBy(u => u.iffsLupCustomerGroup.Name) : records.OrderByDescending(u => u.iffsLupCustomerGroup.Name);
                    break;
            }
            var count = records.Count();
            records = records.OrderBy(o => o.Id).Skip(start).Take(limit);

            var customers = records.Select(customer => new
            {
                customer.Id,
                customer.Name,
                customer.Code,
                CustomerGroup = customer.iffsLupCustomerGroup.Name,
                customer.CustomerGroupId,
            }).ToList();
            var result = new
            {
                total = count,
                data = customers
            };
            return this.Json(result);

        }
        public DirectResult GetCustomer(object query)
        {
            var ht = JsonConvert.DeserializeObject<Hashtable>(query.ToString());
            var quarystring = ""; var start = 0; var limit = 0; long ItemId = 0;
            if (ht != null && ht["query"] != null)
                quarystring = ht["query"].ToString();
            if (ht != null && ht["start"] != null)
                start = int.Parse(ht["start"].ToString());
            if (ht != null && ht["limit"] != null)
                limit = int.Parse(ht["limit"].ToString());
            var records = _customer.GetAll();
            if (quarystring != "")
                records = records.Where(o => o.Name.ToUpper().Contains(quarystring.ToUpper()) || o.Code.ToUpper().Contains(quarystring.ToUpper()));
            var count = records.Count();
            records = records.Skip(start).Take(limit);
            var Items = records.Select(item => new
            {
                item.Id,
                Name = item.Name,
                item.Code,
                CustomerGroup = item.iffsLupCustomerGroup.Name,
                item.CustomerGroupId,
            }).ToList();
            var result = new
            {
                total = count,
                data = Items
            };
            return this.Json(result);

        }
        public DirectResult GetCustomers()
        {
            var filtered = _customer.GetAll().Where(o => !o.IsDeleted);
            var count = filtered.Count();
            var customers = filtered.Select(record => new
            {
                record.Id,
                record.Name,
                record.Code,
                CustomerGroup = record.iffsLupCustomerGroup.Name
            });
            var result = new
            {
                total = count,
                data = customers
            };
            return Json(result);
        }

        public DirectResult GetQuotationsByJobOrder(string jobOrderIds)
        {
            var jobOrderId=0;
            var jobOrderIdCollection = jobOrderIds.Split(new[] { ',' });
            var records = _quotationHeader.GetAll().AsQueryable().Where(q => q.ApprovedById != null);
          
            for (var i = 0; i < jobOrderIdCollection.Count(); i++)
            {
                int.TryParse(jobOrderIdCollection[i], out jobOrderId);
                records = records.Where(q => q.ApprovedById != null && q.iffsJobOrderQuotation.Where(f => f.JobOrderId == jobOrderId).Any());
       
            }
             
            var count = records.Count();
            records = records.OrderBy(o => o.QuotationNo);
            var quotations = records.Select(item => new
            {
                item.Id,
                Name=item.QuotationNo
            }).ToList();

            return this.Json(new
            {
                total = count,
                data = quotations
            });
        }
      
        public DirectResult GetQuotations(object queryParam)
        {
            var hashtable = JsonConvert.DeserializeObject<Hashtable>(JsonConvert.SerializeObject(queryParam));
            int start=0, limit=0,jobOrderId=0;var query="";
            if (hashtable["start"]!=null)
            int.TryParse(hashtable["start"].ToString(), out start);
            if (hashtable["limit"] != null)
            int.TryParse(hashtable["limit"].ToString(), out limit);
              if (hashtable["limit"] != null)
             query = hashtable["query"].ToString();
              if (hashtable["jobOrderId"] != null)
                  int.TryParse(hashtable["jobOrderId"].ToString(), out jobOrderId);
         
            //Get only approved quotations
            var records = _quotationHeader.GetAll().AsQueryable().Where(q=>q.ApprovedById != null && q.QuotationNo.ToUpper().Contains(query.ToUpper())); 
             if(jobOrderId>0)
             {
                 records = records.Where(o => o.iffsJobOrderQuotation.Where(f => f.JobOrderId == jobOrderId).Any());
             }
            var count = records.Count();
            records = records.OrderBy(o=>o.QuotationNo).Skip(start).Take(limit);
            var quotations = records.Select(item => new
            {
                item.Id,
                item.QuotationNo
            }).ToList();

            return this.Json(new
            {
                total = count,
                data = quotations
            });
        }
        public DirectResult GetApprovedQuotations(object queryParam)
        {
            var hashtable = JsonConvert.DeserializeObject<Hashtable>(JsonConvert.SerializeObject(queryParam));
            int start, limit;
            int.TryParse(hashtable["start"].ToString(), out start);
            int.TryParse(hashtable["limit"].ToString(), out limit);
            var query = hashtable["query"].ToString();

            //Get only approved quotations
            var records = _quotationHeader.GetAll().Where(q=>q.ApprovedById != null && q.QuotationNo.ToUpper().Contains(query.ToUpper())); 
            var count = records.Count();
            records = records.Skip(start).Take(limit);
            var quotations = records.Select(item => new
            {
                item.Id,
                item.QuotationNo
            }).ToList();

            return this.Json(new
            {
                total = count,
                data = quotations
            });
        }
        public DirectResult GetEmployees(object query)
        {
            var ht = JsonConvert.DeserializeObject<Hashtable>(query.ToString());
            var quarystring = ""; var start = 0; var limit = 0; long ItemId = 0;
            if (ht != null && ht["query"] != null)
                quarystring = ht["query"].ToString();
            if (ht != null && ht["start"] != null)
                start = int.Parse(ht["start"].ToString());
            if (ht != null && ht["limit"] != null)
                limit = int.Parse(ht["limit"].ToString());
            var records = _employee.GetAll().AsQueryable();
            if (quarystring != "")
                records = records.Where(o => o.corePerson.FirstName.ToUpper().Contains(quarystring.ToUpper()) || o.corePerson.FatherName.ToUpper().Contains(quarystring.ToUpper()));
            var count = records.Count();
            records = records.OrderBy(o => o.Id).Skip(start).Take(limit);
            var Items = records.Select(item => new
            {
                item.Id,
                FullName = item.corePerson.FirstName + " " + item.corePerson.FatherName,
            }).ToList();
            var result = new
            {
                total = count,
                data = Items
            };
            return this.Json(result);

        }
        public DirectResult GetServiceRequest(object query)
        {
            var ht = JsonConvert.DeserializeObject<Hashtable>(query.ToString());
            var quarystring = ""; var start = 0; var limit = 0; long ItemId = 0;
            if (ht != null && ht["query"] != null)
                quarystring = ht["query"].ToString();
            if (ht != null && ht["start"] != null)
                start = int.Parse(ht["start"].ToString());
            if (ht != null && ht["limit"] != null)
                limit = int.Parse(ht["limit"].ToString());
            var records = _serviceRequest.GetAll().AsQueryable();
            if (quarystring != "")
                records = records.Where(o => o.RequestNo.ToUpper().Contains(quarystring.ToUpper()) || o.iffsCustomer.Name.ToUpper().Contains(quarystring.ToUpper()) || o.iffsCustomer.Code.ToUpper().Contains(quarystring.ToUpper()));
            var count = records.Count();
            records = records.OrderBy(o => o.Id).Skip(start).Take(limit);
            var Items = records.Select(item => new
            {
                item.Id,
                Name = item.iffsCustomer.Name + " " + item.RequestNo,
                Customer = item.iffsCustomer.Name,
                item.CustomerId,
                item.iffsCustomer.CustomerGroupId,
                CustomerGroup = item.iffsCustomer.iffsLupCustomerGroup.Name,
            }).ToList();
            var result = new
            {
                total = count,
                data = Items
            };
            return this.Json(result);

        }
        public ActionResult GetPagedTermsAndConditionsTemplate(int start, int limit, string sort, string dir, string param)
        {
            var ht = JsonConvert.DeserializeObject<Hashtable>(param);
            var searchText = ht["searchText"] != null ? ht["searchText"].ToString() : "";
            DateTime date = new DateTime();
            bool isDatestring = DateTime.TryParse(searchText, out date);
            var records = _termsAndConditionsTemplate.GetAll();
            records = searchText != "" ? records.Where(p => p.Description.ToUpper().Contains(searchText.ToUpper()) ||
                p.Title.ToUpper().Contains(searchText.ToUpper())
               ) : records;
            switch (sort)
            {
                case "Title":
                    records = dir == "ASC" ? records.OrderBy(u => u.Title) : records.OrderByDescending(u => u.Title);
                    break;
                case "Description":
                    records = dir == "ASC" ? records.OrderBy(u => u.Description) : records.OrderByDescending(u => u.Description);
                    break;
            }
            var count = records.Count();
            records = records.Skip(start).Take(limit);

            var customers = records.Select(customer => new
            {
                customer.Id,
                customer.Title,
                customer.Description
            }).Cast<object>().ToList();
            var result = new
            {
                total = count,
                data = customers
            };
            return this.Json(result);

        }
        public ActionResult GetAllServiceTemplateWithRate(int start, int limit, string sort, string dir, string param)
        {
            var hashtable = JsonConvert.DeserializeObject<Hashtable>(param);
            var searchText = hashtable["searchText"].ToString();

            int operationTypeId = 0,quotationId=0;
            if (hashtable["operationTypeId"] != null)
                int.TryParse(hashtable["operationTypeId"].ToString(), out operationTypeId);
            if (hashtable["quotationId"] != null)
                int.TryParse(hashtable["quotationId"].ToString(), out quotationId);
            
         if(quotationId==0)
         {
             var records = _serviceRate.GetAll().AsQueryable().Where(o => o.OperationTypeId == operationTypeId);

             records = searchText != "" ? records.Where(p => p.iffsService.Name.ToUpper().Contains(searchText.ToUpper()) ||
                 p.iffsLupServiceUnitType.Name.ToUpper().Contains(searchText.ToUpper()) ||
                 p.iffsLupCurrency.Name.ToUpper().Contains(searchText.ToUpper()) ||
                 p.Rate.ToString().Equals(searchText.ToUpper())) : records;

             switch (sort)
             {
                 case "ServiceUnitType":
                     records = dir == "ASC" ? records.OrderBy(u => u.iffsLupServiceUnitType.Name) : records.OrderByDescending(u => u.iffsLupServiceUnitType.Name);
                     break;
                 case "Currency":
                     records = dir == "ASC" ? records.OrderBy(u => u.iffsLupCurrency.Name) : records.OrderByDescending(u => u.iffsLupCurrency.Name);
                     break;
                 case "Rate":
                     records = dir == "ASC" ? records.OrderBy(u => u.Rate) : records.OrderByDescending(u => u.Rate);
                     break;
                 default:
                     records = dir == "ASC" ? records.OrderBy(u => u.iffsService.Name) : records.OrderByDescending(u => u.iffsService.Name);
                     break;

             }
             var count = records.Count();
             records = records.Skip(start).Take(limit);
             var serviceRates = records.Select(record => new
             {
                 record.Id,
                 record.OperationTypeId,
                 record.ServiceId,
                 record.iffsService.IsTaxable,
                 OperationType = record.iffsLupOperationType.Name,
                 Service = record.iffsService.Name,
                 Quantity=0,
                 CurrencyId = record.CurrencyId,
                 Currency = record.iffsLupCurrency.Name,
                 ServiceUnitTypeId = record.ServiceUnitTypeId,
                 ServiceUnitType = record.iffsLupServiceUnitType.Name,
                 ServiceDescription = record.iffsService.Description,
                 record.ComparingSign,
                 record.Description,
                 Rate = record.Rate
             }).ToList();
             var result = new { total = count, data = serviceRates };
             return this.Json(result);
         }else
         {
             var records = GetAllQuotationServiceWithRate(operationTypeId, quotationId, searchText, start, limit, sort, dir);
             var result = new { total = records.Count, data = records };
             return this.Json(result);
         }

        }
        public IList GetAllQuotationServiceWithRate(int operationTypeId, int quotationId, string searchText,int start, int limit, string sort, string dir)
        {
           

            var records =_quotationDetail.GetAll().AsQueryable().Where(o =>o.QuotationId==quotationId && o.OperationTypeId == operationTypeId);

            records = searchText != "" ? records.Where(p => p.iffsService.Name.ToUpper().Contains(searchText.ToUpper()) ||
                p.iffsLupServiceUnitType.Name.ToUpper().Contains(searchText.ToUpper()) ||
                p.iffsLupCurrency.Name.ToUpper().Contains(searchText.ToUpper()) ||
                p.UnitPrice.ToString().Equals(searchText.ToUpper())) : records;

            switch (sort)
            {
                case "ServiceUnitType":
                    records = dir == "ASC" ? records.OrderBy(u => u.iffsLupServiceUnitType.Name) : records.OrderByDescending(u => u.iffsLupServiceUnitType.Name);
                    break;
                case "Currency":
                    records = dir == "ASC" ? records.OrderBy(u => u.iffsLupCurrency.Name) : records.OrderByDescending(u => u.iffsLupCurrency.Name);
                    break;
                case "Rate":
                    records = dir == "ASC" ? records.OrderBy(u => u.UnitPrice) : records.OrderByDescending(u => u.UnitPrice);
                    break;
                default:
                    records = dir == "ASC" ? records.OrderBy(u => u.iffsService.Name) : records.OrderByDescending(u => u.iffsService.Name);
                    break;

            }
            var count = records.Count();
            records = records.Skip(start).Take(limit);
            var serviceRates = records.Select(record => new
            {
                record.Id,
                record.OperationTypeId,
                record.ServiceId,
                record.iffsService.IsTaxable,
                record.ComparingSign,
                record.Quantity,
                OperationType = record.iffsLupOperationType.Name,
                Service = record.iffsService.Name,
                CurrencyId = record.CurrencyId,
                Currency = record.iffsLupCurrency.Name,
                ServiceUnitTypeId = record.ServiceUnitTypeId,
                ServiceUnitType = record.iffsLupServiceUnitType.Name,
                ServiceDescription = record.iffsService.Description,
                Description=record.ServiceDescription,
                Rate = record.UnitPrice
            }).ToList();
            return serviceRates;
        }
   
        public ActionResult GetUsers(int start, int limit, string sort, string dir, string record)
        {
            var hashtable = JsonConvert.DeserializeObject<Hashtable>(record);

            var filtered = _users.GetAll();

            var count = filtered.Count();
            filtered = filtered.Skip(start).Take(limit);
            var users = filtered.Select(item => new
            {
                item.Id,
                item.FirstName,
                item.LastName,
                item.UserName,
                Role = ""
            }).Cast<object>().ToList();
            var result = new { total = count, data = users };
            return this.Json(result);
        }
        public DirectResult GetRoles(object query)
        {
            var ht = JsonConvert.DeserializeObject<Hashtable>(query.ToString());
            var quarystring = ""; var start = 0; var limit = 0; long ItemId = 0;
            if (ht != null && ht["query"] != null)
                quarystring = ht["query"].ToString();
            if (ht != null && ht["start"] != null)
                start = int.Parse(ht["start"].ToString());
            if (ht != null && ht["limit"] != null)
                limit = int.Parse(ht["limit"].ToString());
            var records = _role.GetAll().AsQueryable();
            if (quarystring != "")
                records = records.Where(o => o.Name.ToUpper().Contains(quarystring.ToUpper()) );
            var count = records.Count();
            records = records.OrderBy(o => o.Id).Skip(start).Take(limit);
            var Items = records.Select(item => new
            {
                item.Id,
                item.Name
            }).ToList();
            var result = new
            {
                total = count,
                data = Items
            };
            return this.Json(result);

        }
        public DirectResult GetRoleSettings()
        {
            var records = _iffsRoleSetting.GetAll();
            var count = records.Count();

            var roles = records.Select(record => new
            {
                record.Id,
                record.RoleId,
                record.coreRole.Name,
                record.coreRole.Code
            });

            var result = new
            {
                total = count,
                data = roles
            };

            return this.Json(result);
        }

        public ActionResult GetApprovedJobOrders()
        {
            var filtered = _jobOrder.GetAll().Where(o => o.ApprovedById != null);

            var count = filtered.Count();

            var result = new { total = count, success = true };

            return this.Json(result);
        }
        public DirectResult GetDocumentType(int start, int limit, string sort, string dir, string param)
        {
            var ht = JsonConvert.DeserializeObject<Hashtable>(param);
            var searchText = ht["searchText"] != null ? ht["searchText"].ToString() : "";                      
            var records = _lookup.GetAll(Lookups.LupDocumentType);
            if (searchText != "")
                records = records.Where(o => o.Name.ToUpper().Contains(searchText.ToUpper()) || o.Code.ToUpper().Contains(searchText.ToUpper()));
            var count = records.Count();
            records = records.Skip(start).Take(limit);
            var Items = records.Select(item => new
            {
                item.Id,
                Name = item.Name,
                item.Code,
            }).ToList();
            var result = new
            {
                total = count,
                data = Items
            };
            return this.Json(result);

        }
        public DirectResult GetServiceRequestDetail(int start, int limit, string sort, string dir, string param)
        {
            var ht = JsonConvert.DeserializeObject<Hashtable>(param);
            var searchText = ht["searchText"] != null ? ht["searchText"].ToString() : "";
            int serviceRequestId=0;
           if(  ht["serviceRequestId"] != null )
                 int.TryParse( ht["serviceRequestId"].ToString(),out serviceRequestId);

           var records = _serviceRequestDetail.GetAll().AsQueryable().Where(o => o.HeaderId == serviceRequestId);
            if (searchText != "")
                records = records.Where(o => o.iffsLupOperationType.Name.ToUpper().Contains(searchText.ToUpper()) ||
                                             o.iffsLupContainerType.Name.ToUpper().Contains(searchText.ToUpper())||
                                             o.iffsLupCommodityType.Name.ToUpper().Contains(searchText.ToUpper()) 
                                     );
            var count = records.Count();
            records = records.OrderBy(o=>o.Id).Skip(start).Take(limit);
            var Items = records.Select(item => new
            {
                item.Id,
                OperationType = item.iffsLupOperationType.Name,
                CommodityType=item.iffsLupCommodityType.Name,
                ContainerType=item.iffsLupContainerType.Name,
                item.Pcs,
                item.POD,
                item.POE,
                
                item.Volume
            }).ToList();
            var result = new
            {
                total = count,
                data = Items
            };
            return this.Json(result);

        }
        public DirectResult GetServiceRequestOpeation(int serviceRequestId)
        {
           
            var records = _serviceRequestDetail.GetAll().AsQueryable().Where(o => o.HeaderId == serviceRequestId);
             var Items = records.Select(item => new
            {
                ServiceRequestDetailId=item.Id,
                Id=item.OperationTypeId,
                Name = item.Description != null ? item.iffsLupOperationType.Name + " " + item.Description : item.iffsLupOperationType.Name,
                item.CommodityTypeId,              
                ContainerType =item.ContainerTypeId.HasValue? item.iffsLupContainerType.Name:"",
            }).ToList();
            var result = new
            {
                 data = Items
            };
            return this.Json(result);

        }



       
        #endregion

        #region Common Methods 

        public int GetCurrentUserEmployeeId()
        {
            int employeeId = 0;
            var objUser = (coreUser)Session[Constants.CurrentUser];
            if (objUser != null && objUser.EmployeeId != null)
            {
                employeeId = (int)objUser.EmployeeId;
            }
            return employeeId;
        }

        #endregion
    }
}
