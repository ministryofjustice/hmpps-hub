define(["sitecore", "/-/speak/v1/business/selectcontrolbase.js"], function (_sc, selectControlBase) {

  var multiSelectControlBaseComponent = _sc.Factories.createBaseComponent({
    name: "MultiSelectControlBase",
    base: "SelectControlBase",
    selector: ".sc-MultiSelectControlBase",

    isRebinding: false,

    attributes: selectControlBase.model.prototype._scAttrs.concat([
      { name: "multiple", value: "$el.data:sc-multiple" },
      { name: "selectedValues", defaultValue: [] , value: "$el.data:sc-selectedvalues" },
      { name: "selectedItemIds", defaultValue: [] },
      { name: "selectedItems", defaultValue: [], value: "$el.data:sc-selecteditems" }
    ]),

    extendModel: {
      resetSelection: function () {
        this._super();

        this.set("selectedItems", []);
        this.set("selectedItemIds", []);
        this.set("selectedValues", []);
      }
    },

    initialize: function () {
      this._super();
    },

    addEventHandlers: function() {
      this._super();
      this.model.on("change:selectedValues", this.onChangeSelectedValues, this);
      this.model.on("change:selectedItems", this.onChangeSelectedItems, this);
    },

    onChangeSelectedOptions: function() {
      //User clicks different option
      this.isRebinding = true;
      var selectedOptions = this.model.get("selectedOptions") || [];
      var selectedItems = [];
      for (var i = 0; i < selectedOptions.length; i++) {
        selectedItems.push(this.getItemFromValue(this.model.get("selectedOptions")[i]));
      }
      this.model.set("selectedItems", selectedItems);
      this.model.set("selectedValue", selectedOptions[0]);
      this.model.set("selectedValues", selectedOptions);
      this.model.set("selectedItem", selectedItems[0]);
      this.model.set("selectedItemId", this.model.get("selectedValue"));
      this.model.set("selectedItemIds", this.model.get("selectedValues"));
      this.isRebinding = false;
    },

    onChangeSelectedValues: function() {
      this.rebind(this.model.get("items"), null, null, this.model.get("displayFieldName"), this.model.get("valueFieldName"), null, this.model.get("selectedValues"));
    },

    onChangeSelectedItems: function () {
      this.rebind(this.model.get("items"), null, null, this.model.get("displayFieldName"), this.model.get("valueFieldName"), this.model.get("selectedItems"), null);
    },

    setSelection: function () {
      //If no items
      if (!this.isPopulatedArray(this.model.get("items"))) {
        this.model.resetSelection();
        return;
      }

      // Order of precedence: selectedItems > selectedValues > selectedItem > selectedValue

      if (!this.isPopulatedArray(this.model.get("selectedItems")) && !this.isPopulatedArray(this.model.get("selectedValues"))) {

        //If selectedItem, set the selectedValue to match
        if (this.model.get("selectedItem")) {
          this.model.set("selectedValue", this.model.get("selectedItem")[this.model.get("valueFieldName")]);
        } else {
          if (this.model.get("selectedValue")) {
            this.model.set("selectedItem", this.getItemFromValue(this.model.get("selectedValue")));
          }
        }
        // Update display and force coherence
        this.model.set("selectedItemId", this.model.get("selectedValue"));
        this.model.set("selectedValues", [this.model.get("selectedValue")]);
        this.model.set("selectedItems", [this.model.get("selectedItem")]);
        this.model.set("selectedItemIds", [this.model.get("selectedItemId")]);
        this.model.set("selectedOptions", [this.model.get("selectedValue")]);

      } else {

        // If selectedItems, set the selectedValues to match
        var selectedItems = [];
        var selectedValues = [];
        var i = 0;
        if (this.isPopulatedArray(this.model.get("selectedItems"))) {
          selectedItems = this.model.get("selectedItems");
          for (i = 0; i < selectedItems.length; i++) {
            selectedValues.push(selectedItems[i][this.model.get("valueFieldName")]);
          }
          this.model.set("selectedValues", selectedValues);
        } else {
          selectedValues = this.model.get("selectedValues");
          for (i = 0; i < selectedValues.length; i++) {
            selectedItems.push(this.getItemFromValue(selectedValues[i]));
          }
          this.model.set("selectedItems", selectedItems);
        }
        // Update display and force coherence
        this.model.set("selectedValue", this.model.get("selectedValues")[0]);
        this.model.set("selectedItem", this.model.get("selectedItems")[0]);
        this.model.set("selectedItemId", this.model.get("selectedItemIds")[0]);
        this.model.set("selectedItemIds", selectedValues);
        this.model.set("selectedOptions", this.model.get("selectedValues"));
      }
    },

    rebind: function (items, selectedItem, selectedValue, displayFieldName, valueFieldName, selectedItems, selectedValues) {
      // this._super.apply(this, arguments);
      if (!this.isRebinding) {
        this.isRebinding = true;

        if (displayFieldName) {
          this.model.set("displayFieldName", displayFieldName);
        }

        if (valueFieldName) {
          this.model.set("valueFieldName", valueFieldName);
        }

        if (items) {
          this.model.set("items", items);
        }

        this.model.set("selectedItem", selectedItem);
        this.model.set("selectedValue", selectedValue);
        this.model.set("selectedItemId", selectedValue);
        this.model.set("selectedItems", selectedItems || []);
        this.model.set("selectedValues", selectedValues || []);
        this.model.set("selectedItemIds", selectedValues || []);

        this.setSelection();
        this.isRebinding = false;
      }
    }

  });

  return multiSelectControlBaseComponent;
});