(function (speak, $, _) {
 
  speak.component(["knockout", "scSpeakObservableArray"], function (ko, observableArray) {

    function changeFacets() {
      if (this.Items != null && this.Items.length > 0) {
        return;
      }

      updateFacets(this);
    }
      
    function addFacet(component, el) {
      var selectedFacets = component.SelectedFacets.slice(0); // clone the array
      selectedFacets.push({ name: el.name, value: el.value });

      component.SelectedFacets = selectedFacets;
    }
      
    function removeFacet(component, el) {
      var selectedFacets = component.SelectedFacets;

      selectedFacets = selectedFacets.filter(function (i) {
        return !(i.name === el.name && i.value === el.value);
      }, component);

      component.SelectedFacets = selectedFacets;
    }

    function updateFacets(component) {
      var facets = component.Facets;

      facets.forEach(function (facet) {
        var f = {
          name: facet.Name,
          values: new ko.observableArray()
        };

        facet.Values.forEach(function (value) {
          var v = {
            name: facet.Name,
            displayText: value.DisplayText,
            value: value.Value,
            count: new ko.observable(value.Count),
            checked: new ko.observable(false)
          };

          v.checked.subscribe(function () {
            component.toggleFacet(v);
          });

          f.values().push(v);
        }, component);

        component.Items.push(f);

      }, component);

      component.SelectedFacets = [];
    }

    return speak.extend({}, {
      name: "ItemFilterControl",

      initialize: function () {
        this.$el = $(this.el);
        this.defineProperty("Items", new observableArray([]));
      },

      initialized: function () {
        this.Facets = [];
        this.SelectedFacets = [];
        this.on("change:Facets", changeFacets, this);
      },

      toggleFacet: function (element) {
        if (_.find(this.SelectedFacets, function (el) { return el.name === element.name && el.value === element.value; })) {
          removeFacet(this, element);
        }
        else {
          addFacet(this, element);
        }
      },

      reset: function () {
        //this.Items.reset();
        var size = this.Items.length;
        for (var idx = 0; idx < size; idx++) {
          this.Items.removeAt(0);
        }
        this.Facets = [];
        this.SelectedFacets = [];
      }

    });
  }, "ItemFilterControl");
  
})(Sitecore.Speak, jQuery, _);
