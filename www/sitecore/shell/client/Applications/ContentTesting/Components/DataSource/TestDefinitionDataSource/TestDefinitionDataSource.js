define([
  "sitecore",
  "/-/speak/v1/contenttesting/DataUtil.js",
  "/-/speak/v1/contenttesting/RequestUtil.js"
], function (Sitecore, dataUtil, requestUtil) {
    var actionUrl = "/sitecore/shell/api/ct/TestDefinition/GetTestDefinition";

    var model = Sitecore.Definitions.Models.ControlModel.extend({
        initialize: function () {
            this._super();

            this.set({
                isBusy: false,
                invalidated: false,
                itemId: null,
                languageName: "",
                version: 0,
                name: null,
                conversions: null,
                isStopTestEnabled: false,
                isCancelTestEnabled: false,
                confirmationMessage: "",
                hasConfirmationMessage: false,
                testType: null
            });

            this.on("change:itemId change:languageName change:version", this.refresh, this);
        },

        refresh: function () {
            var uri = dataUtil.composeUri(this);
            if (!uri) {
                return;
            }

            var url = actionUrl + "?itemdatauri=" + encodeURIComponent(uri);

            if (this.prevUrl === url) {
                return;
            }

            if (this.get("isBusy")) {
                this.set("invalidated", true);
                return;
            }

            this.prevUrl = url;

            this.set({
                isBusy: true,
                invalidated: false
            });

            var ajaxOptions = {
                cache: false,
                url: url,
                context: this,
                success: function (data) {
                    this.set("isBusy", false);
                    if (this.get("invalidated")) {
                        this.refresh();
                    } else {
                        if (data) {
                            this.set({
                                name: data.Name,
                                conversions: data.Conversions,
                                isStopTestEnabled: data.IsStopTestEnabled,
                                isCancelTestEnabled: data.IsCancelTestEnabled,
                                confirmationMessage: data.ConfirmationMessage,
                                hasConfirmationMessage: data.ConfirmationMessage && data.ConfirmationMessage.length > 0,
                                testType: data.TestType
                            });
                        }
                    }
                },
                error: function (req, status, error) {
                    console.log("Ajax call failed");
                    console.log(status);
                    console.log(error);
                    console.log(req);
                }
            };

            requestUtil.performRequest(ajaxOptions);
        }
    });

    var view = Sitecore.Definitions.Views.ControlView.extend({
        initialize: function () {
            this._super();

            this.model.set("isBusy", true);

            // Set initial settings
            this.model.set({
                itemId: this.$el.attr("data-sc-itemid") || null,
                languageName: this.$el.attr("data-sc-language") || "",
                version: this.$el.attr("data-sc-version") || 0
            });

            this.model.set("isBusy", false);
            this.model.refresh();
        }
    });

    Sitecore.Factories.createComponent("TestDefinitionDataSource", model, view, "script[type='x-sitecore-testdefinitiondatasource']");
});
