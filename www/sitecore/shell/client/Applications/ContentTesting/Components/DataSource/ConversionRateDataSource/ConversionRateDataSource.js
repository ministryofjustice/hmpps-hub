define([
  "sitecore",
  "/-/speak/v1/contenttesting/DataUtil.js",
  "/-/speak/v1/contenttesting/RequestUtil.js"
], function (Sitecore, dataUtil, requestUtil) {
    var actionUrl = "/sitecore/shell/api/ct/TestResults/GetConversionRate";

    var model = Sitecore.Definitions.Models.ControlModel.extend({
        initialize: function () {
            this._super();

            var params = Sitecore.Helpers.url.getQueryParameters(window.location.href);
            var device = params.deviceId;

            this.set({
                itemId: null,
                languageName: "",
                version: 0,
                device: device,
                pageSize: 50,
                goalId: null,
                isBusy: false,
                invalidated: false,
                hasMore: false,
                items: [],
                conversions: 0,
                conversionRate: 0,
                totalResults: 0,
                resultCount: 0
            });

            this.on("change:itemId change:languageName change:version change:pageSize change:goalId change:device", this.reset, this);
        },

        reset: function () {
            this.set("count", 0);
            this.fetch();
        },

        fetch: function () {
            this.getCount();
            var count = this.get("count");
            var goalId = this.get("goalId");

            if (!goalId || !count) {
                return;
            }

            var uri = dataUtil.composeUri(this);
            if (!uri) {
                return;
            }

            var url = Sitecore.Helpers.url.addQueryParameters(actionUrl, {
                itemdatauri: uri,
                goalId: goalId,
                resultCount: count,
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
                headers: {},
                context: this,
                success: function (data) {
                    this.set("isBusy", false);
                    if (this.get("invalidated")) {
                        this.fetch();
                    } else {
                        this.set({
                            conversions: data.Conversions,
                            conversionRate: data.ConversionRate,
                            items: data.Items,
                            totalResults: data.TotalResults,
                            hasMore: data.Items[0].items.length < data.TotalResults,
                            resultCount: this.get("pageSize")
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
        },

        getCount: function () {
            var count = this.get("count");

            // If 'count' hasn't been initialized yet, use default size value
            if (count === undefined || count === 0) {
                var defaultSize = this.get("defaultSize");
                this.set("count", defaultSize);
                return;
            }

            // Increase number of items to retrieve to page size value
            count = parseInt(count, 10) + parseInt(this.get("pageSize"), 10);
            this.set("count", count);
        }
    });

    var view = Sitecore.Definitions.Views.ControlView.extend({
        initialize: function () {
            this._super();

            // Set initial settings
            this.model.set({
                itemId: this.$el.attr("data-sc-itemid") || null,
                language: this.$el.attr("data-sc-language") || "",
                version: this.$el.attr("data-sc-version") || 0,
                goalId: this.$el.attr("data-sc-goalId") || null,
                defaultSize: this.$el.attr("data-sc-defaultsize") || 5,
                pageSize: this.$el.attr("data-sc-pagesize") || 5
            });
        }
    });

    Sitecore.Factories.createComponent("ConversionRateDataSource", model, view, ".sc-ConversionRateDataSource");
});


