define(["sitecore", "/-/speak/v1/ExperienceEditor/ExperienceEditor.js"], function (Sitecore, ExperienceEditor) {
  Sitecore.Commands.SelectLayout =
  {
    isNotificationRendered: false,
    canExecute: function (context) {
      if (ExperienceEditor.Web.getUrlQueryStringValue("sc_disable_edit") == "yes") {
        return false;
      }

      if (context.currentContext.isFallback) {
        return false;
      }

      if (!ExperienceEditor.isInMode("edit")) {
        return false;
      }

      if (!context.app.canExecute("ExperienceEditor.IsEditAllVersionsTicked", context.currentContext)) {
        return false;
      }

      if (!this.isNotificationRendered && context.app.canExecute("ExperienceEditor.Versions.GetStatus", context.currentContext)) {
        this.defineNotification(context);
      }

      this.isNotificationRendered = true;

      return true;
    },
    execute: function (context) {
      var postContext = context || this.currentContext;
      ExperienceEditor.PipelinesUtil.generateRequestProcessor("ExperienceEditor.Versions.SelectLayout", function (response) {
        ExperienceEditor.getPageEditingWindow().location.reload();
      }, { value: encodeURIComponent(context.currentContext.argument) }).execute(postContext);
    },

    defineNotification: function (context) {
      var that = this;
      ExperienceEditor.PipelinesUtil.generateRequestProcessor("ExperienceEditor.Versions.NotificationMessage", function (response) {
        var id = "EditAllVersionsID";
        var notification = Sitecore.ExperienceEditor.Context.instance.showNotification("notification", response.responseValue.value, true);
        notification.innerHTML = notification.innerHTML.replace("{", "<b><a href='#' id='" + id + "'>").replace("}", "</a></b>");

        jQuery("#" + id).click(function () {
          that.execute(context);
        });

      }).execute(context);
    }
  };
});