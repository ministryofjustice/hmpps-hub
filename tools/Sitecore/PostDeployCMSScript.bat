SETLOCAL
SET wwwRoot=D:\home\site\wwwroot
SET wwwAppConfigContentTesting=%wwwRoot%\App_Config\Include\ContentTesting

REM remove Unicorn folder:
RD /S /Q $wwwRoot\App_Data\Unicorn

REM disable PreemptiveScreenshot config file:
if exist %wwwAppConfigContentTesting%\Sitecore.ContentTesting.PreemptiveScreenshot.config (ren %wwwAppConfigContentTesting%\Sitecore.ContentTesting.PreemptiveScreenshot.config Sitecore.ContentTesting.PreemptiveScreenshot.config.disabled)