(function(speak) {
  // Private variable shared between all instances of the component
  var groupValues = {};

  speak.component(["knockout"], function(ko) {
    var updating = false;

    // This function is called in context of the component.
    var updateIsChecked = function(newValue) {
      updating = true;
      this.IsChecked = (newValue === this.Value);
      this.app[this.GroupName] = newValue;
      updating = false;
    };

    // This function is called in context of the component.
    var updateKoProperty = function() {
      if (updating) {
        return;
      }

      this._checked.c(this.IsChecked ? this.Value : null);
    };

    return {
      name: "RadioButton",

      initialized: function() {
        if (this.GroupName.length < 1) {
          throw "The GroupName property is empty.";
        }

        if (this.app[this.GroupName] === undefined) {
          this.app.defineProperty(this.GroupName, null);
        }

        if (groupValues[this.GroupName] === undefined) {
          groupValues[this.GroupName] = ko.observable(null);
        }

        this._checked = { c: groupValues[this.GroupName] };
      },

      afterRender: function() {
        this._checked.c.subscribe(updateIsChecked, this);
        this.on("change:IsChecked", updateKoProperty, this);
        this.on("change:Value", updateKoProperty, this);

        if (this.IsChecked) {
          this._checked.c(this.Value);
        }
      }
    };
  }, "RadioButton");
})(Sitecore.Speak);