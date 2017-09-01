define(["sitecore", "/-/speak/v1/contenttesting/RequestUtil.js"], function (Sitecore, requestUtil) {
    var model = Sitecore.Definitions.Models.ControlModel.extend({
        initialize: function () {
            this.set({
                isBusy: false,
                invalidated: false,
                actionUrl: null,
                start: null,
                end: null
            });

            this.on("change:start change:end", this.refresh, this);
        },

        refresh: function () {
            if (this.get("actionUrl") && this.get("start") && this.get("end")) {

                var url = this.getUrl();

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
                        if (this.get("invalidated")) {
                            this.set("isBusy", false);
                            this.refresh();
                        } else {
                            // only populate if we're not about to fetch more data to avoid multiple refreshes on screen
                            this.setData(data);
                            this.set("isBusy", false);
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
        },

        getUrl: function () {
            return this.get("actionUrl") +
              "?start=" + (this.get("start").toJSON ? this.get("start").toJSON() : this.get("start")) +
              "&end=" + (this.get("end").toJSON ? this.get("end").toJSON() : this.get("end"));
        }
    });

    var view = Sitecore.Definitions.Views.ControlView.extend({
        initialize: function () {
            this._super();

            // stop refreshing while initial settings are read
            this.model.set("invalidated", true);

            var start = new Date(this.$el.attr("data-sc-start"));
            this.model.set("start", isNaN(start.getDate()) ? null : start);

            var end = new Date(this.$el.attr("data-sc-end"));
            this.model.set("end", isNaN(end.getDate()) ? null : end);

            // settings have completed reading. Resume
            this.model.set("invalidated", false);
            this.model.refresh();
        }
    });

    Sitecore.Factories.createComponent("OptimizationBaseDataSource", model, view, "script[type='x-sitecore-optimizationbasedatasource']");
});