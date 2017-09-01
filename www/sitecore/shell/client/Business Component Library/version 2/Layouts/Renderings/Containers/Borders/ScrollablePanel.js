(function (Speak) {

  Speak.component(["bclScrollable"], function (Scrollable) {

    return Speak.extend({}, Scrollable.prototype);
      
  }, "ScrollablePanel");

})(Sitecore.Speak);