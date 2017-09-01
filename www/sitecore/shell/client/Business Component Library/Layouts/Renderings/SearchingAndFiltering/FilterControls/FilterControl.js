/// <reference path="../../../../../../assets/lib/dist/sitecore.js" />
/// <reference path="../../../../../../assets/vendors/underscore/underscore-min.js" />
/// <reference path="../../../../../../assets/vendors/Backbone/backbone-min.js" />
/// <reference path="../../../../../../assets/vendors/KnockOut/knockout-2.1.0.js" />

define(["sitecore", "knockout"], function (_sc, ko) {
  var model = _sc.Definitions.Models.ControlModel.extend({
    initialize: function () {
      this._super();

      this.set("facets", []);
      this.set("selectedFacets", []);

      this.on("change:facets", this.changeFacets, this);

      this.viewModel.facetList = new ko.observableArray(null);
      this.updating = false;
    },

    changeFacets: function () {
      if (!this.updating) {
        this.set("selectedFacets", []);
        this.viewModel.facetList(null);
      }

      this.updating = false;

      if (this.viewModel.facetList() != null && this.viewModel.facetList().length > 0) {
        // this.updateCounts();
        return;
      }

      this.updateFacets();
    },
    /*
    updateCounts: function () {
      var facets = this.get("facets");
      var facetList = this.viewModel.facetList();

      _.each(facetList, function (facet) {
        var newFacet = _.find(facets, function (i) {
          return i.Name === facet.name;
        });

        if (newFacet == null) {
          _.each(facet.values(), function (i) {
            i.count(0);
          });
          return;
        }

        _.each(facet.values(), function (value) {
          var newValue = _.find(newFacet.Values, function (i) {
            return i.DisplayText == value.displayText;
          });

          value.count(newValue != null ? newValue.Count : 0);
        });
      });
    },
    */
    updateFacets: function () {
      var facets = this.get("facets");
      var facetList = [];
      var self = this;

      _.each(facets, function (facet) {
        var f = {
          name: facet.Name,
          values: new ko.observableArray()
        };

        _.each(facet.Values, function (value) {
          var v = {
            name: facet.Name,
            displayText: value.DisplayText,
            value: value.Value,
            count: new ko.observable(value.Count),
            checked: new ko.observable(false)
          };

          v.checked.subscribe(function (newValue) {
            self.toggleFacet(newValue, v);
          });

          f.values().push(v);
        }, this);

        facetList.push(f);
        
      }, this);      

      this.viewModel.facetList(facetList);
      this.set("selectedFacets", []);
    },

    toggleFacet: function (value, element) {
      if (value) {
        this.addFacet(element.name, element.value);
      }
      else {
        this.removeFacet(element.name, element.value);
      }
    },

    addFacet: function (name, value) {
      var selectedFacets = this.get("selectedFacets").slice(0); // clone the array
      selectedFacets.push({ name: name, value: value });

      this.updating = true;
      this.set("selectedFacets", selectedFacets);
    },

    removeFacet: function (name, value) {
      var selectedFacets = this.get("selectedFacets");

      selectedFacets = _.reject(selectedFacets, function (i) {
        return i.name === name && i.value === value;
      }, this);

      this.updating = true;
      this.set("selectedFacets", selectedFacets);
    }
  });

  var view = _sc.Definitions.Views.ControlView.extend({
    initialize: function () {
      this._super();
    }
  });

  _sc.Factories.createComponent("FilterControl", model, view, ".sc-filtercontrol");
});