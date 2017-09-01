define(["sitecore", "/-/speak/v1/ExperienceEditor/ExperienceEditor.js"], function (Sitecore, ExperienceEditor) {
  Sitecore.Factories.createBaseComponent({
    name: "LargeButton",
    base: "ButtonBase",
    selector: ".sc-chunk-button",
    attributes: [
        { name: "command", value: "$el.data:sc-command" },
        { name: "isPressed", value: "$el.data:sc-ispressed" }
    ],
    initialize: function () {
      this._super();
      this.model.on("change:isEnabled", this.toggleEnable, this);
      this.model.on("change:isPressed", this.togglePressed, this);
      this.model.on("change:isVisible", this.toggleVisible, this);
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
    },
    togglePressed: function () {
      ExperienceEditor.CommandsUtil.triggerControlStateByCommand(this, "isPressed");
    },

    updatePressed: function (modelValue) {
      var checkedValue = false;
      if (modelValue == "1" || modelValue == true) {
        checkedValue = true;
      }

      this.model.set("isPressed", checkedValue);
    },

    toggleInternalPressed: function (isPressedModelValue) {
      if (this.model.get("isPressed"))
        this.$el.addClass("pressed");
      else {
        this.$el.removeClass("pressed");
      }
    },

    setTitle: function(title) {
      this.$el.find("span:first").text(title);
      var buttons = $("[data-sc-id='" + this.model.get("name") + "']");
      if (buttons.length > 1) {
        $.each(buttons, function (index, button) {
          $(button).find("span:first").text(title);
        });
      }
    }
  });
});