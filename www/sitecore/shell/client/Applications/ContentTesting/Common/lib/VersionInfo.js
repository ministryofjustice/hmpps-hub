define([
  "/-/speak/v1/contenttesting/RequestUtil.js"],
  function (requestUtil) {
  var actionUrlLatestVersion = "/sitecore/shell/api/ct/ItemInfo/GetLatestVersionNumber";
  var actionUrlTestCandidateVersion = "/sitecore/shell/api/ct/ItemInfo/GetVersionTestCandidateVersionNumber";
  var actionUrlAddVersion = "/sitecore/shell/api/ct/ItemInfo/AddVersion";
  var actionUrlPreviousVersion = "/sitecore/shell/api/ct/ItemInfo/GetPreviousVersionNumber";
  var actionUrlLanguageVersion = "/sitecore/shell/api/ct/ItemInfo/GetLanguageVersions";
  var actionUrlLanguageVersionInfo = "/sitecore/shell/api/ct/ItemInfo/GetLanguageVersionInfo";

  var getVersionRequest = function (id, url, callback) {
    var parsedId, parsedLanguage;

    if (_.isObject(id)) {
      parsedId = id.id;
      parsedLanguage = id.lang;
    }
    else {
      parsedId = id;
    }

    var ajaxOptions = {
      cache: false,
      url: _sc.Helpers.url.addQueryParameters(url, {id: parsedId, language: parsedLanguage || ""}),
      context: this,
      success: function (data) {
        if (data == null) {
          callback(parsedId, null, null, null);
        } else {
          callback(parsedId, data.VersionNumber, data.Revision, data.Language);
        }
      }
    };

    requestUtil.performRequest(ajaxOptions);
  };

   var getPreviousVersion = function (id, url, callback) {
    var parsedId, parsedLanguage;

    if (_.isObject(id)) {
      parsedId = id.id;
      parsedLanguage = id.lang;
    }
    else {
      parsedId = id;
    }

    var ajaxOptions = {
      cache: false,
      url: _sc.Helpers.url.addQueryParameters(url, {id: parsedId, language: parsedLanguage || ""}),
      context: this,
      success: function (data) {
        if (data == null) {
          callback(parsedId, null, null, null);
        } else {
          callback(parsedId, data);
        }
      }
    };

    requestUtil.performRequest(ajaxOptions);
  };
  return {
    getLatestVersionNumber: function(id, callback) {
      getVersionRequest(id, actionUrlLatestVersion, callback);
    },

    getTestCandidateVersionNumber: function(id, callback) {
      getVersionRequest(id, actionUrlTestCandidateVersion, callback);
    },

    addNewVersion: function (id, callback) {
      getVersionRequest(id, actionUrlAddVersion, callback);
    },
	
	getPreviousVersionNumber: function(id, callback) {
      getPreviousVersion(id, actionUrlPreviousVersion, callback);
	},
	getLanguageVersions: function (id, callback) {
	    var ajaxOptions = {
	        cache: false,
	        url: _sc.Helpers.url.addQueryParameters(actionUrlLanguageVersion, { id: id }),
	        context: this,
	        success: function (data) {
	            callback(data);
	        }
	    };
	    requestUtil.performRequest(ajaxOptions);
	},
	getLanguageVersionInfo: function (id, languageVersion, callback) {
	    var ajaxOptions = {
	        cache: false,
	        url: _sc.Helpers.url.addQueryParameters(actionUrlLanguageVersionInfo, { id: id, language: languageVersion }),
	        context: this,
	        success: function (data) {
	            callback(data);
	        }
	    };
	    requestUtil.performRequest(ajaxOptions);
	}

  }
});