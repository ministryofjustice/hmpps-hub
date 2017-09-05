using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace HMPPS.Site.Controllers.Pages
{
    public class AuthController : Controller
    {
        public ActionResult SignIn()
        {
            var state = Guid.NewGuid().ToString("N");

            var url = "https://51.141.55.159:8080/openam/oauth2/authorize" +
                "?client_id=CMS_E3_CLIENTID" +
                "&response_type=code" +
                "&scope=" + Server.UrlEncode("openid email profile") +
                "&redirect_uri=" + Server.UrlEncode("https://localhost:4962/auth-callback") +
                "&state=" + state;

            Session["state"] = state;

            return Redirect(url);
        }

    }
}
