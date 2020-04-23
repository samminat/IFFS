using CyberErp.Data.Model;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;

namespace SwiftTederash.Business
{
    public class User : BaseModel<coreUser>
    {
        public User(DbContext dbContext)
            : base(dbContext)
        {

        }


    }
}
