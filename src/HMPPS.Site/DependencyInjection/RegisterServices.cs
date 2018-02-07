using HMPPS.ErrorReporting;
using HMPPS.NomisApiService.Interfaces;
using HMPPS.Utilities.Interfaces;
using HMPPS.Utilities.Services;
using Microsoft.Extensions.DependencyInjection;

namespace HMPPS.Site.DependencyInjection
{
    public class RegisterServices
    {
        public void Process(InitializeDependencyInjectionArgs args)
        {
            // List all services used by MVC controllers

            args.ServiceCollection.AddSingleton<ICacheService, CacheService>();
            args.ServiceCollection.AddSingleton<ILogManager, SitecoreLogManager>();

            args.ServiceCollection.AddTransient<INomisApiService, NomisApiService.Services.NomisApiService>();

            args.ServiceCollection.AddTransient<IUserDataService, UserDataService>();
            args.ServiceCollection.AddTransient<IEncryptionService, EncryptionService>();
            args.ServiceCollection.AddTransient<IJwtTokenService, JwtTokenService>();

            //args.ServiceCollection.AddMvcControllersInCurrentAssembly();
        }
    }
}
