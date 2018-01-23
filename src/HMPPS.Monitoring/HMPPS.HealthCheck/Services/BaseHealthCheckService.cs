using HMPPS.ErrorReporting;
using System;
using System.Collections.Generic;
using System.Reflection;

namespace HMPPS.HealthCheck.Services
{
    public abstract class BaseHealthCheckService
    {
        private readonly ILogManager _logManager;

        public BaseHealthCheckService(ILogManager logManager)
        {
            _logManager = logManager;
        }

        public IList<HealthCheckFacet> GetHealthCheckResults(params string[] checksToRun)
        {
            var healthCheckResults = new List<HealthCheckFacet>();

            if (checksToRun == null)
            {
                _logManager.LogDebug("No health checks operations specified.", GetType());

                return healthCheckResults;
            }

            foreach (var item in checksToRun)
            {
                var check = GetHealthCheckMethod(item);

                if (check == null)
                {
                    continue;
                }

                healthCheckResults.Add(RunCheck(check));
            }

            return healthCheckResults;    
        }

        private HealthCheckFacet RunCheck(MethodInfo check)
        {
            try
            {
                var checkResult = check.Invoke(this, null) as HealthCheckFacet;

                return checkResult;
            }
            catch (Exception ex)
            {
                _logManager.LogError($"Health check operation {check.Name} threw an exception.", ex, GetType());

                return new HealthCheckFacet { Name = check.Name, Healthy = false };
            }
        }

        protected abstract MethodInfo GetHealthCheckMethod(string checkName);
    }
}
