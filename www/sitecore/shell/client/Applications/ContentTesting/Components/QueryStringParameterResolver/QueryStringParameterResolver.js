define(["sitecore"], function (Sitecore) {
  var model = Sitecore.Definitions.Models.ControlModel.extend({
    initialize: function (options) {
      this._super();
      this.set("value","");
      this.on("change:parameterName", this.resolveParameter, this);
    },
    
    resolveParameter: function()
    {
      var params = Sitecore.Helpers.url.getQueryParameters(window.location.href);
      var parameterName = this.get("parameterName");
      var value =  params[parameterName];
      this.set("value", value);
    }
  });

  var view = Sitecore.Definitions.Views.ControlView.extend({
    initialize: function (options) {
      //this._super();
      
      this.model.set("parameterName", this.$el.attr("data-sc-parameter") || null);
    }
  });

  Sitecore.Factories.createComponent("QueryStringParameterResolver", model, view, ".sc-QueryStringParameterResolver");
});
