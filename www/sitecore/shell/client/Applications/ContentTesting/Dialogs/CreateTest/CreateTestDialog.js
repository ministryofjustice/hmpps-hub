define(["sitecore",
        "/-/speak/v1/contenttesting/ImageThumbs.js",
        "/-/speak/v1/contenttesting/ExpectedChangeCtrl.js",
        "/-/speak/v1/contenttesting/ConfidenceLevelCtrl.js",
        "/-/speak/v1/contenttesting/DataUtil.js",
        "/-/speak/v1/contenttesting/CreateTestActions.js",
        "/-/speak/v1/contenttesting/TestTypes.js",
        "css!/-/speak/v1/contenttesting/CreateTestDialog.css",
        "/-/speak/v1/contenttesting/BindingConverters.js",
], function (_sc, thumbsMod, expectedChangeCtrl, confidenceLevelCtrl, dataUtil, actions, testTypes) {
    var TestWizard = _sc.Definitions.App.extend({

        // ListGoals - selecting "Trailing Value/Visit"
        trailingValueVisitGUID: "{00000000-0000-0000-0000-000000000000}",
        isTrailingValueVisitSet: false,

        _imageThumbs: null,
        _showCompareScreenshot: false,
        _showAllScreenshots: false,
        _disabledVariablesMessageShow: false,

        srcCloseIcon: "/sitecore/shell/client/Speak/Assets/img/Speak/DialogWindow/close_button_sprite.png",

        requiredEnabledVariables: 1,
        requiredEnabledVariations: 2,

        // height for editing "TabControl" content
        heightTabControlContentEdit: 255,

        testOptions: {},

        testLengthMessages: [],

        variantWarningMessages: [],

        initialized: function () {
            // testOptions empty
            this.testOptions = dataUtil.getTestOptionsEmpty();

            this.expectedChangeCtrl = expectedChangeCtrl;
            this.confidenceLevelCtrl = confidenceLevelCtrl;

            this.ExpectedTimeWithEstimateOverMaximum.viewModel.$el.css("color", "#DC291E");

            this.ItemInfoDataSource.set("itemUri", this.TestVariablesDataSource.get("itemuri"));

            this.ThumbnailImageSrc.set("imageUrl", "");

            // adding "img" elem to ".sc-smartpanel-close" link - for showing "small" close icon
            var $smartPanelElem = this.TestVariationsSmartPanel.viewModel.$el;
            var $smartPanelCloseLink = $smartPanelElem.find(".sc-smartpanel-close");
            $smartPanelCloseLink.append("<img src='" + this.srcCloseIcon + "' />");

            var screenshotSetting = this.SettingsDictionary.get("ContentTesting.GenerateScreenshots");
            this._showCompareScreenshot = screenshotSetting === "all" || screenshotSetting === "limited";
            this._showAllScreenshots = screenshotSetting === "all";

            this._imageThumbs = new thumbsMod.ImageThumbs({
                dictionary: this.StringDictionary
            });

            this.CarouselImage.set("isVisible", false);
            this.ContentTestingBorder.set("isVisible", false);

            // Expectation
            if (expectedChangeCtrl)
                expectedChangeCtrl.initElements(this);

            // Confidence Level      
            if (confidenceLevelCtrl)
                confidenceLevelCtrl.initElements(this);

            //
            this.initializeComponentEvents();

            //
            this.initializeWindowAction();

            //
            this.initializeContentTypeTesting();

            // Set default values for the controls
            dataUtil.setDefaultsParameters(this);

            this.configureTextTemplates();

            this.TestVariablesWithFilteredVariationsDataSource.set({
                filterFunction: this.setFilteredTestVariations,
                createFilterContextFunction: this.createTestVariationsFilterContext,
                createFilterContextContext: this
            });

            this.FilteredTestVariablesDataSource.set({
                filterFunction: this.filterTestVariable,
                createFilterContextFunction: this.createTestVariableFilterContext,
                createFilterContextContext: this
            });
            
            this.FilteredCandidatesDataSource.set({
                filterFunction: this.filterCandidate,
                createFilterContextFunction: this.createCandidateFilterContext,
                createFilterContextContext: this
            });

            // Data source is paused by default to avoid multiple server calls until all properties are set properly.
            this.TestDurationDataSource.set("isPaused", false);
            this.TestDurationDataSource.refresh();

            this.validateStartAllowed();
        },

        initializeComponentEvents: function () {
            this.TestVariablesDataSource.on("change:items", this.itemsUpdate, this);
            this.FilteredTestVariablesDataSource.on("change:items", this.itemsUpdate, this);

            this.TestVariablesDataSource.on("change:items", this.setDefaultDuration, this);
            this.TestVariablesDataSource.on("change:items", this.renderVariableWarnings, this);
            this.TestVariablesDataSource.on("change:items", this.validateTestLength, this);
            this.TestVariablesDataSource.on("change:multipleDevices", function () {
                if (this.TestVariablesDataSource.get("multipleDevices")) {
                    this._disableDialog([this.MultipleDevicesMessage]);
                }
            }, this);

            // Subscribe to change of the "Maximum duration"
            if (this.MaximumSelect) {
                this.MaximumSelect.on("change:selectedItem", this.validateTestLength, this);
            }

            // Subscribe to change selected test variable in the list control
            this.TestVariablesStateListControl.on("change:selectedItemId", this.populateTestVariationsSmartPanel, this);

            // Subscribe to validation in StateListControl 
            this.TestVariablesStateListControl.on("validation:disableLastItem", function () {
                // StringDictiory is use to translate texts into the context language
                this.VariablesTabMessageBar.addMessage("warning", this.StringDictionary.get(
                    "You cannot disable this variable: it is the only one included in the test."));
            }, this);

            this.TestVariablesStateListControl.once("change:items", this.populateCheckedVariables, this);
            this.TestVariablesStateListControl.set("requiredEnabledRowCount", this.requiredEnabledVariables);

            this.TestVariationsStateListControl.on("validation:disableLastItem", function () {
                //TODO: Think about a SPEAK dialog
                alert(this.StringDictionary.get(
                    "You cannot disable this variation because the test needs at least two variations to be enabled."));
            }, this);

            this.TestVariationsStateListControl.set("requiredEnabledRowCount", this.requiredEnabledVariations);

            this.TestVariationsStateListControl.on("change:checkItem", this.setCheckedVariations, this);

            this.TestVariationsStateListControl.on("change:items", this.populateCheckedVariations, this);
            this.TestVariationsStateListControl.on("change:items", this.enforceVariationRules, this);

            // Subscribe to events that trigger Preview changes
            this.TestVariablesDropDownListControl.on("change:selectedItem", this.setTestPreview, this);

            this.ViewAllTestVariablesHyperlinkButton.viewModel.$el.click({ self: this }, function (event) {
                var self = event.data.self;
                // Set test variables dropdown button title
                self.TestVariablesDropDownButton.set("text", self.ViewAllTestVariablesHyperlinkButton.get("text"));
                // With no selected test nothing will be filtered (show all variants)
                self.CarouselImage.set("selectedTestId", null);
            });

            // Update TestObjective UI according to selected test objective item
            if (this.ObjectiveList) {
                this.ObjectiveList.viewModel.setTestingOptions({ texts: this.StringDictionary });
                this.ObjectiveList.on("change:items", function () {
                    if (!this.isTrailingValueVisitSet) {
                        this.isTrailingValueVisitSet = true;
                        this.ObjectiveList.set("selectedGuid", this.trailingValueVisitGUID);
                    }
                }, this);
                this.ObjectiveList.on("change:selectedItem", this.updateTestObjectiveUI, this);
            }

            this.TestDurationDataSource.on("change:minDuration change:maxDuration change:isEstimated change:experienceCount change:expectedDays change:viewsPerDay change:requiredVisits", this.validateTestLength, this);
            this.TestDurationDataSource.on("change:expectedDays change:isEstimated", this.setEstimateMessage, this);
            this.setEstimateMessage();

            //subscribe to window click event in order to close DropDownButton popup
            this.TestVariablesDropDownButton.viewModel.$el.click(function (event) {
                event.stopPropagation();
            });

            if (this.TrafficAllocationSlider) {
                this.TrafficAllocationSlider.on("change:selectedValue", function() {
                    this.TestDurationDataSource.set("trafficAllocation", this.TrafficAllocationSlider.get("selectedValue"));
                }, this);
            }

            this.TestVariablesStateListControl.on("change:disabledItems", this.FilteredTestVariablesDataSource.refresh, this.FilteredTestVariablesDataSource);
            this.TestVariablesStateListControl.on("change:disabledItems", this.FilteredCandidatesDataSource.refresh, this.FilteredCandidatesDataSource);
            this.FilteredTestVariablesDataSource.on("change:items", this.validateStartAllowed, this);

            // Ensure carousel redraws when visible so elastislider can work out it's dimensions
            this.TestWizardTabControl.on("change:selectedTab", this.CarouselImage.viewModel.populateCarousel, this);
        },

        initializeWindowAction: function () {
            $(window).click(this, function (event) {
                var app = event.data;
                if (app.TestVariablesDropDownButton.get("isOpen") === true) {
                    app.TestVariablesDropDownButton.set("isOpen", false);
                }

                // #25956 - hiding of the SmartPanel by clicking outside
                if (app.TestVariationsSmartPanel && event.target) {
                    var $targetElemInSmartPanel = app.TestVariationsSmartPanel.viewModel.$el.find(event.target);
                    var $targetElemInStateListControl = app.TestVariablesStateListControl.viewModel.$el.find(event.target);
                    // if "event.target" isn't lain in "TestVariationsSmartPanel", "TestVariablesStateListControl"
                    if ($targetElemInSmartPanel.length === 0 && $targetElemInStateListControl.length === 0) {
                        app.TestVariationsSmartPanel.set("isOpen", false);
                    }
                }
            });

            var self = this;
            var CmsDialogFix = function () {
                var $tabControlContent = $("[data-sc-id='TestWizardTabControl'] > .tab-content");
                $tabControlContent.height($(window).height() - self.heightTabControlContentEdit);
            };

            $(document).ready(CmsDialogFix);
            $(window).resize(CmsDialogFix);
        },

        initializeContentTypeTesting: function () {
            this.ThumbnailImageDataSource.set("imageThumbs", this._imageThumbs);
            this.ThumbnailImageDataSource.on("change:items", this.thumbnailImageDataSourceItemsChanged, this);

            var imgThumbnailClickHandler = function (event) {
                var self = event.data;
                var imageUrl = $(event.currentTarget).attr("src");

                if (imageUrl === self.ThumbnailImageDataSource.get("afterImageSrc")) {
                    imageUrl = self.ThumbnailImageDataSource.get("afterImageUnscaledSrc");
                } else {
                    imageUrl = self.ThumbnailImageDataSource.get("beforeImageUnscaledSrc");
                }

                self.ZoomFrame.set("imageUrl", imageUrl);
            };

            var imgThumbnailChanged = function (img, value) {
                if (value && value !== "") {
                    img.viewModel.$el.removeClass("img-loading");
                }
            };

            this.BeforeThumbImage.viewModel.$el.addClass("img-loading");
            this.BeforeThumbImage.viewModel.$el.click(this, imgThumbnailClickHandler);
            this.BeforeThumbImage.on("change:imageUrl", imgThumbnailChanged, this);
            this.AfterThumbImage.viewModel.$el.addClass("img-loading");
            this.AfterThumbImage.viewModel.$el.click(this, imgThumbnailClickHandler);
            this.AfterThumbImage.on("change:imageUrl", imgThumbnailChanged, this);
        },

        thumbnailImageDataSourceItemsChanged: function () {
            return;
            var beforeAfterInfo = this.ThumbnailImageDataSource.getBeforeAfterTooltipInfo();
            if (beforeAfterInfo.before) {
                this.BeforeInfoTooltip.set("content", beforeAfterInfo.before);
            }
            if (beforeAfterInfo.after) {
                this.AfterInfoTooltip.set("content", beforeAfterInfo.after);
            }
        },

        updateTestObjectiveUI: function (sender, selectedTestObjective) {
            if (!selectedTestObjective) {
                return;
            }

            if (selectedTestObjective.guid === this.trailingValueVisitGUID) {
                this.WinnerAutoSelect.set("isEnabled", true);
                this.WinnerAutoSelectUnless.set("isEnabled", false);
                this.WinnerManualSelect.set("isEnabled", true);
                this.WinnerAutoSelect.check();
                this.TestDurationDataSource.set("measureByGoal", false);
            } else {
                this.WinnerAutoSelect.set("isEnabled", true);
                this.WinnerAutoSelectUnless.set("isEnabled", true);
                this.WinnerManualSelect.set("isEnabled", true);
                this.WinnerAutoSelectUnless.check();
                this.TestDurationDataSource.set("measureByGoal", true);
            }
        },

        populateCheckedVariables: function () {
            var items = this.TestVariablesStateListControl.get("items");
            var checked = _.filter(items, function(item) {
                return !item.DisableByDefault;
            });

            this.TestVariablesStateListControl.set("checkedItems", checked);
            this.FilteredTestVariablesDataSource.refresh();
            this.FilteredCandidatesDataSource.refresh();
        },

        populateCheckedVariations: function () {
            var checkedVariations = this.testOptions["checkedVariations"] || {};
            var selectedTestItem = this.TestVariablesStateListControl.get("selectedItem");
            if (!selectedTestItem)
                return;
            var testid = selectedTestItem.get("UId");

            if (checkedVariations[testid]) {
                this.TestVariationsStateListControl.set("checkedItems", checkedVariations[testid]);
            } else {
                this.TestVariationsStateListControl.viewModel.checkAll();
            }
        },

        enforceVariationRules: function () {
            var selectedTestItem = this.TestVariablesStateListControl.get("selectedItem");

            // Disable checkbox for default rule in personalization tests
            if (selectedTestItem.get("TypeKey") === testTypes.personalization) {
                this.TestVariationsStateListControl.viewModel.disableRow("00000000-0000-0000-0000-000000000000");
            }
        },

        setCheckedVariations: function () {
            var testid = this.TestVariationsStateListControl.get("testId");
            var checkedItems = this.TestVariationsStateListControl.get("checkedItems");
            var variations = this.testOptions["checkedVariations"] || {};
            variations[testid] = checkedItems;
            this.testOptions["checkedVariations"] = variations;

            var disabledVariations = this.testOptions["disabledVariations"] || {};
            var disableditems = this.TestVariationsStateListControl.get("disabledItems");
            disabledVariations[testid] = disableditems;
            this.testOptions["disabledVariations"] = disabledVariations;

            var values = _.values(disabledVariations);
            values = _.flatten(values);

            this.TestDurationDataSource.set("disabledVariations", values);
            this.FilteredCandidatesDataSource.refresh();
            this.TestVariablesWithFilteredVariationsDataSource.refresh();

            // The items have been filtered and updated, but their identity hasn't changed, so the change event won't fire. Fire it manually.
            var checkedVariables = this.TestVariablesStateListControl.get("checkedItems");
            this.TestVariablesStateListControl.trigger("change:items");
            this.TestVariablesStateListControl.set("checkedItems", checkedVariables);
        },

        populateTestVariationsSmartPanel: function () {
            // If selected test item is not empty than open the smart panel and request 
            // data source to return test variations y test id
            var selectedTestItem = this.TestVariablesStateListControl.get("selectedItem");
            if (selectedTestItem !== "") {
                this.TestVariationsSmartPanel.set("isOpen", true);
                var self = this;

                //TODO: ask for test variations for the listControl
                var uid = selectedTestItem.get("UId");
                this.TestVariationsDataSource.set("testid", uid);
                this.TestVariationsStateListControl.set("testId", uid);

                // Populate screenshot of first variant into smartpanel
                var items = this.TestCandidatesDataSource.get("items");

                for (var i in items) {
                    var item = items[i];

                    if (item.attrs.testId.toLowerCase() === "{" + uid + "}") {
                        if (this._imageThumbs) {
                            this._imageThumbs.populateImages([item], function () {
                                return self.ThumbnailImageSrc.viewModel.$el;
                            });
                        };
                    }

                    break;
                }
            }
        },

        setDefaultDuration: function(){
            var isContentTesting = this.isJustContentTesting(items);

            // Update the default maximum duration value if MV test is configured from the configuration file.
            var defaultMVMaxDuration;
            if (!isContentTesting) {
                defaultMVMaxDuration = this.SettingsDictionary.get("ContentTesting.MaximumOptimizationTestDuration");
            } else {
                defaultMVMaxDuration = this.SettingsDictionary.get("ContentTesting.MaximumContentTestDuration");
            }

            if (this.MaximumSelect) {
                var items = this.MaximumSelect.get("items");
                if (items.length > 0) {
                    this.MaximumSelect.set("selectedValue", defaultMVMaxDuration);
                    this.MaximumSelect.set("initialized", true);
                }
                else {
                    this.MaximumSelect.once("change:items", function () {
                        this.MaximumSelect.set("selectedValue", defaultMVMaxDuration);
                        this.MaximumSelect.set("initialized", true);
                    }, this);
                }
            } else {
                if (this.TestDurationDataSource) {
                    this.TestDurationDataSource.set("maxDuration", defaultMVMaxDuration);
                }
            }
        },

        itemsUpdate: function (obj) {
            var items = this.TestVariablesDataSource.get("items");
            var itemCount = items.length;

            if (itemCount === 0) {
                this._disableDialog([this.NoCandidatesMessage]);
            }
            else {
                var isContentTesting = this.isJustContentTesting(items);

                // Identify testing type and display corresponding preview components
                this.TestVariablesDropDownButton.set("isVisible", !isContentTesting);

                if (isContentTesting && this._showCompareScreenshot) {
                    this.ContentTestingBorder.set("isVisible", true);
                    this.NoPreviewMessageBorder.set("isVisible", false);
                }
                else if (this._showAllScreenshots) {
                    this.CarouselImage.set("imageThumbs", this._imageThumbs);
                    var showCarousel = this.FilteredTestVariablesDataSource.get("items").length >= 1;


                    this.CarouselImage.set("isVisible", showCarousel);
                    this.NoPreviewMessageBorder.set("isVisible", !showCarousel);
                }

                this.TestCandidatesDataSource.set("itemUri", this.TestVariablesDataSource.get("itemuri"));
            }
        },

        isJustContentTesting: function (items) {
            if (!items) {
                return false;
            }

            if (items.length === 1 && (items[0].TypeKey === testTypes.content || items[0].TypeKey === testTypes.page)) {
                return true;
            }

            return false;
        },

        renderVariableWarnings: function () {
            var items = this.TestVariablesDataSource.get("items");
            var self = this;

            this._removeMessages(this.variantWarningMessages);
            this.variantWarningMessages = [];

            _.each(items, function (item) {
                _.each(item.Warnings, function (warning) {
                    self.NotificationsMessageBar.addMessage("warning", warning);
                    self.variantWarningMessages.push(warning);
                });
            });
        },

        okClicked: function () {
            var items = this.TestVariablesDataSource.get("items");
            if (_.some(items, function (item) {
              return item.Warnings && item.Warnings.length > 0;
            })) {
                var message = this.StringDictionary.get("One or more variations have warnings.") + "\r\n" +
                  this.StringDictionary.get("Do you want to continue?");

                var result = confirm(message);
                if (result) {
                    this.startConfirmed();
                }
            } else {
                this.startConfirmed();
            }
        },

        startConfirmed: function () {
            this.StartTestButton.set("isEnabled", false);
            this.ServerProgressIndicator.set("isBusy", true);

            this.testOptions["itemUri"] = this.TestVariablesDataSource.get("itemuri");

            this.testOptions["trackWithEngagementValue"] = true;
            this.testOptions["autoShowWinner"] = true;

            var showWinner = true;

            // common TestOptions
            dataUtil.getTestOptions(this.testOptions, this);

            var disabledItems = this.TestVariablesStateListControl.get("disabledItems");
            var disabled = [];

            for (var i in disabledItems) {
                disabled.push(disabledItems[i].UId);
            }
            this.testOptions["disabledVariants"] = disabled;

            var disabledVariationsList = [];

            var disabledVariations = this.testOptions["disabledVariations"] || {};

            for (i in disabledVariations) {
                var variationsarray = [];
                for (var variation in disabledVariations[i]) {
                    variationsarray.push(disabledVariations[i][variation].UId);
                }

                var d =
                {
                    testid: i,
                    variations: variationsarray
                };
                disabledVariationsList.push(d);
            }

            this.testOptions["disabledVariations"] = disabledVariationsList;

            var params = _sc.Helpers.url.getQueryParameters(window.location.href);
            this.testOptions["DeviceId"] = params.device;
            this.testOptions["Language"] = params.sc_lang;

            // request to server
            var self = this;
            var successFunc = function () {
                self.ServerProgressIndicator.set("isBusy", false);
                self.closeDialog("yes");
            };

            actions.startTest(this.testOptions, successFunc);
        },

        setTestPreview: function () {
            var selectedTest = this.TestVariablesDropDownListControl.get("selectedItem");

            if (selectedTest === "") {
                return;
            }

            // Set test variables dropdown button title
            this.TestVariablesDropDownButton.set("text", selectedTest.attributes.Name);

            // Filter images in the image list with the selected test
            // Set "selectedTestId" for "CarouselImage" control
            var selectedTestId = selectedTest.attributes.UId;
            this.CarouselImage.set("selectedTestId", selectedTestId);
        },

        validateTestLength: function () {
            if (!this.TestDurationDataSource)
                return;

            var maxDurationValue;
            if (this.MaximumSelect && this.MaximumSelect.get("selectedItem")) {
                maxDurationValue = parseInt(this.MaximumSelect.get("selectedItem").Value, 10);
            } else {
                maxDurationValue = parseInt(this.TestDurationDataSource.get("maxDuration"), 10);
            }

            if (_.isNaN(maxDurationValue))
                return;

            var isEstimated = this.TestDurationDataSource.get("isEstimated");
            var experiences = this.TestDurationDataSource.get("experienceCount");
            var daysExpected = this.TestDurationDataSource.get("expectedDays");
            var viewsPerDay = this.TestDurationDataSource.get("viewsPerDay");
            var requiredVisits = this.TestDurationDataSource.get("requiredVisits");

            var templateFirstMessage, templateSecondMessage, type;

            var minDuration;
            if (this.MinimumSelect) {
                minDuration = parseInt(this.MinimumSelect.get("selectedValue"), 10);
            } else {
                minDuration = parseInt(this.TestDurationDataSource.get("minDuration"), 10);
            }

            if (daysExpected < minDuration) {
                daysExpected = minDuration;
            }

            this.NotificationsMessageBar.viewModel.$el.css("display", "block");
            this._removeMessages(this.testLengthMessages);
            this.testLengthMessages = [];

            // Abort if there are no experiences.
            if (experiences === 0) {
                return;
            }

            if (!isEstimated) { // If not enough traffic to do forecasting
                type = "notification";

                templateFirstMessage = _.template(
                  this.StringDictionary.get("With the changes you have made, you have created <%= experiences %> experiences.") + " " +
                  this.StringDictionary.get("The test will require <%= requiredVisits %> visitors to find a winner.") + " " +
                  this.StringDictionary.get("We do not have enough historical data to provide a forecasting on duration."));

                var message = templateFirstMessage({ experiences: experiences, requiredVisits: requiredVisits });

                this.NotificationsMessageBar.addMessage(type, message);

                this.testLengthMessages.push(message);
            }
            else {
                if (daysExpected > maxDurationValue) { // If test will take too long
                    type = "warning";

                    templateFirstMessage = _.template(
                      this.StringDictionary.get("You have now created <%= experiences %> experiences.") + " " +
                      this.StringDictionary.get("Historical data shows it will take more than <%= days %> days to finish the test.") + " " +
                      this.StringDictionary.get("You can reduce this number by disabling some of the variables, or by adjusting the test settings.")
                    );

                    templateSecondMessage = _.template(
                     this.StringDictionary.get("This page has <%= viewsPerDay %> visitors per day on average.") + " " +
                     this.StringDictionary.get("The test is expected to need <%= days %> days to reach a statistically significant result.") + " " +
                     this.StringDictionary.get("Then it is possible to determine which experience contributes the most to the engagement value.") + " " +
                     this.StringDictionary.get("You can manually stop the test by picking a winner before the test ends automatically."));
                } else {
                    type = "notification";

                    templateFirstMessage = _.template(
                      this.StringDictionary.get("You have now created <%= experiences %> experiences.") + " " +
                      this.StringDictionary.get("Historical data shows that it will take about <%= days %> days to finish the test."));

                    templateSecondMessage = _.template(
                     this.StringDictionary.get("This page has <%= viewsPerDay %> visitors per day on average.") + " " +
                     this.StringDictionary.get("The test is expected to need <%= days %> days to reach a statistically significant result.") + " " +
                     this.StringDictionary.get("Then it is possible to determine which experience contributes the most to the engagement value."));
                }

                var message1 = templateFirstMessage({ experiences: experiences, days: daysExpected });
                var message2 = templateSecondMessage({ viewsPerDay: viewsPerDay, days: daysExpected });

                this.NotificationsMessageBar.addMessage(type, message1);
                this.NotificationsMessageBar.addMessage(type, message2);

                this.testLengthMessages.push(message1);
                this.testLengthMessages.push(message2);
            }

            // Notify if any variables are disabled by default.
            if (!this._disabledVariablesMessageShow) {
                this._disabledVariablesMessageShow = true;

                var items = this.TestVariablesStateListControl.get("items");
                var hasDisabledVariables = _.some(items, function (item) {
                    return item.DisableByDefault;
                });

                if (hasDisabledVariables) {
                    this.NotificationsMessageBar.addMessage("notification", {
                        text: "One or more variables have been automatically disabled. They can be enable under the Variables tab.",
                        actions: [],
                        closable: true
                    });
                }
            }
        },

        configureTextTemplates: function () {
            var selectionParser = function (value) {
                if (value) {
                    return parseInt(value.Value, 10) || 0;
                }


                return 0;
            }

            if (this.MaximumSelect) {
                this.ExpectedTimeWithEstimateOverMaximum.addVariable("maximumDuration", this.MaximumSelect, "selectedItem", this.app, selectionParser);
            } else {
                this.ExpectedTimeWithEstimateOverMaximum.addStaticVariable("maximumDuration", 0);
            }

            if (this.MinimumSelect) {
                this.ExpectedTimeWithEstimate.addVariable("minimumDuration", this.MinimumSelect, "selectedItem", this.app, selectionParser);
                this.ExpectedTimeWithEstimateOverMaximum.addVariable("minimumDuration", this.MinimumSelect, "selectedItem", this.app, selectionParser);
            } else {
                this.ExpectedTimeWithEstimate.addStaticVariable("minimumDuration", 0);
                this.ExpectedTimeWithEstimateOverMaximum.addStaticVariable("minimumDuration", 0);
            }

            this.ExperienceMetricsSingle.resume();
            this.ExperienceMetricsMultiple.resume();
            this.ExpectedTimeWithEstimate.resume();
            this.ExpectedTimeWithEstimateOverMaximum.resume();
            this.ExpectedTimeWithoutEstimate.resume();
        },

        setEstimateMessage: function () {
            if (!this.TestDurationDataSource)
                return;

            if (!this.TestDurationDataSource.get("isEstimated")) {
                this.ExpectedTimeWithEstimateOverMaximum.set("isVisible", false);
                this.ExpectedTimeWithEstimate.set("isVisible", false);
                return;
            }

            var maxSelectedValue = -1;

            if (this.MaximumSelect) {
                maxSelectedValue = parseInt(this.MaximumSelect.get("selectedItem").Value, 10) || 0;
            } else {
                maxSelectedValue = parseInt(this.TestDurationDataSource.get("maxDuration"), 10);
            }

            var expectedDays = this.TestDurationDataSource.get("expectedDays");

            if (maxSelectedValue > 0 && expectedDays > maxSelectedValue) {
                this.ExpectedTimeWithEstimateOverMaximum.set("isVisible", true);

            } else {
                this.ExpectedTimeWithEstimateOverMaximum.set("isVisible", false);
            }

            this.ExpectedTimeWithEstimate.set("isVisible", !this.ExpectedTimeWithEstimateOverMaximum.get("isVisible"));
        },

        createTestVariationsFilterContext: function() {
            return this.testOptions["disabledVariations"];
        },

        setFilteredTestVariations: function (item) {
            var filterContext = this.filterContext;

            if (filterContext) {
                // Add the filtered variable count to the item
                var disabledCount = (filterContext[item.UId] || []).length;
                var count = item.Variations - disabledCount;
                item.filteredVariations = count;
            } else {
                item.filteredVariations = item.Variations;
            }

            return true;
        },

        createTestVariableFilterContext: function () {
            var filterContext = {
                disabledVariations: this.testOptions["disabledVariations"]
            };

            if (this.TestVariablesStateListControl) {
                var ditems = this.TestVariablesStateListControl.get("disabledItems");
                if (ditems) {
                    var duids = _.map(ditems, function (item) {
                        return item.UId;
                    });

                    filterContext.disabledVariables = duids;
                }
            }

            return filterContext;
        },

        filterTestVariable: function (item) {
            var filterContext = this.filterContext;

            if (filterContext) {
                if (filterContext.disabledVariations) {
                    // Add the filtered variable count to the item
                    var disabledCount = (filterContext.disabledVariations[item.UId] || []).length;
                    var count = item.Variations - disabledCount;
                    item.filteredVariations = count;
                } else {
                    item.filteredVariations = item.Variations;
                }
                if(filterContext.disabledVariables) {
                    return !_.contains(filterContext.disabledVariables, item.UId);
                }
            }

            return true;
        },

        createCandidateFilterContext: function() {
            var filterContext = null;

            if (this.TestVariablesStateListControl) {
                filterContext = {};

                var ditems = this.TestVariablesStateListControl.get("disabledItems");
                if (ditems) {
                    var duids = _.map(ditems, function (item) {
                        var uid = item.UId.toUpperCase();
                        if (uid[0] !== "{") {
                            uid = "{" + uid + "}";
                        }
                        return uid;
                    });

                    filterContext.disabledVariables = duids;

                    if (this.testOptions) {
                        filterContext.disabledVariations = {};

                        var disabledVariationsMap = this.testOptions["disabledVariations"];

                        if (disabledVariationsMap) {

                            for (var variable in disabledVariationsMap) {
                                var variableId = variable.toUpperCase();
                                if (variableId[0] !== "{") {
                                    variableId = "{" + variableId + "}";
                                }

                                filterContext.disabledVariations[variableId] = _.map(disabledVariationsMap[variable], function (item) {
                                    return item.UId;
                                });
                            }
                        }
                    }
                }
            }

            return filterContext;
        },

        filterCandidate: function (item) {
            var filterContext = this.filterContext;
            var include = true;            

            if (filterContext) {
                if (filterContext.disabledVariables) {
                    include = !_.contains(filterContext.disabledVariables, item.attrs.testId);
                }

                if (include && filterContext.disabledVariations) {
                    var duid = filterContext.disabledVariations[item.attrs.testId];
                    include = !_.contains(duid, item.uId);
                }
            }

            return include;
        },

        validateStartAllowed: function() {
            var enabledVariables = this.TestVariablesStateListControl.get("checkedItems");
            var allowStart = enabledVariables.length >= this.requiredEnabledVariables;
            this.StartTestButton.set("isEnabled", allowStart);
        },

        _disableDialog: function (allowedComponents) {
            this.TestWizardTabControl.set("isVisible", false);
            this.EndWizardButton.set("isVisible", false);
            this.StartTestButton.set("isVisible", false);

            if (allowedComponents) {
                _.each(allowedComponents, function (component) {
                    component.set("isVisible", true);
                });
            }
        },

        _removeMessages: function (texts) {
            if (!_.isArray(texts)) {
                texts = [texts];
            }

            var self = this;
            _.each(texts, function (text) {
                self.NotificationsMessageBar.removeMessage(function (message) {
                    return message.text === text;
                });
            });
        }
    });

    return TestWizard;
});