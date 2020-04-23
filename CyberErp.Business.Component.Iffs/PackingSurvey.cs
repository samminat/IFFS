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
    public class PackingSurvey : Repository<iffsPackingSurveyHeader>
    {
        #region Members

        /// <summary>
        /// Manage iffsPackingSurveyHeader
        /// </summary>
        //  private readonly IRepository<iffsPackingSurveyHeader> _repository;
        #endregion

        #region Constructor

        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="objectContext"></param>
        public PackingSurvey(DbContext objectContext)
            : base(objectContext, true)
        {
            // _repository = new Repository<iffsPackingSurveyHeader>(objectContext, true);
        }

        #endregion

        #region Methods


        public object Get(int id)
        {
            try
            {

                var obj = base.Single(c => c.Id == id);

                var PackingSurveyHeader = new
                {
                    obj.Id,
                    obj.ClientStatusId,
                    obj.DepartureDate,
                    obj.DestinationAddress,
                    obj.DestinationCountry,
                    obj.PackingDate,
                    obj.IsPacking,
                    obj.IsMoving,
                    obj.IsCustomClearance,
                    obj.IsOcean,
                    obj.IsAir,
                    obj.IsDoorToDoor,
                    obj.IsDoorToPort,
                    obj.SurveyDate,
                    obj.SurveyedById,
                    obj.SurveyRequestId,
                    obj.DestinationPort,
                    obj.EstimatedStuffQty,
                    obj.CBMAir,
                    obj.CBMOcean

                };
                return new
                 {
                     success = true,
                     data = PackingSurveyHeader
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



        public object GetAll(int start, int limit, string sort, string dir, string searchText)
        {

            var records = base.GetAll().AsQueryable();
            records = searchText != "" ? records.Where(p => p.DestinationAddress.ToUpper().Contains(searchText.ToUpper()) ||
               p.DestinationCountry.ToUpper().Contains(searchText.ToUpper())) :
               records;

            var count = records.Count();
            records = records.OrderBy(o => o.SurveyDate).Skip(start).Take(limit);

            var PackingSurveyHeaders = records.Select(item => new
            {
                item.Id,
                item.iffsSurveyRequest.Number,
                OrderingClient = item.iffsSurveyRequest.iffsCustomer.Name,
                ReceivingClient = item.iffsSurveyRequest.iffsReceivingClient.Name,
                ClientStatus = item.iffsLupClientStatus.Name,
                item.DepartureDate,
                item.DestinationAddress,
                item.DestinationCountry,
                item.PackingDate,
                item.IsPacking,
                item.SurveyDate,
                item.SurveyedById,
                item.SurveyRequestId,
                item.IsViewed,
                ServiceType = ""//GetServiceType(item)
            });
            return new { total = count, data = PackingSurveyHeaders };
        }
        private static object GetServiceType(iffsPackingSurveyHeader item)
        {
            return (String.Format("{0} {1} {2} {3} {4} {5} {6} {7}",
              item.IsPacking ? "Packing, " : "", item.IsMoving ? "Moving, " : "",
              item.IsCustomClearance ? "Custom Clearance, " : "", item.IsDoorToDoor ? "Door To Door," : "",
              item.IsDoorToPort ? "Door To Port," : "", item.IsAir ? "Air," : "",
              item.IsOcean ? "Ocean" : ""));
        }

        public object GetAllDetial(int start, int limit, string sort, string dir, int headerId)
        {
            Stack<int> s = new Stack<int>();
            Queue<ifmsSetting> se = new Queue<ifmsSetting>();
            var obj = base.Single(c => c.Id == headerId);
            var records = obj.iffsPackingSurveyDetail.AsQueryable();
            var count = records.Count();
            records = records.OrderBy(o => o.Description).Skip(start).Take(limit);

            var PackingSurveyDetails = records.Select(item => new
            {
                item.Id,
                HeaderId = item.HeaderId,
                item.Description,
                item.Length,
                item.Width,
                item.Height,
                item.Quantity,
                item.RoomTypeId
            });
            return new { total = count, data = PackingSurveyDetails };
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
            records = searchText != "" ? records.Where(p => p.DestinationCountry.ToUpper().Contains(searchText.ToUpper()) ||
                p.DestinationAddress.ToUpper().Contains(searchText.ToUpper())) : records;

            return records.Select(record => new
            {
                record.Id,
                record.DepartureDate,
                record.DestinationAddress,
                // PreparedBy = record.PreparedById != null ? record.hrmsEmployee.corePerson.FirstName + " " + record.hrmsEmployee.corePerson.FatherName + " " + record.hrmsEmployee.corePerson.GrandFatherName : "",
                SurveyRequestNumber = record.iffsSurveyRequest.Number,
                OrderingClient = record.iffsSurveyRequest.iffsCustomer.Name,
                ReceivingClient = record.iffsSurveyRequest.iffsReceivingClient.Name,
                ClientStatus = record.iffsLupClientStatus.Name,
                record.DestinationCountry,
                record.PackingDate,
                record.SurveyDate,
                SurveyedBy = record.SurveyedById != null ? record.hrmsEmployee.corePerson.FirstName + " " + record.hrmsEmployee.corePerson.FatherName + " " + record.hrmsEmployee.corePerson.GrandFatherName : "",
                record.IsPacking,
                record.IsMoving,
                record.IsCustomClearance,
                record.IsDoorToDoor,
                record.IsDoorToPort,
                record.IsAir,
                record.IsOcean
            }).ToList().Cast<object>().ToList();
        }
        #endregion
    }

}
