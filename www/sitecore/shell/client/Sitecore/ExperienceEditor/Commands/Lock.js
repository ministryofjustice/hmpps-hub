define(
  [
    "sitecore",
    "/-/speak/v1/ExperienceEditor/ExperienceEditor.js",
    "/-/speak/v1/ExperienceEditor/ExperienceEditor.Context.js",
    "/-/speak/v1/ExperienceEditor/TranslationUtil.js"
  ],
  function (Sitecore, ExperienceEditor, ExperienceEditorContext, TranslationUtil) {
  Sitecore.Commands.Lock =
  {
    button: null,
    canExecute: function (context) {
      var result = ExperienceEditor.isInMode("edit") && this.allowLock(context);
      this.setButtonTitle(context, context.currentContext.isLocked);

      return result;
    },

    allowLock: function (context) {
      return context.app.canExecute("ExperienceEditor.LockItem.CanToggleLock", context.currentContext);
    },

    execute: function (context) {
      if (!context.currentContext.requireLockBeforeEdit) {
        this.lockItem(context);
        return;
      }

      var that = this;
      ExperienceEditor.modifiedHandling(true, function (isOk) {
        that.lockItem(context);
      });
    },

    lockItem: function (context) {
      context.app.disableButtonClickEvents();
      ExperienceEditor.PipelinesUtil.executePipeline(context.app.LockItemPipeline, function () {
        ExperienceEditor.PipelinesUtil.executeProcessors(Sitecore.Pipelines.LockItem, context);
        if (Sitecore.Commands.MyItems
          && Sitecore.Commands.MyItems.canExecute) {
          Sitecore.Commands.MyItems.canExecute(context);
        }
      });

      context.app.enableButtonClickEvents();

      if (!context.currentContext.requireLockBeforeEdit) {
        return;
      }

      if (ExperienceEditorContext.isModified && !ExperienceEditorContext.instance.isLocked) {
        ExperienceEditorContext.isModified = false;
        context.app.refreshOnItem(context.currentContext);
      }
    },

    setButtonTitle: function(context, isLocked) {
      if (!Sitecore.Commands.Lock.button) {
        Sitecore.Commands.Lock.button = context.button;
      }

      var lockButton = Sitecore.Commands.Lock.button;
      if (!lockButton) {
        return;
      }

      lockButton.viewModel.setTitle(TranslationUtil.translateText(isLocked ? TranslationUtil.keys.Unlock : TranslationUtil.keys.Lock));
    }
  };
});