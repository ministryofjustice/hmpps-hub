define([
    "sitecore",
    "/-/speak/v1/FXM/ExperienceEditorExtension/Utils/ClientBeacon.js",
    "/-/speak/v1/FXM/Validation.js",
    "/-/speak/v1/FXM/ElementMatcherService.js",
    "/-/speak/v1/FXM/ItemActionService.js"
], function (_sc, _clientBeacon, _validator, _elementMatcherService, _itemActionService) {
  return _sc.Definitions.App.extend({
    initialized: function () {
      this.queryString = _sc.Helpers.url.getQueryParameters(location.href);
      this.clientActionValidator = new _validator(this.MessageBarDataSource, this.ClientActionMessageBar);
      this.ParentTreeview.set('whitelist', "*");
      this.ParentTreeview.set('rootItemId', this.getRoot());
      var createMode = this.isCreateMode();
      if (createMode) {
        this.Title.set("isVisible", true);
        this.selectorPath = this.queryString.selector;
        this.IntroText.set("isVisible", true);
        this.Separator.set("isVisible", true);
      } else {
        this.EditTitle.set("isVisible", true);
        this.IntroText.set("isVisible", true);
        this.clientActionValidator.clear();
        jQuery("div[data-sc-id='ParentRowPanel']").hide();
        this.initializeClientAction();
      }


      this.on("button:cancel", function () {
        this.closeDialog(null);
      }, this);

      this.on("button:ok", function () {
        if (createMode) {
          this.save();
        } else {
          this.update();
        }
      }, this);
    },

    isCreateMode: function() {
      if (this.queryString.id) {
        return false;
      }

      return true;
    },

    initializeClientAction: function() {
      var id = this.queryString.id;
      var self = this;
      _elementMatcherService.fetchEntity(decodeURIComponent(id)).execute().then(function(clientAction) {
        self.CaptureClientActionControl.set("item", clientAction);
      });
    },

    getRoot: function () {
      var domainItem = _clientBeacon.domainItem();
      if (domainItem) {
        return domainItem;
      }

      return this.queryString.root;
    },

    save: function () {
      this.clientActionValidator.clear();

      var parent = this.ParentTreeview.get('selectedItemId');
      if (!parent) {
        this.clientActionValidator.showMessageById('{45B2AE8E-26E3-4D69-B691-1FCFABFBEFF4}');
      }

      if (!this.ClientActionNameTextBox.get('text')) {
        this.clientActionValidator.showMessageById('{CF2E08CA-61B8-4AF5-87DC-110EA7F1D254}');
      }

      if (this.clientActionValidator.hasMessages()) {
        return;
      }

      var clientAction = {
        Name: this.ClientActionNameTextBox.get('text'),
        TemplateID: "{69BEDDF2-EB93-4BE1-AC48-D065AF52E3A8}",
        ParentId: parent,
        Selector: this.selectorPath,
        CampaignIds: this.CaptureClientActionControl.viewModel.getCampaignIds(),
        GoalIds: this.CaptureClientActionControl.viewModel.getGoalIds(),
        EventIds: this.CaptureClientActionControl.viewModel.getEventIds(),
        OutcomeIds: this.CaptureClientActionControl.viewModel.getOutcomeIds()
      };

      var self = this;

      _elementMatcherService.create(clientAction).execute().then(function (data) {
        _itemActionService.fetchEntity(decodeURIComponent(data.Id)).execute().then(function (instance) {
          self.closeDialog(instance);
        }); 
      }).fail(function (err) {
        self.clientActionValidator.showMessageById('{1C2ECBD3-B2AA-4ED0-8CA1-139BFE787529}', err.message);
      });
    },

    update: function () {
      this.clientActionValidator.clear();
      if (!this.ClientActionNameTextBox.get('text')) {
        this.clientActionValidator.showMessageById('{CF2E08CA-61B8-4AF5-87DC-110EA7F1D254}');
      }

      if (this.clientActionValidator.hasMessages()) {
        return;
      }

      var self = this;
      this.CaptureClientActionControl.saveItem();
      this.CaptureClientActionControl.on("saved", function () {
        var item = this.CaptureClientActionControl.get("item");
        _itemActionService.fetchEntity(item.Id).execute().then(function(instance) {
          self.closeDialog(instance);
        });
      }, this);

      this.CaptureClientActionControl.on("saveerror", function () {
        self.clientActionValidator.clear();
        self.clientActionValidator.showMessageById('{1C2ECBD3-B2AA-4ED0-8CA1-139BFE787529}', "An error occured");
      }, this);
    }
  });
});