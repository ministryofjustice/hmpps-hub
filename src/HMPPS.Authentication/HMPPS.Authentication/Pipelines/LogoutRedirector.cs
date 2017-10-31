using Sitecore.Pipelines.HttpRequest;
using Sitecore.Web;
using HMPPS.Utilities.Interfaces;


namespace HMPPS.Authentication.Pipelines
{
    public class LogoutRedirector : AuthenticationProcessorBase
    {

        private readonly IUserDataService _userDataService;

        public LogoutRedirector(IUserDataService userDataService)
        {
            _userDataService = userDataService;
        }
        public override void Process(HttpRequestArgs args)
        {
            // Only act on requests against the logout URL
            if (!args.Context.Request.Url.AbsoluteUri.StartsWith(Settings.LogoutUrl)) return;

            // Temporary so we can test log in and out with different user. Probably can delete this whole thing later.
            // unless we need to add a log out button.
            Sitecore.Security.Authentication.AuthenticationManager.Logout();

            _userDataService.DeleteUserDataCookie(args.Context);

            // Redirect the user to the SSO logout URL.
            WebUtil.Redirect(Settings.LogoutEndpoint);
        }
    }
}
