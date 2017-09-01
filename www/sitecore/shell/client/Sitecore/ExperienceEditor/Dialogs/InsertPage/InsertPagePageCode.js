define(["sitecore", "/-/speak/v1/ExperienceEditor/ExperienceEditor.js"], function (Sitecore, ExperienceEditor) {
  var insertPagePageCode = Sitecore.Definitions.App.extend({
    initialized: function () {
      this.setInsertButtonClick();
      this.setCancelButtonClick();
      this.setInsertOptionsItemSelected();
      this.setButtonRules();
    },
    setButtonRules: function() {
      this.itemNameElement().context = this;
      this.itemNameElement().onkeyup = this.enableInsertButton;
      this.ItemNameText.on("change", this.enableInsertButton, this);
    },
    itemNameElement: function() {
      return this.ItemNameText.viewModel.$el[0];
    },
    enableInsertButton: function () {
      var context = this.value || this.value == "" ? this.context : this;
      if (!context) {
        return;
      }

      if (context.templateId
        && context.itemNameElement().value.trim()) {
        context.InsertButton.viewModel.enable();
        return;
      }
      context.InsertButton.viewModel.disable();
    },
    setInsertButtonClick: function () {
      this.on("button:insert", function () {
        var newName = this.ItemNameText.get("text").trim();
        if (!newName || !this.templateId) {
          return;
        }

        this.context = {
          value: escape(newName),
          templateItemId: this.templateId,
          app: this,
        };
        ExperienceEditor.PipelinesUtil.generateRequestProcessor("ExperienceEditor.Insert.ValidateNewName", function (response) {
          response.context.app.closeDialog(response.context.templateItemId + ',' + response.context.value);
        }, this.context).execute(this.context, this.context);
      }, this);
    },
    setCancelButtonClick: function () {
      this.on("button:cancel", function () {
        this.closeDialog(null);
      }, this);
    },
    setInsertOptionsItemSelected: function () {
      this.on("item:selected", function (event) {
        var selectedItem = this.getSelectedItem(event.sender.el);
        var selectedItemId = selectedItem.get("itemId");
        this.templateId = selectedItemId;
        this.InsertOptions.set("selectedItemId", selectedItemId);
        this.InsertOptions.set("selectedDisplayName", selectedItem.get("displayName"));
        $.each(this, function () {
          if (this.attributes === undefined || this.componentName !== "SelectOptionsItem")
            return;
          this.set("isPressed", this.cid === selectedItem.cid);
        });
        this.enableInsertButton();
      }, this);
    },
    getSelectedItem: function (eventTarget) {
      var id = this.findId(eventTarget);
      if (id === undefined)
        return undefined;
      return this[id];
    },
    findId: function (target) {
      if (target === undefined || target === null)
        return undefined;
      var id = $(target).data("sc-id");
      if (id === undefined)
        id = this.findId(target.parentNode);
      return id;
    }
  });
  return insertPagePageCode;
});