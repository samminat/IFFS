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
    
    public partial class iffsLupContainerType
    {
        public iffsLupContainerType()
        {
            this.iffsServiceRequestDetail = new HashSet<iffsServiceRequestDetail>();
            this.iffsContainer = new HashSet<iffsContainer>();
        }
    
        public int Id { get; set; }
        public string Name { get; set; }
        public string Code { get; set; }
        public bool IsDeleted { get; set; }
        public byte[] LastUpdated { get; set; }
    
        public virtual ICollection<iffsServiceRequestDetail> iffsServiceRequestDetail { get; set; }
        public virtual ICollection<iffsContainer> iffsContainer { get; set; }
    }
}
