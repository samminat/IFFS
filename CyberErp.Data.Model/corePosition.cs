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
    
    public partial class corePosition
    {
        public corePosition()
        {
            this.hrmsEmployee = new HashSet<hrmsEmployee>();
        }
    
        public int Id { get; set; }
        public string Code { get; set; }
        public int PositionClassId { get; set; }
        public int UnitId { get; set; }
        public bool IsVacant { get; set; }
        public bool IsDeleted { get; set; }
        public byte[] LastUpdated { get; set; }
    
        public virtual corePositionClass corePositionClass { get; set; }
        public virtual ICollection<hrmsEmployee> hrmsEmployee { get; set; }
    }
}