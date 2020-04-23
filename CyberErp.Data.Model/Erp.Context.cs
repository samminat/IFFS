﻿//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace CyberErp.Data.Model
{
    using System;
    using System.Data.Entity;
    using System.Data.Entity.Infrastructure;
    
    public partial class ErpEntities : DbContext
    {
        public ErpEntities()
            : base("name=ErpEntities")
        {
        }
    
        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            throw new UnintentionalCodeFirstException();
        }
    
        public virtual DbSet<coreModule> coreModule { get; set; }
        public virtual DbSet<coreOperation> coreOperation { get; set; }
        public virtual DbSet<corePerson> corePerson { get; set; }
        public virtual DbSet<corePosition> corePosition { get; set; }
        public virtual DbSet<corePositionClass> corePositionClass { get; set; }
        public virtual DbSet<coreRole> coreRole { get; set; }
        public virtual DbSet<coreRolePermission> coreRolePermission { get; set; }
        public virtual DbSet<coreSubsystem> coreSubsystem { get; set; }
        public virtual DbSet<coreUser> coreUser { get; set; }
        public virtual DbSet<coreUserSubsystem> coreUserSubsystem { get; set; }
        public virtual DbSet<hrmsEmployee> hrmsEmployee { get; set; }
        public virtual DbSet<iffsApprover> iffsApprover { get; set; }
        public virtual DbSet<iffsCustomer> iffsCustomer { get; set; }
        public virtual DbSet<iffsJobOrderDetail> iffsJobOrderDetail { get; set; }
        public virtual DbSet<iffsJobOrderDocument> iffsJobOrderDocument { get; set; }
        public virtual DbSet<iffsJobOrderQuotation> iffsJobOrderQuotation { get; set; }
        public virtual DbSet<iffsJobOrderTemplate> iffsJobOrderTemplate { get; set; }
        public virtual DbSet<iffsLupCommodityType> iffsLupCommodityType { get; set; }
        public virtual DbSet<iffsLupContainerType> iffsLupContainerType { get; set; }
        public virtual DbSet<iffsLupCurrency> iffsLupCurrency { get; set; }
        public virtual DbSet<iffsLupCustomerGroup> iffsLupCustomerGroup { get; set; }
        public virtual DbSet<iffsLupDataType> iffsLupDataType { get; set; }
        public virtual DbSet<iffsLupDocumentType> iffsLupDocumentType { get; set; }
        public virtual DbSet<iffsLupOperationType> iffsLupOperationType { get; set; }
        public virtual DbSet<iffsLupPOE> iffsLupPOE { get; set; }
        public virtual DbSet<iffsLupServiceUnitType> iffsLupServiceUnitType { get; set; }
        public virtual DbSet<iffsLupSizeUnitType> iffsLupSizeUnitType { get; set; }
        public virtual DbSet<iffsLupWeightUnitType> iffsLupWeightUnitType { get; set; }
        public virtual DbSet<iffsNotification> iffsNotification { get; set; }
        public virtual DbSet<iffsOperationDocumentTemplate> iffsOperationDocumentTemplate { get; set; }
        public virtual DbSet<iffsOperationStatusTemplate> iffsOperationStatusTemplate { get; set; }
        public virtual DbSet<iffsQuotationDetail> iffsQuotationDetail { get; set; }
        public virtual DbSet<iffsQuotationTemplate> iffsQuotationTemplate { get; set; }
        public virtual DbSet<iffsRoleSetting> iffsRoleSetting { get; set; }
        public virtual DbSet<iffsServiceRequestDocuments> iffsServiceRequestDocuments { get; set; }
        public virtual DbSet<iffsTermsAndConditionsTemplate> iffsTermsAndConditionsTemplate { get; set; }
        public virtual DbSet<iffsUserOperationTypeMapping> iffsUserOperationTypeMapping { get; set; }
        public virtual DbSet<iffsDocumentNoSetting> iffsDocumentNoSetting { get; set; }
        public virtual DbSet<iffsLupExpenseType> iffsLupExpenseType { get; set; }
        public virtual DbSet<iffsOperationExpenseTemplate> iffsOperationExpenseTemplate { get; set; }
        public virtual DbSet<iffsJobOrderHistoryDetail> iffsJobOrderHistoryDetail { get; set; }
        public virtual DbSet<iffsLupLoadingPort> iffsLupLoadingPort { get; set; }
        public virtual DbSet<iffsLupPortOfDestination> iffsLupPortOfDestination { get; set; }
        public virtual DbSet<iffsLupPortOfOrigin> iffsLupPortOfOrigin { get; set; }
        public virtual DbSet<coreUserRole> coreUserRole { get; set; }
        public virtual DbSet<iffsServiceRequestDetail> iffsServiceRequestDetail { get; set; }
        public virtual DbSet<iffsOperationExpense> iffsOperationExpense { get; set; }
        public virtual DbSet<iffsServiceRate> iffsServiceRate { get; set; }
        public virtual DbSet<iffsService> iffsService { get; set; }
        public virtual DbSet<iffsJobOrderHeader> iffsJobOrderHeader { get; set; }
        public virtual DbSet<iffsJobOrderHistoryHeader> iffsJobOrderHistoryHeader { get; set; }
        public virtual DbSet<iffsLupOperationOpeningLocation> iffsLupOperationOpeningLocation { get; set; }
        public virtual DbSet<iffsOperationStatus> iffsOperationStatus { get; set; }
        public virtual DbSet<iffsOperation> iffsOperation { get; set; }
        public virtual DbSet<iffsServiceAgreement> iffsServiceAgreement { get; set; }
        public virtual DbSet<iffsContainer> iffsContainer { get; set; }
        public virtual DbSet<iffsContainerStatusTemplate> iffsContainerStatusTemplate { get; set; }
        public virtual DbSet<iffsContainerStatus> iffsContainerStatus { get; set; }
        public virtual DbSet<iffsQuotationTermandCondition> iffsQuotationTermandCondition { get; set; }
        public virtual DbSet<iffsQuotationHeader> iffsQuotationHeader { get; set; }
        public virtual DbSet<iffsServiceRequest> iffsServiceRequest { get; set; }
        public virtual DbSet<iffsInvoiceDetail> iffsInvoiceDetail { get; set; }
        public virtual DbSet<iffsInvoiceOperation> iffsInvoiceOperation { get; set; }
        public virtual DbSet<iffsInvoiceHeader> iffsInvoiceHeader { get; set; }
        public virtual DbSet<iffsCrateAndBoxRequestDetail> iffsCrateAndBoxRequestDetail { get; set; }
        public virtual DbSet<iffsCrateAndBoxRequestHeader> iffsCrateAndBoxRequestHeader { get; set; }
        public virtual DbSet<iffsLupBoxType> iffsLupBoxType { get; set; }
        public virtual DbSet<iffsLupClientStatus> iffsLupClientStatus { get; set; }
        public virtual DbSet<iffsLupDamageType> iffsLupDamageType { get; set; }
        public virtual DbSet<iffsLupRoomType> iffsLupRoomType { get; set; }
        public virtual DbSet<iffsLupTruckType> iffsLupTruckType { get; set; }
        public virtual DbSet<iffsPackingCrateAndBoxConsumption> iffsPackingCrateAndBoxConsumption { get; set; }
        public virtual DbSet<iffsPackingDamageReportDetail> iffsPackingDamageReportDetail { get; set; }
        public virtual DbSet<iffsPackingDamageReportHeader> iffsPackingDamageReportHeader { get; set; }
        public virtual DbSet<iffsPackingDetail> iffsPackingDetail { get; set; }
        public virtual DbSet<iffsPackingHeader> iffsPackingHeader { get; set; }
        public virtual DbSet<iffsPackingList> iffsPackingList { get; set; }
        public virtual DbSet<iffsPackingMaterialConsumption> iffsPackingMaterialConsumption { get; set; }
        public virtual DbSet<iffsPackingMaterialDetail> iffsPackingMaterialDetail { get; set; }
        public virtual DbSet<iffsPackingMaterialHeader> iffsPackingMaterialHeader { get; set; }
        public virtual DbSet<iffsPackingStaff> iffsPackingStaff { get; set; }
        public virtual DbSet<iffsPackingTruckAndMachine> iffsPackingTruckAndMachine { get; set; }
        public virtual DbSet<iffsReceivingClient> iffsReceivingClient { get; set; }
        public virtual DbSet<iffsShipmentType> iffsShipmentType { get; set; }
        public virtual DbSet<iffsSurveyRequest> iffsSurveyRequest { get; set; }
        public virtual DbSet<iffsSurveyServiceRequest> iffsSurveyServiceRequest { get; set; }
        public virtual DbSet<lupMeasurementUnit> lupMeasurementUnit { get; set; }
        public virtual DbSet<iffsSchedule> iffsSchedule { get; set; }
        public virtual DbSet<iffsPackingListSetting> iffsPackingListSetting { get; set; }
        public virtual DbSet<iffsPackingSurveyDetail> iffsPackingSurveyDetail { get; set; }
        public virtual DbSet<iffsPackingSurveyHeader> iffsPackingSurveyHeader { get; set; }
        public virtual DbSet<iffsPackingMaterialList> iffsPackingMaterialList { get; set; }
        public virtual DbSet<ifmsSetting> ifmsSetting { get; set; }
        public virtual DbSet<iffsPackingMaterial> iffsPackingMaterial { get; set; }
    }
}
