define(["sitecore"], function (Sitecore) {
  var App = Backbone.Model.extend({
    cookiePrefix: "scExperienceAnalytics_",
    illegalCharacters: /[/\\&%#?]/i,

    attributes: {
      "dateRange": null,
      "subsite": null
    },

    getSubsite: function() {
      var subsite = "all",
        subsiteFromUrl = this.getSubsiteFromUrl(),
        sessionSubsite = this.getSessionValue("Subsite");

      if (subsiteFromUrl) {
        subsite = subsiteFromUrl;
      } else if (sessionSubsite) {
        subsite = sessionSubsite;
      }

      return subsite;
    },

    textTemplate: function(template, data) {
      if (template && data) {
        _.each(data, function (value, variableKey) {
          var regexp = new RegExp("\{\{\\s*" + variableKey + "\\s*\}\}", "g");
          template = template.replace(regexp, value);
        });
      }

      return template;
    },

    resolveTemplatesVariables: function (templates, variables) {
      _.each(templates, _.bind(function (template, key) {
        templates[key] = this.textTemplate(template, variables);
      }, this));

      return templates;
    },

    setSubsite: function(value) {
      value = value || "all";
      this.setSessionValue("Subsite", value);

      this.updateUrl({
        subsite: value
      });

      this.set("subsite", value);
    },

    getSubsiteFromUrl: function() {
      var hash = window.location.hash.substring(1),
        params = Sitecore.Helpers.url.getQueryParameters(hash);

      return params.subsite;
    },

    convertDateFormat: function(date) {
      return $.datepicker.formatDate("dd-mm-yy", $.datepicker.parseDate("d M ''y", date));
    },

    reConvertDateFormat: function(date) {
      return $.datepicker.formatDate("d M ''y", $.datepicker.parseDate("dd-mm-yy", date));
    },

    updateDateRangeInSession: function(from, to) {
      this.setSessionValue("FromDate", this.convertDateFormat(from));
      this.setSessionValue("ToDate", this.convertDateFormat(to));
    },

    updateDateRangeInUrl: function(from, to) {
      var hashObject = {
        dateFrom: this.convertDateFormat(from),
        dateTo: this.convertDateFormat(to)
      };

      this.updateUrl(hashObject);
    },

    setDateRange: function (from, to, persist) {
      if (persist) {
        this.updateDateRangeInSession(from, to);
      }

      this.updateDateRangeInUrl(from, to);

      this.set("dateRange", {
        dateFrom: from,
        dateTo: to
      });
    },

    getDateRange: function() {
      var dateRangeFromUrl = this.getDateRangeFromUrl(),
        sessionFromDate = this.getSessionValue("FromDate"),
        sessionToDate = this.getSessionValue("ToDate"),
        dateObject = null;

      if (dateRangeFromUrl.dateFrom && dateRangeFromUrl.dateTo) {
        if (this.validateDate(dateRangeFromUrl.dateFrom) && this.validateDate(dateRangeFromUrl.dateTo)) {
          dateObject = dateRangeFromUrl;
          dateObject.dateFrom = this.reConvertDateFormat(dateObject.dateFrom);
          dateObject.dateTo = this.reConvertDateFormat(dateObject.dateTo);
        } else {
          return undefined;
        }
      } else if (sessionFromDate && sessionToDate) {
        dateObject = {
          dateFrom: this.reConvertDateFormat(sessionFromDate),
          dateTo: this.reConvertDateFormat(sessionToDate)
        };
      }

      return dateObject;
    },

    validateDate: function(dateString) {
      return dateString.match(/^\d{2}[\-]\d{2}[\-]\d{4}$/);
    },

    getDateRangeFromUrl: function() {
      var hash = window.location.hash.substring(1),
        params = Sitecore.Helpers.url.getQueryParameters(hash);

      return {
        dateFrom: params.dateFrom,
        dateTo: params.dateTo
      };
    },

    updateUrl: function (hashObject) {
      var params = this.removeEmptyParams(window.location.hash.substring(1));
      params = params.replace(new RegExp("^&"), "");
      params = (params.length > 0) ? "?" + params : "";
      params = Sitecore.Helpers.url.addQueryParameters(params, hashObject).replace("?", "");

      if (window.history.replaceState) {
        window.history.replaceState({ state: null }, null, window.location.pathname + window.location.search + "#" + params);
      } else {
        window.location.hash = params;
      }
    },

    removeEmptyParams: function(url) {
      var params = Sitecore.Helpers.url.getQueryParameters(url);

      for (var p in params) {
        if (params[p] === "")
          url = url.replace(new RegExp("&?" + p + "="), "");
      }

      return url;
    },
    
    getCookie: function(name) {
      var cookie = document.cookie,
        cookieArray = cookie.split(";");

      for (var i = 0; i < cookieArray.length; i++) {
        var cookieItem = cookieArray[i].trim().split("=");

        if (cookieItem[0] === name) {
          return cookieItem[1];
        }
      }

      return null;
    },

    getSessionValue: function (name) {
      return this.getCookie(this.cookiePrefix + name);
    },

    // TODO Make method private and insure that it will be executed just once on the start of application
    setGlobalAjaxSettings: function () {
      var ajaxSettings = {},
        langFromCookies = this.getCookie("shell#lang");

      // Needed to improve translation mechanism on the server
      if (langFromCookies) {
        ajaxSettings.headers = { "Accept-Language": langFromCookies };
      }
      
      $.ajaxSetup(ajaxSettings);
    },

    setSessionValue: function(name, value) {
      document.cookie = this.cookiePrefix + name + "=" + value + ";path=/;";
    },

    /**
     * Return first invalid string which matches with validator
     * @param {array|string} list - array of strings which should be validated
     * @param {RegExp} validator - regexp to find invalid sub-strings or characters
     * @return {string|null} returns first invalid sub-strings or character if found or null if invalid character is not found
     */
    findInvalidString: function (list, validator) {
      if (typeof list === 'string') {
        list = [list];
      }

      var invalidString = _.find(list, function (str) {
        return validator.test(str);
      });

      if (invalidString) {
        return invalidString.match(validator)[0];
      } else {
        return null;
      }
    }
  });

  var app = new App;

  app.setGlobalAjaxSettings();

  return app;

});