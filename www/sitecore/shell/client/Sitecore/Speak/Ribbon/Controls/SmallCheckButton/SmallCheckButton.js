define(["sitecore", "/-/speak/v1/ExperienceEditor/ExperienceEditor.js"], function (Sitecore, ExperienceEditor) {
  Sitecore.Factories.createBaseComponent({
    name: "SmallCheckButton",
    base: "ButtonBase",
    selector: ".sc-chunk-check-small",
    attributes: [
        { name: "command", value: "$el.data:sc-command" },
        { name: "registryKey", value: "$el.data:sc-registrykey" },
        { name: "isChecked", value: "$el.data:sc-checked" }
    ],
    initialize: function () {
      this._super();
      this.model.on("change:isEnabled", this.toggleEnable, this);
      this.model.on("change:isVisible", this.toggleVisible, this);
      this.model.on("change:isChecked", this.toggleChecked, this);
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
    toggleChecked: function () {
      ExperienceEditor.CommandsUtil.triggerControlStateByCommand(this, "isChecked");
    },

    toggleInternalPressed: function (isPressedModelValue) {
      ExperienceEditor.Common.addOneTimeEvent(function (that) {
        return that.$el.find(".sc-smallcheckbox").prop('checked') != (that.model.get("isChecked") === "1" || that.model.get("isChecked") === true);
      }, function (that) {
        that.$el.find(".sc-smallcheckbox").prop('checked', that.model.get("isChecked") === "1" || that.model.get("isChecked") === true);
      }, 100, this);
    },

    updatePressed: function (modelValue) {
      this.model.set("isChecked", modelValue);
    },
  });
});