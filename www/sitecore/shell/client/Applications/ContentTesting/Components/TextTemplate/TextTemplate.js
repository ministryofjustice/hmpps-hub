define(["sitecore"], function (Sitecore) {
  Sitecore.Factories.createBaseComponent({
    name: "TextTemplate",
    base: "ControlBase",
    selector: ".sc-TextTemplate",
    attributes: [
      { name: "text", value: "$el.data:sc-text" },
      { name: "variableBindings", value: "$el.data:sc-variable-bindings" },
      { name: "isVisible", defaultValue: true },
      { name: "isSuspended", defaultValue: true },
      { name: "rendered", defaultValue: "" },
      { name: "variables", defaultValue:[] }
    ],

    initialize: function () {
      this.model.on("change:text", this.updateTemplate, this);
      this.model.on("change:variableBindings", this.updateBindings, this);
      this.updateTemplate();
      //this.updateBindings();
    },

    extendModel: {
      addVariable: function (name, component, property, app, converter) {
        app = app || this.viewModel.app;

        var compRef = component;
        if (typeof (compRef) === "string") {
          compRef = app[component];
        }

        if (compRef) {
          var variables = this.get("variables");
          if (!variables) {
            variables = [];
            this.set("variables", variables);
          }

          variables.push({
            name: name,
            component: compRef,
            property: property,
            converter: converter
          });

          compRef.on("change:" + property, this.viewModel.redraw, this);
        } else {
          console.log("Failed to find component with ID '" + component + "'");
        }
      },

      addStaticVariable: function (name, value) {
        var variables = this.get("variables");
        if (!variables) {
          variables = [];
          this.set("variables", variables);
        }

        variables.push({
          name: name,
          value: value
        });
      },

      clearVariables: function() {
        this.set("variables", []);
      },

      suspend: function() {
        this.set("isSuspended", true);
      },

      resume: function() {
        this.set("isSuspended", false);
        this.viewModel.updateBindings();
      }
    },

    updateTemplate: function () {
      this.template = _.template(this.model.get("text"));
      this.redraw();
    },

    updateBindings: function () {
      // May need to wait until components have been loaded into the app
      if (this.model.get("isSuspended")) { return; }
      this.model.set("isSuspended", true);

      _.each(this.model.get("variableBindings"), function(binding) {
        this.model.addVariable(binding.name, binding.componentId, binding.propertyName, this.app);
      }, this);

      this.model.set("isSuspended", false);
      this.redraw();
    },

    redraw: function () {
      if (!this.template || this.model.get("isSuspended")) { return; }

      var templateData = {};
      _.each(this.model.get("variables"), function (variable) {
        if (!_.isUndefined(variable.value)) {
          // static variable
          templateData[variable.name] = variable.value;
        } else {
          var value = variable.component.get(variable.property);
          if (variable.converter) {
            value = variable.converter(value);
          }

          templateData[variable.name] = "";
          if (!_.isUndefined(value)) {
            templateData[variable.name] = value;
          }
        }
      });

      try {
        this.model.set("rendered", this.template(templateData));
      } catch(e) {
        console.log("Error during template processing. All variables may not have been set yet.", e);
      }
    }
  });
});