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
    
    public partial class iffsPackingSurveyDetail
    {
        public int Id { get; set; }
        public int HeaderId { get; set; }
        public int RoomTypeId { get; set; }
        public string Description { get; set; }
        public decimal Length { get; set; }
        public decimal Height { get; set; }
        public decimal Width { get; set; }
        public int Quantity { get; set; }
        public bool IsDeleted { get; set; }
        public byte[] LastUpdated { get; set; }
    
        public virtual iffsLupRoomType iffsLupRoomType { get; set; }
        public virtual iffsPackingSurveyHeader iffsPackingSurveyHeader { get; set; }
    }
}
