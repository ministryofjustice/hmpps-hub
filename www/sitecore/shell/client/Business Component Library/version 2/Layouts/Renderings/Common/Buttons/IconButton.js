(function (speak) {
  speak.component({
    name: "IconButton",
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
    }
  });
})(Sitecore.Speak);