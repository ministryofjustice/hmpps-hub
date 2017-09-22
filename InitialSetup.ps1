# the path to the WWW directory 
$wwwLocation = $args[0]
$appConfigLocation = "$wwwLocation\App_Config"
$appConfigIncludeLocation = "$appConfigLocation\Include"
$sitecoreDashboardDir = "$wwwLocation\sitecore\shell\Applications\Reports\Dashboard"

Write-Host "Site: $wwwLocation"
Write-Host "Site/App_Config: $appConfigLocation"
Write-Host "Site/App_Config/Includes: $appConfigIncludeLocation"



# test the path exists
$pathExists = Test-Path -path $wwwLocation
If(!$pathExists){
    Write-Host "the site directory specified dosent exist" -ForegroundColor Red
    Exit
}

# navigate to the app config location
cd $appConfigIncludeLocation


# rename the config files in App Config

ren "$appConfigIncludeLocation\DataFolder.config.example" "DataFolder.config"
ren "$appConfigIncludeLocation\ScalabilitySettings.config.example" "ScalabilitySettings.config"
ren "$appConfigIncludeLocation\Sitecore.Analytics.Processing.Aggregation.Services.config" "Sitecore.Analytics.Processing.Aggregation.Services.config.disabled"
ren "$appConfigIncludeLocation\Sitecore.Analytics.Processing.Services.config" "Sitecore.Analytics.Processing.Services.config.disabled"
ren "$appConfigIncludeLocation\Sitecore.Analytics.Tracking.Aggregation.config" "Sitecore.Analytics.Tracking.Aggregation.config.disabled"
ren "$appConfigIncludeLocation\Sitecore.Analytics.Tracking.Database.config" "Sitecore.Analytics.Tracking.Database.config.disabled"
ren "$appConfigIncludeLocation\Sitecore.Analytics.Tracking.RobotDetection.config" "Sitecore.Analytics.Tracking.RobotDetection.config.disabled"
ren "$appConfigIncludeLocation\Sitecore.ContentSearch.Azure.DefaultIndexConfiguration.config.disabled" "Sitecore.ContentSearch.Azure.DefaultIndexConfiguration.config"
ren "$appConfigIncludeLocation\Sitecore.ContentSearch.Azure.Index.Analytics.config.disabled" "Sitecore.ContentSearch.Azure.Index.Analytics.config"
ren "$appConfigIncludeLocation\Sitecore.ContentSearch.Azure.Index.Core.config.disabled" "Sitecore.ContentSearch.Azure.Index.Core.config"
ren "$appConfigIncludeLocation\Sitecore.ContentSearch.Azure.Index.Master.config.disabled" "Sitecore.ContentSearch.Azure.Index.Master.config"
ren "$appConfigIncludeLocation\Sitecore.ContentSearch.Lucene.DefaultIndexConfiguration.config" "Sitecore.ContentSearch.Lucene.DefaultIndexConfiguration.config.disabled"
ren "$appConfigIncludeLocation\Sitecore.ContentSearch.Lucene.DefaultIndexConfiguration.Xdb.config" "Sitecore.ContentSearch.Lucene.DefaultIndexConfiguration.Xdb.config.disabled"
ren "$appConfigIncludeLocation\Sitecore.ContentSearch.Lucene.Index.Analytics.config" "Sitecore.ContentSearch.Lucene.Index.Analytics.config.disabled"
ren "$appConfigIncludeLocation\Sitecore.ContentSearch.Lucene.Index.Core.config" "Sitecore.ContentSearch.Lucene.Index.Core.config.disabled"
ren "$appConfigIncludeLocation\Sitecore.ContentSearch.Lucene.Index.Master.config" "Sitecore.ContentSearch.Lucene.Index.Master.config.disabled"
ren "$appConfigIncludeLocation\Sitecore.ContentSearch.Lucene.Index.Web.config" "Sitecore.ContentSearch.Lucene.Index.Web.config.disabled"
ren "$appConfigIncludeLocation\Sitecore.Diagnostics.config" "Sitecore.Diagnostics.config.disabled"
ren "$appConfigIncludeLocation\Sitecore.EngagementAutomation.Processing.Aggregation.Services.config" "Sitecore.EngagementAutomation.Processing.Aggregation.Services.config.disabled"
ren "$appConfigIncludeLocation\Sitecore.Marketing.Azure.Index.Master.config.disabled" "Sitecore.Marketing.Azure.Index.Master.config"
ren "$appConfigIncludeLocation\Sitecore.Marketing.Azure.IndexConfiguration.config.disabled" "Sitecore.Marketing.Azure.IndexConfiguration.config"
ren "$appConfigIncludeLocation\Sitecore.Marketing.Definitions.MarketingAssets.Repositories.Azure.Index.Master.config.disabled" "Sitecore.Marketing.Definitions.MarketingAssets.Repositories.Azure.Index.Master.config"
ren "$appConfigIncludeLocation\Sitecore.Marketing.Definitions.MarketingAssets.Repositories.Azure.IndexConfiguration.config.disabled" "Sitecore.Marketing.Definitions.MarketingAssets.Repositories.Azure.IndexConfiguration.config"
ren "$appConfigIncludeLocation\Sitecore.Marketing.Definitions.MarketingAssets.Repositories.Lucene.Index.Master.config" "Sitecore.Marketing.Definitions.MarketingAssets.Repositories.Lucene.Index.Master.config.disabled"
ren "$appConfigIncludeLocation\Sitecore.Marketing.Definitions.MarketingAssets.Repositories.Lucene.Index.Web.config" "Sitecore.Marketing.Definitions.MarketingAssets.Repositories.Lucene.Index.Web.config.disabled"
ren "$appConfigIncludeLocation\Sitecore.Marketing.Definitions.MarketingAssets.Repositories.Lucene.IndexConfiguration.config" "Sitecore.Marketing.Definitions.MarketingAssets.Repositories.Lucene.IndexConfiguration.config.disabled"
ren "$appConfigIncludeLocation\Sitecore.Marketing.Lucene.Index.Master.config" "Sitecore.Marketing.Lucene.Index.Master.config.disabled"
ren "$appConfigIncludeLocation\Sitecore.Marketing.Lucene.Index.Web.config" "Sitecore.Marketing.Lucene.Index.Web.config.disabled"
ren "$appConfigIncludeLocation\Sitecore.Marketing.Lucene.IndexConfiguration.config" "Sitecore.Marketing.Lucene.IndexConfiguration.config.disabled"
ren "$appConfigIncludeLocation\Sitecore.PathAnalyzer.Processing.config" "Sitecore.PathAnalyzer.Processing.config.disabled"
ren "$appConfigIncludeLocation\Sitecore.PathAnalyzer.RemoteClient.config.disabled" "Sitecore.PathAnalyzer.RemoteClient.config"
ren "$appConfigIncludeLocation\Sitecore.Speak.ContentSearch.Lucene.config" "Sitecore.Speak.ContentSearch.Lucene.config.disabled"
ren "$appConfigIncludeLocation\Sitecore.Xdb.Remote.Client.config.disabled" "Sitecore.Xdb.Remote.Client.config"
ren "$appConfigIncludeLocation\Sitecore.Xdb.Remote.Client.MarketingAssets.config.disabled" "Sitecore.Xdb.Remote.Client.MarketingAssets.config"
ren "$appConfigIncludeLocation\CacheContainers.config.example" "CacheContainers.config"



