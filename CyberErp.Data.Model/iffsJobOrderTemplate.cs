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
    
    public partial class iffsJobOrderTemplate
    {
        public int Id { get; set; }
        public Nullable<int> OperationTypeId { get; set; }
        public string FieldCategory { get; set; }
        public string Field { get; set; }
        public string DefaultValue { get; set; }
    
        public virtual iffsLupOperationType iffsLupOperationType { get; set; }
    }
}