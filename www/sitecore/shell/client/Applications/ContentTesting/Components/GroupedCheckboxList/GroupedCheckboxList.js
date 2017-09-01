define(["sitecore"], function (Sitecore) {
  Sitecore.Factories.createBaseComponent({
    name: "GroupedCheckboxList",
    base: "ControlBase",
    selector: ".sc-GroupedCheckboxList",
    attributes: [
      { name: "items", value: "$el.data:sc-items" },
      { name: "selectedIds", defaultValue: [] }
    ],

    // testing options for unit-tests
    setTestingOptions: function (options) {
      this.$el = options.$el;
      this.model = options.model;
    },

    events: {
      "click input": "toggle"
    },

    toggle: function () {
      // todo: add/remove event source only
      this.updateSelected();
    },

    updateSelected: function () {
      var checkedCtrls = this.$el.find("input:checked");
      this.model.set("selectedIds", _.map(checkedCtrls, function (item) {
        return item.id;
      }));
    }
  });
});