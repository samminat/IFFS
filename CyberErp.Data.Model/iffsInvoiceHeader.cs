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
    
    public partial class iffsInvoiceHeader
    {
        public iffsInvoiceHeader()
        {
            this.iffsInvoiceDetail = new HashSet<iffsInvoiceDetail>();
            this.iffsInvoiceOperation = new HashSet<iffsInvoiceOperation>();
        }
    
        public int Id { get; set; }
        public int OperationTypeId { get; set; }
        public int CustomerId { get; set; }
        public System.DateTime Date { get; set; }
        public string InvoiceNo { get; set; }
        public string CustomerReferenceNo { get; set; }
        public string FsNo { get; set; }
        public string HBL { get; set; }
        public string Carrier { get; set; }
        public string BL_AWB { get; set; }
        public string OperationNo { get; set; }
        public string Container { get; set; }
        public string NoofContainer { get; set; }
        public decimal ExchangeRate { get; set; }
        public int PreparedById { get; set; }
        public System.DateTime PreparedDate { get; set; }
        public Nullable<int> CheckedById { get; set; }
        public Nullable<System.DateTime> CheckedDate { get; set; }
        public Nullable<int> ApprovedById { get; set; }
        public Nullable<System.DateTime> ApprovalDate { get; set; }
        public string Remark { get; set; }
        public string PaymentMode { get; set; }
        public bool WithHoldingApplied { get; set; }
    
        public virtual hrmsEmployee hrmsEmployee { get; set; }
        public virtual hrmsEmployee hrmsEmployee1 { get; set; }
        public virtual hrmsEmployee hrmsEmployee2 { get; set; }
        public virtual iffsCustomer iffsCustomer { get; set; }
        public virtual ICollection<iffsInvoiceDetail> iffsInvoiceDetail { get; set; }
        public virtual iffsLupOperationType iffsLupOperationType { get; set; }
        public virtual ICollection<iffsInvoiceOperation> iffsInvoiceOperation { get; set; }
    }
}
