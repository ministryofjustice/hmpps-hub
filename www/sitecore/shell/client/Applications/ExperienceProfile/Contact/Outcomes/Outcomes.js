define(["sitecore", "/-/speak/v1/experienceprofile/DataProviderHelper.js"], function (sc, providerHelper) {
  var app = sc.Definitions.App.extend({
    initialized: function () {
      this.setupSummaryListControl();
    },

    setupSummaryListControl: function () {
      var tableName = "outcome-detail",
          localUrl = /intel/ + tableName;

      providerHelper.setupHeaders([
        { urlKey: localUrl + "?", headerValue: tableName }
      ]);
      var url = sc.Contact.baseUrl + localUrl;

      providerHelper.initProvider(this.OutcomesDataProvider, tableName, url, this.OutcomesTabMessageBar);
      providerHelper.subscribeSorting(this.OutcomesDataProvider, this.OutcomesListControl);
      providerHelper.setDefaultSorting(this.OutcomesDataProvider, "OutcomeDateTime", true);
      providerHelper.getListData(this.OutcomesDataProvider);
      providerHelper.subscribeAccordionHeader(this.OutcomesDataProvider, this.OutcomesListControl);
    },
    
    setupSmartPanel: function () {
      var analyticsUrl = "/sitecore/api/ao/v1/analytics/outcomes/outcomedefinitions";

      if (this.OutcomesSmartPanel.get("isOpen")) {
        this.OutcomesSmartPanel.set("isOpen", false);
        return;
      }

      this.OutcomesSmartPanel.set("isOpen", true);
      this.PanelHeadersDataRepeater.viewModel.reset();

      providerHelper.initProvider(this.PanelDataProvider, "", analyticsUrl);
      providerHelper.getData(
        this.PanelDataProvider,
        $.proxy(function (jsonData) {
          var newData = [];

          $.each(jsonData, function (i, data) {
            newData.push(data);
          });

          this.PanelHeadersDataRepeater.viewModel.addData(newData);
          this.PanelDataProvider.set("data", jsonData);
        }, this)
      );
      
      this.PanelHeadersDataRepeater.off("subAppLoaded").on("subAppLoaded", function (args) {
        var data = args.data,
            subapp = args.app;

        if (!data) {
          this.PanelHeadersDataRepeater.set("isVisible", false);
          return;
        }

        if (this.OutcomesListControl.get("selectedItemId")) {
          this.OutcomesListControl.get("selectedItem").get("OutcomeCategoryDisplayName") == data.categoryName ?
            this.renderDefinition(this, subapp, data) : $.noop();
          return;
        }

        this.renderDefinition(this, subapp, data);
      }, this);
    },
    
    renderDefinition: function(application, subapp, data) {
      subapp.OutcomeHeaderText.set("text", data.categoryName);
      /*
       *   It renders name and description for each outcomedefinition
       */
      subapp.DescriptionDataRepeater.viewModel.addData(data.definitions);
      subapp.DescriptionDataRepeater.off("subAppLoaded").on("subAppLoaded", function (argsDescription) {
        var dataDescription = argsDescription.data,
            subappDescription = argsDescription.app;

        if (!dataDescription) {
          subappDescription.DescriptionDataRepeater.set("isVisible", false);
          return;
        }

        subappDescription.OutcomeText.set("text", dataDescription.name);
        subappDescription.OutcomeDescription.viewModel.$el.html(dataDescription.description);
      }, application);
    }
    
  });
  return app;
});
