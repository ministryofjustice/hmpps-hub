require.config({
  baseUrl: "/sitecore/shell/client/Applications/ContentTesting/Common/lib",
  ExpectedChangeCtrl: "/-/speak/v1/contenttesting/ExpectedChangeCtrl.js",
  ConfidenceLevelCtrl: "/-/speak/v1/contenttesting/ConfidenceLevelCtrl.js",
});

define(["sitecore", "BindingUtil", "DataUtil", "RequestUtil", "ExpectedChangeCtrl", "ConfidenceLevelCtrl"], function (_sc, bindingUtil, dataUtil, requestUtil, expectedChangeCtrl, confidenceLevelCtrl) {
  var trailingValueVisitGUID = "{00000000-0000-0000-0000-000000000000}";

  return {
    ReviewTest: function (options) {
      var ob = {
        _host: options.hostPage,
        _testItemsProperty: options.testItemsProperty,
        _testItemUriProperty: options.testItemUriProperty,
        _loadOptions: null,

        init: function () {
          var self = this;
          this._host.on("change:" + this._testItemsProperty, this.updateCarouselItems, this);
          this._host.on("change:" + this._testItemsProperty, this.validateTest, this);
          this._host.on("change:" + this._testItemUriProperty, this.updateCarouselItems, this);

          // Expectation
          if (expectedChangeCtrl) {
            this.expectedChangeCtrl = expectedChangeCtrl;
            this._host.expectedChangeCtrl = expectedChangeCtrl;
            expectedChangeCtrl.initElements(this._host);
          }            

          // Confidence level
          if (confidenceLevelCtrl) {
            this.confidenceLevelCtrl = confidenceLevelCtrl;
            this._host.confidenceLevelCtrl = confidenceLevelCtrl;
            confidenceLevelCtrl.initElements(this._host);
          }            


          this._host.CarouselImage.set("imageDescriptionHandler", this.createThumbnailDescription);
          this.validateTest();

          if (this._host.TestDurationDataSource) {
            this._host.on("change:" + this._testItemUriProperty, bindingUtil.propagateChange, {
              source: this._host,
              sourceProp: this._testItemUriProperty,
              target: this._host.TestDurationDataSource,
              targetProp: "itemUri"
            });

            this._host.on("change:" + this._testItemsProperty, bindingUtil.propagateChange, {
              source: this._host,
              sourceProp: function (source) { return (source.get(self._testItemsProperty) || []).length },
              target: this._host.TestDurationDataSource,
              targetProp: "additionalPageCount"
            });

            this._host.TestDurationDataSource.on("change:experienceCount change:viewsPerDay change:expectedDays change:requiredVisits", this.updateMessageBar, this);

            // Set default values for the controls
            dataUtil.setDefaultsParameters(this._host);
          }

          // Close preview accordion until test pages are added
          this._host.PreviewAccordion.set("isOpen", false);

          // loadOptions
          if (this._loadOptions) {
            // Confidence level
            var value = this._loadOptions.ConfidenceLevel.toString();
            if (confidenceLevelCtrl)
              confidenceLevelCtrl.setConfidenceLevel(value);

            // MaxDuration
            value = this._loadOptions.MaxDuration;
            this._host.MaximumSelect.set("selectedValue", value);

            // MinDuration
            value = this._loadOptions.MinDuration;
            this._host.MinimumSelect.set("selectedValue", value);

            // SelectWinnerStrategy
            if (this._loadOptions.SelectWinnerStrategy) {
              var winnerStrategy = this._loadOptions.SelectWinnerStrategy.toLowerCase();
              if (winnerStrategy[0] !== "{") {
                winnerStrategy = "{" + winnerStrategy + "}";
              }

              if (winnerStrategy === this._host.WinnerAutoSelect.get("value").toLowerCase()) {
                this._host.WinnerAutoSelect.check();
              }

              if (winnerStrategy === this._host.WinnerAutoSelectUnless.get("value").toLowerCase()) {
                this._host.WinnerAutoSelectUnless.check();
              }

              if (winnerStrategy === this._host.WinnerManualSelect.get("value").toLowerCase()) {
                this._host.WinnerManualSelect.check();
              }
            }
          }

          // ObjectiveList
          if (this._host.ObjectiveList) {
            this._host.ObjectiveList.on("change:items", function () {
              // set default
              this._host.ObjectiveList.set("selectedGuid", trailingValueVisitGUID);
              if (this._loadOptions && this._loadOptions.GoalId) {
                var value = this._loadOptions.GoalId;
                if (value[0] !== "{") {
                  value = "{" + value + "}";
                }
                // need the previous 'set' call so we change the value and the change event is fired
                this._host.ObjectiveList.set("selectedGuid", value);
              }
            }, this);

            this._host.ObjectiveList.on("change:selectedItem", this.updateTestObjectiveUI, this);
          }
        },

        loadTest: function (options) {
          // Load may occur before items populate, so store the options so defaults can be set when items are populated into controls.
          this._loadOptions = options;
          var expectation = parseInt(options.Expectation);
          if(expectedChangeCtrl)
            expectedChangeCtrl.setExpectation(expectation);

          if (this._host.TrafficAllocationSlider) {
            this._host.TrafficAllocationSlider.set("selectedValue", options.TrafficAllocation);
          }

          // Winner strategy
          if (options.SelectWinnerStrategy && this._host.WinnerAutoSelect) {
            var winnerStrategy = options.SelectWinnerStrategy.toLowerCase();
            if (winnerStrategy[0] !== "{") {
              winnerStrategy = "{" + winnerStrategy + "}";
            }

            if (winnerStrategy === this._host.WinnerAutoSelect.get("value").toLowerCase()) {
              this._host.WinnerAutoSelect.check();
            }

            if (winnerStrategy === this._host.WinnerAutoSelectUnless.get("value").toLowerCase()) {
              this._host.WinnerAutoSelectUnless.check();
            }

            if (winnerStrategy === this._host.WinnerManualSelect.get("value").toLowerCase()) {
              this._host.WinnerManualSelect.check();
            }
          }

          // Other components
          if (confidenceLevelCtrl) {
            confidenceLevelCtrl.setConfidenceLevel(options.ConfidenceLevel.toString());
          }

          if (this._host.ObjectiveList) {
            var goal = options.GoalId;
            if (goal) {
              if (goal[0] !== "{") {
                goal = "{" + goal + "}";
              }
              this._host.ObjectiveList.set("selectedGuid", goal);
            }
          }

          if (this._host.MaximumSelect) {
            this._host.MaximumSelect.set("selectedValue", options.MaxDuration.toString());
          }

          if (this._host.MinimumSelect) {
            this._host.MinimumSelect.set("selectedValue", options.MinDuration.toString());
          }
        },

        createTestOptions: function(options) {
          options = dataUtil.getTestOptionsEmpty(options);

          return dataUtil.getTestOptions(options, this._host);
        },

        updateCarouselItems: function () {
          var testItems = [new dataUtil.DataUri(this._host.get(this._testItemUriProperty))];
          _.each(this._host.get(this._testItemsProperty), function (item) {
            testItems.push(item);
          });

          this._host.PreviewAccordion.set("isOpen", testItems.length !== 0);

          var carouselItems = [];
          for (var i in testItems) {
            carouselItems.push({
              name: (parseInt(i, 10) + 1) + " / " + testItems.length,
              uId: testItems[i].id + "-" + testItems[i].ver + "-" + testItems[i].rev,
              attrs: {
                id: testItems[i].id,
                version: testItems[i].ver,
                revision: testItems[i].rev,
                language: testItems[i].lang,
                original: i === 0
              }
            });
          }

          this._host.CarouselImage.set("items", carouselItems);
        },

        createThumbnailDescription: function (item, $target) {
          // todo: Skynet: The descriptions should be defined inside a placeholder using SPEAK components, not in code.
          // At the very least, use an iteminfodatasource and bind it
          // problem with context. Use 'ob' instead of 'this'
          var uri = new dataUtil.DataUri();
          uri.id = item.attrs.id;
          uri.ver = item.attrs.version;
          uri.rev = item.attrs.revision;
          uri.lang = item.attrs.language;

          var url = "/sitecore/shell/api/ct/ItemInfo/GetByUri?datauri=" + encodeURIComponent(uri);

          var ajaxOptions = {
            cache: false,
            url: url,
            context: this,
            success: function(data) {

              var infoObj = {};
              infoObj[ob._host.Texts.get("Item:")] = data.Path;
              infoObj[ob._host.Texts.get("Version:")] = (item.attrs.ver || data.Version) + "-" + data.Language;
              infoObj[ob._host.Texts.get("Created:")] = data.CreatedDate + " " + ob._host.Texts.get("by") + " " + data.CreatedBy;

              var html = dataUtil.getVariationInfoHTML(infoObj);
              $target.html(html);
            }
          };

          requestUtil.performRequest(ajaxOptions);
        },

        updateMessageBar: function () {
          var experienceCount = this._host.TestDurationDataSource.get("experienceCount");

          if (experienceCount > 0) {
            var sessionsRequired = this._host.TestDurationDataSource.get("requiredVisits");
            var expectedDays = this._host.TestDurationDataSource.get("expectedDays");

            var type = "notification";
            var template;

            if (expectedDays <= 0) {
              template = _.template(this._host.Texts.get("The test will require <%= visits %> visitors to find a winner. We do not have enough historical data to provide a forecasting on duration."));
            }
            else if (expectedDays > 90) {
              // todo: move value to configuration
              type = "warning";
              template = _.template(this._host.Texts.get("Based on historical visitor data, it will take more than <%= days %> days to finish a test for the <%= pages %> pages included.  To speed up the test, disable some of the pages or adjust test settings."));
            }
            else {
              template = _.template(this._host.Texts.get("Based on historical visitor data, it will take about <%= days %> days to finish a test for the <%= pages %> pages included."));
            }

            this._host.MessageBar.removeMessages("notification");
            this._host.MessageBar.removeMessages("warning");
            this._host.MessageBar.addMessage(type, template({
              visits: sessionsRequired,
              days: expectedDays,
              pages: experienceCount
            }));
          }
        },

        validateTest: function () {
          var valid = false;

          // todo: logic for retrieving the selected pages should be in the module and not bleeding into the app
          var testPages = this._host.get(this._testItemsProperty);
          valid = testPages && testPages.length > 0;

          this._host.FirstStartButton.set("isEnabled", valid);
          if (this._host.BottomStartButton) {
            this._host.BottomStartButton.set("isEnabled", valid);
          }
        },

        updateTestObjectiveUI: function (sender, selectedTestObjective) {
          if (!selectedTestObjective) {
            return;
          }

          var measureByValue = selectedTestObjective.guid === trailingValueVisitGUID;

          if (this._host.WinnerAutoSelect) {
            this._host.WinnerAutoSelect.set("isEnabled", true);

            if (measureByValue) {
              this._host.WinnerAutoSelect.check();
            }
          }

          if (this._host.WinnerAutoSelectUnless) {
            this._host.WinnerAutoSelectUnless.set("isEnabled", !measureByValue);

            if (!measureByValue) {
              this._host.WinnerAutoSelectUnless.check();
            }
          }

          if (this._host.WinnerManualSelect) {
            this._host.WinnerManualSelect.set("isEnabled", true);
          }

          if (this._host.TestDurationDataSource) {
            this._host.TestDurationDataSource.set("measureByGoal", !measureByValue);
          }   
        }
      };

      ob.init();
      return ob;
    }
  };
});