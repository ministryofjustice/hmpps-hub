$wwwRoot = "D:\home\site\wwwroot"
$wwwAppConfigInclude = "$wwwRoot\App_Config\Include"
$wwwAdminLocation = "$wwwRoot\sitecore\admin"

if ([IO.File]::Exists("$wwwAppConfigInclude\Sitecore.WebDAV.config")) { ren "$wwwAppConfigInclude\Sitecore.WebDAV.config" "Sitecore.WebDAV.config.disabled" }

if ([IO.File]::Exists("$wwwAdminLocation\Cache.aspx")) { ren "$wwwAdminLocation\Cache.aspx" "Cache.aspx.disabled" }
if ([IO.File]::Exists("$wwwAdminLocation\DBCleanup.aspx")) { ren "$wwwAdminLocation\DBCleanup.aspx" "DBCleanup.aspx.disabled" }
if ([IO.File]::Exists("$wwwAdminLocation\dbbrowser.aspx")) { ren "$wwwAdminLocation\dbbrowser.aspx" "dbbrowser.aspx.disabled" }
if ([IO.File]::Exists("$wwwAdminLocation\ShowServicesConfig.aspx")) { ren "$wwwAdminLocation\ShowServicesConfig.aspx" "ShowServicesConfig.aspx.disabled" }
if ([IO.File]::Exists("$wwwAdminLocation\eventqueuestats.aspx")) { ren "$wwwAdminLocation\eventqueuestats.aspx" "eventqueuestats.aspx.disabled" }
if ([IO.File]::Exists("$wwwAdminLocation\FillDB.aspx")) { ren "$wwwAdminLocation\FillDB.aspx" "FillDB.aspx.disabled" }
if ([IO.File]::Exists("$wwwAdminLocation\InstallLanguage.aspx")) { ren "$wwwAdminLocation\InstallLanguage.aspx" "InstallLanguage.aspx.disabled" }
if ([IO.File]::Exists("$wwwAdminLocation\Jobs.aspx")) { ren "$wwwAdminLocation\Jobs.aspx" "Jobs.aspx.disabled" }
if ([IO.File]::Exists("$wwwAdminLocation\LinqScratchPad.aspx")) { ren "$wwwAdminLocation\LinqScratchPad.aspx" "LinqScratchPad.aspx.disabled" }
if ([IO.File]::Exists("$wwwAdminLocation\Logs.aspx")) { ren "$wwwAdminLocation\Logs.aspx" "Logs.aspx.disabled" }
if ([IO.File]::Exists("$wwwAdminLocation\MediaHash.aspx")) { ren "$wwwAdminLocation\MediaHash.aspx" "MediaHash.aspx.disabled" }
if ([IO.File]::Exists("$wwwAdminLocation\PackageItem.aspx")) { ren "$wwwAdminLocation\PackageItem.aspx" "PackageItem.aspx.disabled" }
if ([IO.File]::Exists("$wwwAdminLocation\PathAnalyzer.aspx")) { ren "$wwwAdminLocation\PathAnalyzer.aspx" "PathAnalyzer.aspx.disabled" }
if ([IO.File]::Exists("$wwwAdminLocation\Pipelines.aspx")) { ren "$wwwAdminLocation\Pipelines.aspx" "Pipelines.aspx.disabled" }
if ([IO.File]::Exists("$wwwAdminLocation\PublishQueueStats.aspx")) { ren "$wwwAdminLocation\PublishQueueStats.aspx" "PublishQueueStats.aspx.disabled" }
if ([IO.File]::Exists("$wwwAdminLocation\RawSearch.aspx")) { ren "$wwwAdminLocation\RawSearch.aspx" "RawSearch.aspx.disabled" }
if ([IO.File]::Exists("$wwwAdminLocation\RebuildKeyBehaviorCache.aspx")) { ren "$wwwAdminLocation\RebuildKeyBehaviorCache.aspx" "RebuildKeyBehaviorCache.aspx.disabled" }
if ([IO.File]::Exists("$wwwAdminLocation\RebuildReportingDB.aspx")) { ren "$wwwAdminLocation\RebuildReportingDB.aspx" "RebuildReportingDB.aspx.disabled" }
if ([IO.File]::Exists("$wwwAdminLocation\RedeployMarketingData.aspx")) { ren "$wwwAdminLocation\RedeployMarketingData.aspx" "RedeployMarketingData.aspx.disabled" }
if ([IO.File]::Exists("$wwwAdminLocation\RemoveBrokenLinks.aspx")) { ren "$wwwAdminLocation\RemoveBrokenLinks.aspx" "RemoveBrokenLinks.aspx.disabled" }
if ([IO.File]::Exists("$wwwAdminLocation\restore.aspx")) { ren "$wwwAdminLocation\restore.aspx" "restore.aspx.disabled" }
if ([IO.File]::Exists("$wwwAdminLocation\SecurityTools.aspx")) { ren "$wwwAdminLocation\SecurityTools.aspx" "SecurityTools.aspx.disabled" }
if ([IO.File]::Exists("$wwwAdminLocation\serialization.aspx")) { ren "$wwwAdminLocation\serialization.aspx" "serialization.aspx.disabled" }
if ([IO.File]::Exists("$wwwAdminLocation\SetSACEndpoint.aspx")) { ren "$wwwAdminLocation\SetSACEndpoint.aspx" "SetSACEndpoint.aspx.disabled" }
if ([IO.File]::Exists("$wwwAdminLocation\ShowConfig.aspx")) { ren "$wwwAdminLocation\ShowConfig.aspx" "ShowConfig.aspx.disabled" }
if ([IO.File]::Exists("$wwwAdminLocation\SqlShell.aspx")) { ren "$wwwAdminLocation\SqlShell.aspx" "SqlShell.aspx.disabled" }
if ([IO.File]::Exists("$wwwAdminLocation\stats.aspx")) { ren "$wwwAdminLocation\stats.aspx" "stats.aspx.disabled" }
if ([IO.File]::Exists("$wwwAdminLocation\unlock_admin.aspx")) { ren "$wwwAdminLocation\unlock_admin.aspx" "unlock_admin.aspx.disabled" }

Remove-Item "$wwwRoot\App_Data\Unicorn" -Recurse -ErrorAction Ignore