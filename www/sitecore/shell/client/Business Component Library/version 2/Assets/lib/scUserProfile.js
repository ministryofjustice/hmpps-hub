(function() {

  define("bclUserProfile",
    ["bclSession"],
    function() {
      var isBrowser = typeof window !== "undefined",
        root = isBrowser ? window : global,
        speak = root.Sitecore.Speak,
        defaultParams = {
          userProfileApiUrl: "/sitecore/shell/api/sitecore/Settings/",
          userProfileApiUpdateMethod: "SetUserProfileKey"
        },
        completed = function(result, done) {
          if ((result.statusCode && result.statusCode === 401) || (result.status && result.status === 401)) {
            var session = speak.module("bclSession");
            session.unauthorized();
            return;
          }
          if (done)
            done(result);
        },
        saveState = function(userProfileKey, userProfileState, done) {

          if (!userProfileKey) {
            throw new Error("Please provide a valid userProfileKey");
          }

          if (userProfileState && !speak.utils.is.an.object(userProfileState)) {
            throw new
              Error("Please provide a valid state to the UserProfileState property - the state must be an object");
          }

          var value = JSON.stringify(userProfileState),
            token = speak.utils.security.antiForgery.getAntiForgeryToken();

          var ajaxOptions = {
            url: defaultParams.userProfileApiUrl + defaultParams.userProfileApiUpdateMethod,
            type: "POST",
            dataType: "text",
            data: {
              key: userProfileKey,
              value: value
            }
          };

          ajaxOptions.data[token.formKey] = token.value;

          $.ajax(ajaxOptions)
            .done(function(result) { completed(result, done); })
            .fail(function(result) { completed(result); });

        },
        parseState = function (state) {
          var response = {};
          try {
            response = JSON.parse(state);
          } catch (e) {
            console.error("Error occurred during parsing the UserProfile state:", state);
          }
          return response;
        };

      if (isBrowser && Sitecore) {
        Sitecore.Speak.module("bclUserProfile",
        {
          saveState: saveState,
          parseState: parseState
        });
      } else {
        exports = module.exports = UserProfile;
      }
    });
})();
