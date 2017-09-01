define([], function () {
  var action = function (context, args) {
    alert(args.text);
  };

  return action;
});
