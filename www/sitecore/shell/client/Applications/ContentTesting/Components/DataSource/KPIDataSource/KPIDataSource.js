define([
  "sitecore",
  "/-/speak/v1/contenttesting/DataUtil.js",
  "/-/speak/v1/contenttesting/RequestUtil.js"
], function (Sitecore, dataUtil, requestUtil) {
    var actionUrl = "/sitecore/shell/api/ct/TestResults/GetOverviewKPI";

    var model = Sitecore.Definitions.Models.ControlModel.extend({
        initialize: function () {
            this._super();

            var params = Sitecore.Helpers.url.getQueryParameters(window.location.href);
            var device = params.deviceId || "";

            this.set({
                isBusy: false,
                invalidated: false,
                itemId: null,
                languageName: null,
                version: 0,
                bestExperienceEffect: 0,
                confidenceLevel: 0,
                testScore: 0,
                device: device
            });

            this.on("change:itemId change:languageName change:version change:device", this.refresh, this);

            this.refresh();
        },

        refresh: function () {
            var uri = dataUtil.composeUri(this);
            if (!uri) {
                return;
            }

            var url = Sitecore.Helpers.url.addQueryParameters(actionUrl, {
                itemdatauri: uri,
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
                dataType: "json",
                success: function (data) {
                    this.set("isBusy", false);
                    if (this.get("invalidated")) {
                        this.refresh();
                    } else {
                        if (data) {
                            // only populate if we're not about to fetch more data to avoid multiple refreshes on screen
                            this.set({
                                bestExperienceEffect: data.BestExperienceEffect,
                                confidenceLevel: data.ConfidenceLevel,
                                testScore: data.TestScore
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

            // stop refreshing while initial settings are read
            this.model.set("isBusy", true);

            this.model.set({
                itemId: this.$el.attr("data-sc-itemid") || null,
                languageName: this.$el.attr("data-sc-language") || null,
                version: this.$el.attr("data-sc-version") || 0,
                bestExperienceEffect: 0,
                confidenceLevel: 0
            });

            // settings have completed reading. Resume
            this.model.set("isBusy", false);
            this.model.refresh();
        }
    });

    Sitecore.Factories.createComponent("KPIDataSource", model, view, "script[type='x-sitecore-kpidatasource']");
});
