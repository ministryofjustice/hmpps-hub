define(["sitecore", "/-/speak/v1/ExperienceEditor/ExperienceEditor.js"], function (Sitecore, ExperienceEditor) {
  return {
    state: null,

    hasActiveTest: function (eeContext) {
      if (this.state != null) {
        return this.state;
      }

      var self = this;

      ExperienceEditor.PipelinesUtil.generateRequestProcessor("Optimization.ActiveItemTest", function (response) {
        self.state = response.responseValue.value;
      }, eeContext.currentContext).execute(eeContext);

      return this.state;
    }
  };
});