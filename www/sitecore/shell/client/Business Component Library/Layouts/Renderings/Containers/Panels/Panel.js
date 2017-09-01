/// <reference path="../../../../../../assets/lib/dist/sitecore.js" />

define(["sitecore"], function (_sc) {
  var model = _sc.Definitions.Models.BlockModel.extend(
    {
      initialize: function (options)
      {
        this._super();
      }
    });

    var view = _sc.Definitions.Views.BlockView.extend(
    {
      initialize: function()
      {
        this._super();
      }
    });

  _sc.Factories.createComponent("Panel", model, view, ".sc-panel");
});