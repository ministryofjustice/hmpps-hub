define(['knockout'], function(ko) {
  ko.bindingHandlers.enterKey = {
    init: function(el, valueAccessor, allBindings, data, context) {
      var wrapper = function(data, event) {
        if (event.keyCode === 13) {
          valueAccessor().call(this, data, event, context);
        }
      };

      ko.applyBindingsToNode(el, { event: { keyup: wrapper } }, context);
    }
  };
  
  ko.bindingHandlers.backspaceKey = {
    init: function (el, valueAccessor, allBindings, data, context) {
      var wrapper = function (data, event) {
        if (event.keyCode === 8) {
          return valueAccessor().call(this, data, event, context);
        }

        return true;
      };

      ko.applyBindingsToNode(el, { event: { keydown: wrapper } }, context);
    }
  };
  
  ko.bindingHandlers.stopBubble = {
    init: function (element) {
      ko.utils.registerEventHandler(element, 'click', function (event) {
        event.cancelBubble = true;
        if (event.stopPropagation) {
          event.stopPropagation();
        }
      });
    }
  };
});