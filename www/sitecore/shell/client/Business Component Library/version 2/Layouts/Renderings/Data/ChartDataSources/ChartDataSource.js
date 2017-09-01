(function (speak) {

  speak.component(["bclBaseDataSource"], function (baseDataSource) {

    return speak.extend(baseDataSource, {
      name: "ChartDataSource",

      initialized: function () {
        if (!this.IsLoadDataDeferred && this.ServiceUrl) {
          this.loadData();
        };
      },

      loadData: function (serverRequestOptions) {
        "use strict";

        var serverRequestParameters = null,
          serverRequestOnSuccess = null,
          serverRequestUrl = this.ServiceUrl;

        if (serverRequestOptions) {
          serverRequestParameters = serverRequestOptions["parameters"],
          serverRequestOnSuccess = serverRequestOptions["onSuccess"],
          serverRequestUrl = serverRequestOptions["url"] ? serverRequestOptions["url"] : this.ServiceUrl;
        }

        var providerItemProperties = {
          "dateFrom": this.DateFrom,
          "dateTo": this.DateTo,
          "resolution": this.Resolution,
          "resolutionRange": this.ResolutionRange
        };

        this.performRequest(serverRequestUrl, providerItemProperties, serverRequestParameters, serverRequestOnSuccess);

      },

      successHandler: function (jsonData) {
      }
    });
  }, "ChartDataSource");
})(Sitecore.Speak);
