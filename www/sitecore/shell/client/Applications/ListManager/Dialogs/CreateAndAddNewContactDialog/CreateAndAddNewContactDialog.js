define(["sitecore", "/-/speak/v1/listmanager/commonPagesDefinition.js"], function (sitecore, commonPagesDefinition) {
  var self;

  return sitecore.Definitions.App.extend({
    save: function() {
    },
    initialized: function () {
      self = this;

      this.on("app:loaded", function () {
        sitecore.trigger("dialog:loaded", self);
      });

      this.on("add:contact:dialog:button:save:clicked", this.createModelAndRunCallback);
      this.on("add:contact:dialog:button:cancel:clicked", this.hideDialog);
      this.ContactMap.on("add:contact:field:changed", this.updateSaveButtonStatus, this);
    },
    showDialog: function (parameters) {
      self.save = parameters.save;
      self.ContactMap.viewModel.resetRows();
      self.ContactMap.viewModel.addRows();
      self.AddNewContactDialog.show();
    },
    hideDialog: function () {
      self.AddNewContactDialog.hide();
    },
    createModelAndRunCallback: function () {
      var mappingModel = self.ContactMap.viewModel.getMappingModel();
      var model = {};

      for (var index = 0; index < mappingModel.length; ++index) {
        model[mappingModel[index].key] = mappingModel[index].value;
      }

      self.save(self, model);
      self.hideDialog();
    },
    updateSaveButtonStatus: function() {
      self.SaveButton.set("isEnabled", self.ContactMap.viewModel.allRequiredSelected());
    }
  });
});