define(["/-/speak/v1/ExperienceEditor/ExperienceEditor.js"], function (ExperienceEditor) {
  return {
    execute: function (context) {
      context.suspend();

      ExperienceEditor.Dialogs.showModalDialog(context.currentContext.value, '', 'dialogHeight: 800px;dialogWidth: 1200px;', null, function (result) {
        context.resume();
      });
    }
  };
});