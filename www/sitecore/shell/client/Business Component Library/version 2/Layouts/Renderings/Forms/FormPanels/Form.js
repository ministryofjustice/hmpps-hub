(function(speak) {

  speak.component(["jquery", "bootstrap"], function() {

    var intializeBinding = function() {

          if (!this.BindingConfiguration) {
            return;
          }

          this.bindingConfigObject = JSON.parse(this.BindingConfiguration);

          var speakBindConfig = _.object(_.map(this.bindingConfigObject, function(num, key) {
            return [key, this.id + "." + num];
          }, this));

          var bindableData = _.object(_.map(this.bindingConfigObject, function(num, key) {
            var parts = num.split(".");
            return [key, this[parts[0]].get(parts[1])];
          }, this));

          this.FormData = speak.bindable(bindableData);
          rebind = rebind.bind(this, this.app, speakBindConfig);
          rebind(this.FormData);
        },

      rebind = function(app, config, bindableData) {
        var cleanData = getCleanData.call(this, bindableData);
        speak.module("bindings").applyBindings(bindableData, config, app);
        this.setFormData(cleanData);
       },

      getCleanData = function (bindableData) {
          return _.pick(bindableData || {}, _.keys(this.bindingConfigObject));
      },

      getComponentId = function(key) {
        var field = this.bindingConfigObject[key];
        return field ? field.split(".")[0] : "";
      },

      updateErrors = function(errors) {
        //Remove any current error visualization
        var $el = $(this.el);
        $el.find(".sc-global-isrequired")
          .toggleClass("sc-invalid-field", false);
        $el.find(".sc-formcomponent .sc-formcomponent-wrapper")
          .removeAttr('title')
          .removeAttr('data-original-title')
          .tooltip('destroy');

        //Create new error visualization
        _.each(errors, function(callout, key) {
            var componentId = getComponentId.call(this, key);
            if (componentId) {
              var $field = $(this[componentId].el).closest(".sc-formcomponent-wrapper");
              var $fieldParent = $field.parent();

              $field.attr('title', callout)
                .attr('data-original-title', callout)
                .tooltip({ trigger: 'manual', container: $fieldParent })
                .tooltip('show')
                .parents(".sc-formcomponent")
                .find(".sc-global-isrequired")
                .toggleClass("sc-invalid-field", true);

              $fieldParent.find('input, button, a, textarea, select')
                .on("focus", function() {
                  $field.tooltip('hide');
                });
            }
          },
          this);
      },

      disableDefaultFormSubmitOnEnter = function(e) {
        if (e.keyCode === 13 && !$(e.target).hasClass('sc-textarea')) {
          e.preventDefault();
        }
      };

    return {
      initialized: function() {
        intializeBinding.call(this);
        this.on("change:BindingTarget", this.setFormData, this);
        this.el.addEventListener("keydown", disableDefaultFormSubmitOnEnter.bind(this));
      },

      setFormData: function(properties) {
        _.extend(this.FormData, getCleanData.call(this, properties));
      },

      getFormData: function() {
        return getCleanData.call(this, this.FormData);
      },

      setErrors: function(errors) {
        if (errors) {
          updateErrors.call(this, errors);
        }
      },

    };
  }, "Form");

})(Sitecore.Speak);