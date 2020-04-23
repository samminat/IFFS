using CyberErp.Presentation.Iffs.Web.Classes;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.Routing;

namespace CyberErp.Presentation.Iffs.Web
{
    // Note: For instructions on enabling IIS6 or IIS7 classic mode, 
    // visit http://go.microsoft.com/?LinkId=9394801
    public class MvcApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {
            AreaRegistration.RegisterAllAreas();

            WebApiConfig.Register(GlobalConfiguration.Configuration);
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);

            Constants.ConnectionString = ConfigurationManager.ConnectionStrings["ErpEntities"].ConnectionString;
            
        }

        protected void Session_Start()
        {
            Session.Timeout = 720;
            Session[Constants.CurrentUser] = null;
            Session[Constants.UserPermission] = null;
        }

        protected void Session_End()
        {
            Session[Constants.CurrentUser] = null;
            Session[Constants.UserPermission] = null;
        }
    }
}