define(["sitecore"], function (_sc) {
  _sc.TestOptions = Backbone.Model.extend({
    initialize: function (options) {

    },

    toJSONString: function () {
      return JSON.stringify(this);
    }

  });

});
