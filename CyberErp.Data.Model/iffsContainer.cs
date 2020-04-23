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
    
    public partial class iffsContainer
    {
        public iffsContainer()
        {
            this.iffsContainerStatus = new HashSet<iffsContainerStatus>();
        }
    
        public int Id { get; set; }
        public int OperationId { get; set; }
        public string ContainerNo { get; set; }
        public int ContainerTypeId { get; set; }
        public int Quantity { get; set; }
        public Nullable<decimal> NetWeight { get; set; }
        public Nullable<decimal> GracePeriod { get; set; }
        public Nullable<decimal> Charge20 { get; set; }
        public Nullable<decimal> Charge40 { get; set; }
        public Nullable<decimal> Length { get; set; }
        public Nullable<decimal> Height { get; set; }
        public Nullable<int> CurrencyId { get; set; }
        public string Remark { get; set; }
        public bool IsDeleted { get; set; }
        public byte[] LastUpdated { get; set; }
        public string Description { get; set; }
    
        public virtual iffsLupContainerType iffsLupContainerType { get; set; }
        public virtual iffsLupCurrency iffsLupCurrency { get; set; }
        public virtual iffsOperation iffsOperation { get; set; }
        public virtual ICollection<iffsContainerStatus> iffsContainerStatus { get; set; }
    }
}
