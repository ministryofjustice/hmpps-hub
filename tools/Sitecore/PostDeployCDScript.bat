SETLOCAL 
SET wwwRoot=D:\home\site\wwwroot
SET wwwAppConfigInclud=%wwwRoot%\App_Config\Include
SET wwwAdminLocation=%wwwRoot%\sitecore\admin

REM Sitecore security hardening for the CD site:

if exist $wwwAppConfigInclude\Sitecore.WebDAV.config (ren $wwwAppConfigInclude\Sitecore.WebDAV.config Sitecore.WebDAV.config.disabled)

if exist %wwwAdminLocation%\Cache.aspx (ren %wwwAdminLocation%\Cache.aspx Cache.aspx.disabled)
if exist %wwwAdminLocation%\DBCleanup.aspx (ren %wwwAdminLocation%\DBCleanup.aspx DBCleanup.aspx.disabled)
if exist %wwwAdminLocation%\dbbrowser.aspx (ren %wwwAdminLocation%\dbbrowser.aspx dbbrowser.aspx.disabled)
if exist %wwwAdminLocation%\ShowServicesConfig.aspx (ren %wwwAdminLocation%\ShowServicesConfig.aspx ShowServicesConfig.aspx.disabled)
if exist %wwwAdminLocation%\eventqueuestats.aspx (ren %wwwAdminLocation%\eventqueuestats.aspx eventqueuestats.aspx.disabled)
if exist %wwwAdminLocation%\FillDB.aspx (ren %wwwAdminLocation%\FillDB.aspx FillDB.aspx.disabled)
if exist %wwwAdminLocation%\InstallLanguage.aspx (ren %wwwAdminLocation%\InstallLanguage.aspx InstallLanguage.aspx.disabled)
if exist %wwwAdminLocation%\Jobs.aspx (ren %wwwAdminLocation%\Jobs.aspx Jobs.aspx.disabled)
if exist %wwwAdminLocation%\LinqScratchPad.aspx (ren %wwwAdminLocation%\LinqScratchPad.aspx LinqScratchPad.aspx.disabled)
if exist %wwwAdminLocation%\Logs.aspx (ren %wwwAdminLocation%\Logs.aspx Logs.aspx.disabled)
if exist %wwwAdminLocation%\MediaHash.aspx (ren %wwwAdminLocation%\MediaHash.aspx MediaHash.aspx.disabled)
if exist %wwwAdminLocation%\PackageItem.aspx (ren %wwwAdminLocation%\PackageItem.aspx PackageItem.aspx.disabled)
if exist %wwwAdminLocation%\PathAnalyzer.aspx (ren %wwwAdminLocation%\PathAnalyzer.aspx PathAnalyzer.aspx.disabled)
if exist %wwwAdminLocation%\Pipelines.aspx (ren %wwwAdminLocation%\Pipelines.aspx Pipelines.aspx.disabled)
if exist %wwwAdminLocation%\PublishQueueStats.aspx (ren %wwwAdminLocation%\PublishQueueStats.aspx PublishQueueStats.aspx.disabled)
if exist %wwwAdminLocation%\RawSearch.aspx (ren %wwwAdminLocation%\RawSearch.aspx RawSearch.aspx.disabled)
if exist %wwwAdminLocation%\RebuildKeyBehaviorCache.aspx (ren %wwwAdminLocation%\RebuildKeyBehaviorCache.aspx RebuildKeyBehaviorCache.aspx.disabled)
if exist %wwwAdminLocation%\RebuildReportingDB.aspx (ren %wwwAdminLocation%\RebuildReportingDB.aspx RebuildReportingDB.aspx.disabled)
if exist %wwwAdminLocation%\RedeployMarketingData.aspx (ren %wwwAdminLocation%\RedeployMarketingData.aspx RedeployMarketingData.aspx.disabled)
if exist %wwwAdminLocation%\RemoveBrokenLinks.aspx (ren %wwwAdminLocation%\RemoveBrokenLinks.aspx RemoveBrokenLinks.aspx.disabled)
if exist %wwwAdminLocation%\restore.aspx (ren %wwwAdminLocation%\restore.aspx restore.aspx.disabled)
if exist %wwwAdminLocation%\SecurityTools.aspx (ren %wwwAdminLocation%\SecurityTools.aspx SecurityTools.aspx.disabled)
if exist %wwwAdminLocation%\serialization.aspx (ren %wwwAdminLocation%\serialization.aspx serialization.aspx.disabled)
if exist %wwwAdminLocation%\SetSACEndpoint.aspx (ren %wwwAdminLocation%\SetSACEndpoint.aspx SetSACEndpoint.aspx.disabled)
if exist %wwwAdminLocation%\ShowConfig.aspx (ren %wwwAdminLocation%\ShowConfig.aspx ShowConfig.aspx.disabled)
if exist %wwwAdminLocation%\SqlShell.aspx (ren %wwwAdminLocation%\SqlShell.aspx SqlShell.aspx.disabled)
if exist %wwwAdminLocation%\stats.aspx (ren %wwwAdminLocation%\stats.aspx stats.aspx.disabled)
if exist %wwwAdminLocation%\unlock_admin.aspx (ren %wwwAdminLocation%\unlock_admin.aspx unlock_admin.aspx.disabled)