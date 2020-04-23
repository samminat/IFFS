using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data.Objects;
using System.Linq.Expressions;
using System.Data.Entity;
using CyberErp.Data.Infrastructure;
using CyberErp.Data.Model;

namespace CyberErp.Business.Component.Iffs
{
    public class SurveyRequest : Repository<iffsSurveyRequest>
    {
        #region Members

        /// <summary>
        /// Manage iffsSurveyRequest
        /// </summary>
        //  private readonly IRepository<iffsSurveyRequest> _repository;
        #endregion

        #region Constructor

        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="objectContext"></param>
        public SurveyRequest(DbContext objectContext)
            : base(objectContext, true)
        {
            // _repository = new Repository<iffsSurveyRequest>(objectContext, true);
        }

        #endregion

        #region Methods


        public object Get(int id)
        {
            try
            {

                var obj = base.Single(c => c.Id == id);

                var surveyRequest = new
                {
                    obj.Id,
                    obj.Number,
                    obj.OrderingClientId,
                    OrderingClient = obj.iffsCustomer.Name,
                    ReceivingClient = obj.iffsReceivingClient.Name,
                    obj.ReceivingClientId,
                    obj.ProposedSurveyDate,
                    obj.SurveyLocation,
                    obj.ProposedPackingDate,
                    obj.OriginCity,
                    obj.DestinationCityCountry,
                    obj.PreparedById,
                    obj.Date,
                    obj.IsAir,
                    obj.IsRailWay,
                    obj.IsOcean,
                    obj.AirLineId,
                    obj.RailWayId,
                    obj.ShippingLineId,
                    obj.ClientAllowanceVolume,
                    obj.MeasurmentUnit,
                    obj.HandlingAgent,
                    PreparedBy = obj.PreparedById != null ? obj.hrmsEmployee.corePerson.FirstName + " " + obj.hrmsEmployee.corePerson.FatherName : "",
                    obj.SurveyReportDate,
                    obj.ScheduleDate,
                    obj.AdditionalInstruction

                };
                return new
                 {
                     success = true,
                     data = surveyRequest
                 };
            }
            catch (Exception e)
            {
                return new
                {
                    success = false,
                    data = e.InnerException.Message
                };
            }
        }

        public object GetSurveyRequests()
        {
            try
            {
                var records = base.GetAll().AsQueryable();
                var count = records.Count();
                records = records.OrderBy(o => o.Number).ThenByDescending(o => o.Date);//.Skip(start).Take(limit).ToList();
                var surveyRequest = records.Select(item => new
                {
                    item.Id,
                    item.Number,
                }).ToList();
                return new { total = count, data = surveyRequest };
            }
            catch (Exception ex)
            {
                return new { sucess = false, total = 0, data = ex.InnerException.Message };
            }
        }

        public object GetAll(int start, int limit, string sort, string dir, string searchText)
        {

            var records = base.GetAll().AsQueryable();
            records = searchText != "" ? records.Where(p => p.Number.ToUpper().Contains(searchText.ToUpper()) ||
                p.iffsCustomer.Name.ToUpper().Contains(searchText.ToUpper()) || p.iffsReceivingClient.Name.ToUpper().Contains(searchText.ToUpper())) : records;

            var count = records.Count();
            records = records.OrderBy(o => o.Number).ThenByDescending(o => o.iffsCustomer.Name).ThenByDescending(o => o.iffsReceivingClient.Name).Skip(start).Take(limit);

            var SurveyRequests = records.Select(item => new
            {
                item.Id,
                item.Number,
                OrderingClient = item.iffsCustomer.Name,
                ReceivingClient = item.iffsReceivingClient.Name,
                item.ProposedSurveyDate,
                item.SurveyLocation,
                item.ProposedPackingDate,
                item.OriginCity,
                item.DestinationCityCountry,
                item.PreparedById,
                item.Date,
                item.IsOcean,
                item.IsAir,
                ClientAllowanceVolume = item.ClientAllowanceVolume + " " + item.MeasurmentUnit,
                item.HandlingAgent,
                PreparedBy = item.PreparedById != null ? item.hrmsEmployee.corePerson.FirstName + " " + item.hrmsEmployee.corePerson.FatherName : "",
                item.AdditionalInstruction,
                item.SurveyReportDate,
                item.IsViewed,
                item.ScheduleDate
            });
            return new { total = count, data = SurveyRequests };
        }

        public object ChangeViewStatus(int id)
        {
            try
            {
                var survey = base.Single(s => s.Id == id);
                survey.IsViewed = true;
                base.SaveChanges();
                return new { success = true, data = "" };
            }
            catch (Exception ex)
            {
                return new { success = false, data = ex.InnerException.Message };
            }
        }

        public List<object> ExportToExcel(string searchText)
        {

            var records = base.GetAll().AsQueryable();
            records = searchText != "" ? records.Where(p => p.Number.ToUpper().Contains(searchText.ToUpper()) ||
                p.iffsCustomer.Name.ToUpper().Contains(searchText.ToUpper()) ||
                p.iffsReceivingClient.Name.ToUpper().Contains(searchText.ToUpper())) : records;

            return records.Select(record => new
            {
                record.Number,
                OrderingClient = record.iffsCustomer.Name,
                ReceivingClient = record.iffsReceivingClient.Name,
                record.ProposedSurveyDate,
                record.SurveyLocation,
                record.ProposedPackingDate,
                record.OriginCity,
                record.DestinationCityCountry,
                IsAir = record.IsAir ? "Yes" : "No",
                IsOcean = record.IsOcean ? "Yes" : "No",
                IsRailWay = record.IsRailWay ? "Yes" : "No",
                AirLine = record.AirLineId.HasValue ? record.iffsShipmentTypeAirLIne.Name : "",
                ShippingLine = record.ShippingLineId.HasValue ? record.iffsShipmentTypeShippingIne.Name : "",
                RailWay = record.AirLineId.HasValue ? record.iffsShipmentTypeRailWay.Name : "",
                ClientAllowanceVolume = record.ClientAllowanceVolume + " " + record.MeasurmentUnit,
                record.HandlingAgent,
                PreparedBy = record.PreparedById != null ? record.hrmsEmployee.corePerson.FirstName + " " + record.hrmsEmployee.corePerson.FatherName + " " + record.hrmsEmployee.corePerson.GrandFatherName : "",
                record.Date,
                record.ScheduleDate
            }).ToList().Cast<object>().ToList();
        }
        #endregion
    }

}
