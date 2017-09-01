define(["sitecore"], function(Sitecore) {
  Sitecore.Factories.createBaseComponent({
    name: "SelectOptionsItem",
    base: "ButtonBase",
    selector: ".sc-insertItem-container",
    attributes: [
      { name: "isPressed", value: "$el.data:sc-ispressed" },
      { name: "displayName", value: "$el.data:sc-displayname" },
      { name: "itemId", value: "$el.data:sc-itemid" }
    ],
    initialize: function() {
      this._super();
      this.$el.parent().find("ul").hide();
      this.model.on("change:isEnabled", this.toggleEnable, this);
      this.model.on("change:isVisible", this.toggleVisible, this);
      this.model.on("change:isPressed", this.togglePressed, this);

      var element = this.$el;

      $("a[data-sc-itemid='" + this.model.get("itemId") + "']").mouseover(function(event) {
        element.addClass("hover");
      });

      $("a[data-sc-itemid='" + this.model.get("itemId") + "']").mouseout(function(event) {
        element.removeClass("hover");
      });
    },
    toggleEnable: function() {
      if (!this.model.get("isEnabled")) {
        this.$el.addClass("disabled");
      } else {
        this.$el.removeClass("disabled");
      }
    },
    toggleVisible: function() {
      if (!this.model.get("isVisible")) {
        this.$el.hide();
      } else {
        this.$el.show();
      }
    },
    togglePressed: function() {
      if (this.model.get("isPressed"))
        this.$el.addClass("selected");
      else {
        this.$el.removeClass("selected");
      }
    },
  });
});