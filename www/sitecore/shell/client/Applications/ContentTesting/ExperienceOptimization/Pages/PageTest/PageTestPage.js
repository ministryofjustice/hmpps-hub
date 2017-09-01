define([
  "sitecore",
  "/-/speak/v1/contenttesting/BindingUtil.js",
  "/-/speak/v1/contenttesting/SelectPagesToTest.js",
  "/-/speak/v1/contenttesting/VersionInfo.js",
  "/-/speak/v1/contenttesting/DataUtil.js",
  "/-/speak/v1/contenttesting/URLs.js",
  "/-/speak/v1/contenttesting/Messages.js",
  "/-/speak/v1/contenttesting/PageTestUtil.js",
  "/-/speak/v1/contenttesting/TestResultsActions.js"
], function (_sc, bindingUtil, selectPagesToTestMod, versionInfoMod, dataUtil, urls, messages, PageTestUtil, actions) {
    var PageTest = _sc.Definitions.App.extend({
        isPageTestExperience: true,

        _testItemUriProperty: "testItemUri",
        _testItemTemplateIdProperty: "testItemTemplateId",
        _groupTestObjectiveProperty: "groupTestObjective",
        _selectedLanguageProperty: "selectedLanguage",
        _selectedVersionProperty: "selectedVersion",
        savedOptions: null,
        invalidated: false,
        _forceLoad: false,
        showThumbnails: true,

        idTabPages: "{A070481F-B6AD-48AC-A91D-43856465A3A4}",
        $tabPagesElem: undefined,
        idTabReviewStart: "{45E3278F-45AD-47CA-B14A-BB37E8D002D9}",
        $tabReviewStartElem: undefined,
        timerPage: undefined,

        // flag of the finishing of "SelectTestPage"
        isSelectTestPageFinished: false,

        // flag of the finishing of data loading
        isLoadDataOK: false,

        // ListGoals - selecting "Trailing Value/Visit"
        trailingValueVisitGUID: '{00000000-0000-0000-0000-000000000000}',
        isTrailingValueVisitSet: false,

        // PagetTestUtil - utilities for PageTest
        pageTestUtil: null,

		// versionInfoMod - utilities for request
        versionInfo: null,
        initialized: function () {

            var self = this;

			this.versionInfo=versionInfoMod;
            // PageTestUtil - initialization
            this.pageTestUtil = new PageTestUtil(this);
			this.pageTestUtil.setSelectionValidationCallback(this.getLanguageVersionsList,this);  
            this.pageTestUtil.initialize();

            this.pageTestUtil.initPagesTab();
            this.pageTestUtil.initReviewTab();

            var arrowIndicators = [{ component: this.KPIEffectArrowIndicator, treatNull: false }, { component: this.KPIConfidenceArrowIndicator, treatNull: false }, { component: this.KPIScoreArrowIndicator, treatNull: false },
            { component: this.TrailingValueIndicator, treatNull: false }, { component: this.ExperienceEffectIndicator, treatNull: false }];
            dataUtil.arrowIndicatorEventAssign(arrowIndicators);

            var screenshotSetting = this.SettingsDictionary.get("ContentTesting.GenerateScreenshots");
            this.showThumbnails = screenshotSetting === "all" || screenshotSetting === "limited";


            this.initReportTab();

            this.SummaryRepeater.on("subAppLoaded", this.bindSummaryEntry, this);
            this.bindSummaryData();

            // save localizable "DetailPanelTitle" text
            this.set("detailsTitleText", this.DetailPanelTitle.get("text"));
            var params = _sc.Helpers.url.getQueryParameters(window.location.href);
            var showReport = (params.report === "true");
            var forceLoad = (params.load === "true");
            this._forceLoad = showReport || forceLoad;

            var qsPage = params.page;
            var qsLanguage = params.language;
            var qsVersion = 0;

            if (params.hostUri) {
                var hostUri = new dataUtil.DataUri(params.hostUri);
                qsPage = hostUri.id;
                qsLanguage = hostUri.lang;
                qsVersion = hostUri.ver;
            }

            if (qsPage) {
                this.set("selectedItemId", qsPage);
                this.set(this._selectedLanguageProperty, qsLanguage);
                this.set(this._selectedVersionProperty, qsVersion);
                this.selectTestPage();
            }
            else {
                this.SelectPageWindow.show();
            }

            if (showReport) {
                this.showLastReport();
            }

            if (this.GoalsListFiltered) {
                this.GoalsListFiltered.viewModel.setTestingOptions({ texts: this.Texts });
            }

            this.TestDefinitionDataSource.on("change:conversions", this.handleTestObjectives, this);

            if (this.TestObjectivesDataSource !== undefined) {
                this.TestObjectivesDataSource.on("change:items", this.testObjectivesChanged, this);
            }

            if (this.WinnerManualSelect !== undefined) {
                this.WinnerManualSelect.check();
            }

            if (this.WinnerAutoSelect !== undefined) {
                this.WinnerAutoSelect.check();
            }

            // Set default values for the controls
            this.isExperienceOptimizationPageTest = true;
            dataUtil.setDefaultsParameters(this);

            // timer-handling
            this.$tabPagesElem = $("[data-tab-id='" + this.idTabPages + "']");
            this.$tabReviewStartElem = $("[data-tab-id='" + this.idTabReviewStart + "']");
            this.timerPage = setInterval(function () {
                // "ThumbnailProgressIndicator" is visible only for "Pages" tab
                if (self.ThumbnailProgressIndicator.get("isBusy")) {
                    self.ThumbnailProgressIndicator.viewModel.$el.css("display", self.$tabPagesElem.hasClass("active") ? "block" : "none");
                }

                // if "DetailPanel" isn't  visible - stop "DetailThumbnailProgressIndicator"
                if (self.DetailThumbnailProgressIndicator.get("isBusy")) {
                    self.DetailThumbnailProgressIndicator.viewModel.$el.css("display", self.DetailPanel.get("isVisible") ? "block" : "none");
                }

                // "ProgressIndicator"(few elements) are visible only for "Pages" and "Review and Start" tab
                var isTabReportsActive = !(self.$tabPagesElem.hasClass("active") || self.$tabReviewStartElem.hasClass("active"));
                if (isTabReportsActive) {
                    var $progressIndicatorElem = $("[data-sc-id='ProgressIndicator']");
                    $progressIndicatorElem.css("display", "none");
                }

                // setting "savedOptions" when data will be loaded
                if (!self.isLoadDataOK) {
                    if (self.isLoadData()) {
                        self.isLoadDataOK = true;
                        self.savedOptions = self.pageTestUtil.createTestOptions();
                    }
                }
            }, 200);
			this.ComboBoxLanguageVersion.on("change", this.setLanguageVersion, this);
        },

        isLoadData: function () {
            var dataLoaded = true;

            if (this.MaximumSelect !== undefined) {
                dataLoaded = dataLoaded && (this.MaximumSelect.get("items") && this.MaximumSelect.get("items").length > 0);
            }

            if (this.MinimumSelect !== undefined) {
                dataLoaded = dataLoaded && (this.MinimumSelect.get("items") && this.MinimumSelect.get("items").length > 0);
            }

            if (this.ObjectiveList !== undefined) {
                dataLoaded = dataLoaded && (this.ObjectiveList.get("items") && this.ObjectiveList.get("items").length > 0);
            }

            dataLoaded = dataLoaded && this.isSelectTestPageFinished;



            return dataLoaded;
        },

        initReportTab: function () {
            var self = this;

            this.on("change:" + this._testItemUriProperty, bindingUtil.propagateChange, {
                source: this,
                sourceProp: this._testItemUriProperty,
                target: this.TestDefinitionDataSource,
                targetProp: function (ob, value) {
                    var uri = new dataUtil.DataUri(value);
                    ob.set({
                        "itemId": uri.id,
                        "version": self.ItemInfoDataSource.get("lastTestVersion") || uri.ver,
                        "languageName": uri.lang
                    });
                }
            });

            this.on("change:" + this._testItemUriProperty, bindingUtil.propagateChange, {
                source: this,
                sourceProp: this._testItemUriProperty,
                target: this.DetailThumbnailImage,
                targetProp: function (ob, val) {
                    var uri = new dataUtil.DataUri(val);
                    ob.set({
                        itemId: uri.id,
                        language: uri.lang,
                        version: uri.ver,
                        revision: uri.rev
                    });
                }
            });

            this.ConversionRateIndicator.on("change:selectedItem", this.setSelectedExperience, { control: this.ConversionRateIndicator, app: this });
            this.ConversionRateIndicator.on("click:entry", this.showDetailPanel, { control: this.ConversionRateIndicator, app: this });

            this.EngagementValueIndicator.on("change:selectedItem", this.setSelectedExperience, { control: this.EngagementValueIndicator, app: this });
            this.EngagementValueIndicator.on("click:entry", this.showDetailPanel, { control: this.EngagementValueIndicator, app: this });

            this.on("change:selectedExperience", this.notifyExperienceChange, { app: this });
        },

        selectValidTestPage: function () {
            var self = this;
            this.pageTestUtil.validateSelectTest(function () {
                self.selectTestPage();
            });
        },

        // Called from the "Select page to add version test to" dialog
        addExistingItemTest: function () {
            var self = this;
            this.pageTestUtil.validateSelectTest(function () {
                self.selectPagesToTest.addExistingItemTest();
            });
        },

        selectTestPage: function () {

            var itemId = this.get("selectedItemId");
            var language = this.get(this._selectedLanguageProperty);
            var version = this.get(this._selectedVersionProperty);
            var itemTempateId = this.get("selectedTemplateId");
            if (!itemId || itemId.length === 0) {
                alert(this.Texts.get("You must select a page to test"));
                return;
            }

            var self = this;

            _.each(this.ItemInfoDataSource.get("warnings"), function (warning) {
                self.PageMessageBar.addMessage("warning", warning);
            });


            var setProperties = function (uri) {
                self.set(self._testItemUriProperty, uri.toString());
                self.set(self._testItemTemplateIdProperty, itemTempateId);
                self.SelectPageWindow.hide();

                self.isSelectTestPageFinished = true;
            };

            if (itemId && language && version) {
                var uri = new dataUtil.DataUri();
                uri.id = itemId;
                uri.ver = version;
                uri.lang = language;

                setProperties(uri);
            }
            else {
                versionInfoMod.getLatestVersionNumber({ id: itemId, lang: language }, function (parsedId, version, revision, language) {

                    if (!version) {
                        alert(self.Texts.get("The item does not have a version in the current language"));
                        return;
                    }

                    var uri = new dataUtil.DataUri();
                    uri.id = parsedId;
                    uri.ver = version;
                    uri.rev = revision;
                    uri.lang = language;

                    setProperties(uri);
                });
            }
			
			versionInfoMod.getPreviousVersionNumber({ id: itemId, lang: language }, function (parsedId, data) {

                    if (data.length == 0) {
                        alert(self.Texts.get("The item does not have any previous version."));
                        return;
                    }

                    self.AddPreviousVersionComboBox.set("items", data);
				
                });
			
			
			
        },

        bindSummaryData: function () {
            this.SummaryRepeater.viewModel.reset();
            this.SummaryRepeater.viewModel.addData([
              {
                  Name: this.Texts.get("Page"),
                  ValueRef: this.ItemInfoDataSource,
                  ValueProp: "name"
              },
              {
                  Name: this.Texts.get("Status"),
                  ValueRef: this.ItemInfoDataSource,
                  ValueProp: "status"
              },
              {
                  Name: this.Texts.get("Created date"),
                  ValueRef: this.ItemInfoDataSource,
                  ValueProp: "testCreatedShort"
              },
              {
                  Name: this.Texts.get("Created by"),
                  ValueRef: this.ItemInfoDataSource,
                  ValueProp: "testCreatedBy"
              }
            ]);

            if (this.TestDurationDataSource) {
                this.SummaryRepeater.viewModel.addData([
                  {
                      Name: this.Texts.get("Expected time"),
                      ValueRef: this.TestDurationDataSource,
                      ValueProp: "expectedDays",
                      VisibleProp: "expectedDays",
                      VisibleInv: false,
                      InitVisibleProp: true,
                      Postfix: " " + this.Texts.get("days")
                  }
                ]);

                this.SummaryRepeater.viewModel.addData([
                  {
                      Name: this.Texts.get("Expected time"),
                      ValueRef: this.TestDurationDataSource,
                      ValueProp: "requiredVisits",
                      VisibleProp: "expectedDays",
                      VisibleInv: true,
                      InitVisibleProp: true,
                      Postfix: " " + this.Texts.get("visitors")
                  }
                ]);
            }

            if (this.TrafficAllocationSlider) {
                var trafficAllocationText = this.Texts.get("Traffic allocation is set to") + " ";
                this.TrafficAllocationLabel.set("text", trafficAllocationText + this.TrafficAllocationSlider.get("selectedValue") + "%");
                this.TrafficAllocationSlider.on("change:selectedValue", function (obj) {
                    this.TrafficAllocationLabel.set("text", trafficAllocationText + this.TrafficAllocationSlider.get("selectedValue") + "%");
                }, this);

                this.SummaryRepeater.viewModel.addData([
                  {
                      Name: this.Texts.get("Traffic allocation"),
                      ValueRef: this.TrafficAllocationSlider,
                      ValueProp: "selectedValue",
                      Postfix: "%"
                  }
                ]);
            }

            if (this.rbConfidence90 && this.rbConfidence95 && this.rbConfidence99) {
                this.SummaryRepeater.viewModel.addData([
                  {
                      Name: this.Texts.get("Confidence level"),
                      ValueRef: [this.rbConfidence90, this.rbConfidence95, this.rbConfidence99],
                      ValueProp: "isChecked",
                      ValuePropName: "value",
                      Postfix: "%",
                      isConfidenceLevel: true
                  }
                ]);
            }


            if (this.ObjectiveList) {
                this.SummaryRepeater.viewModel.addData([
                  {
                      Name: this.Texts.get("Test objective"),
                      ValueRef: this.ObjectiveList,
                      ValueProp: "selectedName"
                  }
                ]);
            }

            if (this.MaximumSelect) {
                this.SummaryRepeater.viewModel.addData([
                  {
                      Name: this.Texts.get("Maximum duration"),
                      ValueRef: this.MaximumSelect,
                      ValueProp: "selectedValue",
                      Postfix: " " + this.Texts.get("days")
                  }
                ]);
            }

            if (this.MinimumSelect) {
                this.SummaryRepeater.viewModel.addData([
                  {
                      Name: this.Texts.get("Minimum duration"),
                      ValueRef: this.MinimumSelect,
                      ValueProp: "selectedValue",
                      Postfix: " " + this.Texts.get("days")
                  }
                ]);
            }
        },

        bindSummaryEntry: function (args) {
            var subapp = args.app;
            var data = args.data;

            subapp.Name.set("text", data.Name);

            if (data.ValueRef) {

                var value = "";
                // ConfidenceLevel binding
                if (data.isConfidenceLevel && data.ValueRef.length && data.ValueRef.length > 1) {
                    for (var i = 0; i < data.ValueRef.length; i++) {
                        data.ValueRef[i].on("change:" + data.ValueProp, bindingUtil.propagateChange, {
                            target: subapp.Value,
                            targetProp: "text",
                            source: data.ValueRef[i],
                            sourceProp: data.ValuePropName,
                            postfix: data.Postfix
                        });
                    }
                    if (this.reviewTest.confidenceLevelCtrl) {
                        value = this.reviewTest.confidenceLevelCtrl.getConfidenceLevel();
                    }
                }
                    // binding of other parameters
                else {
                    data.ValueRef.on("change:" + data.ValueProp, bindingUtil.propagateChange, {
                        target: subapp.Value,
                        targetProp: "text",
                        source: data.ValueRef,
                        sourceProp: data.ValueProp,
                        postfix: data.Postfix
                    });

                    value = data.ValueRef.get(data.ValueProp);
                }

                if (value === null || value === undefined) {
                    value = "--";
                }
                else {
                    value += (data.Postfix || "");
                }

                subapp.Value.set("text", value);

                if (data.VisibleProp) {
                    data.ValueRef.on("change:" + data.VisibleProp, bindingUtil.bindVisibility, {
                        source: data.ValueRef,
                        sourceProp: data.VisibleProp,
                        hide: data.VisibleInv,
                        target: subapp.Entry
                    });
                    if (data.InitVisibleProp) {
                        var currentValue = data.ValueRef.get(data.VisibleProp);
                        var tempValue = currentValue === 0 ? -1 : 0;
                        data.ValueRef.set(data.VisibleProp, tempValue, { silent: true });
                        data.ValueRef.set(data.VisibleProp, currentValue);
                    }
                }
            } else {
                subapp.Value.set("text", data.Value + (data.Postfix || ""));
            }
        },

        addPageOptionSelect: function () {
            this.selectPagesToTest.addPageOptionSelect();
        },

        showLastReport: function () {
            $("[data-tab-id='{B4475B84-FB33-4BA2-A164-C6CE1DD0D774}']").trigger('click');
        },

        listGoalsItemsChanged: function (sender) {
            if (!this.isTrailingValueVisitSet) {
                this.isTrailingValueVisitSet = true;
                this.ObjectiveList.set("selectedGuid", this.trailingValueVisitGUID);
            }
        },

        updateTestObjectiveUI: function (sender, selectedTestObjective) {
            if (typeof selectedTestObjective === 'undefined' || selectedTestObjective === null) {
                return;
            }

            if (selectedTestObjective.guid === this.trailingValueVisitGUID) {
                this.WinnerAutoSelect.set("isEnabled", true);
                this.WinnerAutoSelectUnless.set("isEnabled", false);
                this.WinnerManualSelect.set("isEnabled", true);
                this.WinnerAutoSelect.check();
            } else {
                this.WinnerAutoSelect.set("isEnabled", true);
                this.WinnerAutoSelectUnless.set("isEnabled", true);
                this.WinnerManualSelect.set("isEnabled", true);
                this.WinnerAutoSelectUnless.check();

                this.GoalsListFiltered.set("selectedItem", selectedTestObjective);
            }
        },

        testStatusChanged: function () {
            var status = this.self.ItemInfoDataSource.get("statusCode");

            if (this.self.ItemInfoDataSource.get("isValidateTest")) {
                this.self.ItemInfoDataSource.set("isValidateTest", false);
                return;
            }

            if (status === "active") {
                this.self.set("mode", "report");
                this.self.loadTest(function (app) {
                    app.showLastReport();

                    app.AddPage.set("isEnabled", false);
                    app.FirstStartButton.set("isEnabled", false);

                    if (app.BottomStartButton) {
                        app.BottomStartButton.set("isEnabled", false);
                    }
                });
            }
            else if (status === "teststopped") {
                // Make sure this is an initial load and not a change from saving
                if (!this.self.savedOptions) {
                    var res = false;
                    if (!this.self._forceLoad) {
                        res = confirm("The selected item already has a test defined.\r\nWould you like to edit the existing test?"); // todo: translate
                    }

                    if (res || this.self._forceLoad) {
                        this.self.loadTest();
                    }
                }
            }
            else if (status === "drafttest" || status === "draft") {
                if (this.self._forceLoad) {
                    this.self.loadTest();
                }
            }

        },

        loadTest: function (callback) {
            var self = this;
            this.actions.loadPageTest(this.get(this._testItemUriProperty), function (data) {
                self.set(self._testItemTemplateIdProperty, data.ItemTemplateId);
                self.selectPagesToTest.loadTest(data);
                self.reviewTest.loadTest(data);
                if (callback) {
                    callback(self);
                }
            });
        },

        saveTest: function () {
            if (this.pageTestUtil) {
                this.pageTestUtil.saveTest();
            }
        },

        cancelTest: function () {
            var message = "";
            if (this.ItemInfoDataSource.get("hasActiveTest")) {
                message = this.Texts.get("Do you want to cancel the test?");
            } else {
                message = this.Texts.get("Do you want to delete the draft test?");
            }

            this.CancelConfirmText.set("text", message);
            this.CancelTestDialogWindow.show();
        },

        confirmCancelTest: function () {
            this.CancelTestDialogWindow.hide();

            var uri = this.get(this._testItemUriProperty);

            var successCallback = function (data) {
                var message = null;
                if (data.DeleteDraftTest) {
                    message = messages.draftTestDeleted;
                }

                if (data.CancelRunningTest) {
                    message = messages.testCancelled;
                }

                var url = urls.dashboard;

                if (message) {
                    url = _sc.Helpers.url.addQueryParameters(url, { message: message });
                }

                window.location.href = url;
            };

            this.actions.cancelDraftTest(uri, successCallback, this);
        },

        startTest: function () {
            if (this.pageTestUtil) {
                this.pageTestUtil.startTest();
            }
        },

        setSelectedExperience: function () {
            var selected = this.control.get("selectedItem");
            if (!selected) {
                return;
            }

            this.app.set("selectedExperience", {
                Combination: selected.Combination,
                GoalId: selected.GoalId,
                title: selected.title
            });
        },

        showDetailPanel: function () {
            var experience = this.app.get("selectedExperience");
            if (!experience) {
                this.app.DetailPanel.set("isOpen", false);
                return;
            }

            this.app.DetailPanel.set("isOpen", true);
        },

        notifyExperienceChange: function () {
            var experience = this.app.get("selectedExperience");
            if (!experience) {
                return;
            }

            var detailText = this.app.get("detailsTitleText") + " - " + experience.title;
            this.app.DetailPanelTitle.set("text", detailText);

            var combinationstring = "";

            for (var i = 0; i < experience.Combination.length; i++) {
                combinationstring += experience.Combination[i].toString();
            }

            this.app.ExperienceKPIDataSource.set("goalId", experience.GoalId);
            this.app.ExperienceKPIDataSource.set("combination", combinationstring);
            this.app.DetailThumbnailImage.set("combination", combinationstring);
            this.app.DetailThumbnailImage.set("baseLinkUrl", "/?sc_mode=edit&sc_itemid=" + this.app.DetailThumbnailImage.get("itemId"));
            this.app.TopGoalsDataSource.set("combination", combinationstring);
            this.app.AllGoalsDataSource.set("combination", combinationstring);
            this.app.TopClicksToPagesDataSource.set("combination", combinationstring);
            this.app.AllClicksToPagesDataSource.set("combination", combinationstring);
            this.app.SiteUsageDataSource.set("combination", combinationstring);

            this.app.ReachDataSource.set("isBusy", false);
            this.app.ReachDataSource.set("combination", combinationstring);

            //this.app.TestActions.set("combination", combinationstring);
        },

        confirmWinner: function () {
            this.WinnerButton.set("isEnabled", false);
            this.AppProgressIndicator.set("isBusy", true);

            this.ConfirmDialogWindow.hide();

            var combinationstring = this.ReachDataSource.get("combination");
            actions.stopTest(combinationstring, this.stopTestSucceeded, this.stopTestError, this);
            //this.TestActions.stopTest(this.stopTestSucceeded, this.stopTestError, this);
        },

        pickWinner: function () {
            this.ConfirmDialogWindow.show();
        },

        stopTestSucceeded: function () {
            this.AppProgressIndicator.set("isBusy", false);
            this.invalidated = false;
            var redirectUrl = '/?sc_mode=edit&sc_itemid=';
            redirectUrl = redirectUrl + this.ItemInfoDataSource.get('itemId');
            window.parent.location = redirectUrl;
        },

        stopTestError: function () {
            this.AppProgressIndicator.set("isBusy", false);
            var text = this.Texts.get("An error occurred");
            if (!text) {
                text = "An error occurred";
            }
            alert(text);
            this.WinnerButton.set("isEnabled", true);
        },

        handleTestObjectives: function () {
            var conversions = this.TestDefinitionDataSource.get("conversions");
            if (conversions !== undefined && conversions.length > 0) {
                var conversion = conversions[0];
                this.GoalsListFiltered.set("selectedItem", conversion);
            }
        },

        testObjectivesChanged: function () {
            var self = this;
            //#25880 - removing "Trailing Value/Visit" value from "Select a goal" combobox contains in "Conversion rate" section
            var items = this.GoalsListFiltered.get("items");
            if (items && items.length > 0) {
                var itemsCorrect = [];
                _.each(items, function (item) {
                    if (item.guid && item.guid != self.trailingValueVisitGUID) {
                        itemsCorrect.push(item);
                    }
                });
                this.GoalsListFiltered.set("items", itemsCorrect);
            }
       },
		 getLanguageVersionsList: function () {
			var self=this._selectionValidationCallbackContext;
			self.SelectButton.set("isEnabled", false);
			var itemId=self.SelectItemItemInfoDataSource.attributes.itemId;
			self.versionInfo.getLanguageVersions(itemId,function(data){
				self.SelectButton.set("isEnabled", true);
				self.ComboBoxLanguageVersion.set("items", data);
				self.setLanguageVersion();
			});          			
         
			},
			setLanguageVersion:function()
			{
				var self=this;
				var lang=this.ComboBoxLanguageVersion.get("selectedValue");
				if(lang)
				{
					self.SelectButton.set("isEnabled", false);
					this.set(this._selectedLanguageProperty,lang);
					var itemId=this.SelectItemItemInfoDataSource.attributes.itemId;
					this.versionInfo.getLanguageVersionInfo(itemId, lang,function(data){
						self.NumericVersionValue.set("text",data.VersionNumber);
						self.LastModifiedValue.set("text",data.LastModified);
						self.WorkflowStateValue.set("text",data.WorkflowState);
						self.SelectButton.set("isEnabled", true);
					});
				}
			}
    });

    return PageTest;
});