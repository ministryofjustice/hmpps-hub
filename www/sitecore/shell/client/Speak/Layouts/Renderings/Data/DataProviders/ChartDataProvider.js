require.config({
  paths: {
      baseDataprovider: "/sitecore/shell/client/Speak/Layouts/Renderings/Data/DataProviders/BaseDataprovider"
  }
});

define(["sitecore", "baseDataprovider"], function (_sc) {
  _sc.Factories.createBaseComponent({
    name: "ChartDataProvider",
    base: "BaseDataProvider",
    selector: "script[type='text/x-sitecore-chartdataprovider']",
    attributes: [
        { name: "dataUrl", value: "$el.data:sc-dataurl" },
        { name: "queryParameters", value: "$el.data:sc-queryparameters" },
        { name: "dateTo", value: "$el.data:sc-dateto" },
        { name: "dateFrom", value: "$el.data:sc-datefrom" },
        { name: "resolution", value: "$el.data:sc-resolution" },
        { name: "resolutionRange", value: "$el.data:sc-resolutionrange" },
        { name: "hasData", defaultValue: false },
        { name: "hasNoData", defaultValue: false },
        { name: "isBusy", defaultValue: false }
    ],
    initialize: function () {
      this._super();
    },

    getData: function (serverRequestOptions) {
      "use strict";

      var serverRequestParameters = serverRequestOptions["parameters"],
        serverRequestOnSuccess = serverRequestOptions["onSuccess"],
        serverRequestUrl = serverRequestOptions["url"] ? serverRequestOptions["url"] : this.model.get("dataUrl");

      var providerItemProperties = {
        "dateFrom": this.model.get("dateFrom"),
        "dateTo": this.model.get("dateTo"),
        "resolution": this.model.get("resolution"),
        "resolutionRange": this.model.get("resolutionRange")
      };
      
      this.performRequest(serverRequestUrl, providerItemProperties, serverRequestParameters, serverRequestOnSuccess);
                 
    },
    
    successHandler: function (jsonData) {
    }
  });
});