(function (Speak) {
   define("bclImageHelper", [], function () {
    var ImageHelper = function (a) {
      return {
        getParameters: function (str) {
          if (!str) {
            return undefined;
          }

          var regex = new RegExp('(alt|height|hspace|mediaid|vspace|width)=\"([^"]*)', "g");
          var params = {};
          var match;

          while (match = regex.exec(str)) {
            params[match[1]] = match[2];
          };

          return params;
        },

        getUrl: function (str, database) {
          if (!str || !database) {
            return undefined;
          }

          var parameters = this.getParameters(str);

          if (Object.keys(parameters).length === 0) {
            return undefined;
          }

          var url = "/sitecore/shell/~/media/" + Speak.Helpers.id.toShortId(parameters.mediaid) + ".ashx?h=" + parameters.height + "&w=" + parameters.width + "&db=" + database;

          return url;
        },

        getValue: function (str, attr) {
          if (!str || !attr) {
            return undefined;
          }

          var parameters = this.getParameters(str);

          return Object.keys(parameters).length === 0 ? undefined : parameters[attr];
        },

        getId: function (str) {
          return this.getValue(str, "mediaid");
        },

        getAlt: function (str) {
          return this.getValue(str, "alt");
        },

        getHeight: function (str) {
          return this.getValue(str, "height");
        },

        getWidth: function (str) {
          return this.getValue(str, "width");
        }

      }
    }

    return new ImageHelper;
  });
})(Sitecore.Speak);