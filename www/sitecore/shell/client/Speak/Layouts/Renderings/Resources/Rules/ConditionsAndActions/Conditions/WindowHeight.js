define([], function () {
  var condition = function (context, args) {
    var height = context.args[1];

    var min = parseInt(args.min, 10);
    var max = parseInt(args.max, 10);

    return height >= min && height < max;
  };

  return condition;
});
