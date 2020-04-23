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
using System.Web;
using System.Web.Mvc;

namespace CyberErp.Presentation.Iffs.Web.Controllers
{
    public class ServiceAgreementController : DirectController
    {
        #region Members

        private readonly DbContext _context;
        private readonly BaseModel<iffsServiceAgreement> _serviceAgreement;

        #endregion

        #region Constructor

        public ServiceAgreementController()
        {
            _context = new ErpEntities(Constants.ConnectionString);
            _serviceAgreement = new BaseModel<iffsServiceAgreement>(_context);
            
        }

        #endregion

        #region Actions

        public ActionResult Get(int id)
        {
            var objServiceAgreement = _serviceAgreement.Get(u => u.Id == id);

            var serviceAgreement = new
            {
                objServiceAgreement.Id,
                objServiceAgreement.AgreementNo,
                objServiceAgreement.Date,
                objServiceAgreement.CustomerId,
                objServiceAgreement.QuotationId,
                objServiceAgreement.AgreementFile,
                objServiceAgreement.Remark
            };

            return this.Json(new
            {
                success = true,
                data = serviceAgreement
            });
        }

        public ActionResult GetAll(int start, int limit, string sort, string dir, string param)
        {
            var hashtable = JsonConvert.DeserializeObject<Hashtable>(param);
            var searchText = hashtable["searchText"].ToString();

            var records = _serviceAgreement.GetAll();
            records = searchText != "" ? records.Where(p => p.iffsCustomer.Name.ToUpper().Contains(searchText.ToUpper()) ||
                (p.iffsQuotationHeader == null ? false : p.iffsQuotationHeader.QuotationNo.ToUpper().Contains(searchText.ToUpper())) ||
                p.AgreementFile.ToUpper().Contains(searchText.ToUpper()) ||
                p.Remark.ToUpper().Contains(searchText.ToUpper()) ) : records;

            if (sort == "Customer")
            {
                records = dir == "ASC" ? records.OrderBy(r => r.iffsCustomer.Name) : records.OrderByDescending(r => r.iffsCustomer.Name);
            }
            else if (sort == "Quotation")
            {
                records = dir == "ASC" ? records.OrderBy(r => r.iffsQuotationHeader.QuotationNo) : records.OrderByDescending(r => r.iffsQuotationHeader.QuotationNo);
            }
            else
            {
                records = dir == "ASC" ? records.OrderBy(r => r.GetType().GetProperty(sort).GetValue(r, null)) : records.OrderByDescending(r => r.GetType().GetProperty(sort).GetValue(r, null));
            }

            var count = records.Count();
            records = records.Skip(start).Take(limit);

            var serviceAgreements = records.Select(item => new
            {
                item.Id,
                item.AgreementNo,
                Date = String.Format("{0:MMMM dd, yyyy}", item.Date),
                item.CustomerId,
                Customer = item.iffsCustomer.Name,
                item.QuotationId,
                Quotation = item.iffsQuotationHeader == null ? "" : item.iffsQuotationHeader.QuotationNo,
                item.AgreementFile,
                item.Remark
            }).Cast<object>().ToList();
            var result = new
            {
                total = count,
                data = serviceAgreements
            };
            return this.Json(result);
        }

        [FormHandler]
        public ActionResult Upload(iffsServiceAgreement serviceAgreement)
        {
            try
            {
                string[] supportedTypes = new string[] { "png", "jpg", "jpeg", "pdf", "doc", "docx", "xls", "xlsx" };
                for (int i = 0; i < Request.Files.Count; i++)
                {
                    HttpPostedFileBase postedFile = Request.Files[i];
                    string fileExtension = Path.GetExtension(postedFile.FileName);
                    string fileName = System.IO.Path.GetFileName(postedFile.FileName);
                    string newFileName = serviceAgreement.Id + "_" + GuidEncoder.Encode(Guid.NewGuid()) + fileExtension;
                    if (postedFile != null)
                    {
                        if (supportedTypes.Contains(fileExtension.TrimStart('.').ToLower()))
                        {
                            string appPath = HttpContext.Request.ApplicationPath;
                            string physicalPath = HttpContext.Request.MapPath(appPath);
                            string saveLocation = physicalPath + "\\Upload\\ServiceAgreement\\" + newFileName;
                            postedFile.SaveAs(saveLocation);

                            _serviceAgreement.AddNew(new iffsServiceAgreement
                            {
                                AgreementNo = serviceAgreement.AgreementNo,
                                Date = serviceAgreement.Date,
                                CustomerId = serviceAgreement.CustomerId,
                                QuotationId = serviceAgreement.QuotationId == 0 ? null : serviceAgreement.QuotationId,
                                AgreementFile = newFileName,
                                Remark = serviceAgreement.Remark
                            });
                        }
                    }
                }
                return this.Json(new { success = true, data = "Service Agreement has been saved successfully." });
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

                var objServiceAgreement = _serviceAgreement.Get(d => d.Id == id);
                if (objServiceAgreement != null)
                {
                    string appPath = HttpContext.Request.ApplicationPath;
                    string physicalPath = HttpContext.Request.MapPath(appPath);
                    string fullPath = physicalPath + "\\Upload\\ServiceAgreement\\" + objServiceAgreement.AgreementFile;
                    System.IO.File.Delete(fullPath);
                }
                _serviceAgreement.Delete(u => u.Id == id);

                return this.Json(new { success = true, data = "Service Agreement has been deleted successfully!" });
            }
            catch (System.Exception ex)
            {
                return this.Json(new { success = false, data = ex.InnerException != null ? ex.InnerException.Message : ex.Message });
            }
        }

        public void ExportToExcel()
        {
            var searchText = Request.QueryString["st"];

            var records = _serviceAgreement.GetAll();
            records = searchText != "" ? records.Where(p => p.iffsCustomer.Name.ToUpper().Contains(searchText.ToUpper()) ||
                (p.iffsQuotationHeader == null ? false : p.iffsQuotationHeader.QuotationNo.ToUpper().Contains(searchText.ToUpper())) ||
                p.AgreementFile.ToUpper().Contains(searchText.ToUpper()) ||
                p.Remark.ToUpper().Contains(searchText.ToUpper())) : records;

            var serviceAgreements = records.Select(item => new
            {
                item.Id,
                Date = String.Format("{0:MMMM dd, yyyy}", item.Date),
                item.CustomerId,
                Customer = item.iffsCustomer.Name,
                item.QuotationId,
                Quotation = item.iffsQuotationHeader == null ? "" : item.iffsQuotationHeader.QuotationNo,
                item.AgreementFile,
                item.Remark
            }).Cast<object>().ToList();

            var exportToExcelHelper = new ExportToExcelHelper();
            exportToExcelHelper.ToExcel(Response, serviceAgreements);
        }
        #endregion

    }
}
