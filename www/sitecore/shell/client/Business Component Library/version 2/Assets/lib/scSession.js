(function () {
  define("bclSession", ["bclSelection"], function() {
    var isBrowser = typeof window !== "undefined",
      root = isBrowser ? window : global,
      speak = root.Sitecore.Speak,
      logout = function(callback) {
        var ajaxSettings = {
          url: "/sitecore/shell/api/sitecore/Authentication/Logout?sc_database=master",
          type: "POST",
          data: {},
          cache: false
        };

        var token = speak.utils.security.antiForgery.getAntiForgeryToken();
        ajaxSettings.data[token.formKey] = token.value;
        $.ajax(ajaxSettings).complete(callback);
      },
      unauthorized = function() {
        logout(function() {
          window.top.location.reload(true);
        });
      };


    if (isBrowser && Sitecore) {
      var _module = {
        logout: logout,
        unauthorized: unauthorized
      };
      Sitecore.Speak.module("bclSession", _module);
      return _module;
    } else {
      exports = module.exports = Session;
    }
  });

})();
