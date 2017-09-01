define(["sitecore",
        "/-/speak/v1/FXM/Validation.js",
        "/-/speak/v1/FXM/ParamUtils.js",
        "/-/speak/v1/FXM/ManageFunctionsUtil.js",
        "/-/speak/v1/FXM/DomainMatcherService.js",
        "/-/speak/v1/FXM/BeaconService.js",
        "/-/speak/v1/FXM/WebUtil.js",
        "/-/speak/v1/FXM/Commands.js"],
        function (_sc, _validator, _paramUtils, _viewManager, _domainMatcherService, _beaconService, webUtil) {
          return _sc.Definitions.App.extend({
            initialize: function () {

              // prepare matcher
              this.currentMatcher = {};
            },

            initialized: function () {
              // validators
              this.domainValidator = new _validator(this.MessageBarDataSource, this.DomainTabMessageBar);
              this.validateValidator = new _validator(this.MessageBarDataSource, this.DomainTabValidationMessageBar);
              this.rulesValidator = new _validator(this.MessageBarDataSource, this.RulesTabMessageBar);

              this.RulesTabTreeview.set("whitelist", '*');
              this.RulesTabTreeview.set("templateswhitelist", '*');

              // Manage Functions view manager
              this.viewManager = new _viewManager(this.RulesTabTreeview, this.EditClientActionControl, this.EditPageMatcherControl, this.EditElementReplacerControl, this.rulesValidator);

              // load data
              this.initMatcher().fin($.proxy(this.wireEvents, this));
            },

            getMatcherId: function () {
              if (this.currentMatcher && this.currentMatcher.Id) {
                return this.currentMatcher.Id;
              }

              var id = _paramUtils.getIdFromContext(null, true);
              return id.valid ? id.id : null;
            },

            getEditMode: function () {
              var editMode = false;
              var editQsFlag = _sc.Helpers.url.getQueryParameters(window.location.href).edit;
              if (editQsFlag && editQsFlag === "true")
                editMode = true;
              return editMode;
            },

            toggleEditMode: function () {
              var context = {
                id: this.getMatcherId(),
                edit: !this.getEditMode()
              };
              _sc.Commands.executeCommand('Sitecore.Speak.Commands.OpenDomainMatcher', context);
            },

            readyForSaving: function () {
              this.SaveButton.set('isEnabled', true);
              this.currentMatcher.Name = this.DomainTabNameTextBox.get('text');
              this.currentMatcher.Domain = this.DomainTabUrlTextBox.get('text');
            },

            saveDomainMatcher: function () {
              var self = this;
              self.domainValidator.clear();

              if (self.currentMatcher.isValid()) {
                var isNew = self.currentMatcher.isNew;
                self.currentMatcher.save()
                    .then(function () {
                      self.domainValidator.showMessageById('{15CB286C-D247-47D3-8558-9A90E4A44531}');
                    })
                    .then(function () {
                      if (isNew) { // wait a bit, then attempt to reload the item
                        setTimeout(function () {
                          _domainMatcherService
                              .fetchEntity(decodeURIComponent(self.currentMatcher.Id))
                              .execute()
                              .then(function (data) {
                                self.currentMatcher = data;
                                self.toggleEditMode();
                              }).done();
                        }, 500);
                      }
                    })
                     .then(function () {
                       if (!isNew) { self.toggleEditMode(); }
                     })
                    .fail(function () {
                      self.domainValidator.showMessageById('{1C2ECBD3-B2AA-4ED0-8CA1-139BFE787529}');
                    });
              } else {
                self.domainValidator.showDataValidationErrors(self.currentMatcher);
              }
            },

            confirmDeleteDomainMatcher: function () {
              var context = {
                onConfirm: $.proxy(this.deleteDomainMatcher, this)
              };
              _sc.Commands.ConfirmDeletion.execute(context);
            },

            deleteDomainMatcher: function () {
              this.currentMatcher.destroy()
                  .then(function () {
                    _sc.Commands.executeCommand('Sitecore.Speak.Commands.OpenDomainDashboard');
                  })
                  .fail(function () {
                    alert('The delete failed.');
                  });
            },

            validateDomainMatcherScript: function () {
              var self = this;
              self.validateValidator.clear();

              if (!!self.currentMatcher.Domain) {
                _beaconService.checkScript(self.currentMatcher.Domain)
                    .done(function (data) {
                      var messageId = data ? '{FB17406D-4B3F-49FE-B58B-B73F45EBFA1D}' : '{FA54CCE3-ACD6-4ABF-AA4B-EC58B1DED1E1}';
                      self.validateValidator.showMessageById(messageId);
                    }).fail(function (data) {
                      self.validateValidator.showMessageById('{2C9B3C4E-B086-44BA-83AB-8C24FC9E91CF}', data.statusText);
                    });
              } else if (!self.currentMatcher.isNew) {
                self.validateValidator.showMessageById('{F578A1B3-FA8C-4148-9615-6339994E7E13}');
              }
            },

            populateDomain: function () {
              var editMode = this.getEditMode();
              this.DomainTabNameTextBox.set("text", this.currentMatcher.Name);
              this.DomainTabUrlTextBox.set("text", this.currentMatcher.Domain);

              this.DomainTabNameTextBox.set("isEnabled", editMode);
              this.DomainTabUrlTextBox.set("isEnabled", editMode);
            },

            populateValidationScript: function () {
              var self = this;

              _beaconService.getScript()
                  .done(function (data) {
                    self.DomainTabValidationGeneratedScriptTextArea.set("text", '<script src="' + data + '"></script>');
                  }).fail(function (data) {
                    self.validateValidator.showMessageById('{379D0E64-4F4A-4B66-94F0-4DE71ED94197}', data.statusText);
                  });
            },

            populateSummary: function () {
              this.SummaryDomainNameValue.set('text', this.currentMatcher.Name);
              this.SummaryDomainUrlValue.set('text', this.currentMatcher.Domain);
              this.SummaryCreatedByValue.set('text', this.currentMatcher.CreatedBy);
              this.SummaryPublishStatusValue.set('text', this.currentMatcher.LatestPublishedFormated);
              this.SummaryUpdatedValue.set('text', this.currentMatcher.UpdatedDateFormatted);
            },

            populateRules: function () {
              this.rulesValidator.clear();

              if (this.RulesTabAccordionWrapper.get('isVisible')) {
                this.SaveRuleItem.set('isVisible', true);
              } else {
                // no domain matcher children
                this.rulesValidator.showMessageById('{752C7117-2C48-4725-998B-CB9A26165F82}');
              }
            },

            populateButtons: function () {
              var editMode = this.getEditMode();
              this.ContentProgressIndicator.set('isVisible', false);
              this.SaveButton.set('isVisible', editMode);
              this.EditButton.set('isVisible', !editMode);
              this.PublishButton.set('isVisible', !editMode);
              this.DeleteButton.set('isVisible', !editMode);
              this.ExperienceEditorButton.set('isVisible', !editMode);
              var saveRuleItemVisibility = editMode && this.RulesTabAccordionWrapper.get("isVisible");
              this.SaveRuleItem.set('isVisible', saveRuleItemVisibility);

              var saveRuleItemEnabled = this.viewManager.treeview.viewModel.selectedNode() != null;
              this.SaveRuleItem.set('isEnabled', saveRuleItemEnabled);
            },

            initMatcher: function () {
              var self = this;

              //check for item id
              var id = this.getMatcherId();
              var getPromise;
              if (id) {
                getPromise = _domainMatcherService.fetchEntity(id).execute();
              } else {
                getPromise = _domainMatcherService.create();
              }

              return getPromise
                  .then(function (data) {
                    self.currentMatcher = data;
                    self.populate();
                  })
                  .fail(function (data) {
                    self.domainValidator.showMessageById('{A4C4D523-F79A-4E8F-829D-6EC32139EB3F}', data.statusText);
                  })
                  .fin(function () {
                    self.populateValidationScript();
                  });
            },

            wireEvents: function () {
              // exposed events
              this.on("save:DomainMatcher", this.saveDomainMatcher, this);
              this.on("open:PublishWizard", this.openPublishWizard, this);
              this.on("confirm:DeleteDomainMatcher", this.confirmDeleteDomainMatcher, this);
              this.on("delete:DomainMatcher", this.deleteDomainMatcher, this);
              this.on("cancel:DeleteDomainMatcher", this.cancelDeleteDomainMatcher, this);
              this.on("save:fxmfunction", this.saveItem, this);

              //internal events
              this.DomainTabNameTextBox.on("change:text", this.readyForSaving, this);
              this.DomainTabUrlTextBox.on("change:text", this.readyForSaving, this);

              var that = this;
              webUtil.triggerEventOnFieldChange(that, this.DomainTabNameTextBox, "change:text");
              webUtil.triggerEventOnFieldChange(that, this.DomainTabUrlTextBox, "change:text");

              // bind view manager
              this.viewManager.bindAllEvent("saved", this.saveRuleItemSuccess, this);
              this.viewManager.bindAllEvent("saveerror", this.saveRuleItemError, this);
              this.viewManager.bindAllEvent("change:hasChanges", function (ctl) {
                this.SaveRuleItem.set('isEnabled', ctl.get('hasChanges'));
              }, this);

              this.RulesTabTreeview.on("cancel:activate", this.navigateRuleError, this);

              this.DomainTabValidationGeneratedScriptTextArea.viewModel.$el
                  .on('focus', function () {
                    this.select();
                  });
            },

            saveItem: function () {
              this.rulesValidator.clear();
              this.viewManager.save();
            },

            saveRuleItemSuccess: function () {
              this.rulesValidator.showMessageById('{15CB286C-D247-47D3-8558-9A90E4A44531}');
              this.readyForSaving();
            },

            saveRuleItemError: function () {
              this.rulesValidator.showMessageById('{1C2ECBD3-B2AA-4ED0-8CA1-139BFE787529}', 'Error');
            },

            navigateRuleError: function () {
              this.rulesValidator.clear();
              this.rulesValidator.showMessageById('{75CADB08-EE73-4D00-A3CF-C7988B29143A}');
            },

            populate: function () {
              // title
              var isNew = this.currentMatcher.isNew;
              this.NewHeaderTitle.set('isVisible', isNew);
              this.EditHeaderTitle.set('isVisible', !isNew);

              this.populateDomain();
              this.populateSummary();
              this.populateRules();
              this.populateButtons();
              this.validateDomainMatcherScript();
              this.viewManager.isEnabled(this.getEditMode());
            },

            openPublishWizard: function () {
              var self = this;
              var context = {
                id: this.getMatcherId(),
                complete: function () {
                  // give the publishing a chance
                  setTimeout(function () {
                    self.initMatcher();
                  }, 500);
                }
              };

              _sc.Pipelines.OpenPublishWizard.execute(context);
            },
          });
        });
