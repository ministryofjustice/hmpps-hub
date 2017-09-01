(function (speak) {
  speak.pageCode([], function () {
    return {
      initialized: function () {
      },

      complexDataLoaded: function () {
        this.TextComplex.Text = "Something really complex just happened. Take a look at the XHR request in the browser console.";
      },

      loadComplexData: function () {
        this.GenericDataSourceComplex.loadData({
          onSuccess: this.complexDataLoaded.bind(this),
          parameters: {
            "foo": "bar"
          },
          url: this.GenericDataSourceComplex.ServiceUrl + "?helloworld"
        });
      },

      loadConvenienceProperties: function () {
        var custom = {
          "addData": {
            HasMoreData: true,
            Messages: "foo",
            PageSize: 10,
            PageIndex: 1,
            TotalRecordCount: 123
          }
        };
        this.GenericDataSourceConvenienceProperties.loadData({ parameters: custom });
      },

      loadSortingData: function () {
        var custom = {
          "addData": {
            Sorting: [{ Direction: "Ascending", Field: "Foo" }]
          }
        };
        this.GenericDataSourceSorting.loadData({ parameters: custom });
      },

      loadDataData: function () {
        var custom = {
          "addData": {
            Data: "foo"
          }
        };
        this.GenericDataSourceData.loadData({ parameters: custom });
      }
    };
  }, "DemoApp");
})(Sitecore.Speak);