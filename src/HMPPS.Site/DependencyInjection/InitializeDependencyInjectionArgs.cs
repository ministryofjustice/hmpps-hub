using Microsoft.Extensions.DependencyInjection;
using Sitecore.Pipelines;

namespace HMPPS.Site.DependencyInjection
{
    /// <summary>
    /// https://github.com/GuitarRich/Habitat/tree/feature/dependency-injetion-8.2/src
    /// </summary>
    public class InitializeDependencyInjectionArgs : PipelineArgs
    {
        public IServiceCollection ServiceCollection { get; set; }

        public InitializeDependencyInjectionArgs(IServiceCollection serviceCollection)
        {
            this.ServiceCollection = serviceCollection;
        }
    }
}
