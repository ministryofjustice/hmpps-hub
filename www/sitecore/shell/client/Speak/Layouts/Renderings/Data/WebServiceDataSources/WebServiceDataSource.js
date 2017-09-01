define(["jquery",
    "sitecore",
    "/sitecore/shell/client/Speak/Layouts/Renderings/Data/WebServiceDataSources/jquery.webservice.js",
    "/sitecore/shell/client/Speak/Layouts/Renderings/Data/WebServiceDataSources/jquery.xml2json.js"],
  function ($, sitecore, webService, xml2Json) {
  "use strict";

  var model = sitecore.Definitions.Models.ComponentModel.extend(
    {
      initialize: function (attributes) {
        this._super();

        this.set("url", "");
        this.set("methodName", "");
        this.set("nameSpace", "");
        this.set("parameters", {});
        this.set("requestType", "");
        this.set("response", "");
        this.set("isBusy", false);
        this.set("hasResponse", false);

        this.pendingRequests = 0;
      },
      
      success: function (data, textStatus) {
        this.set("response", data);
        this.set("hasResponse", true);

        this.pendingRequests--;
        if (this.pendingRequests <= 0) {
          this.set("isBusy", false);
          this.pendingRequests = 0;
        }
      },
      
      error: function (data, textStatus) {
        if (data.status === 401) {
          _sc.Helpers.session.unauthorized();
          return;
        }
        
        this.set("response", null);
        this.set("hasResponse", false);

        this.pendingRequests--;
        if (this.pendingRequests <= 0) {
          this.set("isBusy", false);
          this.pendingRequests = 0;
        }
      },
      
      getJson: function () {
        var response = this.get("response");
        return this.xml2json(response);
      },

      refresh: function () {
        var options = {
          url: this.get("url"),
          data: this.get("parameters"),
          dataType: "text",
          requestType: this.get("requestType"),
          nameSpace: this.get("nameSpace"),
          methodName: this.get("methodName"),
          success: $.proxy(this.success, this),
          error: $.proxy(this.error, this)
        };

        this.pendingRequests++;
        this.set("isBusy", true);

        this.request(options);
      },
      
      request: function(options) {
        $.webservice(options);
      },

      xml2json: function (xml) {
        return $.xml2json(xml);
      }
    }
  );

  var view = sitecore.Definitions.Views.ComponentView.extend(
    {
      listen: _.extend({}, sitecore.Definitions.Views.ComponentView.prototype.listen, {
        "refresh:$this": "refresh"
      }),

      initialize: function (options) {
        this._super();

        this.model.set("url", this.$el.attr("data-sc-url"));
        this.model.set("methodName", this.$el.attr("data-sc-method"));
        this.model.set("nameSpace", this.$el.attr("data-sc-namespace"));
        // TODO: set parameters
      },

      refresh: function () {
        this.model.refresh();
      }
    }
  );

  sitecore.Factories.createComponent("WebServiceDataSource", model, view, "script[type='text/x-sitecore-webservicedatasource']");
});