# rename the config files in Include sub directories
ren "$appConfigIncludeLocation\ContentTesting\Sitecore.ContentTesting.Azure.IndexConfiguration.config.disabled" "Sitecore.ContentTesting.Azure.IndexConfiguration.config"
ren "$appConfigIncludeLocation\ContentTesting\Sitecore.ContentTesting.Lucene.IndexConfiguration.config" "Sitecore.ContentTesting.Lucene.IndexConfiguration.config.disabled"
ren "$appConfigIncludeLocation\ContentTesting\Sitecore.ContentTesting.PreemptiveScreenshot.config.disabled" "Sitecore.ContentTesting.PreemptiveScreenshot.config"
ren "$appConfigIncludeLocation\ContentTesting\Sitecore.ContentTesting.Processing.Aggregation.config" "Sitecore.ContentTesting.Processing.Aggregation.config.disabled"



ren "$appConfigIncludeLocation\ExperienceAnalytics\Sitecore.ExperienceAnalytics.Aggregation.config" "Sitecore.ExperienceAnalytics.Aggregation.config.disabled"
ren "$appConfigIncludeLocation\ExperienceAnalytics\Sitecore.ExperienceAnalytics.Reduce.config" "Sitecore.ExperienceAnalytics.Reduce.config.disabled"
ren "$appConfigIncludeLocation\ExperienceAnalytics\Sitecore.ExperienceAnalytics.StorageProviders.config" "Sitecore.ExperienceAnalytics.StorageProviders.config.disabled"




