define([], function () {
  var action = function (context, args) {
    var $el = $(args.selector);
    if ($el.length == 0) {
      console.debug("Element " + args.name + " not found");
      return;
    }

    if (args.value.toLowerCase() == "false") {
      $el.hide();
    } else {
      $el.show();
    }
  };

  return action;
});
