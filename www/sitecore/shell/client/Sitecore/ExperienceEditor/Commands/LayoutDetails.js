define(["sitecore", "/-/speak/v1/ExperienceEditor/ExperienceEditor.js"], function (Sitecore, ExperienceEditor) {
  Sitecore.Commands.LayoutDetails =
  {
    canExecute: function (context, parent) {
      var isEnabled = false;
      ExperienceEditor.PipelinesUtil.generateRequestProcessor("ExperienceEditor.LayoutDetails.CanEdit", function (response) {
        isEnabled = response.responseValue.value;
        if (parent) {
          parent.initiator.set({ isEnabled: isEnabled });
        }
      }).execute(context);

      return isEnabled;
    },
    execute: function (context) {
      this.handleDialogDocument(context);

      var dialogPath = "/sitecore/shell/default.aspx?xmlcontrol=LayoutDetails&id=" + decodeURI(context.currentContext.itemId)+ "&la=" + context.currentContext.language + "&vs=" + context.currentContext.version;
      var dialogFeatures = "dialogHeight: 600px;dialogWidth: 500px;";
      ExperienceEditor.Dialogs.showModalDialog(dialogPath, '', dialogFeatures, null, function (result) {
        if (!result) {
          return;
        }

        context.currentContext.value = ExperienceEditor.Web.encodeHtml(result);

        ExperienceEditor.PipelinesUtil.generateRequestProcessor("ExperienceEditor.LayoutDetails.SetValue", function () {
          ExperienceEditor.getPageEditingWindow().location.reload();
        }).execute(context);
      });
    },

    handleDialogDocument: function (context) {
      if (!ExperienceEditor.isInSharedLayout(context)) {
        return;
      }

      jQuery(document).on("dialog:loaded", function (event, dialogDocument) {
        if (!dialogDocument) {
          return;
        }

        var tabs = dialogDocument.getElementsByClassName("scTab");
        if (tabs.length == 0) {
          return;
        }

        tabs[0].style.display = "none";
      });
    }
  };
});