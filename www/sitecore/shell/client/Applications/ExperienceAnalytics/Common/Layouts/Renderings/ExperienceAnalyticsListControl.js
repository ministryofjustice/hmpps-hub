require.config({
  paths: {
    experienceAnalytics: "/sitecore/shell/client/Applications/ExperienceAnalytics/Common/Layouts/Renderings/Shared/ExperienceAnalytics",
    experienceAnalyticsDvcBase: "/sitecore/shell/client/Applications/ExperienceAnalytics/Common/Layouts/Renderings/Shared/experienceAnalyticsDvcBase"
  }
});

define(["sitecore", "experienceAnalytics", "experienceAnalyticsDvcBase"], function (Sitecore, ExperienceAnalytics, bbb) {
  Sitecore.Factories.createBaseComponent({
    name: "ExperienceAnalyticsListControl",
    base: "ExperienceAnalyticsDvcBase",
    selector: ".sc-ExperienceAnalyticsListControl",
    attributes: Sitecore.Definitions.Views.ExperienceAnalyticsDvcBase.prototype._scAttrs.concat([
      { name: "errorTexts", value: "$el.data:sc-errortexts" },
      { name: "keys", value: "$el.data:sc-keys" },
      { name: "keysCount", value: "$el.data:sc-keyscount", defaultValue: "10" },
      { name: "keyOrderBy", value: "$el.data:sc-orderkeysby" },
      { name: "keysdirection", value: "$el.data:sc-keysdirection" },
      { name: "targetPageUrl", value: "$el.data:sc-targetpageurl" },
      { name: "isLoading", defaultValue: true },
      { name: "keysAreValid", defaultValue: true },
      { name: "segments", value: "$el.data:sc-segments" },
      { name: "keyGrouping", value: "$el.data:sc-keygrouping" },
      { name: "componentType", value: "$el.data:sc-componenttype" },
      { name: "columnFields", value: "$el.data:sc-columnfields" },
      { name: "title", value: "$el.data:sc-title" }
    ]),

    dataProvider: null,
    listControl: null,
    showMoreButton: null,
    keyProperty: "key",
    visibleRows: 0,
    rawKeys: {},
    lastRequestHash: "",

    initialize: function () {
        this._super();
        this.rawKeys = {};
    },

    afterRender: function () {
      if (this.model.get("configurationError")) {
        return;
      }
      var componentName = this.model.get("name");

      this.showMoreButton = this.app[componentName + "Button"];
      this.listControl = this.app[componentName + "ListControl"];
      this.dataProvider = this.app[componentName + "DataProvider"];

      this.setupServerSideErrorHandling();

      ExperienceAnalytics.on("change:dateRange change:subsite", this.getData, this);
      this.showMoreButton.on("click", this.showMoreRows, this);
      this.listControl.on("change:selectedItem", this.drillDownToKey, this);
      this.listControl.on("didRender", this.setIsLoading, this);

      this.validateProperties();

      if (this.areKeysValid() && this.model.get("segments")) {
        this.getData();
      }
    },

    drillDownToKey: function (listcontrol, item) {
      // Bug: For some reason on some clicks this is called twice. Second time item.attributes isn't defined.
      if (item.attributes) {
        var targetPageUrl = this.model.get("targetPageUrl");

        if (targetPageUrl) {
          // Bug: This check is due to a bug where it doesn't always localize keys in list control.
          var rawKey = this.rawKeys[item.attributes.itemId] || item.attributes[this.keyProperty];
          window.location.href = Sitecore.Helpers.url.addQueryParameters(targetPageUrl, {
            key: rawKey
          });
        }

      }
    },

    showMoreRows: function () {
      var nextRowCount = this.visibleRows + parseInt(this.model.get("keysCount")),
        dataLength = this.chartData.dataset[0].data.length;

      this.visibleRows = dataLength > nextRowCount ? nextRowCount : dataLength;

      this.updateListControl();
    },

    updateListControl: function (rawData) {
      this.chartData = rawData ? this.convertApiDataToChartData(rawData).data : this.chartData;

      if (this.model.get("keyGrouping") === "collapsed") {
        this.chartData = this.renameSumKeys(this.chartData);
      }

      var data = _.map(this.chartData.dataset[0].data, _.clone),
        limitedData = [],
        dataLength = data.length,
        counter = dataLength > this.visibleRows ? this.visibleRows : dataLength;

      this.showMoreButton.set("isVisible", dataLength > this.visibleRows);

      data = this.translateKeys(data, this.getTranslations(this.chartData));

      var columnFields = this.model.get("columnFields");
      for (var i = 0; i < counter; i++) {
        for (var field in columnFields) {
          if (columnFields.hasOwnProperty(field)) {
            var numScaleString = this.getNumberScaleString(columnFields[field], data[i][field]);
            data[i][field] = numScaleString;
          }
        }

        limitedData.push(data[i]);
      }

      this.getProgressIndicator().set("isBusy", false);

      this.listControl.set("items", limitedData);
    },

    doNumberScaleValueHasOnlyLeastUnits: function (listOfValues, value) {
       
        if (typeof listOfValues === "undefined" || typeof value === "undefined") return false;
       
        var hasOnlyLeastUnits = false;

        if (listOfValues.length > 1) {
            hasOnlyLeastUnits = (value < (listOfValues[0] * listOfValues[1]));
        } else {
            hasOnlyLeastUnits = (value < (listOfValues[0]));
        }
       
        return hasOnlyLeastUnits;
    },

    getNumberScaleString: function (field, value) {
        var listOfUnits = field.ScaleUnit.split(","),
            listOfValues = field.ScaleValue.split(","),
            scaleRecursively = !!field.ScaleRecursively,
            numOfValues = listOfValues.length,
            outputArray = [],
            remainingValue = value,
            isPercentage = (listOfUnits.length === 1 && listOfUnits[0] === "%");

        if (!isPercentage && this.doNumberScaleValueHasOnlyLeastUnits(listOfValues, value)) {
            outputArray.push(Math.round(value) + listOfUnits[0]);
            return outputArray.join(" ");
        }

        for (var i = numOfValues; i > 0; i--) {
            var totalValue = _.reduce(listOfValues, function (memo, num) { return memo * num; }),
              arrIndex = i - 1,
              currentUnitValue = scaleRecursively || isPercentage ? remainingValue / totalValue : Math.floor(remainingValue / totalValue);

            if (currentUnitValue >= 1 || isPercentage || value == 0) {
                if (isPercentage) {
                    currentUnitValue = Math.round(currentUnitValue * 100) / 100;
                }

                remainingValue = remainingValue - (currentUnitValue * totalValue);
                if (isPercentage) {
                    currentUnitValue = currentUnitValue.toFixed(2);
                }
                outputArray.push(currentUnitValue + listOfUnits[arrIndex]);

                if (scaleRecursively || value == 0)
                    break;
            }

            listOfValues.pop();
        }

        return outputArray.join(" ");
    },

    getTranslations: function (rawData) {
      var localizationFields = rawData.localization.fields,
        translations = null;

      for (var i = 0; i < localizationFields.length; i++) {
        var localizationField = localizationFields[i];

        if (localizationField.field === this.keyProperty) {
          translations = localizationField.translations;
        }
      }

      return translations;
    },

    translateKeys: function (data, translations) {
      if (translations) {
        for (var i = 0; i < data.length; i++) {
          var item = data[i];
          this.rawKeys[i] = item[this.keyProperty];
          item[this.keyProperty] = translations[item[this.keyProperty]];
          item.itemId = i;
        }
      }

      return data;
    },

    getData: function () {
      var dateRange = ExperienceAnalytics.getDateRange(),
        subsite = ExperienceAnalytics.getSubsite(),
        parameters,
        dataParameters,
        currentRequestHash = JSON.stringify(dateRange) + subsite,
        keysAreValid = this.areKeysValid();

      if (!this.model.get("segments")) {
        return;
      }

      this.visibleRows = parseInt(this.model.get("keysCount"), 10);

      if (dateRange && subsite && this.lastRequestHash != currentRequestHash && keysAreValid) {
        this.lastRequestHash = currentRequestHash;

        parameters = {
          dateFrom: ExperienceAnalytics.convertDateFormat(dateRange.dateFrom),
          dateTo: ExperienceAnalytics.convertDateFormat(dateRange.dateTo),
          keyGrouping: this.model.get("keyGrouping")
        };

        var keyOrderBy = this.model.get("keyOrderBy");

        if (keyOrderBy) {
          parameters.keyOrderBy = keyOrderBy + "-" + this.model.get("keysdirection");
        }

        dataParameters = {
          url: this.getDataUrl(this.dataProvider.get("dataUrl"), this.model.get("segments"), this.model.get("keys"), subsite),
          parameters: parameters,
          onSuccess: this.updateListControl.bind(this)
        };

        this.setIsLoading(true);

        this.dataProvider.viewModel.getData(dataParameters);
      }
    },

    setIsLoading: function (isLoading) {
      isLoading = typeof (isLoading) === "boolean" && isLoading == true ? true : false;
      this.model.set("isLoading", isLoading);
    },

    validateProperties: function () {
      this._super();

      var errorTexts = this.model.get("errorTexts");

      if (errorTexts.AllOnly) {
        this.showMessage("warning", errorTexts.AllOnly);
      }

      if (errorTexts.WrongTargetPage) {
        this.showMessage("warning", errorTexts.WrongTargetPage);
      }

      if (!this.areKeysValid() || !this.model.get("segments")) {
        this.getProgressIndicator().set("isBusy", false);
      }
    },

    serverSideErrorHandler: function (errorObject) {
      this._super(errorObject);
      this.getProgressIndicator().set("isBusy", false);
    },

  });
});