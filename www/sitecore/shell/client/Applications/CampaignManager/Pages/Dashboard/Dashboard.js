define([
  "sitecore",
  "jquery",
  "/-/speak/v1/campaignmanager/dictionary.js",
  "/-/speak/v1/campaignmanager/messages.js",
  "/-/speak/v1/campaignmanager/urlParser.js",
  "/-/speak/v1/campaignmanager/constants.js",
  "/-/speak/v1/campaignmanager/campaignActionsManager.js",
  "/-/speak/v1/campaignmanager/fileDownloader.js",
  "/-/speak/v1/campaignmanager/antiForgeryUtils.js",
  "/-/speak/v1/campaignmanager/langResolver.js",
  // TODO: Please remove the references below when the issue #52464 is fixed.
  "jqueryui"
], function (sitecore, $, dictionary, messages, urlParser, constants, campaignActionsManager, fileDownloader, antiForgeryUtils, langResolver) {
  "use strict";
  var dashboardDefinition = {
    isAnalyticsDisabled: false,
    initialized: function () {
      this.ListControl.on("change:selectedItem", this.campaignSelected, this);
      this.ShowCampaignsButton.on("click", this.showCampaigns, this);

      this.on("cm:campaign:experience", function () { this.CampaignExecutionSubAppRenderer.gotoExperienceAnalytics(); }, this);

      sitecore.on("cm:campaign:initialized", this.campaignInfoSubAppRendererInitialized, this);
      sitecore.on("cm:campaign:initialized", this.dashboardSubAppRendererInitialized, this);
      sitecore.on("cm:classifications:initialized", this.dashboardSubAppRendererInitialized, this);
      sitecore.on("cm:execution:initialized", this.dashboardSubAppRendererInitialized, this);
      sitecore.on("cm:campaign:edit", this.openCampaign, this);

      this.on("cm:smartpanel:campaign:edit", this.editCampaign, this);
      this.on("cm:dashboard:export:csv", this.exportToCsv, this);
      this.on("cm:campaign:delete", this.deleteCampaign, this);
      this.on("cm:campaign:delete:ok", this.deleteCampaignOk, this);

      this.CampaignDataSource.on("change:isBusy", this.updateUiOnRequestCompletion, this);
      this.CampaignDataSource.on("change:url change:classifications", this.CampaignDataSource.refresh, this.CampaignDataSource);
      this.CampaignDataSource.refresh();

      this.initializeClassificationsDataSource();

      this.showNotificationAfterDelete();

      this.isAnalyticsDisabled = this.AnalyticsChecker.get("isAnalyticsEnabled") === false;
      campaignActionsManager.addBaseStructure({
        control: this.ListControl,
        actionControl: this.ActionControl,
        dataSource: this.CampaignDataSource,
        isAnalyticsDisabled: this.isAnalyticsDisabled,
        mode: "dashboard"
      });
      this.showAnalyticsWarning();
    },
    showNotificationAfterDelete: function () {
      var actionFromUrl = urlParser.getParameterFromLocationSearchByName(constants.ActionQueryKey);
      if (actionFromUrl === constants.CampaignDeletedQueryValue) {
        var text = this.StringDictionary.get(dictionary.CampaignActivityDeleted);
        messages.showNotification(this.MessageBar, text);
        urlParser.removeQueryParameter(constants.ActionQueryKey);
      }
    },
    showAnalyticsWarning: function() {
      if (this.isAnalyticsDisabled === true) {
        var text = this.StringDictionary.get(dictionary.PleaseNoteThatCampaignActivitiesCannotBeTrackedInCmsOnlyMode);
        messages.showWarning(this.MessageBar, text);
      }
    },
    initializeClassificationsDataSource: function () {
      this.ClassificationsDataSource.on("change:hasResponse", this.refreshClassifications, this);
      var language = langResolver.resolve();
      if (typeof language !== "undefined" && language !== null) {
        var parameters = this.ClassificationsDataSource.get("parameters");
        parameters.sc_lang = language;
        this.ClassificationsDataSource.set("parameters", parameters);
      }
      this.ClassificationsDataSource.set("requestType", "httpget");
      this.ClassificationsDataSource.refresh();
    },
    // callbacks:
    refreshClassifications: function (control, hasResponse) {
      if (hasResponse === true) {
        var items = JSON.parse(control.get("response"));
        this.CampaignClassifications.refresh(items);
        this.ReadOnlyCampaignClassifications.refresh(items);
      }
    },
    dashboardSubAppRendererInitialized: function () {
      this.updateSmartPanelData();
    },
    campaignInfoSubAppRendererInitialized: function () {
      this.CampaignInfoSubAppRenderer.GeneralInformationNameValue.set('watermark', this.StringDictionary.get(dictionary.FilterByCampaignName));
    },
    campaignSelected: function (control, model) {
      if (typeof model !== "undefined" && model !== null && model !== "") {
        this.SmartPanel.set("model", model);
        this.updateSmartPanelData();
        this.SmartPanel.set("isOpen", true);
      }
    },
    updateSmartPanelData: function() {
      var model = this.SmartPanel.get("model");

      if ((typeof model !== "undefined") && (model !== null)) {
        this.SmartPanelHeader.set("text", model.get("Name"));
        if (typeof this.GeneralCampaignInfoSubAppRenderer !== "undefined") {
          this.GeneralCampaignInfoSubAppRenderer.setName(model.get("Name"));
          this.GeneralCampaignInfoSubAppRenderer.setStartDate(model.get("StartDate"));
          this.GeneralCampaignInfoSubAppRenderer.setEndDate(model.get("EndDate"));
        }
        if (typeof this.ReadOnlyCampaignClassifications !== "undefined") {
          this.ReadOnlyCampaignClassifications.setValue(model.get("Classifications"));
        }
        if (typeof this.CampaignExecutionSubAppRenderer !== "undefined") {
          this.CampaignExecutionSubAppRenderer.setCode(model.get("CampaignLink"));
          this.CampaignExecutionSubAppRenderer.setEngagementPlan({ Id: model.get("EngagementPlan"), Title: model.get("EngagementPlanTitles") });
          this.CampaignExecutionSubAppRenderer.setReportUrl(model.get("ExperienceAnalyticsLink"));
          this.CampaignExecutionSubAppRenderer.enableActions();
          if (this.isAnalyticsDisabled === true) {
            this.CampaignExecutionSubAppRenderer.disableAnalyticsActions();
          }
        }
      }
    },
    // temporary open campaign from SmartPanel for Demo purposes
    editCampaign: function () {
      var model = this.SmartPanel.get("model");
      if (typeof model !== "undefined" && model !== null && model !== "") {
        var id = model.get("Id");
        this.openCampaign(id);
      }
    },
    openCampaign: function (id) {
      // trick to not allow SmartPanel be opened
      this.ListControl.off();
      location.href = constants.CampaignPath + "?" + constants.IdQueryKey + "=" + id;
    },
    deleteCampaign: function () {
      this.ConfirmationDialog.show();
    },
    deleteCampaignOk: function () {
      this.ConfirmationDialog.hide();
      var model = this.SmartPanel.get("model");
      if (typeof model !== "undefined" && model !== null && model !== "") {
        var id = model.get("Id"),
            self = this;
        $.ajax($.extend({
          url: constants.WebAPIPath,
          method: "DELETE",
          data: { Id: id },
        }, antiForgeryUtils.getSettings()))
          .done(function (m) {
            self.success(m, self, dictionary.CampaignActivityDeleted);
          })
          .fail(function (er) {
            self.error(er, self, dictionary.CampaignActivityIsNotDeleted);
          });
      }
    },
    showCampaigns: function () {
      var filteredValues = this.CampaignClassifications.getValue();

      var errorMessage = this.CampaignInfoSubAppRenderer.getValidationErrorMessage();
      if (errorMessage !== null) {
        errorMessage = this.StringDictionary.get(errorMessage);
        messages.showError(this.MessageBar, errorMessage);
        return;
      }

      this.CampaignDataSource.set("name", this.CampaignInfoSubAppRenderer.getName());
      this.CampaignDataSource.set("startDate", this.CampaignInfoSubAppRenderer.getStartDate());
      this.CampaignDataSource.set("endDate", this.CampaignInfoSubAppRenderer.getEndDate());
      this.CampaignDataSource.set("classifications", JSON.stringify(filteredValues));
      this.CampaignDataSource.refresh();
    },
    exportToCsv: function (parameters) {
      var name = this.CampaignInfoSubAppRenderer.getName();
      var startDate = this.CampaignInfoSubAppRenderer.getStartDate();
      var endDate = this.CampaignInfoSubAppRenderer.getEndDate();
      var classifications = JSON.stringify(this.CampaignClassifications.getValue());

      var exportUrl = parameters.url +
        "?name=" + name +
        "&startDate=" + startDate +
        "&endDate=" + endDate +
        "&classifications=" + classifications;

      fileDownloader.download(exportUrl, this.exportToCsvError);
    },
    exportToCsvError: function (message) {
      messages.showError(this.MessageBar, message);
    },
    updateUiOnRequestCompletion: function (control, isBusy) {
      if (isBusy === false) {
        var count = this.CampaignDataSource.get("totalItemsCount");
        var header = this.CampaignsAdvancedExpander.get("origHeader");
        if (typeof header === "undefined") {
          header = this.CampaignsAdvancedExpander.get("header");
          this.CampaignsAdvancedExpander.set("origHeader", header);
        }
        this.CampaignsAdvancedExpander.set("header", header + " " + count);
      }
      this.ShowCampaignsButton.set('isEnabled', isBusy !== true);
    },
    // ***HANDLERS FOR RESPONSE FROM THE SERVER***
    success: function (model, context, text) {
      var localizedText = context.StringDictionary.get(text);
      messages.showNotification(context.MessageBar, localizedText);

      context.CampaignDataSource.refresh();
    },
    error: function (error, context, text) {
      console.error(error);
      var localizedText = context.StringDictionary.get(text);
      messages.showError(context.MessageBar, localizedText);
    }
  };
  return sitecore.Definitions.App.extend(dashboardDefinition);
});