/*global define,document,_*/
define(["sitecore"], function (Sitecore) {
  var model = Sitecore.Definitions.Models.ControlModel.extend({
    initialize: function () {
      this._super();

      this.set("items", null);
      this.set("maxItems", null);
      this.set("showHiddenItemCount", false);
    }
  });

  var view = Sitecore.Definitions.Views.ControlView.extend({
    initialize: function () {
      this._super();

      this.model.set("items", this.$el.attr("data-sc-items") || null);
      this.model.set("maxItems", this.$el.attr("data-sc-max-items") || null);
      this.model.set("showHiddenItemCount", this.$el.attr("data-sc-show-hidden-item-count") === "yes" || false);

      this.model.on("change:items", this.refresh, this);
    },

    refresh: function () {
      var items = this.model.get("items");
      var maxItems = Number(this.model.get("maxItems") || -1);
      var clipped = false;
      if (items != undefined && items !== null && maxItems !== -1 && items.length > maxItems) {
        items = items.slice(0, maxItems);
        clipped = true;
      }

      var ul = document.createElement("ul");
      _.each(items, function (element) {
        var li = document.createElement("li");
        var text = document.createTextNode(element);
        li.appendChild(text);
        ul.appendChild(li);
      });

      this.$el.empty();
      this.$el.append(ul);

      if (clipped && this.model.get("showHiddenItemCount")) {
        var orgLength = this.model.get("items").length;
        var count = orgLength - items.length;
        var phrase = count === 1 ? this.app.Texts.get("1 more variable") : this.app.Texts.get("{0} more variables");
        var text = document.createTextNode("+ " + phrase.replace("{0}", count));
        this.$el.append(text);
      }
    }
  });

  Sitecore.Factories.createComponent("UnorderedList", model, view, ".sc-UnorderedList");
});
