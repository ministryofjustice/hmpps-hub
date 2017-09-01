define([
    "sitecore",
    "/-/speak/v1/contenttesting/DataUtil.js",
    "/-/speak/v1/contenttesting/RequestUtil.js",
    "/-/speak/v1/ExperienceEditor/ExperienceEditorProxy.js"],
  function (Sitecore, dataUtil, requestUtil, PageEditorProxy) {
  var actionUrl = "/sitecore/shell/api/ct/Personalization/GetRuleSetPerformance";

  Sitecore.Factories.createBaseComponent({
    name: "RuleSetPerformanceDataSource",
    base: "ControlBase",
    selector: "script[type='x-sitecore-rulesetperformancedatasource']",
    attributes: [
      { name: "items", defaultValue: [] },
      { name: "hasItems", defaultValue: false },
      { name: "invalidated", defaultValue: false },
      { name: "isBusy", defaultValue: false },
      { name: "itemId", value: "$el.data:sc-itemid" },
      { name: "languageName", value: "$el.data:sc-language" },
      { name: "version", value: "$el.data:sc-version" },
      { name: "mode", value: "$el.data:sc-mode" } // <blank>, all, below, above
    ],

    initialize: function () {
      this.model.on("change:itemId change:languageName change:version", this.model.refresh, this.model);
      this.model.refresh();
    },

    extendModel: {
      refresh: function () {
        var uri = dataUtil.composeUri(this);
        if (uri == null) {
          return;
        }

        if (this.get("isBusy")) {
          this.set("invalidated", true);
          return;
        }

        var ajaxOptions = {
          cache: false,
          url: Sitecore.Helpers.url.addQueryParameters(actionUrl, { itemDataUri: uri, deviceId: PageEditorProxy.deviceId(), mode: (this.get("mode") || "all") }),
          context: this,
          success: function(data) {
            this.set("isBusy", false);
            if (this.get("invalidated")) {
              this.refresh();
            } else {
              this.set({
                items: data.Items,
                hasItems: data.Items && data.Items.length > 0
              });
            }
          },
          error: function(req, status, error) {
            console.log("Ajax call failed");
            console.log(status);
            console.log(error);
            console.log(req);
          }
        };

        requestUtil.performRequest(ajaxOptions);
      }
    }
  });
});