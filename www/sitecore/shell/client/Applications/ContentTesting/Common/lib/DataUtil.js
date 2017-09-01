define(["sitecore"], function (Sitecore) {
  return {
    DataUri: function(initVal) {
      var prefix = "sitecore://";

      this.id = null;
      this.ver = null;
      this.lang = null;
      this.rev = null;

      this.from = function (str) {
        if (str.indexOf(prefix) != 0) {
          return;
        }

        var idEnd = str.indexOf("?") || str.length - 1;
        this.id = str.slice(prefix.length, idEnd);
        this._ensureIdFormat();

        if (idEnd < str.length - 1) {
          var params = Sitecore.Helpers.url.getQueryParameters(str);
          this.ver = parseInt(params.ver, 10);
          this.lang = params.lang;
          this.rev = params.rev;
        }
      };

      this.fromObject = function (ob) {
        if(ob.ItemID) {
          this.id = ob.ItemID;
          this._ensureIdFormat();
        }
        
        if(ob.Language && ob.Language.Name) {
          this.lang = ob.Language.Name;
        }
        
        if (ob.Version && ob.Version.Number) {
          this.ver = ob.Version.Number;
        }
      };

      this.toString = function () {
        var decodedId = decodeURIComponent(this.id);
        var output = prefix + decodedId;
        if (this.ver) {
          output = Sitecore.Helpers.url.addQueryParameters(output, { ver: this.ver });
        }

        if (this.lang) {
          output = Sitecore.Helpers.url.addQueryParameters(output, { lang: this.lang });
        }

        if (this.rev) {
          output = Sitecore.Helpers.url.addQueryParameters(output, { rev: this.rev });
        }

        return output;
      };

      this.equals = function (other) {
        return this.id === other.id && this.lang === other.lang && this.ver === other.ver;
      }

      this._ensureIdFormat = function () {
        var decodedId = decodeURIComponent(this.id);
        if (decodedId.substring(0, 1) !== "{") {
          decodedId = "{" + this.id + "}";
        }

        this.id = decodedId.toUpperCase();
      };

      if (initVal) {
        if (_.isObject(initVal)) {
          this.fromObject(initVal);
        }
        else {
          this.from(initVal);
        }
      }
    },

    composeUri: function (storage) {
      var params = Sitecore.Helpers.url.getQueryParameters(window.location.href);
      var la = (storage ? storage.get("languageName") : null) || params.la;
      var id = (storage ? storage.get("itemId") : null) || params.id;
      var vs = (storage ? storage.get("version") : null) || params.vs;

      var uri = null;

      if (id != null && vs != null) {
        var decodedId = decodeURIComponent(id);
        uri = "sitecore://" + decodedId + "?ver=" + vs;
      }

      if (la != null) {
        uri += "&lang=" + la;
      }

      if ((!uri || vs == -1) && params.hostUri) {
        uri = params.hostUri;
      }
      return uri;
    },

    getVariationInfoHTML: function (infoObj) {
      if (!infoObj)
        return "";
      var keys = _.keys(infoObj);
      var html = "<div><table>";
      for (var i = 0; i < keys.length; i++) {
        html += "<tr>";
        html += "<td class='tdLeft'>" + keys[i] + "</td>";
        html += "<td class='tdRight'>" + infoObj[keys[i]] + "</td>";
      }
      html += "</table></div>";

      return html;
    },

    multiplexCombination: function (combination) {

      var text = _.reduce(combination, function(acc, curr) {
        return acc + curr.toString() + "-";
      }, "");

      // Remove the trailing dash
      if (text) {
        text = text.substring(0, text.length - 1);
      }

      return text;
    },

    arrowIndicatorNewValueChanged: function () {
      var newValue = this.self.get("newValue");
      var nullValue;
	  if (this.treatNull)
	  {
		  if (newValue == null)
		  {
			nullValue = "--";  
		  }
	  }
	  else
	  {
		if (!newValue || isNaN(parseFloat(newValue)))
		{
			nullValue = "--";  
		}
	  }

      try {
        //this.self.viewModel.refreshData(this.self.get("oldValue"), this.self.get("newValue"));
		this.app.refreshArrowIndicator(this.self, this.self.get("oldValue"), this.self.get("newValue"));
      }
      catch (e) { }
      if (nullValue) {
        this.self.viewModel.$el.find(".sc-ArrowIndicator-Value").html(nullValue);
		
      }
      if (this.self.get("valueFormat") === "Percentage") {
        var html = this.self.viewModel.$el.find(".sc-ArrowIndicator-Value").html();
        if (html.indexOf("%") < 0)
          this.self.viewModel.$el.find(".sc-ArrowIndicator-Value").html(html + "%");
      }
    },
	
	refreshArrowIndicator: function(indicator, oldValue, newValue)
	{
		indicator.set("oldValue", parseFloat(oldValue));
		indicator.set("newValue", parseFloat(newValue));

		indicator.set("indicatorValue", this.calculateValue(indicator, oldValue, newValue, indicator.get("valueFormat")));
      
      indicator.viewModel.setSvgImage(
        indicator.viewModel.$el.find(".sc-ArrowIndicator-Arrow"),
        indicator.viewModel.getDirection(newValue, oldValue),
        indicator.get("upArrowColor"),
        indicator.get("downArrowColor"),
        indicator.get("equalSignColor"));

      indicator.viewModel.setValueColor(this.model.get("valueColor"));
	},
	
	calculateValue: function (indicator, oldValue, newValue, valueFormat) {
      var result;
      if (isNaN(oldValue) || isNaN(newValue)) {
        return "";
      }
      
      if (valueFormat === "Percentage") {
        if (oldValue === 0) {
          // if oldValue == 0 then do not show percentage, just newValue
          result = newValue.toFixed(2);
          valueFormat = "Number";
        } else {
          result = parseFloat(((newValue - oldValue) / Math.abs(oldValue) * 100)).toFixed(2);
        }        
      } else {
        result = parseFloat(newValue - oldValue).toFixed(2);
      }

      if (!indicator.get("showMinusSign")) {
        result = Math.abs(result);
      }

      result = result.toString();
      
      if (isNaN(result)) {
        return "";
      }

      if (result % 1 === 0) {
        result = parseInt(result);
      }
           
      if (valueFormat === "Percentage") {
        result = result + "%";
      }
      
      return result;
    },

    arrowIndicatorEventAssign: function (arrowIndicators) {
      if (!arrowIndicators)
        return;

      var self = this;
      _.each(arrowIndicators, function (indicator) {
        indicator.component.on("change:newValue", self.arrowIndicatorNewValueChanged, {self:indicator.component, treatNull:indicator.treatNull, app:self});
        var newValue = indicator.component.get("newValue");
        indicator.component.set("newValue", -newValue);
        indicator.component.set("newValue", newValue);        
      });
    },

    getTestOptionsEmpty: function (testOptions) {
      if (!testOptions)
        testOptions = {};
      _.extend(testOptions, {
        TrafficAllocation: -1,
        ConfidenceLevel: -1,
        GoalId: "",
        TrackWithEngagementValue: true,
        MaxDuration: -1,
        MinDuration: -1,
        SelectWinnerStrategy: null,
      });
      return testOptions;
    },

    getTestOptions: function (options, page) {
      if (!options || !page)
        return options;

      if (page.expectedChangeCtrl)
        options.Expectation = page.expectedChangeCtrl.getExpectation();

      if (page.TrafficAllocationSlider) {
        options.TrafficAllocation = page.TrafficAllocationSlider.get("selectedValue");
      } else {
        var defaultTrafficAllocation = page.SettingsDictionary.get("ContentTesting.DefaultTrafficAllocation") || "100";
        options.TrafficAllocation = parseInt(defaultTrafficAllocation, 10);
      }

      if (page.ObjectiveList) {
        var goal = page.ObjectiveList.get("selectedItem");
        if (goal) {
          options.TrackWithEngagementValue = goal.guid === "{00000000-0000-0000-0000-000000000000}";

          if (goal.guid) {
            options.GoalId = goal.guid;
          }
        }
      }

      if (page.get("groupTestObjective")) {
        var groupValue = page.get("groupTestObjective");
        options.SelectWinnerStrategy = groupValue;
      }

      if (page.confidenceLevelCtrl) {
        options.ConfidenceLevel = page.confidenceLevelCtrl.getConfidenceLevel();
      }


      if (page.MaximumSelect) {
        options.MaxDuration = page.MaximumSelect.get("selectedValue");
      } else {
        var defaultMaxDuration;
        var isContentTesting;
        if (page.TestVariablesDataSource && page.isJustContentTesting) {
          var items = page.TestVariablesDataSource.get("items");
          isContentTesting = page.isJustContentTesting(items);
        }

        if (!isContentTesting || page.isExperienceOptimizationPageTest)
          defaultMaxDuration = page.SettingsDictionary.get("ContentTesting.MaximumOptimizationTestDuration");
        else
          defaultMaxDuration = page.SettingsDictionary.get("ContentTesting.MaximumContentTestDuration");

        options.MaxDuration = defaultMaxDuration;
      }

      if (page.MinimumSelect) {
        options.MinDuration = page.MinimumSelect.get("selectedValue");
      } else {
        var defaultMinDuration = page.SettingsDictionary.get("ContentTesting.MinimumDuration");
        options.MinDuration = defaultMinDuration;
      }

      return options;
    },

    setDefaultsParameters: function (page) {
      if (!page || !page.SettingsDictionary)
        return;

      // Traffic allocation
      var defaultTrafficAllocation = page.SettingsDictionary.get("ContentTesting.DefaultTrafficAllocation") || "100";
      defaultTrafficAllocation = parseInt(defaultTrafficAllocation, 10);
      if (page.TrafficAllocationSlider) {
        if (page.TestDurationDataSource) {
          page.TrafficAllocationSlider.on("change:selectedValue", function () {
            page.TestDurationDataSource.set("trafficAllocation", this.get("selectedValue"));
          });
        }

        page.TrafficAllocationSlider.set("selectedValue", defaultTrafficAllocation);
      } else {
        if (page.TestDurationDataSource) {
          page.TestDurationDataSource.set("trafficAllocation", defaultTrafficAllocation);
        }
      }

      // Confidence level
      var defaultConfidenceLevel = page.SettingsDictionary.get("ContentTesting.DefaultConfidenceLevel");
      if (page.confidenceLevelCtrl && page.confidenceLevelCtrl.isAvailable()) {
        page.confidenceLevelCtrl.setConfidenceLevel(defaultConfidenceLevel);
      } else {
        if (page.TestDurationDataSource) {
          page.TestDurationDataSource.set("confidence", defaultConfidenceLevel);
        }
      }

      // Minimum duration
      var defaultMinDuration = page.SettingsDictionary.get("ContentTesting.MinimumDuration");
      if (page.MinimumSelect) {
        page.MinimumSelect.on("change:items", function () {
          page.MinimumSelect.set("selectedValue", defaultMinDuration);
        }, page);
      } else {
        if (page.TestDurationDataSource) {
          page.TestDurationDataSource.set("minDuration", defaultMinDuration);
        }
      }

      // Maximum duration
      var defaultMaxDuration;
      if (page.isExperienceOptimizationPageTest)
        defaultMaxDuration = page.SettingsDictionary.get("ContentTesting.MaximumOptimizationTestDuration");
      else
        defaultMaxDuration = page.SettingsDictionary.get("ContentTesting.MaximumContentTestDuration");

      if (page.MaximumSelect) {
        page.MaximumSelect.on("change:items", function () {
          // Set the default maximum duration value from the config in the Maximum Duration combobox.
          var initialized = page.MaximumSelect.get("initialized");
          if (!initialized) {
            page.MaximumSelect.set("selectedValue", defaultMaxDuration);
          }
        }, page);
      } else {
        if (page.TestDurationDataSource) {
          page.TestDurationDataSource.set("maxDuration", defaultMaxDuration);
        }
      }

    },

  }
});