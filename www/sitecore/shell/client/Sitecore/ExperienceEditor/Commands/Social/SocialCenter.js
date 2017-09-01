define(["sitecore", "/-/speak/v1/ExperienceEditor/ExperienceEditor.js"], function (Sitecore, ExperienceEditor) {
  Sitecore.Commands.SocialCenter =
  {
    canExecute: function (context) {
      this.refreshMessagesCount(context);
      return true;
    },
    
    refreshMessagesCount: function (context) {
      context.app.postServerRequest("ExperienceEditor.Social.SocialCenter.GetMessagesCount", context.currentContext, function (response) {
        if (response.error) {
          context.app.handleResponseErrorMessage(response);
          return;
        }

        var messagesCount = response.value || response.responseValue.value;
        var messagesButtonTextSpan = context.button.viewModel.$el.children("span");
        var counterSpan = "<span> (" + messagesCount + ")</span>";

        if (messagesCount == 0) {
          messagesButtonTextSpan.children().remove();
        } else {
          if (messagesButtonTextSpan.children().length == 0)
            messagesButtonTextSpan.append(counterSpan);
          else
            messagesButtonTextSpan.children().html(counterSpan);
        }
      });
    },

    execute: function (context) {
      context.app.disableButtonClickEvents();
      ExperienceEditor.PipelinesUtil.executePipeline(context.app.SocialCenterPipeline, function () {
        ExperienceEditor.PipelinesUtil.executeProcessors(Sitecore.Pipelines.SocialCenter, context);
      });
      context.app.enableButtonClickEvents();
    }
  };
});