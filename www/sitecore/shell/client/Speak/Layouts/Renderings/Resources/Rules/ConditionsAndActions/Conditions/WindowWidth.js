define([], function () {
  var condition = function (context, args) {
 // console.log("width args:",args);
    var width = context.args[0];
	if (!_.isNumber(width)){
		width=$(window).width();
	}
    var min = parseInt(args.min, 10);
    var max = parseInt(args.max, 10);
//console.log("width results:")
//console.log(width >= min && width < max)
    return width >= min && width < max;
  };

  return condition;
});
