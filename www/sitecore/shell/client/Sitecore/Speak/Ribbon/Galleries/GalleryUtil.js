define(["sitecore"], function (Sitecore) {
  var galleryUtil = {
    executeCommand: function (commandName, commandArgument) {
      var experienceEditor = window.top.ExperienceEditor;
      if (!experienceEditor) {
        return;
      }

      experienceEditor.getContext().instance.executeCommand(commandName, commandArgument);
    },

    scrollToActive: function (component) {
      var isActive = component.model.get("active");
      if (isActive) {
        var element = component.$el;
        $(".sc-gallery-content").animate({
          scrollTop: element.offset().top
        }, 500);
      }
    }
  };

  return galleryUtil;
});