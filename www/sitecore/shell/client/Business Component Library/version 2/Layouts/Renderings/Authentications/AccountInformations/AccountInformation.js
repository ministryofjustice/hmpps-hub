(function (speak) {
  speak.component({
    name: "AccountInformation",
    logout: function (target, event) {
      event.preventDefault();

      // Disable cache to make sure that URL is always "followed"
      // and the logout function gets executed on the server
      var ajaxSettings = {
        type: "POST",
        url: "/sitecore/shell/api/sitecore/Authentication/Logout?sc_database=master",
        data: {},
        cache: false
      };

      var token = speak.utils.security.antiForgery.getAntiForgeryToken();
      ajaxSettings.data[token.formKey] = token.value;

      $.ajax(ajaxSettings).done(function(data) {
        window.location = JSON.parse(data).Redirect;
      });
    }
  });
})(Sitecore.Speak);