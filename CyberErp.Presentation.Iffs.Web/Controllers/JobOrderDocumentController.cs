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
    public class JobOrderDocumentController : DirectController
    {
        #region Members

        private readonly DbContext _context;
        private readonly BaseModel<iffsJobOrderHeader> _jobOrder;
        private readonly BaseModel<iffsJobOrderDocument> _jobOrderDocument;

        #endregion

        #region Constructor

        public JobOrderDocumentController()
        {
            _context = new ErpEntities(Constants.ConnectionString);
            _jobOrder = new BaseModel<iffsJobOrderHeader>(_context);
            _jobOrderDocument = new BaseModel<iffsJobOrderDocument>(_context);
            
        }

        #endregion

        #region Actions

        public ActionResult Get(int id)
        {
            var objJobOrderDocument = _jobOrderDocument.Get(u => u.Id == id);

            var jobDocument = new
            {
                objJobOrderDocument.Id,
                objJobOrderDocument.JobOrderHeaderId,
                objJobOrderDocument.DocumentTypeId,
                DocumentType = objJobOrderDocument.iffsLupDocumentType.Name,
                objJobOrderDocument.FileName,
                objJobOrderDocument.NoOfPagesOriginal,
                objJobOrderDocument.NoOfPagesCopy,
                objJobOrderDocument.NoOfAttachedPagesOriginal,
                objJobOrderDocument.NoOfAttachedPagesCopy,
                objJobOrderDocument.Remark
            };

            return this.Json(new
            {
                success = true,
                data = jobDocument
            });
        }
        
        public ActionResult GetAll(int start, int limit, string sort, string dir, string record)
        {
            var hashtable = JsonConvert.DeserializeObject<Hashtable>(record);
            int jobOrderId;
            int.TryParse(hashtable["jobOrderId"].ToString(), out jobOrderId);

            var filtered = _jobOrderDocument.GetAll().Where(j => j.JobOrderHeaderId == jobOrderId);
            var count = filtered.Count();
            filtered = filtered.Skip(start).Take(limit);

            var workRequests = filtered.Select(item => new
            {
                item.Id,
                item.JobOrderHeaderId,
                item.DocumentTypeId,
                DocumentType = item.iffsLupDocumentType.Name,
                item.FileName,
                item.NoOfPagesOriginal,
                item.NoOfPagesCopy,
                item.NoOfAttachedPagesOriginal,
                item.NoOfAttachedPagesCopy,
                item.Remark
            }).Cast<object>().ToList();
            var result = new
            {
                total = count,
                data = workRequests
            };
            return this.Json(result);
        }

        public ActionResult GetAllDocuments(int start, int limit, string sort, string dir, string record)
        {
            var hashtable = JsonConvert.DeserializeObject<Hashtable>(record);
            int jobOrderId;
            int.TryParse(hashtable["jobOrderId"].ToString(), out jobOrderId);

            var filtered = _jobOrderDocument.GetAll().Where(j => j.JobOrderHeaderId == jobOrderId);
            filtered = filtered.OrderBy(d=>d.iffsLupDocumentType.Name);
            var count = filtered.Count();

            var workRequests = filtered.Select(item => new
            {
                item.Id,
                item.JobOrderHeaderId,
                item.DocumentTypeId,
                DocumentType = item.iffsLupDocumentType.Name,
                item.FileName,
                item.NoOfPagesOriginal,
                item.NoOfPagesCopy,
                item.NoOfAttachedPagesOriginal,
                item.NoOfAttachedPagesCopy,
                item.Remark
            }).Cast<object>().ToList();
            var result = new
            {
                total = count,
                data = workRequests
            };
            return this.Json(result);
        }


        [FormHandler]
        public ActionResult Upload(iffsJobOrderDocument jobDocument)
        {
            try
            {
                string[] supportedTypes = new string[] { "png", "jpg", "jpeg", "pdf", "doc", "docx", "xls", "xlsx" };
                for (int i = 0; i < Request.Files.Count; i++)
                {
                    HttpPostedFileBase postedFile = Request.Files[i];
                    string fileExtension = Path.GetExtension(postedFile.FileName);
                    string fileName = System.IO.Path.GetFileName(postedFile.FileName);
                    string newFileName = jobDocument.JobOrderHeaderId + "_" + GuidEncoder.Encode(Guid.NewGuid()) + fileExtension;
                    if (postedFile != null)
                    {
                        if (supportedTypes.Contains(fileExtension.TrimStart('.').ToLower()))
                        {
                            _jobOrderDocument.AddNew(new iffsJobOrderDocument
                            {
                                JobOrderHeaderId = jobDocument.JobOrderHeaderId,
                                DocumentTypeId = jobDocument.DocumentTypeId,
                                FileName = newFileName,
                                NoOfPagesOriginal = jobDocument.NoOfPagesOriginal,
                                NoOfPagesCopy = jobDocument.NoOfPagesCopy,
                                NoOfAttachedPagesOriginal = jobDocument.NoOfAttachedPagesOriginal,
                                NoOfAttachedPagesCopy = jobDocument.NoOfAttachedPagesCopy,
                                Remark = jobDocument.Remark
                            });

                            string appPath = HttpContext.Request.ApplicationPath;
                            string physicalPath = HttpContext.Request.MapPath(appPath);
                            string saveLocation = physicalPath + "\\Upload\\JobOrderDocument\\" + newFileName;
                            postedFile.SaveAs(saveLocation);
                        }
                    }
                }
                return this.Json(new { success = true, data = "The File has been uploaded." });
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

                var objDocument = _jobOrderDocument.Get(d => d.Id == id);
                if (objDocument != null)
                {
                    string appPath = HttpContext.Request.ApplicationPath;
                    string physicalPath = HttpContext.Request.MapPath(appPath);
                    string fullPath = physicalPath + "\\Upload\\JobOrderDocument\\" + objDocument.FileName;
                    System.IO.File.Delete(fullPath);
                }
                _jobOrderDocument.Delete(u => u.Id == id);

                return this.Json(new { success = true, data = "Job Order Document has been deleted successfully!" });
            }
            catch (System.Exception ex)
            {
                return this.Json(new { success = false, data = ex.InnerException != null ? ex.InnerException.Message : ex.Message });
            }
        }

        public ActionResult ApproveDocumentSubmitted(int id)
        {
            try
            {
                var objJobOrder = _jobOrder.Get(d => d.Id == id);
                objJobOrder.IsRequiredDocumentsSubmited = true;
                _context.SaveChanges();

                return this.Json(new { success = true, data = "Document submit approval completed!" });
            }
            catch (System.Exception ex)
            {
                return this.Json(new { success = false, data = ex.InnerException != null ? ex.InnerException.Message : ex.Message });
            }
        }

        #endregion
    }
}
