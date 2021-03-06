using System;

namespace HMPPS.ErrorReporting
{
    public interface ILogManager
    {
        void LogInfo(string message, Type sourceType);
        void LogAudit(string message, Type sourceType);
        void LogDebug(string message, Type sourceType);
        void LogWarning(string message, Type sourceType);
        void LogError(string message, Type sourceType);
        void LogError(string message, Exception ex, Type sourceType);
    }
}
