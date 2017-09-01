(function (speak) {
  speak.component({
    name: "ToggleButton",
    toggle: function () {
      this.IsOpen = !this.IsOpen;
      this.handler();
    },
    handler: function () {
      var invocation = this.Click;

      if (!this.IsEnabled) {
        return;
      }

      if (this.Click) {
        var i = invocation.indexOf(":");
        if (i <= 0) {
          throw "Invocation is malformed (missing 'handler:')";
        }

        speak.module("pipelines").get("Invoke").execute({
          control: this,
          app: this.app,
          handler: invocation.substr(0, i),
          target: invocation.substr(i + 1)
        });
      }

      this.trigger("click", this.el);
    },
    open: function () {
      this.IsOpen = true;
    },
    close: function (e) {
      if (e && e.target) {
        e.preventDefault();
      }
      this.IsOpen = false;
      this.model.set("isOpen", false);
    }
  });
})(Sitecore.Speak);