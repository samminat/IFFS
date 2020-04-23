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

namespace CyberErp.Presentation.Iffs.Web.Controllers
{
    public class ContainerController : DirectController
    {
        #region Members

        private readonly DbContext _context;
        private readonly BaseModel<iffsContainer> _container;
        private readonly BaseModel<iffsContainerStatusTemplate> _containerStatusTemplate;
        private readonly BaseModel<iffsContainerStatus> _containerStatus;

        #endregion

        #region Constructor

        public ContainerController()
        {
            _context = new ErpEntities(Constants.ConnectionString);
            _container = new BaseModel<iffsContainer>(_context);
            _containerStatusTemplate = new BaseModel<iffsContainerStatusTemplate>(_context);
            _containerStatus = new BaseModel<iffsContainerStatus>(_context);
        }

        #endregion

        #region Container

        public ActionResult Get(int id)
        {
            var objContainer = _container.Get(c => c.Id == id);

            var container = new
            {
                objContainer.Id,
                objContainer.OperationId,
                objContainer.ContainerNo,
                objContainer.ContainerTypeId,
                objContainer.Quantity,
                objContainer.NetWeight,
                objContainer.GracePeriod,
                objContainer.Charge20,
                objContainer.Charge40,
                objContainer.Length,
                objContainer.Height,
                objContainer.Description,
                objContainer.CurrencyId,
                objContainer.Remark
            };
            return this.Json(new
            {
                success = true,
                data = container
            });
        }

        public ActionResult GetAll(int start, int limit, string sort, string dir, string param)
        {
            var hashtable = JsonConvert.DeserializeObject<Hashtable>(param);
            int operationId;
            int.TryParse(hashtable["operationId"].ToString(), out operationId);

            var records = _container.GetAll().Where(j => j.OperationId == operationId).AsQueryable();
            
            var count = records.Count();
            records = records.OrderByDescending(o => o.iffsOperation.OperationNo).Skip(start).Take(limit);
            var containers = records.Select(record => new
            {
                record.Id,
                record.OperationId,
                record.iffsOperation.OperationNo,
                record.ContainerNo,
                ContainerType = record.iffsLupContainerType.Name,
                record.Quantity,
                record.NetWeight,
                record.GracePeriod,
                record.Charge20,
                record.Charge40,
                record.Length,
                record.Height,
                record.Description,
                OperationTypeId=record.iffsOperation.iffsJobOrderHeader.OperationTypeId,
                Currency = record.iffsLupCurrency == null ? "" : record.iffsLupCurrency.Name,
                record.Remark
            }).ToList();
            var result = new { total = count, data = containers };
            return this.Json(result);
        }

        [FormHandler]
        public ActionResult Save(iffsContainer container)
        {
            if (container.Id.Equals(0))
            {
                _container.AddNew(container);
            }
            else
            {
                _container.Edit(container);
            }
            return this.Json(new { success = true, customerId = container.Id, data = "Data has been saved successfully!" });
        }

        public ActionResult Delete(int id)
        {
            try
            {
                _container.Delete(c => c.Id == id);

                return this.Json(new { success = true, data = "record has been successfully deleted!" });
            }
            catch (Exception)
            {
                return this.Json(new { success = false, data = "Could not delete the selected record!" });
            }
        }

        #endregion

        #region Container Status Template

        public ActionResult GetStatusTemplate(int id)
        {
            var objContainerStatusTemplate = _containerStatusTemplate.Get(c => c.Id == id);

            var statusTemplate = new
            {
                objContainerStatusTemplate.Id,
                objContainerStatusTemplate.ContainerStatusType,
                objContainerStatusTemplate.Name,
                objContainerStatusTemplate.Code,
                objContainerStatusTemplate.Description,
                objContainerStatusTemplate.DataTypeId,
                objContainerStatusTemplate.OperationTypeId,
                OperationType=objContainerStatusTemplate.OperationTypeId.HasValue?objContainerStatusTemplate.iffsLupOperationType.Name:"",
                objContainerStatusTemplate.RoleId
            };
            return this.Json(new
            {
                success = true,
                data = statusTemplate
            });
        }

        public ActionResult GetAllStatusTemplate(int start, int limit, string sort, string dir, string param)
        {
            var hashtable = JsonConvert.DeserializeObject<Hashtable>(param);

            var searchText = hashtable["searchText"]!=null?hashtable["searchText"].ToString():"";
            var operationTypeId =hashtable["operationTypeId"]!=null?int.Parse( hashtable["operationTypeId"].ToString()):0;

            var records = _containerStatusTemplate.GetAll();
            records = records.Where(o => o.OperationTypeId == operationTypeId);
            records = searchText != "" ? records.Where(p => p.Name.ToUpper().Contains(searchText.ToUpper())) : records;

            if (sort == "DataType")
            {
                records = dir == "ASC" ? records.OrderBy(r => r.iffsLupDataType.Name) : records.OrderByDescending(r => r.iffsLupDataType.Name);
            }
            else if (sort == "Role")
            {
                records = dir == "ASC" ? records.OrderBy(r => r.coreRole.Name) : records.OrderByDescending(r => r.coreRole.Name);
            }
            else
            {
                records = dir == "ASC" ? records.OrderBy(r => r.GetType().GetProperty(sort).GetValue(r, null)) : records.OrderByDescending(r => r.GetType().GetProperty(sort).GetValue(r, null));
            }

            var count = records.Count();
            records = records.Skip(start).Take(limit);

            var operationStatusTemplates = records.Select(item => new
            {
                item.Id,
                item.ContainerStatusType,
                item.Name,
                item.Code,
                item.Description,
                item.DataTypeId,
                DataType = item.iffsLupDataType.Name,
                item.RoleId,
                Role = item.coreRole.Name
            }).Cast<object>().ToList();

            var result = new { total = count, data = operationStatusTemplates };
            return this.Json(result);
        }

