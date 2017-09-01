define(["sitecore"], function(Sitecore) {
  var beforeSendCallback, successCallback, errorCallback, completeCallback;
  Sitecore.Factories.createBaseComponent({
    name: "LoadOnDemandPanel",
    base: "ControlBase",
    selector: ".sc-load-on-demand-panel",
    attributes: [
      { name: "itemId", defaultValue: null, value: "$el.data:sc-itemid" },
      { name: "database", defaultValue: "core", value: "$el.data:sc-database" },
      { name: "contentDatabase", defaultValue: null, value: "$el.data:sc-contentdatabase" },
      { name: "loadOnVisible", defaultValue: false, value: "$el.data:sc-loadonvisible" },
      { name: "triggerLoad", defaultValue: "", value: "$el.data:sc-triggerload" },
      { name: "isLoaded", defaultValue: false }
    ],
    extendModel: {
      load: function() {
        this.trigger("load", this.app);
      },

      refresh: function() {
        this.trigger("refresh", this.app);
      },

      destroy: function() {
        this.trigger("destroy", this.app);
      },

      beforeSend: function(callback) {
        beforeSendCallback = callback;
      },

      success: function(callback) {
        successCallback = callback;
      },

      error: function(callback) {
        errorCallback = callback;
      },

      complete: function(callback) {
        completeCallback = callback;
      }

    },

    initialize: function() {
      var self = this;

      this.model.beforeSend(function(jqXHR, settings) {
        var contentDb = self.model.get("contentDatabase");
        if (contentDb) {
          settings.url += "&sc_content=" + contentDb;
        }

        return true;
      });

      if (this.model.get("triggerLoad") !== "") {
        this.app.on(this.model.get("triggerLoad"), this.load, this);
      }

      this.model.on("load", this.load, this);
      this.model.on("refresh", this.refresh, this);

      if (this.model.get("loadOnVisible")) {
        this.loadOnVisibleHandler();
      }
      this.model.on("change:loadOnVisible", this.loadOnVisibleHandler, this);
    },

    load: function(app) {
      if (!this.model.get("isLoaded")) {
        this.renderContent(app);
      }
    },

    refresh: function(app) {
      this.$el.empty();
      this.model.set("isLoaded", false);
      this.load();
    },

    renderContent: function() {
      var app = this.app,
          model = this.model,
          self = this,
          jqxhr,
          ajaxOptions = {};
      if (beforeSendCallback) {
        _.extend(ajaxOptions, { "beforeSend": beforeSendCallback });
      }
      if (successCallback) {
        _.extend(ajaxOptions, { "success": successCallback });
      }
      if (errorCallback) {
        _.extend(ajaxOptions, { "error": errorCallback });
      }
      if (completeCallback) {
        _.extend(ajaxOptions, { "complete": completeCallback });
      }

      jqxhr = this.app.insertRendering(
        model.get("itemId"),
        {
          $el: this.$el,
          database: model.get("database"),
          ajax: ajaxOptions
        },
        function(app) {
          self.model.set("isLoaded", true);
        });

    },

    loadOnVisibleHandler: function() {
      var self = this;
      if (this.model.get("isVisible")) {
        this.model.load();
      }
      this.model.on("change:isVisible", function() {
        if (self.model.get("isVisible")) {
          self.model.load();
        }
      }, self);
    },

    reset: function() {
      this.app.destroy();
      this.$el.empty();
    }
  });
});
