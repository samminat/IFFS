//------------------------------------------------------------------------------
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
    using System.Collections.Generic;
    
    public partial class iffsOperation
    {
        public iffsOperation()
        {
            this.iffsOperationExpense = new HashSet<iffsOperationExpense>();
            this.iffsOperationStatus = new HashSet<iffsOperationStatus>();
            this.iffsContainer = new HashSet<iffsContainer>();
            this.iffsInvoiceOperation = new HashSet<iffsInvoiceOperation>();
            this.iffsCrateAndBoxRequestHeader = new HashSet<iffsCrateAndBoxRequestHeader>();
            this.iffsPackingDamageReportHeader = new HashSet<iffsPackingDamageReportHeader>();
            this.iffsPackingHeader = new HashSet<iffsPackingHeader>();
            this.iffsPackingList = new HashSet<iffsPackingList>();
            this.iffsPackingMaterialHeader = new HashSet<iffsPackingMaterialHeader>();
        }
    
        public int Id { get; set; }
        public int JobOrderId { get; set; }
        public string OperationNo { get; set; }
        public System.DateTime Date { get; set; }
        public string ClientReferenceNo { get; set; }
        public string GoodsDescription { get; set; }
        public string MBLNo { get; set; }
        public string HBLNo { get; set; }
        public string SSLine { get; set; }
        public string Vessel { get; set; }
        public string Voyage { get; set; }
        public Nullable<int> PortOfOriginId { get; set; }
        public Nullable<int> PortOfDestinationId { get; set; }
        public Nullable<int> OpeningLocationId { get; set; }
        public string ETAPort { get; set; }
        public Nullable<System.DateTime> PortDischargeDate { get; set; }
        public string NumberOfContainers { get; set; }
        public string NumberOfPackages { get; set; }
        public Nullable<decimal> Weight { get; set; }
        public Nullable<decimal> Volume { get; set; }
        public Nullable<int> LoadingPortId { get; set; }
        public Nullable<int> OperationManagerId { get; set; }
        public Nullable<int> TransitorId { get; set; }
        public Nullable<int> FinanceOfficerId { get; set; }
        public Nullable<int> MarketingOfficerId { get; set; }
        public Nullable<int> CargoAgentId { get; set; }
        public string BoxFile { get; set; }
        public string FileNo { get; set; }
        public string MAWBNo { get; set; }
        public string HAWBNo { get; set; }
        public string Carrier { get; set; }
        public string FlightNo { get; set; }
        public string LoadingAir { get; set; }
        public Nullable<System.DateTime> ETD { get; set; }
        public Nullable<System.DateTime> ETA { get; set; }
        public string Remarks { get; set; }
        public int PreparedById { get; set; }
        public System.DateTime PreparedDate { get; set; }
        public Nullable<int> CheckedById { get; set; }
        public Nullable<System.DateTime> CheckedDate { get; set; }
        public Nullable<int> ApprovedById { get; set; }
        public Nullable<System.DateTime> ApprovalDate { get; set; }
        public bool IsDeleted { get; set; }
        public byte[] LastUpdated { get; set; }
    
        public virtual hrmsEmployee hrmsEmployee { get; set; }
        public virtual hrmsEmployee hrmsEmployee1 { get; set; }
        public virtual hrmsEmployee hrmsEmployee2 { get; set; }
        public virtual hrmsEmployee hrmsEmployee3 { get; set; }
        public virtual hrmsEmployee hrmsEmployee4 { get; set; }
        public virtual hrmsEmployee hrmsEmployee5 { get; set; }
        public virtual hrmsEmployee hrmsEmployee6 { get; set; }
        public virtual hrmsEmployee hrmsEmployee7 { get; set; }
        public virtual iffsJobOrderHeader iffsJobOrderHeader { get; set; }
        public virtual iffsLupLoadingPort iffsLupLoadingPort { get; set; }
        public virtual iffsLupOperationOpeningLocation iffsLupOperationOpeningLocation { get; set; }
        public virtual iffsLupPortOfDestination iffsLupPortOfDestination { get; set; }
        public virtual iffsLupPortOfOrigin iffsLupPortOfOrigin { get; set; }
        public virtual ICollection<iffsOperationExpense> iffsOperationExpense { get; set; }
        public virtual ICollection<iffsOperationStatus> iffsOperationStatus { get; set; }
        public virtual ICollection<iffsContainer> iffsContainer { get; set; }
        public virtual ICollection<iffsInvoiceOperation> iffsInvoiceOperation { get; set; }
        public virtual ICollection<iffsCrateAndBoxRequestHeader> iffsCrateAndBoxRequestHeader { get; set; }
        public virtual ICollection<iffsPackingDamageReportHeader> iffsPackingDamageReportHeader { get; set; }
        public virtual ICollection<iffsPackingHeader> iffsPackingHeader { get; set; }
        public virtual ICollection<iffsPackingList> iffsPackingList { get; set; }
        public virtual ICollection<iffsPackingMaterialHeader> iffsPackingMaterialHeader { get; set; }
    }
}
