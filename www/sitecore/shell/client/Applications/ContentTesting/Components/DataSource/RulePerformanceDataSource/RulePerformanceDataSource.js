define([
  "sitecore",
  "/-/speak/v1/contenttesting/DataUtil.js",
  "/-/speak/v1/contenttesting/RequestUtil.js",
  "/-/speak/v1/ExperienceEditor/ExperienceEditorProxy.js"
], function (Sitecore, dataUtil, requestUtil, PageEditorProxy) {
    var actionUrl = "/sitecore/shell/api/ct/Personalization/GetRulePerformance";

    var model = Sitecore.Definitions.Models.ControlModel.extend({
        initialize: function (options) {
            this._super();
            this.set({
                isBusy: false,
                invalidated: false,
                ruleSetId: "",
                ruleId: "",
                RuleValue: "--",
                Default: "--",
                ChangeRate: "--",
                RuleVisitors: 0,
                VisitorsRate: 0
            });

            this.on("change:ruleSetId change:ruleId", this.fetch, this);
        },

        fetch: function () {
            if (this.get("isSilent")) {
                return;
            }

            var uri = dataUtil.composeUri(this);
            var deviceId = PageEditorProxy.deviceId();
            var ruleSetId = this.get("ruleSetId");
            var ruleId = this.get("ruleId");

            if (!uri || !ruleSetId || !ruleId) {
                return;
            }

            var url = Sitecore.Helpers.url.addQueryParameters(actionUrl, {
                itemDataUri: uri,
                deviceId: deviceId,
                ruleSetId: ruleSetId,
                ruleId: ruleId
            });

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
                        this.set({
                            RuleValue: data.PersonalizedValue,
                            Default: data.NotPersonalizedValue,
                            ChangeRate: data.Effect,
                            RuleVisitors: data.Visitors,
                            VisitorsRate: data.VisitorsRate
                        });
                    }
                }
            };

            requestUtil.performRequest(ajaxOptions);
        }
    });


    var view = Sitecore.Definitions.Views.ControlView.extend({
        initialize: function (options) {
            this._super();

            // Set initial settings
            this.model.set({
                itemId: this.$el.attr("data-sc-itemid") || null,
                language: this.$el.attr("data-sc-language") || "",
                version: this.$el.attr("data-sc-version") || 0
            });
        }
    });

    Sitecore.Factories.createComponent("RulePerformanceDataSource", model, view, ".sc-RulePerformanceDataSource");
});
