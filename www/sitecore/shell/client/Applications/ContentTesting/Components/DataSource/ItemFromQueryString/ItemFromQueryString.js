define(["sitecore"], function (Sitecore) {
  var model = Sitecore.Definitions.Models.ControlModel.extend({
    initialize: function (options) {
      this._super();

      var params = Sitecore.Helpers.url.getQueryParameters(window.location.href);
      this.set("language", params.la);
      this.set("itemId", params.id);
      this.set("version", params.vs);
    }
  });

  var view = Sitecore.Definitions.Views.ControlView.extend({
    initialize: function (options) {
      this._super();
    }
  });

  Sitecore.Factories.createComponent("ItemFromQueryString", model, view, "script[type='x-sitecore-itemfromquerystring']");
});
