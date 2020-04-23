using CyberErp.Data.Model;
using System.Collections.Generic;
using SwiftTederash.Business;
using System;
using System.Data.Entity;
using System.Data.Objects;
using System.Linq;
using System.Web;
using System.Collections.Generic;
namespace CyberErp.Presentation.Iffs.Web.Classes
{
    public class Utility
    {
        #region Members

        private readonly DbContext _context;
        private readonly BaseModel<iffsDocumentNoSetting> _documentNoSetting;

        #endregion

        #region Constructor

        public Utility()
        {
            _context = new ErpEntities(Constants.ConnectionString);
            _documentNoSetting = new BaseModel<iffsDocumentNoSetting>(_context);
        }

        #endregion

        public static string InQuotation(string paramString)
        {
            if (paramString == "")
            {
                return (char)39 + "" + (char)39;
            }
            else
            {
                return (char)39 + paramString + (char)39;
            }
            
        }

        public static double DateDiffInMonths(DateTime startDate, DateTime endDate)
        {
            int monthsOnly = (endDate.Month + endDate.Year * 12) - (startDate.Month + startDate.Year * 12);
            double daysInEndMonth = (endDate - endDate.AddMonths(1)).Days;
            double totalMonths = monthsOnly + ((startDate.Day - endDate.Day - 1) / daysInEndMonth);
            return totalMonths;
        }
        public string GetDocumentNumber(string documentType)
        {
            try
            {
                var objDocumentNoSetting = _documentNoSetting.GetAll().Where(o => o.DocumentType == documentType).FirstOrDefault();
                var format = GetDocumentFormat(objDocumentNoSetting.NoOfDigit);
                var documentNo=string.Format(format, objDocumentNoSetting.CurrentNo);
                 documentNo = objDocumentNoSetting.Prefix + "/" + documentNo;
                if (objDocumentNoSetting.Year != null && objDocumentNoSetting.Year > 0)
                    documentNo = documentNo + "/" + objDocumentNoSetting.Year;
                if (objDocumentNoSetting.SurFix != null && objDocumentNoSetting.SurFix !="")
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
            var objDocumentNoSetting = _documentNoSetting.GetAll().Where(o => o.DocumentType == documentType).FirstOrDefault();
            if (objDocumentNoSetting != null)
            {
                objDocumentNoSetting.CurrentNo += 1;
            }
            _context.SaveChanges();
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

        public static void CopyObject(object source, object destination)
        {
            var destProperties = destination.GetType().GetProperties();

            foreach (var sourceProperty in source.GetType().GetProperties())
            {
                foreach (var destProperty in destProperties)
                {
                    if (destProperty.Name == sourceProperty.Name && destProperty.PropertyType.IsAssignableFrom(sourceProperty.PropertyType))
                    {
                        destProperty.SetValue(destination, sourceProperty.GetValue(source, new object[] { }), new object[] { });
                        break;
                    }
                }
            }
        }
    }
}