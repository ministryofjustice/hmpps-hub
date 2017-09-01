define([
    "sitecore",
    "/-/speak/v1/FXM/ExperienceEditorExtension/Utils/ClientBeacon.js",
    "/-/speak/v1/FXM/Validation.js",
    "/-/speak/v1/FXM/ElementPlaceholderService.js",
    "/-/speak/v1/FXM/ItemActionService.js"
], function (_sc, _clientBeacon, _validator, _elementPlaceholderService, _itemActionService) {
  return _sc.Definitions.App.extend({
    initialized: function () {
      this.queryString = _sc.Helpers.url.getQueryParameters(location.href);
      this.elementReplacerValidator = new _validator(this.MessageBarDataSource, this.ElementReplacerMessageBar);
      this.selectorPath = this.queryString.selector;
      this.position = this.queryString.position;
      this.ParentTreeview.set('whitelist', "*");
      this.ParentTreeview.set('rootItemId', this.getRoot());

      this.on("button:cancel", function () {
        this.closeDialog(null);
      }, this);

      this.on("button:ok", function () {
        this.save();
      }, this);
    },

    getRoot: function () {
      var domainItem = _clientBeacon.domainItem();
      if (domainItem) {
        return domainItem;
      }

      return this.queryString.root;
    },

    save: function () {
      var self = this;

      this.elementReplacerValidator.clear();

      var parent = this.ParentTreeview.get('selectedItemId');
      var name = this.NameTextbox.get('text');
      if (!parent) {
        this.elementReplacerValidator.showMessageById('{45B2AE8E-26E3-4D69-B691-1FCFABFBEFF4}');
      }

      if (!name) {
        this.elementReplacerValidator.showMessageById('{CF2E08CA-61B8-4AF5-87DC-110EA7F1D254}');
      }

      if (this.elementReplacerValidator.hasMessages()) {
        return;
      }

      var elementPlaceholder = {
        Name: name,
        TemplateID: '{10E23679-55DB-4059-B8F2-E417A2F78FCB}',
        ParentId: parent,
        Position: this.position,
        Selector: this.selectorPath
      };

      _elementPlaceholderService.create(elementPlaceholder).execute().then(function (data) {
        _itemActionService.fetchEntity(decodeURIComponent(data.Id)).execute().then(function (instance) {
          self.closeDialog(instance);
        });
      }).fail(function (err) {
        self.elementReplacerValidator.showMessageById('{1C2ECBD3-B2AA-4ED0-8CA1-139BFE787529}', err.message);
      });
    }
  });
});
