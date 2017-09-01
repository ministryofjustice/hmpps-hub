Sitecore.Speak.D3.models.canvas = function () {
  "use strict";

  var options = {
    width: 200,
    height: 200,
    $el: null
  };

  var svg,
    originalWidth,
    canvasSelector,
    elementSelector,
    dispatcher,
    resize = function () { };

  function clearCanvas() {
    d3.select(canvasSelector)
      .remove();
  };

  function canvasResize() {
    options.width = originalWidth || options.$el.width();
    svg.attr("viewBox", "0 0 " + options.width + " " + options.height);
    dispatcher["resize"]();
    resize();
  };

  function canvas() {
    elementSelector = "[data-sc-id=" + options.$el.attr("data-sc-id") + "]";
    canvasSelector = elementSelector + " svg";
    clearCanvas();
    
    var container = d3.select(elementSelector);
    svg = container.append("svg")
      .attr("class", "chart")
      .attr("width", "100%")
      .attr("height", options.height)
      .attr("viewBox", "0 0 " + options.width + " " + options.height);

    dispatcher = Sitecore.Speak.D3.models.dispatcher().add("resize");

    d3.select(window).on("resize", _.throttle(canvasResize, 200));
    //d3.select(window).on("resize", canvasResize);

    return d3.rebind(svg, dispatcher, "on");
};

  canvas.resize = function (value) {
    if (!arguments.length) {
      return resize;
    }
    resize = value;    
    return canvas;
  }

  canvas.options = function (value) {
    if (!arguments.length) {
      return options;
    }
    options = value;
    originalWidth = value.width;
    options.width = originalWidth || options.$el.width();
    return canvas;
  }

  return canvas;
};
