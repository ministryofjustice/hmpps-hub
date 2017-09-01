var requestUtilPath;
if (window.location.host && window.location.host != '') { // launching when address to web-page
  requestUtilPath = "/-/speak/v1/contenttesting/RequestUtil.js";
}
else { // launching of the code-coverage estemating
  require.config({
    paths: {
      requestUtilPath: contentTestingDir + "/Common/lib/RequestUtil"
    },
  });
  requestUtilPath = "requestUtilPath";
}

define([
    "sitecore",
    requestUtilPath],
  function (Sitecore, requestUtil) {
    var model = Sitecore.Definitions.Models.ControlModel.extend({
      initialize: function () {
        this._super();
        this.set("components", {});

        this.set("TrafficAllocation", 0);
        this.set("ConfidenceLevel", 0);
      },

      fetch: function () {
        var self = this;
        var ajaxOptions = {
          cache: false,
          url: "/sitecore/shell/api/ct/OptionsMapper/GetDefaultOptions",
          context: this,
          success: function (data) {
            self.set("TrafficAllocation", data.TrafficAllocation);
            self.set("ConfidenceLevel", data.ConfidenceLevel);
          }
        };

        requestUtil.performRequest(ajaxOptions);
      },

      addOptionComponent: function (component, componentProperty, modelProperty, changedProperty) {
        var components = this.get("components");
        if (component !== undefined) {
          if (component.length && component.length > 1) {
            for (var i = 0; i < component.length; i++) {
              var map = { componentName: component[i].get("name"), "componentProperty": componentProperty, "modelProperty": modelProperty };
              var key = map.componentName + map.componentProperty;
              var componetProp = componentProperty;
              components[key] = map;
              var event = "change:" + changedProperty;
              component[i].on(event, this.handleComponentChange, { component: component[i], self: this, "componentProperty": componetProp });
              this.updateProperty({ component: component[i], self: this, "componentProperty": componetProp });
            }
          } else {
            var map = { componentName: component.get("name"), "componentProperty": componentProperty, "modelProperty": modelProperty };
            var key = map.componentName + map.componentProperty;
            var componetProp = componentProperty;
            components[key] = map;
            var event = "change:" + map.componentProperty;
            component.on(event, this.handleComponentChange, { component: component, self: this, "componentProperty": componetProp });
            this.updateProperty({ component: component, self: this, "componentProperty": componetProp });
          }
        }
      },

      handleComponentChange: function () {
        this.self.updateProperty(this);
      },

      updateProperty: function (obj) {
        var component = obj.component;
        var componentName = component.get("name");
        var componentProperty = obj.componentProperty;
        var self = obj.self;
        var key = componentName + componentProperty;
        var map = self.get("components")[key];
        self.set(map.modelProperty, component.get(componentProperty));
      }


    });

    var view = Sitecore.Definitions.Views.ControlView.extend({
      initialize: function () {
        this._super();
        this.model.fetch();
      },
    });

    Sitecore.Factories.createComponent("OptionsMapper", model, view, ".sc-OptionsMapper");
  });
