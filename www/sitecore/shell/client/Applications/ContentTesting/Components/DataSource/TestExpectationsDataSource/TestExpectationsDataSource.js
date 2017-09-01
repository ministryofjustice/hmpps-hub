define(["sitecore", "/-/speak/v1/contenttesting/RequestUtil.js"], function (Sitecore, requestUtil) {
  var model = Sitecore.Definitions.Models.ControlModel.extend({
    initialize: function (options) {
        this._super();

        var uri = this.getQueryVariable("uri");

        this.set("itemuri", uri);

        this.getTestExpectations();
        this.getTestDependencies();
    },

    getTestExpectations: function () {
        this.set("daysExpected", 28);
        this.set("experiences", 16);
        this.set("trafficAllocation", 100);
        this.set("variables", 3);
        this.set("variations", 8);
        this.set("visitorsPerDay", 161);
    },

    getTestDependencies: function () {
      var ajaxOptions = {
        cache: false,
        url: "/sitecore/shell/api/ct/CreateTestDialog/GetTestDependencies?datauri=" + this.get("itemuri"),
        context: this,
        success: function (data) {
          this.set("dependencies", data);
        }
      };
      
      requestUtil.performRequest(ajaxOptions);
    },
    
    getQueryVariable : function(variable) {
        var query = window.location.search.substring(1);
        var vars = query.split('&');
        
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split('=');
            
            if (decodeURIComponent(pair[0]) === variable) {
                return pair[1];
            }
        }

        return null;
    }
  });

  var view = Sitecore.Definitions.Views.ControlView.extend({
    initialize: function (options) {
      this._super();
    }
  });

  Sitecore.Factories.createComponent("TestExpectationsDataSource", model, view, ".sc-TestExpectationsDataSource");
});
