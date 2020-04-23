<%@ Page Language="C#" Inherits="System.Web.Mvc.ViewPage<dynamic>"  %>

<!DOCTYPE html>

<html>
<head runat="server">
    <meta name="viewport" content="width=device-width" />
    <title>Integrated Freight Forwarding System</title>
    <link rel="shortcut icon" href="<% = Url.Content("~/Content/images/app/favicon.ico") %>" />

    <link type="text/css" href="<% = Url.Content("~/Content/css/ext-all.css") %>" rel="Stylesheet" />
    <link type="text/css" href="<% = Url.Content("~/Content/css/app/main.css") %>" rel="Stylesheet" />
    <link type="text/css" href="<% = Url.Content("~/Content/css/app/icons.css") %>" rel="Stylesheet" />
    <link type="text/css" href="<% = Url.Content("~/Content/css/app/fileuploadfield.css") %>" rel="Stylesheet" />

    <script type="text/javascript" src="<% = Url.Content("~/Scripts/ext-base.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/ext-all.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/tab-close-menu.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/ux-util.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/array-tree.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/SystemMessage.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/SystemMessageManager.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/PagingRowNumberer.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/iframe-component.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/FileUploadField.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/ComboColumn.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/PasswordChange.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/Lookup.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/Customer.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/Service.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/RoleSetting.js") %>"></script>

    <script type="text/javascript" src="<% = Url.Content("~/Scripts/JobOrderTemplate.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/JobOrder.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/JobOrderDocument.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/Approver.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/ServiceRequest.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/QuotationTemplate.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/Common.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/ServiceRate.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/Quotation.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/termsAndConditionsTemplate.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/DocumentNoSetting.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/ServiceAgreement.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/OperationDocumentTemplate.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/UserOperationTypeMapping.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/ApprovedJobOrders.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/ApprovedJobOrdersViewer.js") %>"></script>
     <script type="text/javascript" src="<% = Url.Content("~/Scripts/UsersSelector.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/DocumentConfirmation.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/JobOrderDocumentChecklist.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/OperationStatusTemplate.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/OperationExpenseTemplate.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/OperationExpense.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/ServiceRequestFileUploader.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/JobOrderHistory.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/Operation.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/Notifications.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/JobOrderStatus.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/Container.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/ContainerStatusTemplate.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/ContainerStatus.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/Invoice.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/Login.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/Logout.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/Reception.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/Workbench.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/DirectApi") %>"></script>
    
    <%--Script Tag to access C# constants from extjs --%>
    <script type="text/javascript" src="<% = Url.Action("ConstantsViewer") %>"></script>
</head>
<body>
    <div>
        
    </div>
</body>
</html>
