using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace HMPPS.Site.Controllers.Api
{
    public class HealthController : ApiController
    {
        [HttpGet]
        public string Index()
        {
            return "it works";
        }
    }
}
