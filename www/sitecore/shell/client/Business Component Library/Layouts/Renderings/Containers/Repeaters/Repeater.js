/// <reference path="../../../../../../assets/lib/dist/sitecore.js" />
require.config({
  paths: {
    "Scrollbar": "/sitecore/shell/client/Speak/Assets/lib/ui/1.1/behaviors/Scrollbar",
  },
  shim: {
    'Scrollbar': { deps: ['sitecore'] }
  }
});

define(["sitecore", "Scrollbar"], function(Sitecore) {

  Sitecore.Factories.createBaseComponent({
    name: "Repeater",
    base: "ControlBase",
    selector: ".sc-repeater",
    attributes: [
      { name: "contentDatabase", defaultValue: null, value: "$el.data:sc-contentdatabase" },
      { name: "items", defaultValue: [] },
      { name: "isLoading", defaultValue: false },
      { name: "queryStringSuffix", defaultValue: "", value: "$el.data:sc-querystringsuffix" },
      { name: "template", defaultValue: "<div class='sc-repeater-container' />" }
    ],
    extendModel: {
      add: function(item) {
        this.trigger("addItem", item);
      },
      remove: function(app) {
        this.trigger("removeItem", app);
      },
      getItem: function(app) {
        var rndrObject = this.RenderedItems.find(function(renderedObj) {
          return renderedObj.get("app") === app;
        });

        return rndrObject.get("item");
      }
    },
    initialize: function() {
      this.model.on("change:items", this.renderItems, this);
      this.model.on("addItem", this.add, this);
      this.model.on("removeItem", this.remove, this);
      this.model.RenderedItems = new Backbone.Collection();
      this.tmstp = 0;
      this.$container = $(this.model.get("template"));
      this.$container.appendTo(this.$el);
    },
    add: function(item) {
      var items = this.model.get("items");
      if (items == null) {
        items = [];
      }

      items.push(item);
      this.renderItem(item);
    },
    remove: function(app) {
      var renderedItem = this.model.RenderedItems.find(function(renderedApp) {
        return renderedApp.get("app") === app;
      });

      var items = this.model.get("items");
      var index = items.indexOf(renderedItem.get("item"));
      if (index > -1) {
        items.splice(index, 1);
      }

      renderedItem.get("app").ScopedEl.empty();
      renderedItem.get("app").destroy();

      this.model.RenderedItems.remove(renderedItem);
    },
    renderItem: function(item, callback, $el, tmstp) {
      var self = this;

      $el = ($el) ? $el : this.$el;

      this.model.set("isLoading", true);

      var ajaxOptions = {
        beforeSend: function(jqXHR, settings) {
          addUrlParameters(self.model, settings);
        }
      };

      this.app.insertRendering(item.itemId, { $el: $el, database: item.$database, ajax: ajaxOptions }, function(app) {
        //self.model.get("items").push(item);
        self.model.RenderedItems.add({ item: item, app: app });
        self.model.set("isLoading", false);

        // Updates each parent with scrollbar behavior
        self.$el.parents(".mCustomScrollbar").mCustomScrollbar("update");

        // execute callback function 
        if (typeof (callback) != "undefined") {
          callback.apply(self, [tmstp]);
        }
      });
    },
    renderItems: function() {
      var items = this.model.get("items");
      if (items != null) {
        this.reset();
        this.$container = $(this.model.get("template"));
        this.$container.appendTo(this.$el);

        var index = 0;
        var count = items.length;
        this.tmstp++;

        var itemReceived = function(tmstp) {
          // cancel the request queue if other items was requested
          if (this.tmstp == tmstp) {
            index++;
            if (index < count) {
              this.renderItem(items[index], itemReceived, this.$container, tmstp);
            }
          }
        };

        if (count > 0) {
          this.renderItem(items[index], itemReceived, this.$container, this.tmstp);
        }
      }
    },
    reset: function() {
      this.model.RenderedItems.each(function(app) {
        app.destroy();
      });
      this.model.RenderedItems.reset();
      this.$el.empty();
    }
  });

  function addUrlParameters(model, settings) {
    var contentDatabase = model.get("contentDatabase");
    if (contentDatabase) {
      settings.url += "&sc_content=" + contentDatabase;
    }

    var suffix = model.get("queryStringSuffix");
    if (suffix) {
      settings.url += "&" + suffix;
    }

    return true;
  }
});
