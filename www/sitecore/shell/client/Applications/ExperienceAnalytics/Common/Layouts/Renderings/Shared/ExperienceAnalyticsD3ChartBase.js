require.config({
  paths: {
    experienceAnalytics: "/sitecore/shell/client/Applications/ExperienceAnalytics/Common/Layouts/Renderings/Shared/ExperienceAnalytics",
    experienceAnalyticsDvcBase: "/sitecore/shell/client/Applications/ExperienceAnalytics/Common/Layouts/Renderings/Shared/ExperienceAnalyticsDvcBase",
    chartDataConversionService: "/sitecore/shell/client/Applications/ExperienceAnalytics/Common/Layouts/Renderings/Shared/ChartDataConversionService"
  }
});

define(["sitecore", "experienceAnalytics", "chartDataConversionService", "experienceAnalyticsDvcBase"], function (Sitecore, ExperienceAnalytics, chartDataConversionService) {
  "use strict";

  var RES_DAILY = "5B533C99F0D241659ACD97201DAB74EB",
    RES_WEEKLY = "8BC1EF452A3841DFBA618CA679541A89",
    RES_MONTHLY = "F48DBE526048419CB4E30110C9D6AFF2";

  Sitecore.Factories.createBaseComponent({
    base: "ExperienceAnalyticsDvcBase",
    name: "ExperienceAnalyticsD3ChartBase",
    selector: ".sc-ExperienceAnalyticsD3ChartBase",

    attributes: Sitecore.Definitions.Views.ExperienceAnalyticsDvcBase.prototype._scAttrs.concat([
     { name: "errorTexts", value: "$el.data:sc-errortexts" },
     { name: "keyscollapsedlabel", value: "$el.data:sc-keyscollapsedlabel" },
     { name: "title", value: "$el.data:sc-title" },
     { name: "metrics", value: "$el.data:sc-metrics" },
     { name: "segments", value: "$el.data:sc-segments" },
     { name: "timeResolution", value: "" },
     { name: "keys", value: "$el.data:sc-keys" },
     { name: "seriesChartField", value: "$el.data:sc-serieschartfield" },
     { name: "keysByMetricQuery", value: "$el.data:sc-keysbymetricquery" },
     { name: "chartName", value: "ChartBase" },
     { name: "keyGrouping", value: "$el.data:sc-keygrouping" },
     { name: "componentType", value: "$el.data:sc-componenttype" },
     { name: "configurationError", value: "$el.data:sc-configurationerror" }
    ]),

    lastRequestHash: "",
    previousResponseData: null,
    keyProperty: "key",
    rawKeys: {},

    initialize: function () {
      this._super();
      if (this.model.get("configurationError")) {
        return;
      }

      this.rawKeys = {};
      // TODO: Move time resolution functionality into separated extension. #16903
      var timeResolutionControlName = this.model.get("name") + "ActionControl",
        timeResolutionControl = this.app[timeResolutionControlName];

      if (timeResolutionControl) {
        this.model.setPreferredTimeResolution(this.getResolutionString(this.$el.attr("data-sc-timeresolution")));
        this.setupActions(timeResolutionControl);
      }

      this.setupServerSideErrorHandling();

      this.validateProperties();

      this.model.on("change:timeResolution", this.updateChart, this);
      ExperienceAnalytics.on("change:dateRange change:subsite", this.updateChart, this);
    },

    afterRender: function () {
      if (this.model.get("configurationError")) {
        return;
      }
      var chartModel = this.app[this.model.get("name") + this.model.get("chartName")];
      this.chartModel = chartModel;
      this.setupMessageBar(chartModel);
      this.setChartProperties(chartModel);
    },

    extendModel: {
      setTitle: function (value) {
        this.set("title", value);
      },

      setPreferredTimeResolution: function (value) {
        this.set("timeResolution", value.toLowerCase());
      }
    },

    getResolutionString: function (abbreviation) {
      switch (abbreviation) {
        case "m":
          return "monthly";
        case "w":
          return "weekly";
        case "d":
          return "daily";
        case "a":
          return "auto";
        case "c":
          return "collapsed";
        default:
          throw "Could not convert abbreviation '" + abbreviation + "' to resolution string";
      }
    },

    getResolutionAbbreviation: function (resString) {
      switch (resString) {
        case "monthly":
          return "by-month";
        case "weekly":
          return "by-week";
        case "daily":
          return "by-day";
        case "auto":
          return "by-auto";
        case "-":
          return "collapsed";
        default:
          throw "Could not convert resolution'" + resString + "' to abbreviation string";
      }
    },

    setupActions: function (actionControl) {
      var that = this;

      actionControl.get("actions").each(function (i, action) {
        switch (action.id()) {
          case RES_DAILY:
            action.click = $.proxy(that.selectDaily, that);
            break;
          case RES_WEEKLY:
            action.click = $.proxy(that.selectWeekly, that);
            break;
          case RES_MONTHLY:
            action.click = $.proxy(that.selectMonthly, that);
            break;
          default:
            throw "Could not find action for " + action.id();
        }
      });
    },
    selectCurrentTimResolution: function (resolution) {
      switch (resolution) {
        case "weekly":
          this.updateResolutionDropdown(RES_WEEKLY);
          break;
        case "monthly":
          this.updateResolutionDropdown(RES_MONTHLY);
          break;
        case "daily":
          this.updateResolutionDropdown(RES_DAILY);
          break;
        default:
          break;
      }
    },

    selectDaily: function () {
      this.model.setPreferredTimeResolution("daily");
    },

    selectWeekly: function () {
      this.model.setPreferredTimeResolution("weekly");
    },

    selectMonthly: function () {
      this.model.setPreferredTimeResolution("monthly");
    },

    updateResolutionDropdown: function (resolutionItemId) {
      var actionControl = this.app[this.model.get("name") + "ActionControl"];
      actionControl.get("actions").each(function (i, action) {
        action.isEnabled(action.id() !== resolutionItemId);
      });
    },

    updateChart: function () {
      var dateRange = ExperienceAnalytics.getDateRange(),
        subsite = ExperienceAnalytics.getSubsite(),
        timeResolution = this.model.get("timeResolution"),
        currentRequestHash = JSON.stringify(dateRange) + subsite + timeResolution,
        keysAreValid = this.areKeysValid(),
        metrics = this.model.get("metrics"),
        segments = this.model.get("segments");

      if (dateRange && subsite && timeResolution && this.lastRequestHash != currentRequestHash && keysAreValid && metrics && segments) {
        this.lastRequestHash = currentRequestHash;

        var parameters = Sitecore.Helpers.url.getQueryParameters(this.model.get("keysByMetricQuery"));
        parameters.dateFrom = ExperienceAnalytics.convertDateFormat(dateRange.dateFrom);
        parameters.dateTo = ExperienceAnalytics.convertDateFormat(dateRange.dateTo);
        parameters.keyGrouping = this.model.get("keyGrouping");
        this.getData(parameters, subsite, timeResolution);
      }
    },

    setChartProperties: function (chartModel) {
            var metrics = this.model.get("metrics"),
                segments = this.model.get("segments");

      if (!segments || !metrics) {
        return;
      }

            var errorTexts = this.model.get("errorTexts");
      if (errorTexts.AllOnly) {
        this.showMessage("warning", errorTexts.AllOnly);
      }

            this.showMessageForInvalidSettingsOfCharts();
      chartModel.set("lang", ExperienceAnalytics.getCookie('shell#lang'));
    },

        showMessageForInvalidSettingsOfCharts: function () {
            var metrics = this.model.get("metrics"),
                keys = this.model.get("keys") ? this.model.get("keys").toString() : "",
                keysArr = keys ? keys.split("|") : [];

            var keyTop = Sitecore.Helpers.url.getQueryParameters(this.model.get("keysByMetricQuery")).keyTop ? parseInt(Sitecore.Helpers.url.getQueryParameters(this.model.get("keysByMetricQuery")).keyTop) : 0,
                keyFromUrl = Sitecore.Helpers.url.getQueryParameters(window.location.search).key,
                hasMultipleMetrics = metrics.length > 1,
                hasMultipleKeys = !keyFromUrl && (keyTop !== 1) && (keysArr.length > 1 || keys === "" || keys === "+" || keys === "ALL") && (this.model.get("keyGrouping") !== "collapsed");
            if (hasMultipleMetrics && hasMultipleKeys) {
      var errorTexts = this.model.get("errorTexts");
      this.showMessage("warning", errorTexts.MultipleKeysAndMultipleMetrics);
            }
    },

    getData: function (parameters, subsite, timeResolution) {
      var modelName = this.model.get("name"),
        dataProviderComponentName = modelName + "DataProvider",
        dataProviderModel = this.app[dataProviderComponentName],
        dataParameters = {
          url: this.getDataUrl(dataProviderModel.get("dataUrl"), this.model.get("segments"), this.model.get("keys"), subsite, this.getResolutionAbbreviation(timeResolution)),
          parameters: parameters,
          onSuccess: this.dataLoadedHandler.bind(this)
        };

            this.toggleProgressIndicator(true);

      dataProviderModel.viewModel.getData(dataParameters);
    },

    toggleProgressIndicator: function (toggle) {
        var progressIndicator = this.app[this.model.get('name') + 'ProgressIndicator'];
            if (progressIndicator) {
            progressIndicator.set("isBusy", toggle);
        }
    },

    dataLoadedHandler: function (data) {
      data = this.convertApiDataToChartData(data);

      if (this.model.get("title") == "") {
        this.displayKeyAsTitleForDrillDown(data.data);
      }

      var dataLength = data.data.dataset[0].data.length;
      if (!dataLength) {
        this.resetChartData();
      } else {
                this.setMetricsFormat(ExperienceAnalytics.getCookie('shell#lang'), data.timeResolution);
        this.setChartData(data.data);
      }

            this.toggleProgressIndicator(false);

      this.previousResponseData = data;
      this.selectCurrentTimResolution(this.getResolutionString(data.timeResolution));
    },

         setMetricsFormat: function (lang, timeResolution) {            
        },

    serverSideErrorHandler: function (errorObject) {
      this._super(errorObject);
      // Need to hide progress indicator if server error is appeared
            this.toggleProgressIndicator(false);
      this.resetChartData();
    },

    renameSumKeys: function (data) {
      _(data.dataset[0].data).each(function (dataItem) {
        dataItem.key = this.model.get("keyscollapsedlabel");
      }, this);

      return data;
    },

    resetChartData: function () {
      if (this.chartModel) {
          this.chartModel.set("dynamicData", []);
      }
    },

    setChartData: function (data) {
      var readyData = data;
      var isKeyGroupingCollapsed = this.model.get("keyGrouping") === "collapsed";
      var seriesChartField = this.model.get("seriesChartField");
      var chartName = this.model.get("chartName");
      var metrics = this.model.get("metrics");

      var segmentTranslations = this.getTranslationsByField(data, seriesChartField.segmentField);
      var numOfSegments = _.keys(segmentTranslations).length;
      var keyTranslations = this.getTranslationsByField(data, seriesChartField.keyField);
      var translations = _(segmentTranslations).extend(keyTranslations);

      var useCartesianKey = !isKeyGroupingCollapsed && numOfSegments > 1;

      if (isKeyGroupingCollapsed) {
        readyData = this.renameSumKeys(data);
      }
      else if (useCartesianKey) {
        _(readyData.dataset[0].data).each(function (item) {
          item.cartesianKey = item[seriesChartField.segmentField] + '|' + item[seriesChartField.keyField];
          translations[item.cartesianKey] = translations[item[seriesChartField.segmentField]] + " - " + translations[item[seriesChartField.keyField]];
        });
      }

      this.extractDimensionKeys(data);

      this.chartModel.set("data", readyData);
      var chartParameters = {};
      chartParameters.metrics = metrics;
      chartParameters.chartName = chartName;
      chartParameters.isKeyGroupingCollapsed = isKeyGroupingCollapsed;
      chartParameters.numOfSegments = numOfSegments;
      chartParameters.seriesChartField = seriesChartField;

      var dynamicData = chartDataConversionService.convert(readyData.dataset, translations, chartParameters);
      this.chartModel.set("dynamicData", dynamicData);
    },

    displayKeyAsTitleForDrillDown: function (data) {
      var seriesChartField = this.model.get("seriesChartField");
      var keyTranslations = this.getTranslationsByField(data, seriesChartField.keyField);
      var keyFromUrl = Sitecore.Helpers.url.getQueryParameters(window.location.search).key;
      if (keyFromUrl) {
        var keyTranslation = keyTranslations[keyFromUrl];
        if (keyTranslation) {
          this.model.set("title", keyTranslation);
        }
      }
    },

    extractDimensionKeys: function (readyData) {
      var entries = readyData.dataset[0].data;
      this.rawKeys = _.pluck(entries, this.keyProperty);
    },

    getTranslationsByField: function (data, field) {
      var translations;
      try {
        translations = _.find(data.localization.fields, function (item) { return item.field === field; }).translations;
      } catch (e) {
        throw 'Cannot find translation for field "' + field + '"';
      }
      return translations;
    },

    setupMessageBar: function (chartModel) {
      chartModel.on("error", function (error) {
        this.showMessage("error", error.message);
      }, this);
    },

    validateProperties: function () {
      this._super();

      if (!this.model.get("metrics")) {
        this.showMessage("error", this.model.get("errorTexts").MetricsAreEmpty);
      }
    },

    drillDownToKey: function (selectedSegment) {
            var rawData = selectedSegment.rawData;
            if (rawData && this.model.get("targetPageUrl") && this.model.get("keyGrouping") != "collapsed") {
        var targetPageUrl = this.model.get("targetPageUrl");

        if (targetPageUrl) {
                    var rawKey = this.rawKeys[rawData.index] || rawData.data[this.keyProperty];
          window.location.href = Sitecore.Helpers.url.addQueryParameters(targetPageUrl, {
            key: rawKey
          });
        }
      }
    }

  });
});