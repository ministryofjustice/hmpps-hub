define(
  [
    "sitecore",
    "/-/speak/v1/ExperienceEditor/ExperienceEditor.js",
    "/-/speak/v1/ExperienceEditor/ExperienceEditor.Context.js"], function (Sitecore, ExperienceEditor, ExperienceEditorContext) {
  Sitecore.Factories.createBaseComponent({
    name: "Panel",

    base: "ControlBase",

    selector: ".sc-chunk-panel",

    attributes: [
        { name: "ID", value: "$el.data:sc-id" },
        { name: "FullContentSrc", value: "$el.data:sc-fullcontentsrc" },
        { name: "FullContentWidth", value: "$el.data:sc-fullcontentwidth" },
        { name: "FullContentHeight", value: "$el.data:sc-fullcontentheight" },
        { name: "HasFullContent", value: "$el.data:sc-hasfullcontent" }
    ],

    initialize: function () {
      var self = this;
      var panel = ExperienceEditor.Common.getElementById(this.model.get("ID"));
      var context = this;
      if (panel) {
        var hasFullContent = context.model.get("HasFullContent");
        if (hasFullContent.toLowerCase() == 'true') {
          var expandPanelButton = panel.querySelector(".showPanelButton");
          expandPanelButton.onclick = function (event) {
            var url = context.model.get("FullContentSrc") + "?" + context.getContextQueryString();
            var dimensions = {
              width: context.model.get("FullContentWidth"), height: context.model.get("FullContentHeight")
            };

            ExperienceEditor.Common.showGallery(url, panel, dimensions);
          };
        }

        var panelContent = $(panel).find(".panelContentContainer");
        var offset = 39;
        $(panel).find(".scRibbonPanelUp").click(function() {
          panelContent.scrollTop(panelContent.scrollTop() - offset);
        });

        $(panel).find(".scRibbonPanelDown").click(function () {
          panelContent.scrollTop(panelContent.scrollTop() + offset);
        });
      }
      this._super();
    },

    getContextQueryString: function () {
      return "itemId=" +ExperienceEditorContext.instance.currentContext.itemId + "&" +
        "deviceId=" + ExperienceEditorContext.instance.currentContext.deviceId + "&" +
        "database=" + ExperienceEditorContext.instance.currentContext.database + "&" +
        "sc_lang=" + ExperienceEditor.Common.getCookieValue("shell#lang");
    }
  });
});