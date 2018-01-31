SET wwwRoot=D:\home\site\wwwroot
SET wwwAppConfigContentTesting=%wwwRoot%\App_Config\Include\ContentTesting

if exist $wwwAppConfigContentTesting\Sitecore.ContentTesting.PreemptiveScreenshot.config (ren $wwwAppConfigContentTesting\Sitecore.ContentTesting.PreemptiveScreenshot.config Sitecore.ContentTesting.PreemptiveScreenshot.disabled)