using CyberErp.Data.Model;
using CyberErp.Presentation.Iffs.Web.Classes;
using Ext.Direct.Mvc;
using Newtonsoft.Json;
using SwiftTederash.Business;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Data.Entity;
using System.IO;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.Mvc;
using System.Web.UI;
using System.Xml;
using System.Xml.Serialization;

namespace CyberErp.Presentation.Iffs.Web.Controllers
{
    public class CustomerController : DirectController
    {
        #region Members

        private readonly DbContext _context;
        private readonly BaseModel<iffsCustomer> _customer;
        private readonly BaseModel<iffsDocumentNoSetting> _documentNoSetting;
        #endregion

        #region Constructor

        public CustomerController()
        {
            _context = new ErpEntities(Constants.ConnectionString);
            _customer = new BaseModel<iffsCustomer>(_context);
            _documentNoSetting = new BaseModel<iffsDocumentNoSetting>(_context);
        }

        #endregion

        #region Actions

        public ActionResult Get(int id)
        {
            var objCustomer = _customer.Get(c=>c.Id == id);
            
            var customer = new
            {
                objCustomer.Id,
                objCustomer.CustomerGroupId,
                objCustomer.Name,
                objCustomer.Code,
                objCustomer.TinNo,
                objCustomer.Address,
                objCustomer.Email,
                objCustomer.Telephone
            };
            return this.Json(new
            {
                success = true,
                data = customer
            });
        }

        public ActionResult GetAll(int start, int limit, string sort, string dir, string param)
        {
            var hashtable = JsonConvert.DeserializeObject<Hashtable>(param);
            var searchText = hashtable["searchText"].ToString();

            var records = _customer.GetAll();
            records = searchText != "" ? records.Where(p => p.iffsLupCustomerGroup.Name.ToUpper().Contains(searchText.ToUpper()) ||
                p.Name.ToUpper().Contains(searchText.ToUpper()) ||
                p.Code.ToUpper().Contains(searchText.ToUpper()) ||
                (p.TinNo == null ? false : p.TinNo.ToUpper().Contains(searchText.ToUpper()))||
                (p.Email == null ? false : p.Email.ToUpper().Contains(searchText.ToUpper())) ||
                (p.Telephone == null ? false : p.Telephone.ToUpper().Contains(searchText.ToUpper())) ||
                (p.Address == null ? false : p.Address.ToUpper().Contains(searchText.ToUpper()))) : records;

            if (sort == "CustomerGroup")
            {
                records = dir == "ASC" ? records.OrderBy(r => r.iffsLupCustomerGroup.Name) : records.OrderByDescending(r=>r.iffsLupCustomerGroup.Name);
            }
            else
            {
                records = dir == "ASC" ? records.OrderBy(r => r.GetType().GetProperty(sort).GetValue(r, null)) : records.OrderByDescending(r => r.GetType().GetProperty(sort).GetValue(r, null));
            }

            var count = records.Count();

            records = records.Skip(start).Take(limit);
            var customers = records.Select(record => new
            {
                record.Id,
                record.CustomerGroupId,
                CustomerGroup = record.iffsLupCustomerGroup.Name,
                record.Name,
                record.Code,
                record.TinNo,
                record.Address,
                record.Email,
                record.Telephone

            }).Cast<object>().ToList();
            var result = new { total = count, data = customers };
            return this.Json(result);
        }

        [FormHandler]
        public ActionResult Save(iffsCustomer customer)
        {
            
            if (customer.Id.Equals(0))
            {
                customer.Code = GetDocumentNumber("Customer");
                _customer.AddNew(customer);
                UpdateDocumentNumber("Service Request");
            }
            else
            {
                _customer.Edit(customer);
            }
            return this.Json(new { success = true,customerId=customer.Id, data = "Data has been saved successfully!" });
        }

        public ActionResult Delete(int id)
        {
            try
            {
                _customer.Delete(c=>c.Id == id);
                
                return this.Json(new { success = true, data = "record has been successfully deleted!" });
            }
            catch (Exception)
            {
                return this.Json(new { success = false, data = "Could not delete the selected record!" });
            }
        }

        public void ExportToExcel()
        {
            var searchText = Request.QueryString["st"];

            var records = _customer.GetAll();
            records = searchText != "" ? records.Where(p => p.iffsLupCustomerGroup.Name.ToUpper().Contains(searchText.ToUpper()) ||
                p.Name.ToUpper().Contains(searchText.ToUpper()) ||
                p.Code.ToUpper().Contains(searchText.ToUpper()) ||
                (p.TinNo == null ? false : p.TinNo.ToUpper().Contains(searchText.ToUpper())) ||
                p.Email.ToUpper().Contains(searchText.ToUpper()) ||
                p.Telephone.ToUpper().Contains(searchText.ToUpper()) ||
                p.Address.ToUpper().Contains(searchText.ToUpper())) : records;

            var customers = records.Select(record => new
            {
                record.Id,
                record.CustomerGroupId,
                CustomerGroup = record.iffsLupCustomerGroup.Name,
                record.Name,
                record.Code,
                record.TinNo,
                record.Address,
                record.Email,
                record.Telephone

            }).Cast<object>().ToList();

            var exportToExcelHelper = new ExportToExcelHelper();
            exportToExcelHelper.ToExcel(Response, customers);
        }

        public string GetDocumentNumber(string documentType)
        {
            try
            {
                var objDocumentNoSetting = _documentNoSetting.GetAll().Where(o => o.DocumentType == documentType).FirstOrDefault();
                var format = GetDocumentFormat(objDocumentNoSetting.NoOfDigit);
                var documentNo = string.Format(format, objDocumentNoSetting.CurrentNo);
                documentNo = objDocumentNoSetting.Prefix + "-" + documentNo;
                
                return documentNo;
            }
            catch (Exception e)
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
        #endregion  
    }
}
