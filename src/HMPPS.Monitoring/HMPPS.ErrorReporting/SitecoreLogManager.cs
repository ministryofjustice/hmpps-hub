using System;
using Sitecore.Diagnostics;

namespace HMPPS.ErrorReporting
{
    public class SitecoreLogManager : ILogManager
    {
        public void LogInfo(string message, Type sourceType)
        {
            Log.Info(FormatMessage(message, sourceType), sourceType);
        }

        public void LogAudit(string message, Type sourceType)
        {
            Log.Audit(FormatMessage(message, sourceType), sourceType);
        }

        public void LogDebug(string message, Type sourceType)
        {
            Log.Debug(FormatMessage(message, sourceType), sourceType);
        }

        public void LogWarning(string message, Type sourceType)
        {
            Log.Warn(FormatMessage(message, sourceType), sourceType);
        }

        public void LogError(string message, Exception ex, Type sourceType)
        {
            Log.Error(FormatMessage(message, sourceType), ex, sourceType);
        }

        public void LogError(string message, Type sourceType)
        {
            Log.Error(FormatMessage(message, sourceType), sourceType);
        }

        private string FormatMessage(string message, Type sourceType)
        {
            return $"{sourceType.FullName} - {message}";
        }
    }
}
