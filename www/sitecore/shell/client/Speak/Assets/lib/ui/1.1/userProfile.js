define(["sitecore"], function(sc) {
  return {
    defaultParams: {
      userProfileKeyDataAttributeName: "sc-userprofilekey",
      stateDataAttributeName: "sc-userstate",
      userProfileKeyName: "userProfileKey",
      userProfileApiUrl: "/api/sitecore/Settings/",
      userProfileApiUpdateMethod: "SetUserProfileKey"
    },
    update: function(control, state, customParams) {
      var params = {};
      _.extend(params, this.defaultParams);
      _.extend(params, customParams);
      var key = control.model.get(params.userProfileKeyName);
      var value = JSON.stringify(state);

      var ajaxOptions = {
        url: params.userProfileApiUrl + params.userProfileApiUpdateMethod,
        type: "POST",
        dataType: "text",
        data: {
          key: key,
          value: value
        }
      };

      var token = sc.Helpers.antiForgery.getAntiForgeryToken();
      ajaxOptions.data[token.formKey] = token.value;

      $.ajax(ajaxOptions);
    },
    get: function(control, callback, customParams) {
      var params = {};
      _.extend(params, this.defaultParams);
      _.extend(params, customParams);
      var userState = control.$el.data(params.stateDataAttributeName);
      if (userState) {
        if (callback && typeof callback == "function") {
          callback.call(control, userState);
        }
        return userState;
      }
      return null;
    },
    init: function(control, customParams) {
      var params = {};
      _.extend(params, this.defaultParams);
      _.extend(params, customParams);
      control.model.set(params.userProfileKeyName, control.$el.data(params.userProfileKeyDataAttributeName));
    }
  }
});