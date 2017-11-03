using System.Web.Optimization;
using Sitecore.Pipelines;

namespace HMPPS.Site
{
    /// <summary>
    /// Global.asax is private in Sitecore 8.2. Any application event / global.asax code must go into an initialization pipeline
    /// </summary>
    public class RegisterBundles
    {
        public void Process(PipelineArgs args)
        {
            // app start here
            BundleConfig.RegisterBundles(BundleTable.Bundles);
        }
    }
}
