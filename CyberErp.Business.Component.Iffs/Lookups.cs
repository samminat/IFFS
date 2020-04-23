using CyberErp.Data.Infrastructure;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;

namespace CyberErp.Business.Component.Iffs
{
    public class Lookups
    {
        #region Members

        public const string LupCommodityType = "iffsLupCommodityType";
        public const string LupContainerType = "iffsLupContainerType";
        public const string LupCurrency = "iffsLupCurrency";
        public const string LupCustomerGroup = "iffsLupCustomerGroup";
        public const string LupOperationType = "iffsLupOperationType";
        public const string LupPOE = "iffsLupPOE";
        public const string LupServiceUnitType = "iffsLupServiceUnitType";
        public const string LupSizeUnitType = "iffsLupSizeUnitType";
        public const string LupWeightUnitType = "iffsLupWeightUnitType";
        public const string LupLoadingPort = "iffsLupLoadingPort";
        public const string LupPOD = "iffsLupPortOfDestination";
        public const string LupPOO = "iffsLupPortOfOrigin";
        public const string LupDocumentType = "iffsLupDocumentType";
        public const string LupDataType = "iffsLupDataType";
        public const string LupOperationStatusCategory = "iffsLupOperationStatusCategory";
        public const string LupExpenseType = "iffsLupExpenseType";
        public const string LupOperationOpeningLocation = "iffsLupOperationOpeningLocation";
        public const string RoomType = "iffsLupRoomType";
        public const string ClientStatus = "iffsLupClientStatus";
        public const string MeasurementUnit = "lupMeasurementUnit";
        public const string BoxType = "iffsLupBoxType";
        public const string DamageType = "iffsLupDamageType";
        public const string TruckType = "iffsLupTruckType";

       
        private readonly Repository _repository;

        #endregion

        #region Constructor

        public Lookups(DbContext dbContext)
        {
            _repository = new Repository(dbContext);
        }

        #endregion

        #region Methods

        public void AddNew(coreLookup lookup, string table)
        {
            _repository.Add(lookup, table);
        }

        public void Edit(coreLookup lookup, string table)
        {
            _repository.Edit(lookup, table);
        }

        public void Delete(int id, string table)
        {
            _repository.Delete(id, table);
        }

        public coreLookup Get(int id, string table)
        {
            return _repository.Get(id, table);
        }

        public IEnumerable<coreLookup> GetAll(string table)
        {
            return _repository.GetAll(table);
        }

        public IEnumerable<coreLookup> GetAll(int start, int limit, string table)
        {
            return _repository.GetAll(start, limit, table);
        }

        public static ArrayList GetLookupCategories()
        {
            var categoryList = new ArrayList();

            categoryList.Add(new { id = LupCommodityType, text = "Commodity Type", href = string.Empty, type = "category", iconCls = "icon-unit", leaf = true });
            categoryList.Add(new { id = LupContainerType, text = "Container Type", href = string.Empty, type = "category", iconCls = "icon-unit", leaf = true });
            categoryList.Add(new { id = LupCurrency, text = "Currency", href = string.Empty, type = "category", iconCls = "icon-unit", leaf = true });
            categoryList.Add(new { id = LupCustomerGroup, text = "Customer Group", href = string.Empty, type = "category", iconCls = "icon-unit", leaf = true });
            categoryList.Add(new { id = LupDataType, text = "Data Type", href = string.Empty, type = "category", iconCls = "icon-unit", leaf = true });
            categoryList.Add(new { id = LupDocumentType, text = "Document Type", href = string.Empty, type = "category", iconCls = "icon-unit", leaf = true });
            categoryList.Add(new { id = LupLoadingPort, text = "Loading Port", href = string.Empty, type = "category", iconCls = "icon-unit", leaf = true });
            //categoryList.Add(new { id = LupOperationStatusCategory, text = "Operation Status Category", href = string.Empty, type = "category", iconCls = "icon-unit", leaf = true });
            categoryList.Add(new { id = LupOperationType, text = "Operation Type", href = string.Empty, type = "category", iconCls = "icon-unit", leaf = true });
            categoryList.Add(new { id = LupPOD, text = "Port Of Destination", href = string.Empty, type = "category", iconCls = "icon-unit", leaf = true });
            categoryList.Add(new { id = LupPOE, text = "POE", href = string.Empty, type = "category", iconCls = "icon-unit", leaf = true });
            categoryList.Add(new { id = LupPOO, text = "Port Of Origin", href = string.Empty, type = "category", iconCls = "icon-unit", leaf = true });
            categoryList.Add(new { id = LupServiceUnitType, text = "Service Unit Type", href = string.Empty, type = "category", iconCls = "icon-unit", leaf = true });
            categoryList.Add(new { id = LupSizeUnitType, text = "Size Unit Type", href = string.Empty, type = "category", iconCls = "icon-unit", leaf = true });
            categoryList.Add(new { id = LupWeightUnitType, text = "Weight Unit Type", href = string.Empty, type = "category", iconCls = "icon-unit", leaf = true });
            categoryList.Add(new { id = LupExpenseType, text = "Expense Type", href = string.Empty, type = "category", iconCls = "icon-unit", leaf = true });
            categoryList.Add(new { id = LupOperationOpeningLocation, text = "Operation Opening Location", href = string.Empty, type = "category", iconCls = "icon-unit", leaf = true });
            categoryList.Add(new { id = RoomType, text = "Room Type", href = string.Empty, type = "category", iconCls = "icon-unit", leaf = true });
            categoryList.Add(new { id = ClientStatus, text = "Client Status", href = string.Empty, type = "category", iconCls = "icon-unit", leaf = true });
            categoryList.Add(new { id = MeasurementUnit, text = "Measurement Unit", href = string.Empty, type = "category", iconCls = "icon-unit", leaf = true });
            categoryList.Add(new { id = BoxType, text = "Box Types", href = string.Empty, type = "category", iconCls = "icon-unit", leaf = true });
            categoryList.Add(new { id = DamageType, text = "Lable Types", href = string.Empty, type = "category", iconCls = "icon-unit", leaf = true });
            categoryList.Add(new { id = TruckType, text = "Truck (Fork List) Types", href = string.Empty, type = "category", iconCls = "icon-unit", leaf = true });
                  
            return categoryList;
        }

        #endregion
    }
}
