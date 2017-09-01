define('searchBox/FilterViewModel', ['knockout', 'jquery-noconflict', 'searchBox/operationUtils'], function (ko, $, operationUtils) {

  return function(filterInString, allSearchFilters, readOnly) {
    var self = this;
    var parsedFilter = parseFilter(filterInString, allSearchFilters);

    // { name, iconPath, webMethod, controlType, clientSideHook }
    this.filterType = parsedFilter.filterType;

    // possible values: 'should', 'not', 'must' - for regular filters; 'should' - for "debug" filter; 'asc', 'desc' - for filters with client side hook 'sort' 
    this.operation = ko.observable(parsedFilter.operation);

    this.value = ko.observable(parsedFilter.value);

    this.displayName = ko.observable();
    
    this.displayValue = ko.observable();
    
    this.editing = ko.observable(false);

    this.serverValue = function() {
      var parsedValue = self.filterType.clientSideHook.parse(self.value());
      if (self.filterType.clientSideHook.name == 'date' && parsedValue) {
        return self.value();
      }
      
      return (parsedValue + '' === parsedValue) || !parsedValue
        ? parsedValue
        : parsedValue.key + '|' + parsedValue.value;
    };

    // observe the 'value' and 'editing' state to update 'displayName' and 'displayValue'
    ko.computed(function() {
      var value = self.value();
      var displayValues = self.filterType.clientSideHook.getDisplayValues(value);
      self.displayName(self.editing() ? self.filterType.name : (displayValues.displayName || self.filterType.name));

      if (self.filterType.controlType.name != 'check box') {
        self.displayValue(displayValues.displayValue);
      } else {
        self.displayValue(~['yes', 'true', ''].indexOf(value) ? window.scTranslations.yes : window.scTranslations.no);
      }
    });

    if (this.filterType.clientSideHook.name == 'sort') {
      // observe the 'value' to update 'operation' 
      ko.computed(function() {
        var operation = operationUtils.extractSortOperation(self.value());
        operation && self.operation(operation);
      });

      // observe the 'operation' to update 'value' if necessary 
      ko.computed(function() {
        var operation = self.operation();
        var valueAndSortOperation = operationUtils.splitValueAndSortOperation(self.value.peek());
        if (valueAndSortOperation.sortOperation && valueAndSortOperation.sortOperation != operation) {
          self.value(valueAndSortOperation.value + '[' + operation + ']');
        }
      });
    }

    this.iconPath = ko.computed(function() {
      return getIconPath(self.filterType.iconPath, self.operation());
    });

    this.toString = ko.computed(function() {
      return self.filterType.clientSideHook.toString(self.operation(), self.filterType.name, self.value());
    });

    this.isValid = ko.computed(function() {
      return !!self.filterType.clientSideHook.parse(self.value());
    });

    this.readOnly = !!readOnly;

    this.startEdit = function() {
      if (!self.readOnly) {
        self.editing(true);
      }
    };

    this.endEdit = function() {
      if (self.isValid()) {
        self.editing(false);
        return true;
      }

      return false;
    };

    this.toggleOperation = function() {
      if (self.readOnly || self.filterType.name.toLowerCase() == 'debug') {
        return;
      }

      var newOperation = self.filterType.clientSideHook.toggleOperation(self.operation());
      self.operation(newOperation);
    };

    this.setCursorToEnd = function(inputElement) {
      var tmp = inputElement.value();
      inputElement.value('');
      inputElement.value(tmp);
    };

    // It stores jQuery object of '<div class="display-name" ... ></div>'
    this.$displayNameElement = null;

    // I have no idea how to write correct HTML/CSS for filter, so here is a hack
    this.getValueMaxWidth = function(element) {
      // dependencies
      self.displayValue();
      self.editing();

      self.$displayNameElement || (self.$displayNameElement = $(element).prev().prev());

      var maxFilterWidth = 430;
      var correction = 75; // width of a filter without Value and Display Name
      var result = maxFilterWidth - correction - self.$displayNameElement.width() + 'px';
      return result;
    };

    // It makes results in autocomplete for ID-based filters more beautiful
    this.onAfterRender = function(elements) {
      if (self.filterType.clientSideHook.name == 'id' && self.filterType.controlType.name == 'auto suggest list') {
        $(elements).filter('.raw-value').autocomplete().data('ui-autocomplete')._renderItem = function(ul, item) {
          var result;
          if (item.id && item.path && item.name) {
            result = $('<li title="' + item.path + '">')
              .append('<a><span class="name">' + item.name + '</span><div class="path"> ' + item.path + '</div></a>')
              .appendTo(ul);
          } else {
            var id = self.filterType.clientSideHook.parse(item.value);
            var displayValue = self.filterType.clientSideHook.getDisplayValues(item.value).displayValue;
            result = $('<li>')
              .append('<a><span class="name">' + displayValue + '</span><span class="id">' + id + '</span></a>')
              .appendTo(ul);
          }

          return result;
        };
      }
    };
  };

  function parseFilter(filterInString, allSearchFilters) {
    filterInString = (filterInString || '').trim();
    var colonPosition = filterInString.indexOf(':');

    var result;
    if (~colonPosition) {
      var rawName = filterInString.slice(0, colonPosition);
      var operationObject = operationUtils.extractOperation(rawName);
      var operation = operationObject.name;

      var name = rawName.slice(operationObject.symbol.length).trim();
      var value = filterInString.slice(colonPosition + 1).trim();

      if (name == 'sort') {
        var valueAndSortOperation = operationUtils.splitValueAndSortOperation(value, 'asc');
        value = valueAndSortOperation.value;
        operation = valueAndSortOperation.sortOperation;
      }

      var filterType = getFilterType(name, allSearchFilters);

      // if we have recieved "number:123" then it will be "custom:number|123"
      if (filterType.name != name) {
        value = name + '|' + value;
        name = filterType.name;
      }

      if (name == 'debug') {
        operation = 'should';
        value = ~['yes', 'true', ''].indexOf(value.toLowerCase()) ? 'true' : 'false';
      }

      result = {
        operation: operation,
        name: name,
        value: value,
        filterType: filterType
      };
    } else
      result = {
        operation: 'should',
        name: 'text',
        value: filterInString,
        filterType: getFilterType('text', allSearchFilters)
      };

    return result;
  }

  function getFilterType(filterName, allSearchFilters) {
    var result = ko.utils.arrayFirst(allSearchFilters, function(filter) { return filter.name.toLowerCase() == filterName; })
      || ko.utils.arrayFirst(allSearchFilters, function(filter) { return filter.name.toLowerCase() == 'custom'; });
    return result;
  }

  function getIconPath(originalIconPath, operation) {
    var positionOfExtention = originalIconPath.lastIndexOf('.');
    var operationSuffix = operation == 'should' ? '' : (operation || '');
    var result = originalIconPath.slice(0, positionOfExtention) + operationSuffix + originalIconPath.slice(positionOfExtention);
    return result;
  }

});