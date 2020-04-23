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
    public class ReceivingClient : Repository<iffsReceivingClient>
    {
        #region Members

        /// <summary>
        /// Manage iffsReceivingClient
        /// </summary>
        //  private readonly IRepository<iffsReceivingClient> _repository;
        #endregion

        #region Constructor

        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="objectContext"></param>
        public ReceivingClient(DbContext objectContext)
            : base(objectContext, true)
        {
            // _repository = new Repository<iffsReceivingClient>(objectContext, true);
        }

        #endregion

        #region Methods


        public object Get(int id)
        {
            try
            {

                var obj = base.Single(c => c.Id == id);

                var ReceivingClient = new
                {
                    obj.Id,
                    obj.Name,
                    obj.ContactPerson

                };
                return new
                 {
                     success = true,
                     data = ReceivingClient
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



        public object GetAll()//int start, int limit, string sort, string dir, string searchText
        {

            var records = base.GetAll().AsQueryable();
            var count = records.Count();
            records = records.OrderBy(o => o.Name).ThenByDescending(o => o.ContactPerson);//.Skip(start).Take(limit).ToList();
            var clients = records.Select(item => new
            {
                item.Id,
                item.Name,
                item.ContactPerson
            }).ToList();
            return new { total = count, data = clients };
        }

        #endregion
    }

}
