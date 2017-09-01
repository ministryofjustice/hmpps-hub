(function(speak) {
  var wrapperSelector = ".sc-navigation-wrapper";
  var activeClass = "active";

  var resetNavigation = function() {
    var wrapper = $(wrapperSelector);
    if (wrapper && !wrapper.hasClass(activeClass)) {
      wrapper.addClass(activeClass);
    }
  };

  speak.component({
    name: "NavigationToggle",

    initialized: function() {
      speak.on("resetNavigation", resetNavigation);
    },

    togglePanel: function() {
      var wrapper = $(wrapperSelector);
      if (wrapper) {
        wrapper.toggleClass(activeClass);
      }
    }
  });
})(Sitecore.Speak);