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
    public class JobOrderHistoryController : DirectController
    {
        #region Members

        private readonly DbContext _context;
        private readonly BaseModel<iffsJobOrderHistoryHeader> _jobOrderHeader;
        private readonly BaseModel<iffsJobOrderHistoryDetail> _jobOrderDetail;
        private readonly BaseModel<iffsQuotationHeader> _quotationHeader;
        private readonly BaseModel<iffsJobOrderQuotation> _jobOrderQuotation;
        private readonly Utility _utils = new Utility();
        private readonly Lookups _lookup;

        #endregion

        #region Constructor

        public JobOrderHistoryController()
        {
            _context = new ErpEntities(Constants.ConnectionString);
            _jobOrderHeader = new BaseModel<iffsJobOrderHistoryHeader>(_context);
            _jobOrderDetail = new BaseModel<iffsJobOrderHistoryDetail>(_context);
            _quotationHeader = new BaseModel<iffsQuotationHeader>(_context);
            _lookup = new Lookups(_context);
            _jobOrderQuotation = new BaseModel<iffsJobOrderQuotation>(_context);
        }

        #endregion

        #region Actions

        public ActionResult Get(int id)
        {
            var objJobOrder = _jobOrderHeader.Get(c => c.Id == id);

            var jobOrderTemplate = new
            {
                objJobOrder.Id,
                objJobOrder.OperationTypeId,
                objJobOrder.Quotations,
                QuotationRecs = GetQuotationRecs(objJobOrder.Id),
                objJobOrder.JobOrderNo,
                objJobOrder.ReceivingClient,
                objJobOrder.UltimateClient,
                objJobOrder.Remark,
                objJobOrder.ContactPersonForeign,
                objJobOrder.ContactPersonLocal,
                objJobOrder.ValidityDate,
                objJobOrder.PreparedById,
                objJobOrder.PreparedDate,
                objJobOrder.Status,
                objJobOrder.CheckedById,
                objJobOrder.CheckedDate,
                CheckedBy = objJobOrder.CheckedById != null ? objJobOrder.hrmsEmployee1.corePerson.FirstName + " " + objJobOrder.hrmsEmployee1.corePerson.FatherName : "",
                objJobOrder.ApprovedById,
                ApprovedBy = objJobOrder.ApprovedById != null ? objJobOrder.hrmsEmployee2.corePerson.FirstName + " " + objJobOrder.hrmsEmployee2.corePerson.FatherName : "",
                objJobOrder.ApprovedDate,
                objJobOrder.ParentJobOrderId,
                objJobOrder.Version,
                objJobOrder.IsRequiredDocumentsSubmited,
                objJobOrder.IsViewed
            };
            return this.Json(new
            {
                success = true,
                data = jobOrderTemplate
            });
        }

        public string GetQuotationRecs(int jobOrderId)
        {
            string recs = "";
            var objJobOrder = _jobOrderQuotation.GetAll().AsQueryable().Where(o => o.JobOrderId == jobOrderId).ToList();
            foreach (var j in objJobOrder)
            {
                recs += j.QuotationId + ";";
            }
            return recs;
        }

        public ActionResult GetAll(int start, int limit, string sort, string dir, string param)
        {
            var hashtable = JsonConvert.DeserializeObject<Hashtable>(param);
            int jobOrderId;
            int.TryParse(hashtable["jobOrderId"].ToString(), out jobOrderId);

            var records = _jobOrderHeader.GetAll().AsQueryable().Where(o => o.ParentJobOrderId == jobOrderId);
            var count = records.Count();
            records = records.OrderByDescending(o => o.Version).Skip(start).Take(limit);
            var jobOrders = records.Select(record => new
            {
                record.Id,
                record.JobOrderNo,
                record.Version
            });
            var result = new { total = count, data = jobOrders };
            return this.Json(result);
        }

        public ActionResult GetGridDetails(int start, int limit, string sort, string dir, string record)
        {
            var hashtable = JsonConvert.DeserializeObject<Hashtable>(record);
            int jobOrderId;
            int.TryParse(hashtable["jobOrderId"].ToString(), out jobOrderId);

            var filtered = _jobOrderDetail.GetAll().AsQueryable().Where(o => o.JobOrderHeaderId == jobOrderId);
            var count = filtered.Count();
            filtered = filtered.OrderBy(o => o.FieldCategory).Skip(start).Take(limit);

            var details = filtered.Select(item => new
            {
                item.Id,
                item.FieldCategory,
                item.Field,
                item.Value
            }).ToList();
            var result = new { total = count, data = details };
            return this.Json(result);
        }

        #endregion
    }
}