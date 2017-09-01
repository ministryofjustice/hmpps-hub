define(["sitecore", "/-/speak/v1/FXM/ComponentSettings.js"], function (_sc, componentSettings) {
  var model = _sc.Definitions.Models.ControlModel.extend({
    initialize: function (options) {
      this._super();

      this.set("items", []);
      this.set("queryString", '');
      this.set("requestMethod", '');
      this.set("baseUrl", '');
      this.set("isBusy", false);
      this.set("hasItems", false);
      this.set("pendingRequests", 0);
      this.set(componentSettings.urlParameter, "");

      this.on("change:pendingRequests", this.setBusyState, this);
      this.on("change:items", this.setItemsState, this);
      this.on("change:queryString", this.setUrl, this);
      this.on("change:baseUrl", this.setUrl, this);
    },

    setBusyState: function () {
      var pendingRequests = this.get("pendingRequests");
      if (pendingRequests < 0) { pendingRequests = 0; }
      this.set("isBusy", pendingRequests > 0);
    },

    setItemsState: function () {
      var items = this.get("items");
      this.set("hasItems", items.length > 0);
    },

    setUrl: function () {
      var base = this.get("baseUrl");
      var qs = this.get("queryString");
      this.set(componentSettings.urlParameter, base + "?" + qs);
    },

    refresh: function () {
      this.set("pendingRequests", this.get("pendingRequests") + 1);

      var self = this;

      $.ajax({
        url: this.get(componentSettings.urlParameter),
        type: this.get("requestMethod"),
        headers: {
          "X-RequestVerificationToken": jQuery('[name=__RequestVerificationToken]').val(),
          "X-Requested-With": "XMLHttpRequest"
        }
      }).fail(function (data) {
        self.error(data);
      }).done(function (data) {
        self.completed(data);
      });
    },

    error: function (data) {
      console.error(data);

      this.set("items", []);
      this.set("pendingRequests", 0);
    },

    completed: function (data) {
      this.set("items", data);

      this.set("pendingRequests", this.get("pendingRequests") - 1);

      _sc.trigger('completed:' + this.id);
    }
  });

  var view = _sc.Definitions.Views.ControlView.extend({
    initialize: function (options) {
      this._super();

      this.model.set("queryString", this.$el.data("sc-querystring"));
      this.model.set("requestMethod", this.$el.data("sc-requestmethod"));
      this.model.set("baseUrl", this.$el.data("sc-baseurl"));
      this.model.set("id", this.$el.data("sc-id"));
    }
  });

  _sc.Factories.createComponent("FxmDataSource", model, view, ".FxmDataSource");
});