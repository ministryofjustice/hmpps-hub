(function (Speak) {

  function load() {
    var component = this;
    if (!component.IsLoaded) {
      renderContent(component);
    }
  };

  function refresh() {
    var component = this;
    component.IsLoaded = false;
    component.load();
  };

  function renderContent(component) {
    var ajaxOptions = {};

    if (component.BeforeSend) {
      _.extend(ajaxOptions, { "beforeSend": component.BeforeSend });
    }
    if (component.Success) {
      _.extend(ajaxOptions, { "success": component.Success });
    }
    if (component.Error) {
      _.extend(ajaxOptions, { "error": component.Error });
    }
    if (component.Complete) {
      _.extend(ajaxOptions, { "complete": component.Complete });
    }

    var subAppKey = component.SubAppKey || component.id + "app";

    component.app.replaceRendering(
      component.StaticData,
      {
        el: component.el,
        contentDabase: Speak.Context.current().contentDatabase,
        database: component.Database,
        ajax: ajaxOptions,
        name: subAppKey,
        parameter: component.QueryParameters
      },
      function (app) {
        component.IsLoaded = true;
        component.trigger("loaded", app[subAppKey]);
      });
  };

  function loadOnVisibleHandler() {
    var component = this;

    if (component.IsVisible) {
      component.load();
    }

    component.on("change:IsVisible", function () {
      if (component.IsVisible) {
        component.load();
      }
    }, this);
  };

  Speak.component({
    name: "LoadOnDemandPanel",

    load: function () {
      this.trigger("load", this);
    },

    refresh: function () {
      this.trigger("refresh", this);
    },

    reset: function () {
      this.app.remove();
      $(this.el).empty();
    },

    destroy: function () {
      this.trigger("destroy", this.app);
    },

    initialize: function () {
      this.defineProperty("SubAppKey", "");
      this.defineProperty("IsLoaded", false);
      this.defineProperty("BeforeSend", null);
      this.defineProperty("Success", null);
      this.defineProperty("Complete", null);
      this.defineProperty("Error", null);
    },

    initialized: function () {
      if (this.Trigger !== "") {
        this.app.on(this.Trigger, load, this);
      }

      this.on("load", load, this);
      this.on("refresh", refresh, this);

      if (this.LoadOnVisible) {
        loadOnVisibleHandler.call(this);
      }
      this.on("change:LoadOnVisible", loadOnVisibleHandler, this);
    }
  });

})(Sitecore.Speak);