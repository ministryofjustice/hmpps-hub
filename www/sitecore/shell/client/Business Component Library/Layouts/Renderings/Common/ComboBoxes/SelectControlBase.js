define(["sitecore"], function (_sc) {

  var selectControlBaseComponent = _sc.Factories.createBaseComponent({
    name: "SelectControlBase",
    base: "InputBase",
    selector: ".sc-SelectControlBase",

    attributes: [
      { name: "items", defaultValue: [], value: "$el.data:sc-items" },
      { name: "selectedItem", defaultValue: null, value: "$el.data:sc-selecteditem" },
      { name: "selectedValue", value: "$el.data:sc-selectedvalue" },
      { name: "valueFieldName", value: "$el.data:sc-valuefieldname" },
      { name: "displayFieldName", value: "$el.data:sc-displayfieldname" },
      { name: "selectedOptions", value: "$el.data:sc-selectedoptions" },
      // deprecated
      { name: "selectedItems", defaultValue: [], value: "$el.data:sc-selecteditems" },
      { name: "selectedItemId", defaultValue: null, value: "$el.data:sc-selecteditemid" }
    ],

    extendModel: {
      addItem: function (item) {
        var items = this.get("items");

        if (items) {
          items.push(item);
        } else {
          items = [item];
        }
        this.setItems(items);
      },

      setItems: function (items) {
        this.unset("items", { silent: true });
        this.set("items", items);
      },

      resetSelection: function() {
        this.set("selectedItem", null);
        this.set("selectedItemId", null);
        this.set("selectedValue", null);
      }
    },

    isRebinding: false,

    initialize: function (options) {
      this.addEventHandlers();
    },

    addEventHandlers: function () {

      this.model.on("change:selectedOptions", this.onChangeSelectedOptions, this);
      this.model.on("change:items", this.onChangeItems, this);
      this.model.on("change:selectedItem", this.onChangeSelectedItem, this);
      this.model.on("change:selectedValue", this.onChangeSelectedValue, this);
      this.model.on("change:selectedItems", this.onChangeSelectedItems, this);
    },

    onChangeSelectedOptions: function() {
      //User clicks different option
      this.isRebinding = true;
      this.model.set("selectedValue", this.model.get("selectedOptions")[0]);
      this.model.set("selectedItem", this.getItemFromValue(this.model.get("selectedValue")));
      this.model.set("selectedItemId", this.model.get("selectedValue"));
      this.model.set("selectedItems", [this.model.get("selectedItem")]);
      this.isRebinding = false;
    },

    onChangeItems: function () {
        this.rebind(this.model.get("items"), null, null, this.model.get("displayFieldName"), this.model.get("valueFieldName"));
    },

    onChangeSelectedItem: function() {
        this.rebind(this.model.get("items"), this.model.get("selectedItem"), null, this.model.get("displayFieldName"), this.model.get("valueFieldName"));
    },

    onChangeSelectedValue: function() {
        this.rebind(this.model.get("items"), null, this.model.get("selectedValue"), this.model.get("displayFieldName"), this.model.get("valueFieldName"));
    },

    onChangeSelectedItems: function () {
        this.rebind(this.model.get("items"), this.model.get("selectedItems")[0], null, this.model.get("displayFieldName"), this.model.get("valueFieldName"));
    },

    getItemFromValue: function (value) {
      var items = this.model.get("items");
      for (var i = 0; i < items.length; i++) {
        if (items[i][this.model.get("valueFieldName")] === value) {
          return items[i];
        }
      }
      return null;
    },
    // It's impossible to simply observe changes of valueFieldName and displayFieldName
    // TODO: replace "getValueFieldName" and "getDisplayFieldName" with ko Computed Observables
    getValueFieldName: function (item) {
      return item[this.model.get("valueFieldName")];
    },

    getDisplayFieldName: function (item) {
      return item[this.model.get("displayFieldName")];
    },

    isPopulatedArray: function (array) {
      return (array && array.length > 0);
    },

    setSelection: function () {
      //If no items
      if (!this.isPopulatedArray(this.model.get("items"))) {
        this.model.resetSelection();
        return;
      }
      //If selectedItem, set the selectedValue to match
      if (this.model.get("selectedItem")) {
        this.model.set("selectedValue", this.model.get("selectedItem")[this.model.get("valueFieldName")]);
      } else {
        if (!this.model.get("selectedValue")) {
          this.model.set("selectedValue", this.model.get("items")[0][this.model.get("valueFieldName")]);
        }
        this.model.set("selectedItem", this.getItemFromValue(this.model.get("selectedValue")));
      }
      //Update display and force coherence
      this.model.set("selectedOptions", [this.model.get("selectedValue")]);
      this.model.set("selectedItemId", this.model.get("selectedValue"));
      this.model.set("selectedItems", [this.model.get("selectedItem")]);
    },

    rebind: function (items, selectedItem, selectedValue, displayFieldName, valueFieldName) {
      if (!this.isRebinding) {
        this.isRebinding = true;
        if (items) {
          this.model.set("items", items);
        }

        this.model.set("selectedItem", selectedItem);
        this.model.set("selectedValue", selectedValue);
        this.model.set("selectedItemId", selectedValue);

        if (displayFieldName) {
          this.model.set("displayFieldName", displayFieldName);
        }
        if (valueFieldName) {
          this.model.set("valueFieldName", valueFieldName);
        }
        this.setSelection();
        this.isRebinding = false;
      }
    }
 });

  return selectControlBaseComponent;
});
