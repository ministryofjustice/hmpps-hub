define(["sitecore", "/-/speak/v1/ExperienceEditor/ExperienceEditor.js"], function (Sitecore, ExperienceEditor) {
  Sitecore.Commands.PublishRestrictions =
  {
    canExecute: function (context) {
      return context.app.canExecute("ExperienceEditor.PublishRestrictions.CanChange", context.currentContext);
    },

    execute: function (context) {
      ExperienceEditor.handleIsModified();

      var dialogFeatures = "dialogHeight: 760px;dialogWidth: 850px;";
      var dialogUrl = "/sitecore/shell/default.aspx?xmlcontrol=SetPublishing";
      dialogUrl += "&id=" + context.currentContext.itemId;
      dialogUrl += "&la=" + context.currentContext.language;
      dialogUrl += "&vs=" + context.currentContext.version;
      dialogUrl += "&db=" + context.currentContext.database;

      if (context.currentContext.isReadOnly || this.isLockedByOtherUser(context)) {
        dialogUrl += "&ro=1";
      }

      ExperienceEditor.Dialogs.showModalDialog(dialogUrl, "", dialogFeatures, null, function (result) {
        if (!result) {
          return;
        }

        if (result != "yes") {
          return;
        }

        window.top.location.reload();
      });
    },

    isLockedByOtherUser: function(context) {
      return context.currentContext.isLocked && !context.currentContext.isLockedByCurrentUser;
    }
  };
});