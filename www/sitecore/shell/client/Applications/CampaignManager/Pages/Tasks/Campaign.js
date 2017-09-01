define([
  "sitecore",
  "/-/speak/v1/campaignmanager/dictionary.js",
  "/-/speak/v1/campaignmanager/messages.js",
  "/-/speak/v1/campaignmanager/urlParser.js",
  "/-/speak/v1/campaignmanager/constants.js",
  "/-/speak/v1/campaignmanager/campaignActionsManager.js",
  "/-/speak/v1/campaignmanager/antiForgeryUtils.js",
  "/-/speak/v1/campaignmanager/langResolver.js",
  // TODO: Please remove the references below when the issue #52464 is fixed.
  "jquery",
  "jqueryui"
], function (sitecore, dictionary, messages, urlParser, constants, campaignActionsManager, antiForgeryUtils, langResolver) {
  "use strict";
  var isoMinDate = "10101T000000",
  viewModel = {
    changed: [],
    invalid: ["Name"],
    stored: { Name: "", StartDate: "", EndDate: "", Classifications: {}, EngagementPlan: "" },
    current: {
      Name: { Value: "", Invalid: [undefined, null, ""] },
      StartDate: { Value: null, Invalid: [] },
      EndDate: { Value: null, Invalid: [] },
      Classifications: { Value: {}, Invalid: [] },
      EngagementPlan: { Value: "", Invalid: [] }
    }
  },
  campaignDefinition = {
    uninitializedSubAppRenderersCount: 3,
    isAnalyticsDisabled: false,
    initialized: function () {
      this.EntityDataSource = antiForgeryUtils.getDecoratorFor(this.EntityDataSource);
      this.refreshDeferredDataSource(this.EntityDataSource);
      this.SaveButton.on("click", this.saveCampaign, this);
      this.EntityDataSource.on("change:entity", this.entityChanged, this);

      sitecore.on("cm:campaign:initialized", this.updateTaskPageWithoutData, this);
      this.CampaignClassifications.on("change:isBusy", this.updateTaskPageWithoutData, this);
      this.CampaignClassifications.on("change:isBusy", this.loadCampaignIfExists, this);
      this.ClassificationsDataSource.on("change:hasResponse", this.refreshClassifications, this);
      sitecore.on("cm:execution:initialized", this.updateTaskPageWithoutData, this);

      this.on("cm:campaign:experience", function () { this.ExecutionSubAppRenderer.gotoExperienceAnalytics(); }, this);

      this.on("cm:campaign:delete", this.deleteCampaign, this);
      this.on("cm:campaign:delete:ok", this.deleteCampaignOk, this);
      this.on("cm:campaign:leave", this.leavePage, this);
      this.on("cm:campaign:leave:save", this.leavePageSave, this);
      this.on("cm:campaign:leave:donotsave", this.leavePageDoNotSave, this);
      this.on("cm:campaign:leave:cancel", this.leavePageCancel, this);

      this.initializeBreadcrumbDialog();
      this.initializeClassificationsDataSource();

      this.isAnalyticsDisabled = this.AnalyticsChecker.get("isAnalyticsEnabled") === false;
      campaignActionsManager.addBaseStructure({
        actionControl: this.ActionControl,
        isAnalyticsDisabled: this.isAnalyticsDisabled,
        mode: "campaign"
      });
      this.showAnalyticsWarning();
    },
    // ***INITIALIZATION***
    updateTaskPageWithoutData: function () {
      this.updateTaskPageData();
    },
    updateTaskPageData: function (model) {
      if (this.uninitializedSubAppRenderersCount > 0) {
        --this.uninitializedSubAppRenderersCount;
      }

      if (typeof model !== "undefined" && model !== null) {
        if (typeof this.CampaignInfoSubAppRenderer !== "undefined") {
          this.CampaignInfoSubAppRenderer.setName(model.Name);
          this.CampaignInfoSubAppRenderer.setStartDate(model.StartDate);
          this.CampaignInfoSubAppRenderer.setEndDate(model.EndDate);

          this.updateCampaignInfo(model);
        }
        if (typeof this.CampaignClassifications !== "undefined" && typeof model.Classifications !== "undefined") {
          this.CampaignClassifications.setValue(model.Classifications.underlying);
        }
        if (typeof this.ExecutionSubAppRenderer !== "undefined") {
          this.ExecutionSubAppRenderer.setCode(model.CampaignLink);
          this.ExecutionSubAppRenderer.setReportUrl(model.ExperienceAnalyticsLink);
          this.ExecutionSubAppRenderer.setEngagementPlan({ Id: model.EngagementPlan, Title: model.EngagementPlanTitles });
          this.ExecutionSubAppRenderer.enableActions();
          if (this.isAnalyticsDisabled === true) {
            this.ExecutionSubAppRenderer.disableAnalyticsActions();
          }
        }
      }

      if ((this.uninitializedSubAppRenderersCount === 0) && ((this.EntityDataSource.get('isBusy') !== true) || (urlParser.getParameterFromLocationSearchByName(constants.IdQueryKey) === ""))) {
        this.ProgressIndicator.set('isVisible', false);
      }
    },
    refreshDeferredDataSource: function (dataSource) {
      dataSource.IsDeferred = true;
      dataSource.refresh();
      dataSource.IsDeferred = false;
    },
    initializeClassificationsDataSource: function () {
      var language = langResolver.resolve();
      if (typeof language !== "undefined" && language !== null) {
        var parameters = this.ClassificationsDataSource.get("parameters");
        parameters.sc_lang = language;
        this.ClassificationsDataSource.set("parameters", parameters);
      }
      this.ClassificationsDataSource.set("requestType", "httpget");
      this.ClassificationsDataSource.refresh();
    },
    refreshClassifications: function (control, hasResponse) {
      if (hasResponse === true) {
        var items = JSON.parse(control.get("response"));
        this.CampaignClassifications.refresh(items);
      }
    },
    loadCampaignIfExists: function () {
      var entityId = urlParser.getParameterFromLocationSearchByName(constants.IdQueryKey);
      if (entityId !== "") {
        this.EntityDataSource.set("entityID", entityId);
      } else {
        // for existing entities this function will be called in 'entityChanged'
        // state management must be switched on only when all controls are initialized
        this.initializeStateManagement();
      }
    },
    initializeStateManagement: function () {
      sitecore.on('cm:campaign:change:name', function () {
        this.updateState(this.CampaignInfoSubAppRenderer.getName(), 'Name');
      }, this);
      sitecore.on('cm:campaign:change:start', function () {
        this.updateState(this.CampaignInfoSubAppRenderer.getStartDate(), "StartDate");
      }, this);
      sitecore.on('cm:campaign:change:end', function () {
        this.updateState(this.CampaignInfoSubAppRenderer.getEndDate(), "EndDate");
      }, this);
      sitecore.on('cm:execution:plan:changed', function () {
        this.updateState(this.ExecutionSubAppRenderer.getEngagementPlan().Id, "EngagementPlan");
      }, this);
      this.CampaignClassifications.on("changed", this.updateClassificationsState, this);
    },
    initializeBreadcrumbDialog: function () {
      var self = this;
      self.storedUrl = "";
      ["ul>li:first>a", "ul>li:last>a"].forEach(function (selector) {
        var link = self.Breadcrumb.viewModel.$el.find(selector);
        link.click(function (event) {
          event.preventDefault();
          self.storedUrl = link.attr("href");
          self.leavePage();
        });
      });
    },
    showAnalyticsWarning: function () {
      if (this.isAnalyticsDisabled === true) {
        var text = this.StringDictionary.get(dictionary.PleaseNoteThatCampaignActivitiesCannotBeTrackedInCmsOnlyMode);
        messages.showWarning(this.MessageBar, text);
      }
    },
    // ***CALLBACKS***
    saveCampaign: function () {
      var self = this,
          model = {},
          entityId,
          promise,
          isNew = false;

      // validation
      var errorMessage = this.CampaignInfoSubAppRenderer.getValidationErrorMessage();
      if (errorMessage !== null) {
        errorMessage = this.StringDictionary.get(errorMessage);
        messages.showError(this.MessageBar, errorMessage);
        return;
      }

      // initialize model
      model.Name = this.CampaignInfoSubAppRenderer.getName();
      model.StartDate = this.CampaignInfoSubAppRenderer.getStartDate();
      model.EndDate = this.CampaignInfoSubAppRenderer.getEndDate();
      model.Classifications = this.CampaignClassifications.getValue();
      model.EngagementPlan = this.ExecutionSubAppRenderer.getEngagementPlan().Id;
      // decide: create or update
      entityId = this.EntityDataSource.get("entityID");

      this.SaveButton.set('isEnabled', false);

      if (entityId === "") {
        model.Id = this.EntityDataSource.Service.constructor.utils.guid.generate();
        isNew = true;
        var query = this.EntityDataSource.Service.create(model);
        promise = query.execute();
      } else {
        var currentModel = this.EntityDataSource.get("entity");
        for (var prop in model) {
          if (model.hasOwnProperty(prop)) {
            currentModel[prop] = model[prop];
          }
        }
        promise = currentModel.save();
      }
      // common then()
      promise.then(function (m) {
        self.success(m, isNew, self);
      }, function (er) {
        self.error(er, self, dictionary.YourCampaignActivityHasNotBeenSaved);
      });
    },
    entityChanged: function (dataSource, model) {
      // initialize controls
      this.updateTaskPageData(model);
      // initialize viewModel that acts as mediator
      this.updateStoredState(model);
      // initialize state management
      this.initializeStateManagement();
    },
    deleteCampaign: function () {
      this.ConfirmationDialog.show();
    },
    deleteCampaignOk: function () {
      var self = this;
      var entity = this.EntityDataSource.get("entity");
      var promise = entity.destroy();
      promise.then(self.deleteSuccess, function (er) {
        self.error(er, self, dictionary.CampaignActivityIsNotDeleted);
      });
    },
    leavePage: function () {
      if (this.isChanged() === true) {
        this.LeavePageDialog.show();
      } else {
        this.goBackOrToStoredUrl();
      }
    },
    leavePageSave: function () {
      this.saveCampaign();
      this.goBackOrToStoredUrl();
    },
    leavePageDoNotSave: function () {
      this.goBackOrToStoredUrl();
    },
    leavePageCancel: function () {
      this.storedUrl = "";
      this.LeavePageDialog.hide();
    },
    back: function () {
      if (typeof window.InstallTrigger !== "undefined") {
        window.location.replace(document.referrer);
      } else {
        window.history.back();
      }
    },
    goToStoredUrl: function () {
      window.location.href = this.storedUrl;
    },
    goBackOrToStoredUrl: function () {
      if (typeof this.storedUrl !== "undefined" && this.storedUrl !== null && this.storedUrl !== "") {
        this.goToStoredUrl();
      } else {
        this.back();
      }
    },
    // ***HANDLERS FOR RESPONSE FROM THE SERVER***
    success: function (model, isNew, context) {
      var text = context.StringDictionary.get(dictionary.YourCampaignActivityHasBeenSaved);
      messages.showNotification(context.MessageBar, text);

      if (isNew === true) {
        context.EntityDataSource.set("entityID", model.Id);
        urlParser.appendQueryParameter(constants.IdQueryKey, model.Id);
      } else {
        context.EntityDataSource.refresh();
      }
    },
    error: function (error, context, text) {
      console.error(error);
      var localizedText = context.StringDictionary.get(text);
      messages.showError(context.MessageBar, localizedText);
    },
    deleteSuccess: function () {
      location.href = constants.DashboardPath + "?" + constants.ActionQueryKey + "=" + constants.CampaignDeletedQueryValue;
    },
    // ***UTILS***
    updateClassificationsState: function (items) {
      this.updateState(items, "Classifications");
    },
    updateCampaignInfo: function (model) {
      this.updateBreadcrumb(model);
      document.title = model.Name;
      this.HeaderTitle.set("text", model.Name);
      this.InfoSpotStartDateValue.set("text", this.CampaignInfoSubAppRenderer.getFormattedStartDate());
      this.InfoSpotEndDateValue.set("text", this.CampaignInfoSubAppRenderer.getFormattedEndDate());
      this.InfoSpotStatusValue.set("text", model.Status);
    },
    // ToDo: find something better to update breadcrumb
    updateBreadcrumb: function (model) {
      var currentPageLink = this.Breadcrumb.viewModel.$el.find("ul>li:last>a");
      currentPageLink.attr("href", location.href);
      currentPageLink.text(model.Name);
    },
    // *** STATE MANAGEMENT ***
    updateStoredState: function (model) {
      for (var prop in model) {
        if (model.hasOwnProperty(prop) && viewModel.stored.hasOwnProperty(prop)) {
          viewModel.stored[prop] = model[prop];
        }
      }
      if (typeof model.Classifications === "undefined" || model.Classifications === null || model.Classifications === "") {
        viewModel.stored.Classifications = {};
      }
      var isoStartDate = sitecore.Helpers.date.toISO(model.StartDate);
      if (typeof isoStartDate !== "undefined" && isoStartDate !== null && isoStartDate.indexOf(isoMinDate) !== -1) {
        viewModel.stored.StartDate = "";
      }
      var isoEndDate = sitecore.Helpers.date.toISO(model.EndDate);
      if (typeof isoEndDate !== "undefined" && isoEndDate !== null && isoEndDate.indexOf(isoMinDate) !== -1) {
        viewModel.stored.EndDate = "";
      }
      if (typeof model.EngagementPlan === "undefined" || model.EngagementPlan === null) {
        viewModel.stored.EngagementPlan = "";
      }
      viewModel.changed = [];
      viewModel.invalid = [];
      this.SaveButton.set("isEnabled", false);
    },
    updateState: function (value, property) {
      var invalid = false;
      if (!viewModel.current.hasOwnProperty(property)) {
        return;
      }
      if (viewModel.current[property].Invalid.filter(function (e) { return e === value; }).length > 0) {
        invalid = true;
      }
      viewModel.current[property].Value = value;
      var indexOfChanged = viewModel.changed.indexOf(property);
      if (viewModel.stored[property] !== value) {
        if (indexOfChanged === -1) {
          viewModel.changed.push(property);
        }
      } else {
        if (indexOfChanged !== -1) {
          viewModel.changed.splice(indexOfChanged, 1);
        }
      }
      var indexOfInvalid = viewModel.invalid.indexOf(property);
      if (invalid === true) {
        if (indexOfInvalid === -1) {
          viewModel.invalid.push(property);
        }
      } else {
        if (indexOfInvalid !== -1) {
          viewModel.invalid.splice(indexOfInvalid, 1);
        }
      }
      this.SaveButton.set("isEnabled", this.isChanged());
    },
    isChanged: function () {
      return viewModel.changed.length > 0 && viewModel.invalid.length === 0;
    }
  };
  return sitecore.Definitions.App.extend(campaignDefinition);
});