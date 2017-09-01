define(["sitecore",
  "/-/speak/v1/ExperienceEditor/ExperienceEditor.js",
  "/-/speak/v1/ExperienceEditor/ProfileCards.js",
  "/-/speak/v1/ExperienceEditor/SelectProfileCard.js"],
  function (Sitecore, experienceEditor, profileCards, selectProfileCard) {
  Sitecore.Factories.createBaseComponent({
    name: "ProfileCardsPanel",
    base: "ControlBase",
    selector: ".sc-profilecards-panel",
    attributes: [
      { name: "isInIframeRendering", value: "$el.data:sc-isiniframerendering" }
    ],
    initialize: function () {
      this._super();
      window.ProfileCardsPanel = {
        selectProfileCard: function(profileCardId) {
          var clientContext = window.top.ExperienceEditor;
          clientContext.getContext().instance.executeCommand("SelectProfileCard", profileCardId);
          clientContext.Common.closeFullContentIframe();
        },

        editProfileCards: function() {
          var clientContext = window.top.ExperienceEditor;
          clientContext.getContext().instance.executeCommand("ProfileCards");
          clientContext.Common.closeFullContentIframe();
        }
      };

      this.registerCheckPermissionsHook();
    },

    registerCheckPermissionsHook: function() {
      if (this.model.get("isInIframeRenderin") == "true") {
        return;
      }

      Sitecore.ExperienceEditor = Sitecore.ExperienceEditor || {};
      Sitecore.ExperienceEditor.Hooks = Sitecore.ExperienceEditor.Hooks || [];

      var that = this;

      Sitecore.ExperienceEditor.Hooks.push({
        execute: function (context) {
          experienceEditor.PipelinesUtil.generateRequestProcessor("ExperienceEditor.ProfileCardsPanel.CanOpenProfileCard", function (response) {
            if (!response.responseValue.value) {
              var parentPanel = that.$el.parent().parent();
              if (!parentPanel) {
                console.warn("Parent panel of the ProfileCardsPanel control could not be found.");
              }
              parentPanel.addClass("disabled");
              var expandPanelButton = parentPanel.find(".showPanelButton");
              if (!expandPanelButton) {
                return;
              }

              expandPanelButton.hide();
            }
          }).execute(context);
        }
      });
    }
  });
});