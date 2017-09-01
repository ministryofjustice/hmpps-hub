define([
  "sitecore",
  "/-/speak/v1/contenttesting/DataUtil.js",
  "/-/speak/v1/contenttesting/RequestUtil.js"
], function (Sitecore, dataUtil, requestUtil) {
  var actionUrl = "/sitecore/shell/api/ct/TestResults/GetExperiencesPerformance";

  var model = Sitecore.Definitions.Models.ControlModel.extend({
    initialize: function () {
      this._super();

      var params = Sitecore.Helpers.url.getQueryParameters(window.location.href);
      var device = params.deviceId == undefined ? '' : params.deviceId;

      this.set({
        itemId: null,
        languageName: "",
        version: 0,
        device: device,
        pageSize: 50,
        isBusy: false,
        hasMore: false,
        items: []
      });

      this.on("change:itemId change:languageName change:version change:pageSize change:device", this.refresh, this);
    },

    refresh: function () {
      // do not allow multiple refreshes to run at once
      if (this.get("isBusy"))
        return;

      this.fetch();
    },

    fetch: function () {
      // do not allow multiple fetches to run at once
      if (this.get("isBusy"))
        return;

      var groupsArray = this.get("items");
      var itemsArray = 0;
      var itemsCount = 0;
      if (groupsArray.length > 0) {
        itemsArray = groupsArray[0].items;
        itemsCount = itemsArray.length;
      }

      var count = itemsCount + parseInt(this.get("pageSize"), 10);

      var uri = dataUtil.composeUri(this);
      if (!uri) {
        return;
      }

      this.set("isBusy", true);

      var url = Sitecore.Helpers.url.addQueryParameters(actionUrl, {
        itemdatauri: uri,
        count: count,
        deviceId: this.get("device")
      });

      var ajaxOptions = {
        cache: false,
        url: url,
        context: this,
        success: function(data) {
          this.set("isBusy", false);
          if (this.get("invalidated")) {
            this.fetch();
          } else {
            if (data) {
              this.set({
                items: data.Items,
                totalItemsCount: data.TotalResults,
                hasMore: data.Items != null && data.Items.length > 0 ? data.Items[0].items.length < data.TotalResults : false
              });
            }
          }
        }
      };

      requestUtil.performRequest(ajaxOptions);
    }
  });

  var view = Sitecore.Definitions.Views.ControlView.extend({
    initialize: function (options) {
      this._super();

      // stop refreshing while initial settings are read
      this.model.set("isBusy", true);
      this.model.set("languageName", this.$el.attr("data-sc-language") || "");
      this.model.set("version", this.$el.attr("data-sc-version") || 0);
      this.model.set("itemId", this.$el.attr("data-sc-itemid") || null);
      this.model.set("pageSize", this.$el.attr("data-sc-pagesize") || 50);

      // settings have completed reading. Resume
      this.model.set("isBusy", false);
      this.model.refresh();
    }
  });

  Sitecore.Factories.createComponent("ExperienceEngagementDataSource", model, view, "script[type='x-sitecore-experienceengagementdatasource']");
});
