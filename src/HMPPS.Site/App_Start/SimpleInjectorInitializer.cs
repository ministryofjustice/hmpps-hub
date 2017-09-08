using SimpleInjector;
using SimpleInjector.Integration.Web;

namespace HMPPS.Site
{
    public class SimpleInjectorInitializer
    {
        private static Container _default;

        public static Container Default
        {
            get
            {
                if (_default == null)
                    _default = InitContainer();

                return _default ?? InitContainer();
            }
        }

        private static Container InitContainer()
        {
            /* 
          * Some notes on Lifestyle:
          * - If a class depends on an item with scoped lifestyle then it must have a scoped lifestyle as well
          * - UmbracoContext/UmbracoHelper should be registered as scoped to ensure the request context is up to date
          */

            var container = new Container();
            container.Options.DefaultScopedLifestyle = new WebRequestLifestyle();//Set Scoped to behave as "PerWebRequest"

            RegisterInstances(container);

            container.Verify(); // Make sure everything is valid

            return container;
        }

        public static void RegisterInstances(Container container)
        {
            // config 

            // singleton repositories

            // web-request scoped repositories

            // services

            // cache
            container.Register(() => System.Runtime.Caching.MemoryCache.Default, Lifestyle.Singleton);

        }
    }
}