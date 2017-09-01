require.config({
  paths: {
    experienceAnalytics: "/sitecore/shell/client/Applications/ExperienceAnalytics/Common/Layouts/Renderings/Shared/ExperienceAnalytics",
    experienceAnalyticsBase: "/sitecore/shell/client/Applications/ExperienceAnalytics/Common/Layouts/Renderings/Shared/experienceAnalyticsBase"
  }
});

define(["sitecore", "experienceAnalytics", "experienceAnalyticsBase"], function (Sitecore, ExperienceAnalytics) {
  "use strict";

  Sitecore.Factories.createBaseComponent({
    name: "ExperienceAnalyticsDvcBase",
    base: "ExperienceAnalyticsBase",
    selector: ".sc-ExperienceAnalyticsDvcBase",

    attributes: Sitecore.Definitions.Views.ExperienceAnalyticsBase.prototype._scAttrs.concat([
      { name: "errorTexts", value: "$el.data:sc-errortexts" },
      { name: "configurationError", value: "$el.data:sc-configurationerror" }
    ]),

    keysInvalidCharacter: undefined,

    initialize: function() {
      this._super();

      if (this.model.get("configurationError")) {
        var configurationErrorText = this.model.get("errorTexts").ConfigurationError;
        if (this.messageBarHasText(configurationErrorText) == false) {
          this.showMessage("error", configurationErrorText);
        }
        return;
      }

      this.model.on("change:keys", function() { this.keysInvalidCharacter = undefined; }, this);
    },

    convertApiDataToChartData: function (apiData) {
      _.extend(apiData.data, { "dataset": [{ "data": apiData.data.content }] });
      delete apiData.data.content;
      
      return apiData;
    },

    getProgressIndicator: function() {
      return this.app[this.model.get("name") + "ProgressIndicator"];
    },

    serverSideErrorHandler: function (errorObject) {
      var dialogWindow = this.app["ExperienceAnalyticsDialogWindowModal"],
        genericServerError = this.model.get("errorTexts").GenericServerError;
          
      if (errorObject) {
        if (typeof (errorObject) === "object" && typeof (errorObject.response) === "object" && typeof (errorObject.response.status) === "number" && errorObject.response.status === 401) {
          dialogWindow.viewModel.show();
        } else {
          this.showMessage("error", genericServerError, { ERRORCODE: errorObject.response.status });
        }
      }
    },

    setupServerSideErrorHandling: function () {
      var dataProvider = this.app[this.model.get("name") + "DataProvider"];

      dataProvider.on("error", this.serverSideErrorHandler, this);
    },

    areKeysValid: function () {
      if (this.keysInvalidCharacter === undefined) {
        var keys = this.model.get("keys");
        this.keysInvalidCharacter = ExperienceAnalytics.findInvalidString(typeof keys === "string" ? keys.split("|") : keys, ExperienceAnalytics.illegalCharacters);
      }

      return this.keysInvalidCharacter ? false : true;
    },

    validateProperties: function() {
      var errorTexts = this.model.get("errorTexts");

      if (!this.areKeysValid()) {
        this.showMessage("error", errorTexts.NotAllowedCharacters, { ILLEGAL_CHARACTER: this.keysInvalidCharacter });
      }

      if (!this.model.get("segments")) {
        this.showMessage("error", errorTexts.SegmentsAreEmpty);
      }
    },
    
    renameSumKeys: function (data) {
      var entries = data.dataset[0].data,
        localizationFields = data.localization.fields,
        keyField,
        segmentIdField;

      for (var i = 0; i < entries.length; i++) {
        var entry = entries[i];
        entry.key = entry.segment;
      }

      for (var j = 0; j < localizationFields.length; j++) {
        var localizationField = localizationFields[j];

        if (localizationField.field === "key") {
          keyField = localizationField;
        } else if (localizationField.field === "segment") {
          segmentIdField = localizationField;
        }
      }

      if (keyField && segmentIdField) {
        keyField.translations = segmentIdField.translations;
      }

      return data;
    },

    pipeToComma: function (str) {
      return str ? String(str).replace(/\|/g, "%2c") : String(str);
    },

    getDataUrl: function (originalUrl, segments, keys, subsite, timeResolution) {
      var encodedKeys = this.pipeToComma(keys),
        encodedSegments = this.pipeToComma(_.map(segments.split("|"), function (segment) { return Sitecore.Helpers.id.toShortId(segment); }).join("|")),
        url = originalUrl.replace("{SUBSITE}", subsite)
        .replace("{SEGMENTS}", encodedSegments)
        .replace("{KEYS}", encodedKeys ? encodedKeys : "all");

      if (timeResolution) {
        url = url.replace("{TIME_RESOLUTION}", timeResolution);
      }

      return url;
    }
    
  });
});