ren "$appConfigIncludeLocation\FXM\Sitecore.FXM.Azure.DomainsSearch.DefaultIndexConfiguration.config.disabled" "Sitecore.FXM.Azure.DomainsSearch.DefaultIndexConfiguration.config"
ren "$appConfigIncludeLocation\FXM\Sitecore.FXM.Azure.DomainsSearch.Index.Master.config.disabled" "Sitecore.FXM.Azure.DomainsSearch.Index.Master.config"
ren "$appConfigIncludeLocation\FXM\Sitecore.FXM.Lucene.DomainsSearch.DefaultIndexConfiguration.config" "Sitecore.FXM.Lucene.DomainsSearch.DefaultIndexConfiguration.config.disabled"
ren "$appConfigIncludeLocation\FXM\Sitecore.FXM.Lucene.DomainsSearch.Index.Master.config" "Sitecore.FXM.Lucene.DomainsSearch.Index.Master.config.disabled"
ren "$appConfigIncludeLocation\FXM\Sitecore.FXM.Lucene.DomainsSearch.Index.Web.config" "Sitecore.FXM.Lucene.DomainsSearch.Index.Web.config.disabled"




ren "$appConfigIncludeLocation\ListManagement\Sitecore.ListManagement.Azure.Index.List.config.disabled" "Sitecore.ListManagement.Azure.Index.List.config"
ren "$appConfigIncludeLocation\ListManagement\Sitecore.ListManagement.Azure.IndexConfiguration.config.disabled" "Sitecore.ListManagement.Azure.IndexConfiguration.config"
ren "$appConfigIncludeLocation\ListManagement\Sitecore.ListManagement.DisableListLocking.config.disabled" "Sitecore.ListManagement.DisableListLocking.config"
ren "$appConfigIncludeLocation\ListManagement\Sitecore.ListManagement.Lucene.Index.List.config" "Sitecore.ListManagement.Lucene.Index.List.config.disabled"
ren "$appConfigIncludeLocation\ListManagement\Sitecore.ListManagement.Lucene.IndexConfiguration.config" "Sitecore.ListManagement.Lucene.IndexConfiguration.config.disabled"


ren "$appConfigIncludeLocation\Social\Sitecore.Social.Azure.Index.Master.config.disabled" "Sitecore.Social.Azure.Index.Master.config"
ren "$appConfigIncludeLocation\Social\Sitecore.Social.Azure.IndexConfiguration.config.disabled" "Sitecore.Social.Azure.IndexConfiguration.config"
ren "$appConfigIncludeLocation\Social\Sitecore.Social.Lucene.Index.Analytics.Facebook.config" "Sitecore.Social.Lucene.Index.Analytics.Facebook.config.disabled"
ren "$appConfigIncludeLocation\Social\Sitecore.Social.Lucene.Index.Master.config" "Sitecore.Social.Lucene.Index.Master.config.disabled"
ren "$appConfigIncludeLocation\Social\Sitecore.Social.Lucene.Index.Web.config" "Sitecore.Social.Lucene.Index.Web.config.disabled"
ren "$appConfigIncludeLocation\Social\Sitecore.Social.Lucene.IndexConfiguration.config" "Sitecore.Social.Lucene.IndexConfiguration.config.disabled"
ren "$appConfigIncludeLocation\Social\Sitecore.Social.ScalabilitySettings.config.disabled" "Sitecore.Social.ScalabilitySettings.config"



# rename the config files in Sitecore Dir


ren "$sitecoreDashboardDir\CampaignCategoryDefaultSettings.config" "CampaignCategoryDefaultSettings.config.disabled"
ren "$sitecoreDashboardDir\Configuration.config" "Configuration.config.disabled"
ren "$sitecoreDashboardDir\DefaultSettings.config" "DefaultSettings.config.disabled"
ren "$sitecoreDashboardDir\SingleCampaignDefaultSettings.config" "SingleCampaignDefaultSettings.config.disabled"
ren "$sitecoreDashboardDir\SingleTrafficTypeDefaultSettings.config" "SingleTrafficTypeDefaultSettings.config.disabled"