(function(Speak) {

  Speak.component([], function () {
    var onUserInput = _.debounce(function () {
      if (this.TriggerTextChangeOnKeyUp) {        
          this.Value = inputDomEl.value;        
      }
    }, 400);
    var inputDomEl;
    return {

      initialized: function () {
        inputDomEl = this.el.querySelector("input");
        inputDomEl.addEventListener("keypress", this.keyupPressed.bind(this));
        this.on("change:Value", this.setText.bind(this));
      },

      keyupPressed: function (e) {
        if (e.keyCode === 13) {
          this.clickHandler(e);
          return;
        }

        onUserInput.call(this);
      },
      
      setText: function () {        
        if (this.MaxLength > 0) {
          this.Value = this.Value.substring(0, this.MaxLength);
        }        
      },

      clickHandler: function (e) {
        var invocation = this.Click;

        if (!this.IsEnabled) {
          e.preventDefault();
          return;
        }
        
        if (e.keyCode === 13) {
          this.Value = $(this.el).find("input").val();
        }

        if (this.Click) {
          var i = invocation.indexOf(":");
          if (i <= 0) {
            throw "Invocation is malformed (missing 'handler:')";
          }

          Speak.module("pipelines").get("Invoke").execute({
            control: this,
            app: this.app,
            handler: invocation.substr(0, i),
            target: invocation.substr(i + 1)
          });
        }

        this.trigger("click", this.el);
      },
    }
  }, "ButtonTextBox");
})(Sitecore.Speak);