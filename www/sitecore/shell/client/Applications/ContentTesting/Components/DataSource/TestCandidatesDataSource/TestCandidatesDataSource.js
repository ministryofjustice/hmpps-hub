define(["sitecore", "/-/speak/v1/contenttesting/RequestUtil.js"], function (Sitecore, requestUtil) {
    var model = Sitecore.Definitions.Models.ControlModel.extend({
        initialize: function () {
            this._super();

            var params = Sitecore.Helpers.url.getQueryParameters(window.location.href);
            var device = params.device;

            this.set({
                isBusy: false,
                invalidated: false,
                baseActionUrl: "/sitecore/shell/api/ct/ContentTesting/GetTestCandidatesVariations",
                itemId: null,
                itemUri: null,
                items: [],
                candidateCount: 0,
                showCarousel: false,
                device: device
            });

            this.on("change:itemId change:itemUri", this.refresh, this);
        },

        refresh: function () {
            var url = "";
            if (this.get("itemId")) {
                url = this.get("baseActionUrl") + "ById";

                url = Sitecore.Helpers.url.addQueryParameters(url, {
                    "id": this.get("itemId")
                });
            }

            if (this.get("itemUri")) {
                url = this.get("baseActionUrl") + "ByUri";

                url = Sitecore.Helpers.url.addQueryParameters(url, {
                    "itemDataUri": this.get("itemUri")
                });
            }

            if (url) {
                url = Sitecore.Helpers.url.addQueryParameters(url, {
                    "deviceId": this.get("device")
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
                            _.each(data, function (d) {
                                d.attrs = this.parseQuery(d.parameters);
                            }, this);
                            this.set({
                                items: data,
                                candidateCount: data.length,
                                showCarousel: data.length !== 2
                            });
                        }
                    },
                    error: function (req, status, error) {
                        alert(error);
                        console.log("TestCandidatesDataSource ajax failed");
                        console.log(status);
                        console.log(error);
                        console.log(req);
                    }
                };

                requestUtil.performRequest(ajaxOptions);
            }
        },

        parseQuery: function (query) {
            var vars = query.split("&");
            var attrs = {};
            for (var i = 0; i < vars.length; i++) {
                var pair = vars[i].split("=");
                attrs[pair[0]] = pair[1];
            }

            return attrs;
        },
    });

    var view = Sitecore.Definitions.Views.ControlView.extend({
        initialize: function () {
            this._super();

            // stop refreshing while initial settings are read
            this.model.set("isBusy", true);

            this.model.set({
                itemUri: this.$el.attr("data-sc-itemuri"),
                itemId: this.$el.attr("data-sc-itemid")
            });

            // settings have completed reading. Resume
            this.model.set("isBusy", false);
            this.model.refresh();
        }
    });

    Sitecore.Factories.createComponent("TestCandidatesDataSource", model, view, "script[type = 'x-sitecore-testcandidatesdatasource']");
});