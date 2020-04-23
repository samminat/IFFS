<%@ Page Language="C#" Inherits="System.Web.Mvc.ViewPage<dynamic>" %>

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
    <!--  <script type="text/javascript" src="<% = Url.Content("~/Scripts/iframe-component.js") %>"></script> -->
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
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/ShipmentType.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/PackingMaterialSetting.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/PackingMaterialSurvey.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/PackingListSetting.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/SurveyRequest.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/SurveyRequestNotification.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/PackingSurveyDetail.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/PackingSurvey.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/ReceivingClient.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/PackingCrateAndBoxRequest.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/PackingMaterial.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/Packing.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/PackingList.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/PackingMaterialConsumption.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/PackingDamageReport.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/PackingAbsentDays.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/PackingTruckAndMachine.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/DirectApi") %>"></script>

    <!-- Calendar-specific includes -->
    <link rel="stylesheet" type="text/css" href="<% = Url.Content("~/Scripts/calendar/resources/css/calendar.css" )%>" />
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/calendar/calendar-all-debug.js" )%>"></script>
      <script type="text/javascript" src="<% = Url.Content("~/Scripts/calendar/calendar-all.js" )%>"></script>
     <%--<script type="text/javascript" src="<% = Url.Content("~/Scripts/calendar/src/Ext.calendar.js" )%>"></script>--%>
    <script type="text/javascript" src="<% =Url.Content("~/Scripts/calendar/src/templates/DayHeaderTemplate.js" )%>"></script>
    <script type="text/javascript" src="<% =Url.Content("~/Scripts/calendar/src/templates/DayBodyTemplate.js" )%>"></script>
    <script type="text/javascript" src="<% =Url.Content("~/Scripts/calendar/src/templates/DayViewTemplate.js" )%>"></script>
    <script type="text/javascript" src="<% =Url.Content("~/Scripts/calendar/src/templates/BoxLayoutTemplate.js") %>"></script>
    <script type="text/javascript" src="<% =Url.Content("~/Scripts/calendar/src/templates/MonthViewTemplate.js") %>"></script>
  <%--  <script type="text/javascript" src="<% =Url.Content("~/Scripts/calendar/src/dd/CalendarScrollManager.js") %>"></script>
    <script type="text/javascript" src="<% =Url.Content("~/Scripts/calendar/src/dd/StatusProxy.js") %>"></script>
    <script type="text/javascript" src="<% =Url.Content("~/Scripts/calendar/src/dd/CalendarDD.js") %>"></script>
    <script type="text/javascript" src="<% =Url.Content("~/Scripts/calendar/src/dd/DayViewDD.js" )%>"></script>--%>
    <script type="text/javascript" src="<% =Url.Content("~/Scripts/calendar/src/EventRecord.js" )%>"></script>
    <script type="text/javascript" src="<% =Url.Content("~/Scripts/calendar/src/views/MonthDayDetailView.js" )%>"></script>
    <script type="text/javascript" src="<% =Url.Content("~/Scripts/calendar/src/widgets/CalendarPicker.js" )%>"></script>
    <script type="text/javascript" src="<% =Url.Content("~/Scripts/calendar/src/WeekEventRenderer.js" )%>"></script>
    <script type="text/javascript" src="<% =Url.Content("~/Scripts/calendar/src/views/CalendarView.js" )%>"></script>
    <script type="text/javascript" src="<% =Url.Content("~/Scripts/calendar/src/views/MonthView.js" )%>"></script>
    <script type="text/javascript" src="<% =Url.Content("~/Scripts/calendar/src/views/DayHeaderView.js") %>"></script>
    <script type="text/javascript" src="<% =Url.Content("~/Scripts/calendar/src/views/DayBodyView.js") %>"></script>
    <script type="text/javascript" src="<% =Url.Content("~/Scripts/calendar/src/views/DayView.js" )%>"></script>
    <script type="text/javascript" src="<% =Url.Content("~/Scripts/calendar/src/views/WeekView.js") %>"></script>
    <script type="text/javascript" src="<% =Url.Content("~/Scripts/calendar/src/widgets/DateRangeField.js" )%>"></script>
    <script type="text/javascript" src="<% =Url.Content("~/Scripts/calendar/src/widgets/ReminderField.js")%>"></script>
    <script type="text/javascript" src="<% =Url.Content("~/Scripts/calendar/src/EventEditForm.js" )%>"></script>
    <script type="text/javascript" src="<% =Url.Content("~/Scripts/calendar/src/EventEditWindow.js" )%>"></script>
    <script type="text/javascript" src="<% =Url.Content("~/Scripts/calendar/src/CalendarPanel.js" )%>"></script>
    <%--<script type="text/javascript" src="<% =Url.Content("~/Scripts/calendar/app/event-list.js" )%>"></script>--%>
    <script type="text/javascript" src="<% =Url.Content("~/Scripts/calendar/app/test-app.js" )%>"></script>

    <%--Script Tag to access C# constants from extjs --%>
    <script type="text/javascript" src="<% = Url.Action("ConstantsViewer") %>"></script>
</head>
<body>
    <div>
    </div>
</body>
</html>
