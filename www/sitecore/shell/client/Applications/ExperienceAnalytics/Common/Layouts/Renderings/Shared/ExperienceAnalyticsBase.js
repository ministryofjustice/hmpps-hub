require.config({
  paths: {
    experienceAnalytics: "/sitecore/shell/client/Applications/ExperienceAnalytics/Common/Layouts/Renderings/Shared/ExperienceAnalytics"
  }
});

define(["sitecore", "experienceAnalytics"], function (Sitecore, ExperienceAnalytics) {
  "use strict";

  Sitecore.Factories.createBaseComponent({
    name: "ExperienceAnalyticsBase",
    base: "ControlBase",
    selector: ".sc-ExperienceAnalyticsBase",

    attributes: [],

    initialize: function () {
      
      var errorTexts = this.model.get("errorTexts");

      if (errorTexts) {
        var resolvedTexts = ExperienceAnalytics.resolveTemplatesVariables(this.model.get("errorTexts"), {
          COMPONENT_NAME: this.model.get("name"),
          COMPONENT_TYPE: this.model.get("componentType")
        });

        this.model.set("errorTexts", resolvedTexts);
      }
    },

    showMessage: function (type, text, data) {
      if (this.app.MessageBar) {
        if (data) {
          text = ExperienceAnalytics.textTemplate(text, data);
        }

        var errorObj = {
          text: text,
          actions: [],
          closable: type !== "error"
        };

        this.app.MessageBar.addMessage(type, errorObj);
      }
    },

    messageBarHasText: function (text) {
        return this.app.MessageBar && _(this.app.MessageBar.attributes["errors"]).some(function(item) { return item.text == text; });
    }
  });
});