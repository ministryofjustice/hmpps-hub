using System;
using Sitecore.Diagnostics;

namespace HMPPS.ErrorReporting
{
    public class SitecoreErrorManager : IErrorManager
    {
        public void LogInfo(string message, Type sourceType)
        {
            Log.Info(message, sourceType);
        }
        public void LogAudit(string message, Type sourceType)
        {
            Log.Audit(message, sourceType);
        }
        public void LogDebug(string message, Type sourceType)
        {
            Log.Debug(message, sourceType);
        }
        public void LogWarning(string message, Type sourceType)
        {
            Log.Warn(message, sourceType);
        }
        public void LogError(string message, Exception ex, Type sourceType)
        {
            Log.Error(message, ex, sourceType);
        }
    }
}
