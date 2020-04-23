using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data.Objects;
using System.Linq.Expressions;
using System.Data.Entity;
using CyberErp.Data.Infrastructure;
using CyberErp.Data.Model;

namespace CyberErp.Business.Component.Iffs
{
    public class DocumentNoSetting :  Repository<iffsDocumentNoSetting>
    {
        #region Members

        /// <summary>
        /// Manage iffsDocumentNoSetting
        /// </summary>
      //  private readonly IRepository<iffsDocumentNoSetting> _repository;
        #endregion

        #region Constructor

        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="objectContext"></param>
        public DocumentNoSetting(DbContext objectContext)
            : base(objectContext, true)
        {
           // _repository = new Repository<iffsDocumentNoSetting>(objectContext, true);
        }

        #endregion

        #region Methods


        public string GetDocumentNumber(string documentType)
        {
            try
            {
                var objDocumentNoSetting = base.FindAllQueryable(o => o.DocumentType == documentType).FirstOrDefault();
                var format = GetDocumentFormat(objDocumentNoSetting.NoOfDigit);
                objDocumentNoSetting.CurrentNo += 1;
                var documentNo = string.Format(format, objDocumentNoSetting.CurrentNo);
                documentNo = objDocumentNoSetting.Prefix + "/" + documentNo;
                if (objDocumentNoSetting.Year != null && objDocumentNoSetting.Year > 0)
                    documentNo = documentNo + "/" + objDocumentNoSetting.Year;
                if (objDocumentNoSetting.SurFix != null && objDocumentNoSetting.SurFix != "")
                    documentNo = documentNo + "/" + objDocumentNoSetting.SurFix;
                return documentNo;
               
            }
            catch (Exception e)
            {
                return string.Empty;
            }
        }

        public void UpdateDocumentNumber(string documentType)
        {
            var objDocumentNoSetting = base.FindAllQueryable(o => o.DocumentType == documentType).FirstOrDefault();
            if (objDocumentNoSetting != null)
            {
                objDocumentNoSetting.CurrentNo += 1;
            }
            base.SaveChanges();
        }

        public string GetDocumentFormat(int numberOfDigits)
        {
            var format = "{0:";
            for (var i = 0; i < numberOfDigits; i++)
            {
                format += "0";
            }
            format += "}";
            return format;
        }

        #endregion
    }

}
