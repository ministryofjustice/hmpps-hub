define(["sitecore", "/-/speak/v1/ExperienceEditor/ExperienceEditor.js", "/-/speak/v1/ExperienceEditor/TranslationUtil.js"], function (Sitecore, ExperienceEditor, TranslationUtil) {
  Sitecore.Commands.ResetLayout =
  {
    canExecute: function (context, parent) {
      var isEnabled = false;
      ExperienceEditor.PipelinesUtil.generateRequestProcessor("ExperienceEditor.ResetLayout.IsEnabled", function (response) {
        isEnabled = response.responseValue.value;
        if (parent) {
          parent.initiator.set({ isEnabled: isEnabled });
        }
      }).execute(context);

      return isEnabled;
    },
    execute: function (context) {
      if (context.app.canExecute("ExperienceEditor.IsEditAllVersionsTicked", context.currentContext) && ExperienceEditor.isInSharedLayout(context)) {
        ExperienceEditor.Dialogs.confirm(TranslationUtil.translateTextByServer(TranslationUtil.keys.Are_you_sure_you_want_to_reset_the_shared_layout_These_changes_will_affect_all_versions_of_this_page), function (isOk) {
          if (!isOk) {
            return;
          }

          context.currentContext.value = encodeURIComponent("ResetFinal=DoNotReset&ResetShared=1");
          ExperienceEditor.PipelinesUtil.generateRequestProcessor("ExperienceEditor.ResetLayout.Execute", function () {
            window.top.location.reload();
          }).execute(context);
        });
        return;
      }

      var dialogPath = "/sitecore/shell/default.aspx?xmlcontrol=ResetLayout";
      var dialogFeatures = "dialogHeight: 267px;dialogWidth: 370px;";
      ExperienceEditor.Dialogs.showModalDialog(dialogPath, '', dialogFeatures, null, function(result) {
        if (!result || result == "undefined") {
          return;
        }

        context.currentContext.value = encodeURIComponent(result);
        ExperienceEditor.PipelinesUtil.generateRequestProcessor("ExperienceEditor.ResetLayout.Execute", function () {
          window.top.location.reload();
        }).execute(context);
      });
    }
  };
});