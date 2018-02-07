using System.Web;

namespace HMPPS.Utilities.Helpers
{
    public class SessionHelper
    {
        public static T Get<T>(HttpContext context, string key)
        {
            if (!SessionIsAvailable(context)) return default(T);
            var o = context.Session[key];
            if (o is T variable)
            {
                return variable;
            }
            return default(T);
        }
        public static void Set<T>(HttpContext context, string key, T item)
        {
            if (SessionIsAvailable(context))
            {
                context.Session[key] = item;
            }
        }

        public static void Remove(HttpContext context, string key)
        {
            if (SessionIsAvailable(context))
            {
                context.Session.Remove(key);
            }
        }

        private static bool SessionIsAvailable(HttpContext context)
        {
            return context?.Session != null; 
        }
    }
}
