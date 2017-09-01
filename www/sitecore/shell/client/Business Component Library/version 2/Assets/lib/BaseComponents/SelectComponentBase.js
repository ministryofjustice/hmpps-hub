define(["sitecore"], function (speak) {
  return speak.component({
    name: "SelectControlBase",
    
    resetSelection: function() {
      this.SelectedItem = null;
      this.SelectedItemId = null;
      this.SelectedValue = null;
    },

    initialized: function () {
       
      if (this.DynamicData.length > 0) {
        this.SelectedItem = this.DynamicData[0];
        this.SelectedValue = this.DynamicData[0][this.ValueFieldName];
      }
      this.on("change:SelectedOptions", this.onChangeSelectedOptions, this);
      this.on("change:DynamicData", this.onChangeItems, this);
      this.on("change:SelectedItem", this.onChangeSelectedItem, this);
      this.on("change:SelectedValue", this.onChangeSelectedValue, this);
      this.on("change:SelectedItems", this.onChangeSelectedItems, this);
    },

    onChangeSelectedOptions: function() {
      this.SelectedValue = this.SelectedOptions[0];     
      this.SelectedItem = this.getItemFromValue(this.SelectedValue);     
      this.SelectedItemId = this.SelectedValue;     
      this.SelectedItems = [this.SelectedItem];
    },

    onChangeItems: function () {      
      this.rebind(this.DynamicData, null, null, this.DisplayFieldName, this.ValueFieldName);
    },

    onChangeSelectedItem: function() {
      this.rebind(this.DynamicData, this.SelectedItem, null, this.DisplayFieldName, this.ValueFieldName);
    },

    onChangeSelectedValue: function() {
      this.rebind(this.DynamicData, null, this.SelectedValue, this.DisplayFieldName, this.ValueFieldName);
    },

    onChangeSelectedItems: function() {
      this.rebind(this.DynamicData, this.SelectedItems[0], null, this.DisplayFieldName, this.ValueFieldName);
    },

    getItemFromValue: function(value) {
      var items = this.DynamicData;
      for (var i = 0; i < items.length; i++) {
        if (items[i][this.ValueFieldName] === value) {
          return items[i];
        }
      }
      return null;
    },
    
    getValueFieldName: function ( item ) {
      item = item[0] || item;
      return item[this.ValueFieldName];
    },

    getDisplayFieldName: function ( item ) {
        item = item[0] || item;
        return item[this.DisplayFieldName];
    },

    isPopulatedArray: function(array) {
      return (array && array.length > 0);
    },

    setSelection: function() {
      //If no items
      if (!this.isPopulatedArray(this.DynamicData)) {
        this.resetSelection();
        return;
      }
      //If selectedItem, set the selectedValue to match
      if (this.SelectedItem) {
        this.set("SelectedValue", this.SelectedItem[this.ValueFieldName], true);
      } else {
        if (!this.SelectedValue) {
          this.set("SelectedValue", this.DynamicData[0][this.ValueFieldName], true);
        }
        this.set("SelectedItem", this.getItemFromValue(this.SelectedValue), true);
      }

      //Update display and force coherence
      this.set("SelectedOptions", [this.SelectedValue], true);
      this.SelectedItemId = this.SelectedValue;
      this.set("SelectedItems", [this.SelectedItem], true);
    },

    rebind: function(items, selectedItem, selectedValue, displayFieldName, valueFieldName) {
        if (items) {
          this.set("DynamicData", items);
        }

        this.set("SelectedItem", selectedItem, true);
        this.set("SelectedValue", selectedValue, true);
        this.set("SelectedItemId", selectedValue, true);
        if (displayFieldName) {
          this.DisplayFieldName = displayFieldName;
        }

        if (valueFieldName) {
          this.ValueFieldName = valueFieldName;
        }

        if (!items && (displayFieldName || valueFieldName)) {
            this.trigger('itemsChanged');
        }

        this.setSelection();
    }
  }); 
});