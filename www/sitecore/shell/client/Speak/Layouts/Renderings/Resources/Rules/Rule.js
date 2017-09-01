define(["sitecore"], function (Sitecore) {
  var model = Sitecore.Definitions.Models.ComponentModel.extend({
    initialize: function (options) {
      this._super();
    }
  });

  var view = Sitecore.Definitions.Views.ComponentView.extend({
    initialize: function (options) {
      this._super();

      if (options.isDocumenting) return;

      this.script = this.$el.attr("data-sc-rulescript");
      this.trigger = this.$el.attr("data-sc-trigger");
      this.controlName = this.$el.attr("data-sc-control");
      this.loadMode = this.$el.attr("data-sc-loadmode");

      if (this.trigger && this.trigger.substr(0, 7) == "window:") {
        _sc.on(this.trigger, this.evaluate, this);
      }
      else if (this.controlName != null) {
        this.app.on("app:loaded", this.subscribe, this);
      }
      else {
        this.app.on(this.trigger, this.evaluate, this);
      }

      if (this.loadMode == "immediately") {
        require([this.script], function (f) {
        });
      }
    },
    
    subscribe: function () {
      var control = this.app[this.controlName];
      if (control == null) {
        console.log("Control \"" + this.controlName + "\" not found");
        return;
      }

      control.on(this.trigger, this.evaluate, this);
    },
    
    evaluate: function () {
      var context = {
        app: this.app,
        args: arguments,
        trigger: this.trigger
      };

      require([this.script], function (f) {
        f(context);
      });
    }
  });

  Sitecore.Factories.createComponent("Rule", model, view, "script[data-sc-component=Rule]");
});
