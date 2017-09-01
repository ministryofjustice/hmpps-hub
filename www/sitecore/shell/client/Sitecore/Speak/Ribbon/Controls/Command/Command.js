define(["sitecore", "/-/speak/v1/ExperienceEditor/ExperienceEditor.js"], function (Sitecore, ExperienceEditor) {
  Sitecore.Factories.createBaseComponent({
    name: "Command",

    base: "ControlBase",

    selector: ".sc-simpleCommand",

    attributes: [
        { name: "ID", value: "$el.data:sc-id" }
    ],

    initialize: function () {
      this._super();
      this.model.set("itemId", this.$el.data("sc-itemid"));
      this.model.set("command", this.$el.data("sc-command"));

      this.registerCommand();
    },

    registerCommand: function () {
      var itemId = this.model.get("itemId");
      if (!itemId || itemId == "") {
        return;
      }

      var command = this.model.get("command");
      if (!command || command == "") {
        return;
      }

      ExperienceEditor.CommandsUtil.addDropDownMenuItemCommand(itemId, command);
    }
  });
});