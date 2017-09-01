require.config({
  paths: {
    select2: "/sitecore/shell/client/Speak/Assets/lib/ui/1.1/deps/select2/select2",
  }
});

define(["sitecore", "select2"], function(sc) {
  var onSelectionChange = function(event) {
    this.model.set("selectedValue", event.val);
  };

  var updateOptions = function() {
    var items = this.model.get("items");
    if (!items) {
      this.model.set("options", null);
      return;
    }

    this.model.set("options", getOptionsFromItems(this, items));
    updateSelectedItem.call(this, this, this.model.get("selectedValue"));
  };

  var updateSelectedValue = function(model, newItem) {
    var newValue = newItem ? this.getValue(newItem) : null;
    if (newValue === this.model.get("selectedValue")) {
      return;
    }

    this.model.set("selectedValue", newValue);
  };

  var updateSelectedItem = function(sender, newValue) {
    if (_.isNull(newValue) || _.isUndefined(newValue)) {
      this.model.set("selectedItem", null);
      this.$el.find("select").select2("val", null);
      return;
    }

    var selectedItem = findSelectedItem(this.model, newValue);
    if (!selectedItem) {
      this.model.set("selectedValue", null);
      return;
    }

    this.model.set("selectedItem", selectedItem);
    this.$el.find("select").select2("val", newValue);
  };

  var getOptionsFromItems = function(viewModel, items) {
    if (!viewModel.model.get("groupFieldName")) {
      return items;
    }

    var groups = _.groupBy(items, function(item) {
      return viewModel.getGroupName(item);
    }, viewModel);

    return _.map(groups, function(group, key) {
      return { groupName: key, optionItems: group };
    });
  };

  var findSelectedItem = function(model, value) {
    var items = model.get("items");
    if (!items) {
      return null;
    }

    var selectedItem = model.get("selectedItem");
    if (!selectedItem || model.viewModel.getValue(selectedItem) !== value) {
      selectedItem = _.find(items, function(item) { return model.viewModel.getValue(item) === value; });
    }

    return selectedItem;
  };

  var getField = function(viewModel, item, fieldName) {
    return item[viewModel.model.get(fieldName)];
  };

  sc.Factories.createBaseComponent({
    name: "AdvancedComboBox",
    base: "InputBase",
    selector: ".sc-advancedcombobox",

    attributes: [
      { name: "items", defaultValue: [], value: "$el.data:sc-items" },
      { name: "selectedItem", defaultValue: null, value: "$el.data:sc-selecteditem" },
      { name: "selectedValue", defaultValue: null, value: "$el.data:sc-selectedvalue" },
      { name: "valueFieldName", value: "$el.data:sc-valuefieldname" },
      { name: "displayFieldName", value: "$el.data:sc-displayfieldname" },
      { name: "groupFieldName", value: "$el.data:sc-groupfieldname" },
      { name: "options", defaultValue: [] }
    ],

    initialize: function() {
      this._super();

      this.model.on("change:items", updateOptions, this);
      this.model.on("change:selectedItem", updateSelectedValue, this);
      this.model.on("change:selectedValue", updateSelectedItem, this);

      this.$el.find("select")
        .change($.proxy(onSelectionChange, this))
        .select2({ formatNoMatches: this.$el.data("sc-text-nomatches") })
        .removeClass("hide");
    },

    getValue: function(item) {
      return getField(this, item, "valueFieldName");
    },

    getGroupName: function(item) {
      return getField(this, item, "groupFieldName");
    },

    getDisplayName: function(item) {
      return getField(this, item, "displayFieldName");
    }
  });
});