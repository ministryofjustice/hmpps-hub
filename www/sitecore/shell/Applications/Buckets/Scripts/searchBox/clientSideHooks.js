/* 
For more information about ClientSideHook object look at Sitecore.Buckets.Client.Spec/spec/clientSideHooksSpec.js 
*/

define(['searchBox/operationUtils'], function (operationUtils) {

  return [
    createClientSideHook(
      'normal',
      function (value) {
        if (this.parse(value)) {
          return createDisplayValues(value.trim());
        } else {
          return createDisplayValues(window.scTranslations.emptyValue);
        }
      },
      function(operation, filterName, filterValue) {
        return filterValue
          ? operationUtils.getSymbolOfOperation(operation) + filterName + ':' + filterValue.trim()
          : '';
      },
      function(value) {
        return value || null;
      }
    ),
    createClientSideHook(
      'id',
      function(value) {
        var displayValues;
        if (this.parse(value)) {
          var pipePosition = value.lastIndexOf('|');
          !~pipePosition && (pipePosition = value.length); // if value is totally GUID, then displayValue will be GUID
          displayValues = createDisplayValues(value.slice(0, pipePosition).trim());
        } else {
          displayValues = createDisplayValues(value ? window.scTranslations.invalidIdFormat : window.scTranslations.emptyValue);
        }

        return displayValues;
      },
      function(operation, filterName, filterValue) {
        var id = this.parse(filterValue);
        var result;
        if (id) {
          result = operationUtils.getSymbolOfOperation(operation) + filterName + ':' + filterValue.trim().replace(/\s*\|\s*/, '|').replace(/^\|/, '');
        } else {
          result = '';
        }
        
        return result;
      },
      function (value) {
        if (!value) {
          return null;
        }

        var pipePosition = value.lastIndexOf('|');
        var id = value.slice(pipePosition + 1).trim();

        var guidRegExp = new RegExp('^((\{[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}\})|([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})|([0-9a-fA-F]{32}))$'); // http://goo.gl/XEM7E9
        var isValid = guidRegExp.test(id);
        return isValid
          ? id
          : null;
      }
    ),
    createClientSideHook(
      'date',
      function(value) {
        var date = this.parse(value);
        var displayValues;
        if (date) {
          displayValues = createDisplayValues(date);
        } else {
          displayValues = createDisplayValues(value ? window.scTranslations.invalidDateFormat : window.scTranslations.emptyValue);
        }

        return displayValues;
      },
      function (operation, filterName, filterValue) {
        var date = this.parse(filterValue);
        return date
          ? operationUtils.getSymbolOfOperation(operation) + filterName + ':' + filterValue.trim()
          : '';
      },
      function(value) {
        var date = new Date(value || '');
        var isValid = Object.prototype.toString.call(date) === "[object Date]" && !isNaN(date.getTime());
        return isValid
          ? date.toLocaleDateString()
          : null;
      }
    ),
    createClientSideHook(
      'sort',
      function (value) {
        var displayValues = createDisplayValues(this.parse(value) || window.scTranslations.emptyValue);
        return displayValues;
      },
      function (operation, filterName, filterValue) {
        var value = this.parse(filterValue);
        return value
          ? filterName + ':' + value + '[' + (operation || 'asc') + ']'
          : '';
      },
      function(value) {
        return operationUtils.splitValueAndSortOperation(value).value;
      },
      function(currentOperation) {
        return currentOperation == 'desc'
          ? 'asc'
          : 'desc';
      }
    ),
    createClientSideHook(
      'custom',
      function (value) {
        var parsedKeyValue = this.parse(value);
        var displayValues;
        if (parsedKeyValue && parsedKeyValue.value) {
          displayValues = createDisplayValues(parsedKeyValue.value, parsedKeyValue.key);
        } else {
          displayValues = createDisplayValues(value ? window.scTranslations.invalidCustomValueFormat : window.scTranslations.emptyValue);
        }
        
        return displayValues;
      },
      function (operation, filterName, filterValue) {
        var parsedKeyValue = this.parse(filterValue);
        return parsedKeyValue
          ? operationUtils.getSymbolOfOperation(operation) + filterName + ':' + parsedKeyValue.key + '|' + parsedKeyValue.value
          : '';
      },
      function(value) {
        value = (value || '').trim();
        var pipePosition = value.indexOf('|');
        return ~pipePosition && (pipePosition != value.length - 1) && (pipePosition != 0)
          ? { key: value.slice(0, pipePosition).trim(), value: value.slice(pipePosition + 1).trim() }
          : null;
      }
    )
  ];
  
  function createClientSideHook(name, getDisplayValues, toString, parse, toggleOperation) {
    parse = parse || function (x) { return x; };
    toggleOperation = toggleOperation || operationUtils.toggleOperationDefault;

    return {
      name: name,
      getDisplayValues: getDisplayValues,
      toString: toString,
      parse: parse,
      toggleOperation: toggleOperation
    };
  }

  function createDisplayValues(displayValue, displayName) {
    return {
      displayName: displayName || null, // if !!displayName === false, then a calling code must use filter name as displayName
      displayValue: displayValue
    };
  }
});