(function(speak) {
  // This function is called in context of the component.
  var subscribe = function() {
    var target = this.app[this.TargetControl];
    if (!target) {
      console.log("Control \"" + this.TargetControl + "\" not found");
      return;
    }

    target.on(this.Trigger, evaluate, this);
  };

  // This function is called in context of the component.
  var evaluate = function() {
    var context = {
      app: this.app,
      args: arguments,
      trigger: this.Trigger
    };

    require([this.RuleUrl], function(f) {
      f(context);
    });
  };

  speak.component({
    name: "Rule",
    initialized: function() {
      if (this.Trigger && this.Trigger.substr(0, 7) === "window:") {
        speak.on(this.Trigger, evaluate, this);
      }
      else if (this.TargetControl) {
        this.app.on("app:loaded", subscribe, this);
      }
      else {
        this.app.on(this.Trigger, evaluate, this);
      }

      if (this.LoadMode === "immediately") {
        require([this.RuleUrl], function() { });
      }
    }
  });
})(Sitecore.Speak);