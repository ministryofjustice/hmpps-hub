(function (speak) {
  speak.pageCode([], function () {
    return {
      initialized: function () {
      },

      complexDataLoaded: function () {
        this.TextComplex.Text = "Something really complex just happened. Take a look at the XHR request in the browser console.";
      },

      loadComplexData: function () {
        this.ChartDataSourceComplex.loadData({
          onSuccess: this.complexDataLoaded.bind(this),
          parameters: {
            "foo": "bar"
          },
          url: this.ChartDataSourceComplex.ServiceUrl + "?helloworld"
        });
      },

      loadConvenienceProperties: function () {
        var custom = {
          "addData": {
            Messages: "foo"
          }
        };
        this.ChartDataSourceConvenienceProperties.loadData({ parameters: custom });
      },

      loadDataData: function () {
        var custom = {
          "addData": {
            Data: "foo"
          }
        };
        this.ChartDataSourceData.loadData({ parameters: custom });
      }
    };
  }, "DemoApp");
})(Sitecore.Speak);