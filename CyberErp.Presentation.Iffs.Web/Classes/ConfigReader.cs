using System.Configuration;

namespace CyberErp.Presentation.Iffs.Web.Classes
{
    public static class ConfigReader
    {
        public static string GetConnectionString(string key)
        {
            return ConfigurationManager.ConnectionStrings[key].ConnectionString;
        }
    }
}