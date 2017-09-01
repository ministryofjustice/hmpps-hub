define(["/-/speak/v1/FXM/ComponentSettings.js"], function (componentSettings) {
  var webControlsUtil = {
    triggerEventOnFieldChange: function(context, control, triggerEvent) {
      if (!context
        || !control
        || !triggerEvent
        || triggerEvent == "") {
        return;
      }

      jQuery(control.viewModel.$el[0]).on("keypress", context, function () {
        control.trigger(triggerEvent);
      });

      //handle backspace and delete key
      jQuery(control.viewModel.$el[0]).on("keyup", context, function (e) {
        if (e.keyCode == 8 || e.keyCode == 46) {
          control.trigger(triggerEvent);
        }
      });
    },

    resolveExternalSitePath: function () {
      var externalPageUrl = _sc.Helpers.url.getQueryParameters(window.top.location.href)[componentSettings.urlParameter] || '/';
      var parsedUrl = $.url(externalPageUrl) || '';
      var path = parsedUrl.attr('path') || '';
      
      return path;
    }
  };

  return webControlsUtil;
});