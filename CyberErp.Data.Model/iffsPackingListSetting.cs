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
    
    public partial class iffsPackingListSetting
    {
        public iffsPackingListSetting()
        {
            this.iffsPackingListSetting1 = new HashSet<iffsPackingListSetting>();
        }
    
        public int Id { get; set; }
        public string Name { get; set; }
        public string Code { get; set; }
        public Nullable<int> ParentId { get; set; }
    
        public virtual ICollection<iffsPackingListSetting> iffsPackingListSetting1 { get; set; }
        public virtual iffsPackingListSetting iffsPackingListSetting2 { get; set; }
    }
}