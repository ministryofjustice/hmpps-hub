
var dataUtilPath;
var requestUtilPath;
if (window.location.host && window.location.host !== "") { // launching when address to web-page
    dataUtilPath = "/-/speak/v1/contenttesting/DataUtil.js";
    requestUtilPath = "/-/speak/v1/contenttesting/RequestUtil.js";
}
else { // launching of the code-coverage estemating
    require.config({
        paths: {
            dataUtilPath: contentTestingDir + "/Common/lib/datautil",
            requestUtilPath: contentTestingDir + "/Common/lib/RequestUtil",
        }
    });
    dataUtilPath = "dataUtilPath";
    requestUtilPath = "requestUtilPath";
}

define([
  "sitecore",
  dataUtilPath,
  requestUtilPath
], function (Sitecore, dataUtil, requestUtil) {
    var model = Sitecore.Definitions.Models.ControlModel.extend({
        initialize: function () {
            this._super();

            var params = Sitecore.Helpers.url.getQueryParameters(window.location.href);
            var device = params.deviceId;

            this.set({
                actionUrl: "",
                actionUrlForTestValue: "",
                isBusy: false,
                invalidated: false,
                itemId: null,
                languageName: null,
                version: 0,
                device: device,
                combination: null,
                valueId: null
            });

            this.on("change:itemId change:languageName change:version change:device", this.refresh, this);
            this.on("change:valueId", this.refreshByValueId, this);
            this.on("change:combination", this.refreshByCombination, this);

            this.refresh();
        },

        refresh: function () {
            this.set("count", 0);
            this.set("items", []);

            this.fetch();
        },

        refreshByCombination: function () {
            this.set("count", 0);
            this.set("items", []);

            var combination = this.get("combination");
            if (combination === "" || combination === null || combination === undefined) {
                return;
            }

            this.set("valueId", "", { silent: true });

            this.fetch();
        },

        refreshByValueId: function () {
            this.set("count", 0);
            this.set("items", []);

            var valueId = this.get("valueId");
            if (valueId === "" || valueId === null || valueId === undefined) {
                return;
            }

            this.set("combination", "", { silent: true });

            this.fetch();
        },

        fetch: function () {
            var uri = dataUtil.composeUri(this);
            if (!uri) {
                return;
            }

            var combination = this.get("combination");
            var valueId = this.get("valueId");

            var actionUrlForTestValue = this.get("actionUrlForTestValue");
            var actionUrl = this.get("actionUrl");

            if (!combination && !valueId) {
                return;
            }

            var url = "";
            if (valueId && actionUrl) {
                url = Sitecore.Helpers.url.addQueryParameters(actionUrlForTestValue, {
                    testValueId: valueId
                });
            } else if (combination && actionUrl) {
                url = Sitecore.Helpers.url.addQueryParameters(actionUrl, {
                    combination: combination
                });
            }

            url = Sitecore.Helpers.url.addQueryParameters(url, {
                itemdatauri: uri,
                deviceId: this.get("device") || ""
            });

            url = this._appendUrl(url);

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
                        this._setData(data);
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

        _appendUrl: function (url) {
            return url;
        },

        _setData: function (data) {
            // This function should always be overridden
            this.set("data", data);
        },
    });

    var view = Sitecore.Definitions.Views.ControlView.extend({
        initialize: function () {
            this._super();

            this.model.set("isBusy", true);

            // Set initial settings
            this.model.set({
                itemId: this.$el.attr("data-sc-itemid") || null,
                languageName: this.$el.attr("data-sc-language") || "",
                version: this.$el.attr("data-sc-version") || 0,
            });

            this.model.set("isBusy", false);
            this.model.refresh();
        }
    });

    try {

        Sitecore.Factories.createComponent("ItemCallMetricBaseDataSource", model, view, "script[type='x-sitecore-itemcallmetricbasedatasource']");
    }
    catch (e) {
    }

});
