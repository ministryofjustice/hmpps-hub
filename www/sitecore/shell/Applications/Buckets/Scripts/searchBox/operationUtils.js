/* knockout is used in this file only as an utility object. It could be replaced by underscore in a future */

define(['knockout'], function (ko) {

  var operations = [
    { name: 'should', symbol: '' },
    { name: 'not', symbol: '-' },
    { name: 'must', symbol: '+' }
  ];

  return {
    getSymbolOfOperation: function(operation) {
      return (ko.utils.arrayFirst(operations, function(x) { return x.name == operation; }) || operations[0]).symbol;
    },

    getNameOfOperation: function(operation) {
      return (ko.utils.arrayFirst(operations, function(x) { return x.symbol == operation; }) || operations[0]).name;
    },

    toggleOperationDefault: function(currentOperation) {
      var i = operations.length;
      while (i-- && operations[i].name != currentOperation) {
      }

      !~i && (i = 0);
      return operations[(i + 1) % operations.length].name;
    },

    extractOperation: function(value) {
      var operationSymbol = (value.match(/^[\+-]/) || [''])[0];
      return ko.utils.arrayFirst(operations, function (x) { return x.symbol == operationSymbol; });
    },
    
    extractSortOperation: function (value, defaulOperation) {
      return this.splitValueAndSortOperation(value, defaulOperation).sortOperation;
    },
    
    splitValueAndSortOperation: function (value, defaultOperation) {
      defaultOperation == undefined && (defaultOperation = null);
      
      value = (value || '').trim();
      var matches = value.match(/(.+)\[(asc|desc)\]$/) || [, value, defaultOperation];
      
      return {
        value: matches[1].trim(),
        sortOperation: matches[2]
      };
    }
  };
});