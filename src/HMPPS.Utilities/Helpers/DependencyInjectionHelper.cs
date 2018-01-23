using Sitecore.DependencyInjection;
using System;

namespace HMPPS.Utilities.Helpers
{
    public static class DependencyInjectionHelper
    {
        public static T ResolveService<T>() where T : class
        {
            var service =  ServiceLocator.ServiceProvider.GetService(typeof(T)) as T;

            if (service == null)
            {
                throw new InvalidOperationException($"No service registered for type {typeof(T)}");
            }

            return service;
        }
    }
}
