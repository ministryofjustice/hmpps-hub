define([
  "sitecore",
  "/-/speak/v1/contenttesting/DataUtil.js",
  "/-/speak/v1/contenttesting/RequestUtil.js"
], function (Sitecore, dataUtil, requestUtil) {
    var actionUrl = "/sitecore/shell/api/ct/TestResults/GetExperienceKPI";

    var model = Sitecore.Definitions.Models.ControlModel.extend({
        initialize: function () {
            this._super();

            var params = Sitecore.Helpers.url.getQueryParameters(window.location.href);
            var device = params.deviceId;

            this.set({
                isBusy: false,
                invalidated: false,
                itemId: null,
                languageName: null,
                version: 0,
                combination: null,
                variationId: null,
                goalId: null,
                trailingValue: 0,
                experienceEffect: 0,
                conversionRate: 0,
                device: device
            });

            this.on("change:combination", this.fetchTestCombination, this);
            this.on("change:variationId", this.fetchTestValue, this);
            this.on("change:goalId change:device", this.fetch, this);
        },

        fetchTestCombination: function () {
            this.set("variationId", "", { silent: true });
            this.fetch();
        },

        fetchTestValue: function () {
            this.set("combination", "", { silent: true });
            this.fetch();
        },

        fetch: function () {
            var combination = this.get("combination");
            var variationid = this.get("variationId");
            var goalid = this.get("goalId");
            if (goalid === undefined) {
                goalid = "{00000000-0000-0000-0000-000000000000}";
            }

            if (!combination && !variationid) {
                return;
            }

            var uri = dataUtil.composeUri(this);
            if (!uri) {
                return;
            }

            var url = Sitecore.Helpers.url.addQueryParameters(actionUrl, {
                itemdatauri: uri,
                goalId: goalid,
                combination: combination,
                variationId: variationid,
                deviceId: this.get("device")
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
                        this.fetch();
                    } else {
                        this.set({
                            conversionRate: data.ConversionRate,
                            trailingValue: data.TrailingValue,
                            experienceEffect: data.ExperienceEffect
                        });
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

            this.model.set({
                itemId: this.$el.attr("data-sc-itemid") || null,
                languageName: this.$el.attr("data-sc-language") || null,
                version: this.$el.attr("data-sc-version") || 0,
                combination: this.$el.attr("data-sc-combination") || null,
                variationId: this.$el.attr("data-sc-variation-id") || null,
                goalId: this.$el.attr("data-sc-goal-id") || null
            });

            this.model.set("isBusy", false);
            this.model.fetch();
        }
    });

    Sitecore.Factories.createComponent("ExperienceKPIDataSource", model, view, "script[type = 'x-sitecore-experiencekpidatasource']");
});
