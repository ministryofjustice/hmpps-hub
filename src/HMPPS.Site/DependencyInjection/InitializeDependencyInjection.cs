using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using Microsoft.Extensions.DependencyInjection;
using SimpleInjector;
using SimpleInjector.Integration.Web.Mvc;
using Sitecore.Pipelines;

namespace HMPPS.Site.DependencyInjection
{

    /// <summary>
    /// https://github.com/GuitarRich/Habitat/tree/feature/dependency-injetion-8.2/src
    /// </summary>
    public class InitializeDependencyInjection
    {
        public void Process(PipelineArgs args)
        {
            var serviceCollection = new ServiceCollection();
            var container = new Container();
            // container.Options.DefaultScopedLifestyle = new WebRequestLifestyle();

            // start the pipeline to register all dependencies
            var dependencyInjectionArgs = new InitializeDependencyInjectionArgs(serviceCollection);
            CorePipeline.Run("initializeDependencyInjection", dependencyInjectionArgs);

            var containerCache = new List<Type>();

            foreach (var serviceDescriptor in dependencyInjectionArgs.ServiceCollection)
            {
                // Safety check so we don't try to register the same type twice
                if (containerCache.Contains(serviceDescriptor.ServiceType))
                {
                    continue;
                }

                Lifestyle siScope;
                switch (serviceDescriptor.Lifetime)
                {
                    case ServiceLifetime.Singleton:
                        siScope = Lifestyle.Singleton;
                        break;

                    case ServiceLifetime.Transient:
                        siScope = Lifestyle.Transient;
                        break;

                    case ServiceLifetime.Scoped:
                    default:
                        siScope = Lifestyle.Scoped;
                        break;
                }

                container.Register(serviceDescriptor.ServiceType, serviceDescriptor.ImplementationType, siScope);
                containerCache.Add(serviceDescriptor.ServiceType);
            }

            // Register Mvc controllers
            var assemblies = AppDomain.CurrentDomain.GetAssemblies()
                .Where(a => a.FullName.StartsWith("HMPPS.Site"));
            container.RegisterMvcControllers(assemblies.ToArray());

            // Register Mvc filter providers
            container.RegisterMvcIntegratedFilterProvider();

            // Verify our registrations
            container.Verify();

            // Set the ASP.NET dependency resolver
            DependencyResolver.SetResolver(new SimpleInjectorDependencyResolver(container));
        }
    }
}
