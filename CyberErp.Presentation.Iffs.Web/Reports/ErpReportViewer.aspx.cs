using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Data.SqlClient;
using System.Web.UI.WebControls;
using CyberErp.ReportEngine.Reports;
using CrystalDecisions.Web;
using CyberErp.Presentation.Iffs.Web;
using CrystalDecisions.CrystalReports.Engine;
using CrystalDecisions.Shared;
using CyberErp.Presentation.Iffs.Web.Classes;
using CyberErp.Presentation.Iffs.Web.Controllers;
using System.Data.EntityClient;
using CyberErp.Presentation.Iffs.Web.Reports;
using SwiftTederash.Business;
using CyberErp.Data.Model;


namespace CyberErp.ReportEngine.Reports
{
    public partial class ErpReportViewer : System.Web.UI.Page
    {
        private CrystalReportSource _source;
        private string _report;
        private ReportDocument repDocument = null;
        

        protected override void OnInit(EventArgs e)
        {
            base.OnInit(e);

            var reportType = Request.QueryString["rt"];
            var voucherNo = "";
            var statusId = "";
            var currencyId = 0;
            var currencyName = "";
            var showTotalDetail = false;
            voucherNo = (Request.QueryString["vn"]);
            statusId = (Request.QueryString["sId"]);
            if (Request.QueryString["showTotalDetail"]!=null)
            showTotalDetail =bool.Parse( (Request.QueryString["showTotalDetail"]));
            if (Request.QueryString["currencyId"] != null)
                currencyId = int.Parse((Request.QueryString["currencyId"]));
            if (Request.QueryString["currencyName"] != null)
                currencyName = Request.QueryString["currencyName"];

            string reportPath = string.Empty;

            #region Set Connection Info
            EntityConnectionStringBuilder entityBuilder = new EntityConnectionStringBuilder(Constants.ConnectionString);
            SqlConnectionStringBuilder builder = new SqlConnectionStringBuilder(entityBuilder.ProviderConnectionString);
            ConnectionInfo connectionInfo = new ConnectionInfo();
            connectionInfo.DatabaseName = builder.InitialCatalog;
            connectionInfo.UserID = builder.UserID;
            connectionInfo.Password = builder.Password;
            connectionInfo.ServerName = builder.DataSource;
            connectionInfo.IntegratedSecurity = builder.IntegratedSecurity;
            #endregion

            if (reportType == "PreviewJO")
            {
                int jobOrderId = 0;
                int.TryParse(Request.QueryString["id"], out jobOrderId);

                this.repDocument = new rptJobOrder();
                this.reportViewer.ReportSource = repDocument;
                Tables repTbls = repDocument.Database.Tables;
                this.SetDBLogonForReport(connectionInfo, repTbls);
                this.reportViewer.ReportSource = repDocument;
                reportViewer.Zoom(75);
                repDocument.DataDefinition.FormulaFields["JobOrderId"].Text = jobOrderId.ToString();
            }
            else if (reportType == "PreviewQuote")
            {
                int quoteId = 0;
                int.TryParse(Request.QueryString["id"], out quoteId);

                this.repDocument = new rptQuotation();
                this.reportViewer.ReportSource = repDocument;
                Tables repTbls = repDocument.Database.Tables;
                this.SetDBLogonForReport(connectionInfo, repTbls);
                this.reportViewer.ReportSource = repDocument;
                reportViewer.Zoom(75);
                repDocument.DataDefinition.FormulaFields["QuotationId"].Text = quoteId.ToString();
            
            }
            else if (reportType == "PreviewInvoice")
            {
                int invoiceId = 0;
                int.TryParse(Request.QueryString["id"], out invoiceId);

                this.repDocument = new rptInvoice();
                this.reportViewer.ReportSource = repDocument;
                Tables repTbls = repDocument.Database.Tables;
                this.SetDBLogonForReport(connectionInfo, repTbls);
                this.reportViewer.ReportSource = repDocument;
                reportViewer.Zoom(75);
                repDocument.DataDefinition.FormulaFields["InvoiceId"].Text = invoiceId.ToString();
                repDocument.DataDefinition.FormulaFields["CurrencyId"].Text = currencyId.ToString();
                repDocument.DataDefinition.FormulaFields["CurrencyName"].Text =Utility.InQuotation( currencyName);
          
            }
            this.reportViewer.DataBind();
            this.reportViewer.RefreshReport();
            this.reportViewer.Visible = true;
            this.reportViewer.DisplayGroupTree = false;
            this.reportViewer.HasToggleGroupTreeButton = false;
            this.reportViewer.HasRefreshButton = true;
            this.reportViewer.EnableDatabaseLogonPrompt = false;
            this.reportViewer.EnableParameterPrompt = false;
            this.reportViewer.BorderStyle = BorderStyle.Solid;
            this.reportViewer.BorderColor = System.Drawing.ColorTranslator.FromHtml("#D0DEF0");
            this.reportViewer.BorderWidth = Unit.Pixel(1);
            this.reportViewer.HasCrystalLogo = false;
            this.reportViewer.BestFitPage = true;
            this.reportViewer.HasDrillUpButton = false;

            this.reportViewer.RefreshReport();
        }

        protected void Page_Load(object sender, EventArgs e)
        {
            
        }

        private void SetDBLogonForReport(ConnectionInfo connectionInfo, Tables reportTables)
        {
            foreach (CrystalDecisions.CrystalReports.Engine.Table table in reportTables)
            {
                TableLogOnInfo tableLogonInfo = table.LogOnInfo;
                tableLogonInfo.ConnectionInfo = connectionInfo;
                table.ApplyLogOnInfo(tableLogonInfo);
            }
        }

        protected void Page_Unload(object sender, EventArgs e)
        {
            if (this.repDocument != null)
            {
                this.repDocument.Close();
                this.repDocument.Dispose();
            }
        }
        
    }
}