        [FormHandler]
        public ActionResult SaveStatusTemplate(iffsContainerStatusTemplate containerStatusTemplate)
        {
            if (containerStatusTemplate.Id.Equals(0))
            {
                _containerStatusTemplate.AddNew(containerStatusTemplate);
            }
            else
            {
                _containerStatusTemplate.Edit(containerStatusTemplate);
            }

            return this.Json(new { success = true, data = "Data has been saved successfully!" });
        }

        public ActionResult DeleteStatusTemplate(int id)
        {
            try
            {
                _containerStatusTemplate.Delete(c => c.Id == id);

                return this.Json(new { success = true, data = "record has been successfully deleted!" });
            }
            catch (Exception)
            {
                return this.Json(new { success = false, data = "Could not delete the selected record!" });
            }
        }

        #endregion 

        #region Container Status

        public ActionResult GetAllStatus(int start, int limit, string sort, string dir, string param)
        {
            var hashtable = JsonConvert.DeserializeObject<Hashtable>(param);
            int containerId;
            int.TryParse(hashtable["containerId"].ToString(), out containerId);
            var containerStatusType = hashtable["containerStatusType"].ToString();
            var operationTypeId = hashtable["operationTypeId"] != null ? int.Parse(hashtable["operationTypeId"].ToString()) : 0;

            var records = _containerStatus.GetAll().AsQueryable().Where(o => o.ContainerId == containerId && o.iffsContainerStatusTemplate.ContainerStatusType == containerStatusType);
            var count = records.Count();

            if (count == 0)
            {
                    var statusTemplate = _containerStatusTemplate.GetAll().Where(o => o.ContainerStatusType == containerStatusType && o.OperationTypeId == operationTypeId);
                    var statusCount = statusTemplate.Count();
                        statusTemplate = statusTemplate.OrderBy(o => o.Code);
                        var containerStatus = statusTemplate.Select(record => new
                        {
                            Id = "",
                            ContainerId = containerId,
                            StatusId = record.Id,
                            Status = record.Name,
                            StatusCode = record.Code,
                            DataType = record.iffsLupDataType.Name,
                            Value = "",
                            Remark = ""
                        }).ToList();
                        var result = new { total = count, data = containerStatus };
                        return this.Json(result);
            }
            else
            {
                records = records.OrderBy(o => o.iffsContainerStatusTemplate.Code);
                var containerStatus = records.Select(record => new
                {
                    record.Id,
                    record.ContainerId,
                    record.StatusId,
                    Status = record.iffsContainerStatusTemplate.Name,
                    StatusCode = record.iffsContainerStatusTemplate.Code,
                    DataType = record.iffsContainerStatusTemplate.iffsLupDataType.Name,
                    record.Value,
                    record.Remark
                }).ToList().Select(record => new
                {
                    record.Id,
                    record.ContainerId,
                    record.StatusId,
                    record.Status,
                    record.StatusCode,
                    record.DataType,
                    record.Value,
                    record.Remark
                });
                var result = new { total = count, data = containerStatus };
                return this.Json(result);
            }
        }

        public DirectResult SaveStatus(string param)
        {
            try
            {
                var statuses = JsonConvert.DeserializeObject<List<object>>(param);
                int id;

                for (var i = 0; i < statuses.Count(); i++)
                {
                    var hashtable = JsonConvert.DeserializeObject<Hashtable>(statuses[i].ToString());

                    int.TryParse(hashtable["Id"].ToString(), out id);

                    if (id == 0)
                    {
                        _containerStatus.AddNew(new iffsContainerStatus
                        {
                            ContainerId = int.Parse(hashtable["ContainerId"].ToString()),
                            StatusId = int.Parse(hashtable["StatusId"].ToString()),
                            Value = hashtable["Value"].ToString(),
                            Remark = hashtable["Remark"].ToString()
                        });
                    }
                    else
                    {
                        _containerStatus.Edit(new iffsContainerStatus
                        {
                            Id = id,
                            ContainerId = int.Parse(hashtable["ContainerId"].ToString()),
                            StatusId = int.Parse(hashtable["StatusId"].ToString()),
                            Value = hashtable["Value"].ToString(),
                            Remark = hashtable["Remark"].ToString()
                        });
                    }
                }
                return this.Json(new { success = true, data = "Container Status have been saved successfully!" });
            }
            catch (Exception ex)
            {
                return this.Json(new { success = false, data = ex.InnerException != null ? ex.InnerException.Message : ex.Message });

            }
        }



        #endregion
    }
}
