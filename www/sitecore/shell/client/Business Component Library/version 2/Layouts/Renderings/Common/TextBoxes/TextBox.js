(function(Speak) {

  Speak.component([], function () {
    var onUserInput = function () {
      if (this.TriggerTextChangeOnKeyUp) {
        this.Value = this.el.value;
      }
    }

    return {      
      initialized: function() {
        this.el.addEventListener("keyup", _.debounce(onUserInput, 400).bind(this));
      }
    }
  }, "TextBox");
})(Sitecore.Speak);