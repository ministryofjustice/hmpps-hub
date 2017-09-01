define(function () {
  return {
    getLocation: function () {
      return window.location;
    },
    getHistory: function () {
      return window.history;
    },
    getParameterFromLocationSearchByName: function (name) {
      return this.getParameterByName(this.getLocation().search, name);
    },
    getParameterByName: function (search, name) {
      name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
      var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
          results = regex.exec(search);
      return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    },
    appendQueryParameter: function (name, value) {
      var location = this.getLocation();
      var history = this.getHistory();

      var fullPath;
      if (location.search == "") {
        fullPath = location.pathname + "?" + name + "=" + value;
      } else {
        fullPath = location.pathname + location.search + "&" + name + "=" + value;
      }
      history.replaceState({ "canBeAnything": true }, "", fullPath);
    },
    removeQueryParameter: function (name) {
      var location = this.getLocation();

      var urlparts = location.href.split('?');
      if (urlparts.length < 2) {
        return;
      }

      var prefix = encodeURIComponent(name) + '=';
      var parameters = urlparts[1].split(/[&;]/g);

      for (var i = parameters.length; i-- > 0;) {
        if (parameters[i].lastIndexOf(prefix, 0) !== -1) {
          parameters.splice(i, 1);
        }
      }

      var fullPath = parameters.length == 0 ? urlparts[0] : urlparts[0] + '?' + parameters.join('&');

      var history = this.getHistory();
      history.replaceState({ "canBeAnything": true }, "", fullPath);
    }
  };
});