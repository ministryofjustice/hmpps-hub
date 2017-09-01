(function () {
  define(function () {
    return {
      getCookies: function() {
        return document.cookie;
      },
      getCookieByName: function(name) {
        var cookies = this.getCookies();
        var value = "; " + cookies;
        var parts = value.split("; " + name + "=");
        if (parts.length == 2) {
          return parts.pop().split(";").shift();
        }
        return null;
      }
    };
  });
})();