define(["sitecore"], function(sc)
{
  sc.Factories.createBaseComponent({
    name: "DataRepeater",
    base: "ControlBase",
    selector: ".sc-data-repeater",
    attributes: [
      { name: "itemId", defaultValue: null, value: "$el.data:sc-itemid" },
      { name: "database", defaultValue: "core", value: "$el.data:sc-database" },
      { name: "isBusy", defaultValue: false },
      { name: "renderedApps", defaultValue: null }
    ],

    extendModel: {
      appendData: function(elements)
      {
        this.processingData = this.processingData.concat(elements);
      },

      getNextData: function()
      {
        return this.processingData.shift();
      },

      checkBusy: function()
      {
        if(this.processingData.length < 1)
        {
          this.set("isBusy", false);
        }
      }
    },

    initialize: function()
    {
      this.model.processingData = [];
      this.model.set("renderedApps", new window.Backbone.Collection());
    },

    reset: function()
    {
      var renderedApps = this.model.get("renderedApps");
      renderedApps.each(function(app)
      {
        app.destroy();
      });

      renderedApps.reset();
      this.$el.empty();
    },

    addData: function(elements)
    {
      if(!elements || elements.length < 1)
      {
        return;
      }

      this.model.set("isBusy", true);

      this.model.appendData(elements);
      _.each(elements, this.renderItem, this);
    },

    renderItem: function()
    {
      var self = this;

      var options = {
        $el: this.$el,
        database: this.model.get("database"),
        ajax: {
          error: function()
          {
            self.model.getNextData();
            self.model.checkBusy();
          }
        }
      };

      this.app.insertRendering(this.model.get("itemId"), options, function(app)
      {
        if(app.ScopedEl.length < 1)
        {
          return;
        }

        var data = self.model.getNextData();
        self.model.get("renderedApps").add(app);
        self.model.trigger("subAppLoaded", { app: app, data: data });

        self.model.checkBusy();
      });
    }
  });
});