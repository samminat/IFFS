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
    
    public partial class iffsPackingTruckAndMachine
    {
        public int Id { get; set; }
        public int HeaderId { get; set; }
        public int TruckType { get; set; }
        public int NumberOfTrip { get; set; }
        public decimal EstimatedKmCovered { get; set; }
        public string Remark { get; set; }
        public bool IsDeleted { get; set; }
        public byte[] LastUpdated { get; set; }
    
        public virtual iffsLupTruckType iffsLupTruckType { get; set; }
        public virtual iffsPackingHeader iffsPackingHeader { get; set; }
    }
}
