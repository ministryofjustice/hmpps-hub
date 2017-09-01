define(["sitecore", "jquery", "knockout"], function (sc, $, ko) {
  "use strict";

  function ClassificationValues(data) {
    this.name = data.Name;
    this.value = data.Id;
  }

  function Classification(data) {
    var self = this;
    self.name = data.Name;
    self.fieldId = data.FieldId;
    self.selected = ko.observable();
    self.values = [];
    for (var i = 0; i < data.Values.length; i++) {
      self.values.push(new ClassificationValues(data.Values[i]));
    }
    this.selectedName = ko.computed(function () {
      for (var j = 0; j < self.values.length; j++) {
        if (self.selected() == self.values[j].value) {
          return self.values[j].name;
        }
      }

      return "";
    }, self);
  }

  var model = sc.Definitions.Models.ControlModel.extend({
    initialize: function () {
      this._super();
      this.set("items", []);
      this.set("isBusy", true);
    },
    getValue: function () {
      var returnValue = [];
      var items = this.get("items");
      for (var i in items) {
        var item = items[i];
        var selectedValue = item.selected();
        if (selectedValue) {
          returnValue.push({ FieldId: item.fieldId, Value: selectedValue });
        }
      }

      return returnValue;
    },
    setValue: function (values) {
      var items = this.get("items");

      if (values === null) {
        return;
      }

      for (var i = 0; i < values.length; i++) {
        var value = values[i];
        for (var j = 0; j < items.length; j++) {
          var item = items[j];
          if (item.fieldId === value.FieldId) {
            item.selected(value.Value);
          }
        }
      }
    },
    refresh: function(data) {
      var self = this;
      var onChangedFn = function () {
        self.trigger("changed", self.getValue());
      };
      var items = [];
      for (var i = 0; i < data.length; i++) {
        var classificationObject = new Classification(data[i]);
        classificationObject.selected.subscribe(onChangedFn);
        items.push(classificationObject);
      }
      self.set("items", items);
      self.set("isBusy", false);
    }
  });

  var view = sc.Definitions.Views.ControlView.extend({});

  return sc.Factories.createComponent("CampaignClassifications", model, view, ".sc-campaignClassifications");
});