define(["sitecore", "/-/speak/v1/ExperienceEditor/ExperienceEditor.js", "/-/speak/v1/ExperienceEditor/ExperienceEditorProxy.js"], function (Sitecore, ExperienceEditor, ExperienceEditorProxy) {
  Sitecore.Commands.AssociatedContent =
  {
    canExecute: function (context) {
      return true;
    },
    execute: function (context) {
      ExperienceEditorProxy._pe().postRequest("webedit:open(id={" + context.currentContext.argument + "})", null, false);
    }
  };
});