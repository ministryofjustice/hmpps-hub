(function (speak) {
  speak.component({
    name: "HyperlinkButton",
    initialized: function () {
      $(this.el).on("click", this, this.handler);
    },
    handler: function (e) {
      var control = e.data;
      if (e && !control.IsEnabled) {
        e.preventDefault();
      }

      var invocation = control.Click;
      if (!control.IsEnabled) {
        return;
      }

      if (control.Click) {
        var i = invocation.indexOf(":");
        if (i <= 0) {
          throw "Invocation is malformed (missing 'handler:')";
        }

        speak.module("pipelines").get("Invoke").execute({
          control: control,
          app: control.app,
          handler: invocation.substr(0, i),
          target: invocation.substr(i + 1)
        });
        
        e.preventDefault();
      }

      control.trigger("click", control.el);
    }
  });
})(Sitecore.Speak);