define([], function () {
    return {
        SelectItemDialog: function (options) {
            // define object
            var ob = {
                // member variables
                _dialogWindow: options.dialogWindow,
                _itemIdPropertyName: options.itemIdPropertyName,
                _itemUriPropertyName: options.itemUriPropertyName,
                _itemTemplateIdPropertyName: options.itemTemplateIdPropertyName,
                _hostPage: options.host,
                _selectionValidationCallback: null,
                _selectionValidationCallbackContext: null,

                // ctor / init
                init: function () {
                    this._hostPage.TreeView.on("change:selectedItemId", this.setSelectedItemFromTree, this);
                    this._hostPage.ResultsList.on("change:selectedItemId", this.setSelectedItemFromList, this);

                    this._hostPage.SelectItemItemInfoDataSource.on("change:name", this.setWarnings, this);
                },

                // member functions
                setSelectedItemFromTree: function () {
                    this._hostPage.SelectItemProgressIndicator.set("isBusy", true);
                    this._hostPage.SelectButton.set("isEnabled", false);
                    this._hostPage.HostPageMessageBar.removeMessages("warning");

                    this._hostPage.set(this._itemIdPropertyName, this._hostPage.TreeView.get("selectedItemId"));
                    var node = this._hostPage.TreeView.get("selectedNode");
                    var rawItem = node.rawItem;

                    if (rawItem == undefined) {
                        return;
                    }

                    var uri = "sitecore://" + rawItem.itemId + "?ver=" + rawItem.$version + "&lang=" + rawItem.$language;

                    this._hostPage.SelectItemItemInfoDataSource.set({
                        itemId: null,
                        itemUri: uri
                    });

                    this._hostPage.set(this._itemUriPropertyName, uri);
                    this._hostPage.set(this._itemTemplateIdPropertyName, rawItem.$templateId);
                    this.validateSelection();
                },

                setSelectedItemFromList: function () {
                    this._hostPage.SelectItemProgressIndicator.set("isBusy", true);
                    this._hostPage.SelectButton.set("isEnabled", false);
                    this._hostPage.HostPageMessageBar.removeMessages("warning");

                    var itemId = this._hostPage.ResultsList.get("selectedItemId");

                    this._hostPage.set(this._itemIdPropertyName, itemId);

                    this._hostPage.SelectItemItemInfoDataSource.set({
                        itemUri: null,
                        itemId: itemId
                    });
                    this.validateSelection();
                },

                validateSelection: function () {
                    if (this._selectionValidationCallback) {
                        this._selectionValidationCallback.call(this._selectionValidationCallbackContext);
                    }
                },

                setWarnings: function () {
                    var self = this;

                    _.each(this._hostPage.SelectItemItemInfoDataSource.get("warnings"), function (warning) {
                        self.addWarning(warning);
                    });

                    var status = this._hostPage.SelectItemItemInfoDataSource.get("statusCode");
                    if (status === "active") {
                        var message = this._hostPage.Texts.get("This page has an active test. Please select another page.");
                        this.addWarning(message);
                    }

                    if (status === "drafttest") {
                        var message = this._hostPage.Texts.get("This page has a draft test. Please select another page.");
                        this.addWarning(message);
                    }

                    var hasWarnings = this._hostPage.HostPageMessageBar.get("hasWarningMessages");
                    var hasErrors = this._hostPage.HostPageMessageBar.get("hasErrorMessages");

                    if (!hasWarnings && !hasErrors) {
                        this._hostPage.SelectButton.set("isEnabled", true);
                    }

                    this._hostPage.SelectItemProgressIndicator.set("isBusy", false);
                },

                addWarning: function (message) {
                    this._hostPage.HostPageMessageBar.addMessage("warning", message);
                    this._hostPage.SelectButton.set("isEnabled", false);
                },

                setTitle: function (title) {
                    var titleEl = this._dialogWindow.viewModel.$el.find(".sc-dialogWindow-header-title");
                    titleEl.text(title);
                },

                setSelectButtonText: function (text) {
                    var buttonEl = this._dialogWindow.viewModel.$el.find("div[data-sc-id=\"SelectButton\"]");
                    buttonEl.text(text);
                },

                setSelectButtonCallback: function (callback) {
                    var buttonEl = this._dialogWindow.viewModel.$el.find("button[data-sc-id=\"SelectButton\"]");
                    buttonEl.attr("data-sc-click", "javascript:app." + callback + "()");
                },

                setSelectionValidationCallback: function (callback, context) {
                    this._selectionValidationCallback = callback;
                    this._selectionValidationCallbackContext = context;
                },

                show: function () {
                    this._dialogWindow.show();
                    this.validateSelection();
                },

                hide: function () {
                    this._dialogWindow.hide();
                    this._selectionValidationCallback = null;
                    this._selectionValidationCallbackContext = null;
                }
            };

            ob.init();
            return ob;
        }
    };
});