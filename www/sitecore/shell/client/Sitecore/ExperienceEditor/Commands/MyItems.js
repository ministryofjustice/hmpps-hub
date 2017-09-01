define(["sitecore", "/-/speak/v1/ExperienceEditor/ExperienceEditor.js"], function (Sitecore, ExperienceEditor) {
  Sitecore.Commands.MyItems =
  {
    canExecute: function (context) {
      if (ExperienceEditor.getPageEditingWindow().Sitecore.WebEditSettings.showNumberOfLockedItemsOnButton) {
        var amountOfLockedItems = context.app.canExecute("ExperienceEditor.MyItems.Count", context.currentContext);
        var myItemsButton = $("a[data-sc-id='MyItemsRibbonButton'] span");
        var counterSpan = "<span> (" + amountOfLockedItems + ")</span>";

        if (amountOfLockedItems == 0) {
          myItemsButton.children().remove();
        } else {
          if (myItemsButton.children().length == 0)
            myItemsButton.append(counterSpan);
          else
            myItemsButton.children().html(counterSpan);
        }
      }
  
      return true;
    },

    execute: function (context) {
      var dialogPath = "/sitecore/shell/~/xaml/Sitecore.Shell.Applications.WebEdit.Dialogs.LockedItems.aspx";
      var dialogFeatures = "dialogHeight: 600px;dialogWidth: 800px;";
      ExperienceEditor.Dialogs.showModalDialog(dialogPath, '', dialogFeatures, null, function () {
        Sitecore.Commands.MyItems.canExecute(context);
        context.currentContext.isLocked = context.app.canExecute("ExperienceEditor.LockItem.IsLocked", context.currentContext);
        if (Sitecore.Commands.Lock) {
          Sitecore.Commands.Lock.canExecute(context);
        }
      });
    }
  };
});