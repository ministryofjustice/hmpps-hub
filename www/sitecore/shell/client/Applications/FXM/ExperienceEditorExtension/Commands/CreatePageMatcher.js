define(["sitecore", "/-/speak/v1/ExperienceEditor/ExperienceEditor.js", "/-/speak/v1/FXM/ComponentSettings.js"], function (_sc, ExperienceEditor, componentSettings) {

  _sc.Commands.CreatePageMatcher =
  {
    canExecute: function (context) {
      return true;
    },
    execute: function (context) {
      var urlQueryParamater = componentSettings.urlParameter;
      var itemId = _sc.Helpers.url.getQueryParameters(window.parent.location.href)["sc_itemid"] || '';
      var selectedUrl = _sc.Helpers.url.getQueryParameters(window.parent.location.href)[urlQueryParamater] || '';

      var dialogPath = "/sitecore/client/Applications/FXM/ExperienceEditorExtension/Dialogs/CreatePageMatcher?itemId=" + itemId + "&" + urlQueryParamater + "=" + selectedUrl;
      var dialogFeatures = "dialogHeight:650;dialogWidth:700;ignoreSpeakSizes:true";

      ExperienceEditor.Dialogs.showModalDialog(dialogPath, '', dialogFeatures, null, function (result) {
        if (result) {
          window.top.location.reload();
        }
      });
    }
  };
});