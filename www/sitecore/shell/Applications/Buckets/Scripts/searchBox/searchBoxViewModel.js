define(['knockout', 'jquery-ui', 'searchBox/getSearchFilters', 'searchBox/FilterViewModel'], function(ko, $, getSearchFilters, FilterViewModel) {
  return function() {
    var self = this;

    this.allSearchFilters = getSearchFilters();

    this.allSearchFilterNames = $.map(self.allSearchFilters, function(filter) { return filter.name; });

    this.userRawInput = ko.observable();

    this.filters = ko.observableArray();

    this.userRawInputHasFocus = ko.observable(false);

    this.baseItemIconPath = window.SC ? window.SC.baseItemIconPath : '';

    // refers to search functionality in ItemBucket.js 
    this.startSearchCallback = null;

    // automatically add a filter when user has typed ':'
    ko.computed(function() {
      var userRawInput = self.userRawInput();
      if (userRawInput && !~userRawInput.indexOf(';') && !~userRawInput.indexOf('&') && (userRawInput.lastIndexOf(':') == userRawInput.length - 1)) {
        self.addFilterFromUserRawInput();
      }
    });

    this.addFilter = function(filter) {
      self.filters.push(filter);
    };

    var filterWasSelectedByEnterKey = false;
    this.onFilterSelect = function (evt, ui) {
      self.userRawInput(ui.item.value);
      filterWasSelectedByEnterKey = evt.which == 13;
    };

    this.addFilterFromUserRawInput = function() {
      var userRawInput = self.userRawInput();
      if (userRawInput) {
        var newFilters = parseMultipleFilters(userRawInput, false, self.allSearchFilters);
        ko.utils.arrayPushAll(this.filters, newFilters);
        self.userRawInput('');
        if (newFilters.length == 1 && !newFilters[0].isValid()) {
          newFilters[0].startEdit();
          return;
        }
      }
    };

    this.removeFilter = function(filter) {
      !filter.readOnly && self.filters.remove(filter);
      self.userRawInputHasFocus(true);
    };

    this.removeAllFilters = function () {
      self.userRawInput('');
      self.filters.remove(function(filter) { return !filter.readOnly; });
      setTimeout(function() {
        self.userRawInputHasFocus(true);
      }, 50);
    };

    this.performSearch = function () {
      $('.ui-autocomplete-input').autocomplete('close');
      if (filterWasSelectedByEnterKey) {
        self.userRawInput(self.userRawInput() + ':');
        filterWasSelectedByEnterKey = false;
        return;
      } else {
        self.addFilterFromUserRawInput();
      }

      self.startSearchCallback && self.startSearchCallback(self.allFiltersInObjectArray());
    };
    
    this.allFiltersInString = ko.computed(function() {
      var filtersInStrings = self.filters().map(function(filter) { return filter.toString(); });
      var result = filtersInStrings.filter(function(x) { return x; }).join(';');
      return result;
    });

    this.allFiltersInObjectArray = function() {
      var result = self.filters().filter(function(filter) {
        return filter.isValid();
      }).map(function (filter) {
        return {
          type: filter.filterType.name,
          value: filter.serverValue(),
          operation: filter.operation(),       
        };
      });

      return result;
    };
    
    this.couldSearchBeCleared = ko.computed(function() {
      return !self.filters().filter(function (filter) { return !filter.readOnly; }).length && !self.userRawInput();
    });
    
    this.isSearchEmpty = ko.computed(function () {
      return !self.filters().length && !self.userRawInput();
    });

    this.onBackspaceKeyInFilter = function (filter) {
      if (!filter.value()) {
        self.removeFilter(filter);
        return false;
      }

      return true;
    };

    var defaultFilters = parseMultipleFilters(window.filterForSearch, false, self.allSearchFilters);
    ko.utils.arrayPushAll(this.filters, defaultFilters);

    var persistentFilters = parseMultipleFilters(window.filterForAllSearch, true, self.allSearchFilters);
    ko.utils.arrayPushAll(this.filters, persistentFilters);
  };

  function parseMultipleFilters(filtersInString, isReadOnly, allSearchFilters) {
    filtersInString = filtersInString || '';
    var separator = filtersInString.indexOf(';') > -1 ? ';' : '&';
    var filters = filtersInString.split(separator).filter(function (x) { return x; });
    var result = filters.map(function(filterInString) {
      return new FilterViewModel(filterInString, allSearchFilters, isReadOnly);
    });

    return result;
  }
});