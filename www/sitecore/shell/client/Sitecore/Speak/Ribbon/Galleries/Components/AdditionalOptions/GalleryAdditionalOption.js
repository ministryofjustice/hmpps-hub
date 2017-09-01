define(["sitecore", "/-/speak/v1/Ribbon/GalleryUtil.js"], function (Sitecore, GalleryUtil) {
  Sitecore.Factories.createBaseComponent({
    name: "GalleryAdditionalOption",
    base: "ButtonBase",
    selector: ".sc-gallery-additionaloption",
    attributes: [
        { name: "command", value: "$el.data:sc-command" },
        { name: "isPressed", value: "$el.data:sc-ispressed" },
        { name: "controlStateResult", value: "$el.data:sc-controlstateresult" }
    ],

    initialize: function () {
      this._super();
      this.model.on("change:isEnabled", this.toggleEnable, this);
      this.model.on("change:isVisible", this.toggleVisible, this);
      this.model.on("click", function() {
        var experienceEditor = window.top.ExperienceEditor;
        if (!experienceEditor) {
          return;
        }

        var command = this.model.get("command");
        if (!command || command == '') {
          return;
        }

        experienceEditor.Common.closeFullContentIframe();
        experienceEditor.getContext().instance.executeCommand(command);
      }, this);
      this.checkCommandCanExecute();
    },

    checkCommandCanExecute: function() {
      var controlStateResult = this.model.get("controlStateResult");
      if (controlStateResult) {
        this.model.set({ isEnabled: controlStateResult.toLowerCase() == "true" });
        return;
      }

      var command = this.model.get("command");
      if (!command || command == "") {
        return;
      }

      var experienceEditor = window.top.ExperienceEditor;
      if (!experienceEditor) {
        return;
      }

      var context = experienceEditor.getContext().instance.getContext();
      var commandInstance = experienceEditor.getContext().instance.getCommand(command);
      if (!commandInstance) {
        return;
      }

      var canExecute = commandInstance.canExecute(context, this);

      this.model.set({ isEnabled: canExecute });
    },

    toggleEnable: function () {
      if (!this.model.get("isEnabled")) {
        this.$el.addClass("disabled");
      } else {
        this.$el.removeClass("disabled");
      }
    },

    toggleVisible: function () {
      if (!this.model.get("isVisible")) {
        this.$el.hide();
      } else {
        this.$el.show();
      }
    }
  });
});