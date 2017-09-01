define(["sitecore",
        "/-/speak/v1/contenttesting/BindingUtil.js",
        "/-/speak/v1/contenttesting/SelectPagesToTest.js",
        "/-/speak/v1/contenttesting/PageTestActions.js",
        "/-/speak/v1/contenttesting/SelectItemDialog.js",
        "/-/speak/v1/contenttesting/ReviewTest.js",
        "/-/speak/v1/contenttesting/ImageThumbs.js",
        "/-/speak/v1/contenttesting/ModeFix.js",
    "/-/speak/v1/contenttesting/DataUtil.js",
], function (_sc, bindingUtil, selectPagesToTestMod, pageTestActionsMod, selectItemDialogMod, reviewTestMod, thumbsMod, modeFix, dataUtil) {
    return function PageTestUtil(page, saveKey) {

        var self;

        var pageTestUtil = {
            _testItemUriProperty: "testItemUri",
            _testItemTemplateIdProperty: "testItemTemplateId",
            _selectionValidationCallback: null,

            constructor: function () {
                self = this;
            },

            initialize: function () {
                // workaround
                modeFix.fixModeCookies();

                page.on("change:" + page._testItemUriProperty, bindingUtil.propagateChange, { source: page, sourceProp: page._testItemUriProperty, target: page.ItemInfoDataSource, targetProp: "itemUri" });
                page.on("change:" + page._testItemUriProperty, this.setTreeViewContentLanguage, page);
                page.ItemInfoDataSource.on("change:status", page.testStatusChanged, { self: page });
                page.on("change:" + page._testItemUriProperty + " change:" + selectPagesToTestMod.testItemsProperty, function () {
                    page.invalidated = true;
                    if (page.isPageTestExperience) {
                        page.savedOptions = self.createTestOptions();
                    }
                });

                page.actions = new pageTestActionsMod.PageTestActions({
                    messageBar: page.PageMessageBar,
                    dictionary: page.Texts,
                    progressIndicator: page.AppProgressIndicator,
                    firstStartButton: page.FirstStartButton,
                    bottomStartButton: page.BottomStartButton,
                    saveButton: page.SaveButton
                });

                // Ensure carousel redraws when visible so elastislider can work out it's dimensions
                page.Tabs.on("change:selectedTab", page.CarouselImage.viewModel.populateCarousel, page);

                // Update TestObjective UI according to selected test objective item
                if (page.ObjectiveList !== undefined) {
                    if (page.isPageTestExperience) {
                        page.ObjectiveList.on("change:items", page.listGoalsItemsChanged, page);
                        page.ObjectiveList.on("change:selectedItem", page.updateTestObjectiveUI, page);
                    }
                    // set localization keys for "ObjectiveList"
                    page.ObjectiveList.viewModel.setTestingOptions({ texts: page.Texts });
                }

                var closeCheck = function () {
                    if (!page.invalidated) {
                        return;
                    }
                    var current = self.createTestOptions();
                    if (!_.isEqual(page.savedOptions, current)) {
                        if (page.isPageTestExperience) {
                            return page.Texts.get("The test has not been saved");
                        } else {
                            window.top[saveKey] = current;
                        }
                    }
                };

                // bind both beforeunload and unload as beforeunload is proprietry
                $(window).on("beforeunload", closeCheck);
                $(window).unload(closeCheck);



            },

            initPagesTab: function () {
                page.on("change:" + this._testItemUriProperty, bindingUtil.bindVisibility, { source: page, sourceProp: this._testItemUriProperty, target: page.PagesBorder });
                page.on("change:" + this._testItemUriProperty, bindingUtil.bindVisibility, { source: page, sourceProp: this._testItemUriProperty, target: page.SelectPageBorder, hide: true });

                var selectItemDialog = new selectItemDialogMod.SelectItemDialog({
                    host: page,
                    itemIdPropertyName: "selectedItemId",
                    itemUriPropertyName: "selectedItemUri",
                    itemTemplateIdPropertyName: "selectedTemplateId",
                    dialogWindow: page.SelectPageWindow
                });

                if (this._selectionValidationCallback) {
                    selectItemDialog.setSelectionValidationCallback(this._selectionValidationCallback, this);
                }

                page.selectPagesToTest = new selectPagesToTestMod.SelectPagesToTest({
                    testItemDataSource: page.ItemInfoDataSource,
                    hostPage: page,
                    testItemUriProperty: this._testItemUriProperty,
                    testItemTemplateProperty: this._testItemTemplateIdProperty,
                    selectedLanguageProperty: page._selectedLanguageProperty,
                    compareTemplates: true,
                    selectItemDialog: selectItemDialog
                });

                if (!page.showThumbnails) {
                    page.ThumbnailBorder.set("isVisible", false);
                    page.ThumbnailProgressIndicator.set("isVisible", false);
                }
            },

            initReviewTab: function () {
                page.reviewTest = new reviewTestMod.ReviewTest({
                    hostPage: page,
                    testItemsProperty: selectPagesToTestMod.testItemsProperty,
                    testItemUriProperty: page._testItemUriProperty
                });

                if (page.showThumbnails) {
                    page.CarouselImage.set("imageThumbs", new thumbsMod.ImageThumbs({
                        dictionary: page.Texts
                    }));
                }
                else {
                    if (page.PreviewAccordion) {
                        page.PreviewAccordion.set("isVisible", false);
                    }
                }
            },

            saveTest: function () {
                var options = self.createTestOptions();
                page.savedOptions = options;
                page.actions.savePageTest(options);
                page.invalidated = false;
                page.ItemInfoDataSource.refresh();
            },

            startTest: function () {
                var options = self.createTestOptions();
                page.savedOptions = options;
                page.actions.savePageTest(options, true, function () {
                    page.actions.startPageTest({
                        ItemUri: options.ItemUri
                    }, function () {
                        page.ItemInfoDataSource.refresh();
                        if (page.isPageTestExperience) {
                            page.invalidated = false;
                        } else {
                            var url = _sc.Helpers.url.addQueryParameters(window.top.location.href, {
                                sc_mode: "edit"
                            });

                            window.top.location.href = url;
                        }
                    });
                });
            },

            setTreeViewContentLanguage: function () {
                var uriString = this.get(this._testItemUriProperty);
                var uri = new dataUtil.DataUri(uriString);
                this.TreeView.set("contentLanguage", uri.lang);
            },

            createTestOptions: function () {
                var options = {
                    ItemUri: page.get(page._testItemUriProperty)
                };

                page.selectPagesToTest.createTestOptions(options);
                page.reviewTest.createTestOptions(options);

                return options;
            },

            validateSelectTest: function (callback) {
                var itemId = page.get("selectedItemId");
                var itemUri = page.get("selectedItemUri");
                var infoItemId = page.ItemInfoDataSource.get("itemId");

                if (itemId === infoItemId) {
                    this.validateTestStatus({ callback: callback });
                }
                else {
                    page.ItemInfoDataSource.once("change:name", this.validateTestStatus, { context: page, callback: callback, itemUri: page.ItemInfoDataSource.get("itemUri") });
                    page.ItemInfoDataSource.set({
                        isValidateTest: true,
                        itemUri: itemUri
                    });
                }
            },

            validateTestStatus: function (data) {
                var callback = (data ? data.callback : null) || this.callback;

                /*var callback;
                if (data && data.callback) {
                    callback = data.callback;
                } else if (this.callback) {
                    callback = this.callback;
                }*/

                if (!callback) {
                    return;
                }

                var self = page;
                if (this.context) {
                    self = this.context;
                }

                var status = self.ItemInfoDataSource.get("statusCode");
                if (status === "active") {
                    var message = self.Texts.get("This page has active test. Please select another page.");
                    alert(message);
                }
                else {
                    callback();
                }

                if (this.itemUri) {
                    self.ItemInfoDataSource.set("itemUri", this.itemUri);
                }
            },
            setSelectionValidationCallback: function (callback, context) {
                this._selectionValidationCallback = callback;
                this._selectionValidationCallbackContext = context;
            }
        };

        pageTestUtil.constructor();
        return pageTestUtil;
    };
});