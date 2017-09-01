(function (speak) {
  var wrapperSelector = ".sc-navigation-wrapper"; 
  var activeClass = "info-active";

  var resetNavigation = function () {
    var wrapper = $(wrapperSelector);
    if (wrapper && !wrapper.hasClass(activeClass)) {
      wrapper.addClass(activeClass);
    }
  };

  var toggleActiveClass = function() {
    var wrapper = $(wrapperSelector);
    if (wrapper) {
      wrapper.toggleClass(activeClass, this.IsOpen);
    }
  };

  speak.component({
    name: "ContextToggle",

    initialized: function () {
      speak.on("resetNavigation", resetNavigation);
      this.on("change:IsOpen", toggleActiveClass, this);
      toggleActiveClass.call(this);
    },

    togglePanel: function () {
      this.IsOpen = !this.IsOpen;
    }
  });
})(Sitecore.Speak);