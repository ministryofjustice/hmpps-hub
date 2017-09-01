define([
    "sitecore",
    "/-/speak/v1/assets/q.js",
    "/-/speak/v1/FXM/ParamUtils.js",
    "/-/speak/v1/FXM/Validation.js",
    "/-/speak/v1/FXM/PageMatcherService.js",
    "/-/speak/v1/FXM/ExperienceEditorExtension/Utils/ClientBeacon.js",
    "/-/speak/v1/FXM/WebUtil.js",
    "/-/speak/v1/FXM/Commands.js",
	"/-/speak/v1/FXM/purl.js",
], function (_sc, Q, _paramUtils, _validator, _service, _clientBeacon, webUtil) {
  return _sc.Definitions.App.extend({
    initialize: function () {
      this.currentMatcher = {};
      this.ruleXml = '';

      this.on("button:cancel", function () {
        this.closeDialog(null);
      }, this);

      this.on("button:ok", function () {
        this.savePageMatcherAndExit();
      }, this);
    },

    initialized: function () {
      this.queryString = _sc.Helpers.url.getQueryParameters(location.href);
      this.detailsValidator = new _validator(this.MessageBarDataSource, this.DialogMessageBar);
      this.allRadios = [this.ThisPageOnlyRadio, this.ThisPageAndChildrenRadio, this.CustomRadioButton];

      this.initMatcher()
          .then(jQuery.proxy(this.populate, this))
          .fin(jQuery.proxy(this.wireEvents, this));
    },

    initMatcher: function () {
      var self = this;

      return _service.create(self.getRoot())
          .then(function (data) {
            // initialize client side only bits
            data.initMatchCriteria = function () {
              this.RuleTemplateValue = this.MatchRuleType != '3' ? this.RuleFinalValue : '';
              this.RuleXmlValue = this.MatchRuleType == '3' ? this.RuleFinalValue : '';
            };
            data.updateMatchCriteria = function () {
              if (this.MatchRuleType !== "3" && self.RuleTemplateValueTextBox.get("text") === "") {
                self.RuleTemplateValueTextBox.set("text", webUtil.resolveExternalSitePath());
              }

              this.RuleXmlValue = this.RuleXmlValue === '<ruleset />' ? '' : this.RuleXmlValue;
              this.RuleFinalValue = this.MatchRuleType == '3' ? this.RuleXmlValue : self.RuleTemplateValueTextBox.get("text");
            };
            data.initMatchCriteria();
            return data;
          })
          .then(function (data) {
            self.currentMatcher = data;
          })
          .fail(function (data) {
            self.detailsValidator.showMessageById('{A4C4D523-F79A-4E8F-829D-6EC32139EB3F}', data.statusText);
          });
    },

    getRoot: function () {
      var domainItem = _clientBeacon.domainItem();
      if (domainItem) {
        return domainItem;
      }

      return this.queryString.root;
    },

    populate: function () {
      // enable buttons
      var enableControls = [
          this.DetailsNameTextbox,
          this.OkButton
      ];

      $.each(enableControls, function (i, ctrl) {
        ctrl.set('isEnabled', true);
      });

      // button visibility
      this.OkButton.set('isVisible', true);

      // Details
      this.DetailsNameTextbox.set('text', this.currentMatcher.Name);

      if (this.currentMatcher.RuleTemplateValue === null) {
        var path = webUtil.resolveExternalSitePath();

        this.RuleTemplateValueTextBox.set('text', path);
      } else {
        this.RuleTemplateValueTextBox.set('text', this.currentMatcher.RuleTemplateValue);
      }

      this.set('RuleTemplate', this.currentMatcher.MatchRuleType); // initialize our attribute that the radio's are implicitly bound to.
      this.updateRuleTypeRadio(this.currentMatcher.MatchRuleType);

      var isCustom = this.CustomRadioButton.get('isChecked');
      this.RuleTemplateValueTextBox.set('isEnabled', !isCustom);

      if (this.currentMatcher.isNew) {
        return;
      }
    },

    updateRuleTypeRadio: function (newValue) {
      _.each(this.allRadios, function (radio) {
        if (radio.get('value') == newValue.toString()) {
          radio.check();
        }
      });
    },

    wireEvents: function () {
      // exposed events
      this.on('pagematcher:customrule', this.customRule, this);

      // change events
      this.DetailsNameTextbox.on('change:text', function (data) {
        this.currentMatcher.Name = data.get('text');
        this.prepareForChange();
      }, this);

      this.RuleTemplateValueTextBox.on('change:text', function (data) {
        this.currentMatcher.RuleTemplateValue = data.get('text');
        this.prepareForChange();
      }, this);

      // disable the rule value text box when user specifies a custom rule, and set the final value
      // to the correct representation for client side validation.
      this.CustomRadioButton.on('change:isChecked', function (data) {
        var isCustom = this.CustomRadioButton.get('isChecked');
        this.RuleTemplateValueTextBox.set('isEnabled', !isCustom);
        this.currentMatcher.RuleFinalValue = isCustom ? this.currentMatcher.RuleXmlValue : this.currentMatcher.RuleTemplateValue;
      }, this);

      this.NewPageMatcherProfilesAnalyticsItemPickerSelectedItems.on('change:items', function (data) {
        this.prepareForChange();
        this.setMatcherListField('ProfileIds', data);
      }, this);

      this.NewPageMatcherGoalsAnalyticsItemPickerSelectedItems.on('change:items', function (data) {
        this.prepareForChange();
        this.setMatcherListField('GoalIds', data);
      }, this);

      this.NewPageMatcherCampaignsAnalyticsItemPickerSelectedItems.on('change:items', function (data) {
        this.prepareForChange();
        this.setMatcherListField('CampaignIds', data);
      }, this);

      this.NewPageMatcherEventsAnalyticsItemPickerSelectedItems.on('change:items', function (data) {
        this.prepareForChange();
        this.setMatcherListField('EventIds', data);
      }, this);

      this.NewPageMatcherOutcomesAnalyticsItemPickerSelectedItems.on('change:items', function(data) {
        this.prepareForChange();
        this.setMatcherListField('OutcomeIds', data);
      }, this);
    },

    customRule: function () {
      var self = this;
      var selectedRuleType = this.get('RuleTemplate'); //remember which was selected in case we fail.
      this.CustomRadioButton.check();

      var ruleEditorPromise = this.currentMatcher.isNew ?
          this.savePageMatcher() :
          Q({});

      ruleEditorPromise
          .then(function () {
            var context = {
              data: {
                itemId: self.currentMatcher.Id,
                database: self.currentMatcher.Database || window.top.ExperienceEditor.getContext().instance.currentContext.database,
                field: "Matcher Rule",
                initValue: self.currentMatcher.RuleXmlValue
              },
              complete: $.proxy(function (data) {
                if (data) {
                  self.currentMatcher.RuleXmlValue = data;
                }
              }, self)
            };
            _sc.Pipelines.OpenRulesEditor.execute(context);
          })
      .fail(function () {
        self.updateRuleTypeRadio(selectedRuleType);
      });
    },

    setMatcherListField: function (field, listControl) {
      var self = this;
      var list = self.currentMatcher[field];
      list.length = 0; // clear()
      $.each(listControl.get('items'), function (i, entry) {
        if (list.indexOf(entry.itemId) < 0) {
          list.push(entry.itemId);
        }
      });
    },

    prepareForChange: function () {
      this.OkButton.set('isEnabled', true);
    },

    savePageMatcherAndExit: function () {
      this.savePageMatcher(true);
    },

    savePageMatcher: function (closeOnSuccess) {
      var self = this;
      this.detailsValidator.clear();

      // set rule template explicitly when saving as not bound to any event
      this.currentMatcher.MatchRuleType = this.get('RuleTemplate');
      this.currentMatcher.updateMatchCriteria();

      if (self.currentMatcher.isValid()) {
        var isNew = self.currentMatcher.isNew;
        var savePromise = self.currentMatcher.save();

        return savePromise
            .then(function () {
              if (closeOnSuccess) {
                self.closeDialog(true);
              } else {
                self.detailsValidator.showMessageById('{15CB286C-D247-47D3-8558-9A90E4A44531}');

                if (isNew) {
                  self.currentMatcher.Id = decodeURIComponent(self.currentMatcher.Id);
                } else {
                  self.populate();
                }
              }
            })
            .fail(function (err) {
              self.detailsValidator.showMessageById('{1C2ECBD3-B2AA-4ED0-8CA1-139BFE787529}', err.message);
            });
      } else {
        self.detailsValidator.showDataValidationErrors(self.currentMatcher);
        return Q.fcall(function () { throw new Error('validation failed.'); });
      }
    }
  });
});
