define(
  [
    "sitecore",
    "/-/speak/v1/ExperienceEditor/ExperienceEditor.js",
    "/-/speak/v1/ExperienceEditor/ExperienceEditor.Context.js",
    "/-/speak/v1/ExperienceEditor/DOMHelper.js",
    "/-/speak/v1/ExperienceEditor/TranslationUtil.js",
    "/-/speak/v1/ExperienceEditor/ValidateFieldsUtil.js"
  ],
  function (Sitecore, ExperienceEditor, ExperienceEditorContext, DOMHelper, TranslationUtil, ValidationUtil) {
    var RibbonPageCode = Sitecore.Definitions.App.extend({
      initialized: function () {
        Sitecore.ExperienceEditor = Sitecore.ExperienceEditor || {};
        this.currentContext = {
          language: this.PageEditBar.get("language"),
          version: this.PageEditBar.get("version"),
          isFallback: this.PageEditBar.get("isFallback"),
          isHome: this.PageEditBar.get("isHome"),
          itemId: this.PageEditBar.get("itemId"),
          database: this.PageEditBar.get("database"),
          deviceId: this.PageEditBar.get("deviceId"),
          isLocked: this.PageEditBar.get("isLocked"),
          isLockedByCurrentUser: this.PageEditBar.get("isLockedByCurrentUser"),
          ribbonUrl: decodeURIComponent(this.PageEditBar.get("url")),
          siteName: this.PageEditBar.get("siteName"),
          isReadOnly: this.PageEditBar.get("isReadOnly"),
          analyticsEnabled: this.PageEditBar.get("analytisEnabled"),
          webEditMode: ExperienceEditor.Web.getUrlQueryStringValue("mode"),
          requireLockBeforeEdit: this.PageEditBar.get("requireLockBeforeEdit"),
          virtualFolder: this.PageEditBar.get("virtualFolder"),
          isInFinalWorkFlow: this.PageEditBar.get("isInFinalWorkflow"),
          argument: ""
        };

        this.collapsed = ExperienceEditor.Common.getCookieValue("sitecore_webedit_ribbon") == "1";
        this.setToggleShow();

        ExperienceEditorContext.instance = this;
        ExperienceEditorContext.instance.ValidationUtil = ValidationUtil;

        // Support old approach to load script resources. Should be removed in the next product version.
        if (Sitecore.ExperienceEditor.instance) {
          Sitecore.ExperienceEditor.instance = this;
        }

        window.top.ExperienceEditor = ExperienceEditor;

        this.initializeExperienceEditorObject(this);
        this.initializeNotifications(this);
        if (this.currentContext.webEditMode == "edit") {
          this.initializeFieldsValidation(this);
          this.processItemLocking(this);
        }

        DOMHelper.divideButtons("sc-chunk-button-small", "sc-chunk-button-small-list");
        DOMHelper.divideButtons("sc-chunk-check-small", "sc-chunk-check-list");

        var self = this;
        var pipelineContext = this.clone(this.currentContext);
        ExperienceEditor.PipelinesUtil.executePipeline(this.InitializePageEditPipeline, function () {
          Sitecore.Pipelines.InitializePageEdit.execute({ app: self, currentContext: pipelineContext });
          self.setHeight();
          self.trigger("button:toggleshow", true);
        });

        $(window).bind("click resize", function () {
          self.setHeight();
        });

        DOMHelper.prepareHeaderButtons();
        this.enableButtonClickEvents();

        ExperienceEditor.Common.addOneTimeEvent(function () {
          return ExperienceEditor.getPageEditingWindow().Sitecore.PageModes.PageEditor;
        }, function (that) {
          ExperienceEditor.getPageEditingWindow().Sitecore.PageModes.PageEditor.save = function () {
            that.save();
          };
        }, 50, this);

        if (ExperienceEditor.getPageEditingWindow().NotifcationMessages != undefined) {
          ExperienceEditor.getPageEditingWindow().NotifcationMessages.forEach(function (entry) {
            self.showNotification(entry.type, entry.text, true, false);
          });
        }

        ExperienceEditor.getPageEditingWindow().onbeforeunload = ExperienceEditor.handleIsModified;
      },
      save: function () {
        if (!ExperienceEditorContext.instance.getCommand("Save")) {
          return;
        }

        if (ExperienceEditor.getPageEditingWindow()
          && ExperienceEditor.getPageEditingWindow().document
          && ExperienceEditor.getPageEditingWindow().document.activeElement
          && ExperienceEditor.getPageEditingWindow().document.activeElement.blur) {
          ExperienceEditor.getPageEditingWindow().document.activeElement.blur();
        }
        ExperienceEditorContext.instance.executeCommand("Save", null);
      },

      initializeFieldsValidation: function (context) {
        ExperienceEditor.PipelinesUtil.generateRequestProcessor("ExperienceEditor.ToggleRegistryKey.Get", function (response) {
          if (!response.responseValue.value) {
            return;
          }

          ValidationUtil.validateFields(context);
        }, { value: "/Current_User/Page Editor/Capability/FieldsValidation" }).execute(context);
      },

      initializeNotifications: function (context) {
        var webEditMode = context.currentContext.webEditMode;
        if (webEditMode) {
          webEditMode = webEditMode.toLowerCase();
        }

        var isPreviewMode = webEditMode === "preview";
        var isEditMode = webEditMode === "edit";
        if (!isPreviewMode
          && !isEditMode) {
          return;
        }

        this.registerPageEditorNotificationHandler();
        ExperienceEditorContext.instance.NotificationBar.viewModel.$el.click(function () { ExperienceEditorContext.instance.setToggleShow(); });
        if (isEditMode) {
          ExperienceEditorContext.instance.NotificationBar.viewModel.$el.on("click", "button.close", function (e) {
            ExperienceEditor.getPageEditingWindow().Sitecore.PageModes.DesignManager.sortingEnd();
          });
        }

        if (isPreviewMode) {
          this.showPreviewModeNotifications(context);
        }

        if (isEditMode) {
          this.showEditModeNotifications(context);
        }

      },
      showEditModeNotifications: function (context) {
        ExperienceEditor.PipelinesUtil.generateRequestProcessor("ExperienceEditor.Item.Notifications", function (response) {
          var notificationTypes = ["error", "notification", "warning"];
          var notifications = response.responseValue.value;
          response.context.NotificationBar.removeMessages("");
          for (var i = 0; i < notifications.length; i++) {
            var notification = notifications[i];
            var notificationElement = ExperienceEditorContext.instance.showNotification(notificationTypes[notification.Type], notification.Description, true);
            if (notificationElement
              && notification.Options.length > 0) {
              for (var j = 0; j < notification.Options.length; j++) {
                $(notificationElement).append(DOMHelper.getNotificationOption(notification.Options[j].Title, notification.Options[j].Command));
              }
            }
          }
        }).execute(context);
      },
      showPreviewModeNotifications: function (context) {
        ExperienceEditor.areItemsInFinalWorkflowState(context, null, function (result) {
          if (result.notInFinalStateCount == 0) {
            return;
          }

          var notificationTitle = TranslationUtil.translateTextByServer(TranslationUtil.keys.This_page_contains_associated_content_that_has_not_been_approved_for_publishing_To_make_sure_the_associated_content_on_the_page_can_also_be_published_move_the_relevant_items_to_the_final_workflow_state);
          context.NotificationBar.removeMessages("");
          ExperienceEditorContext.instance.showNotification("notification", notificationTitle, true);
        });
      },
      publishAffectedPagesNotification: function (context) {
        if (!context.currentContext.isInFinalWorkFlow) {
          return;
        }

        var that = this;
        var itemIDs = ExperienceEditor.getPageDatasourcesItemIDs();
        if (itemIDs.length > 0) {
          ExperienceEditor.areItemsInFinalWorkflowState(context, itemIDs, function (result) {
            if (result.inFinalStateCountAndNotPublished > 0) {
              that.showPublishAffectedPagesNotification();
              return;
            }
          });
        }

        ExperienceEditor.getDatasourceUsagesWithFinalWorkflowStep(context, function (context, isInFinalStep) {
          if (isInFinalStep == true) {
            that.showPublishAffectedPagesNotification();
            return;
          }
        });        
      },
      showPublishAffectedPagesNotification: function () {
        var notificationTitle = TranslationUtil.translateTextByServer(TranslationUtil.keys.This_component_contains_associated_content_If_you_publish_this_component_the_associated_content_is_also_published_to_a_number_of_other_pages_that_use_the_same_associated_content);
        // notificationTitle = notificationTitle.replace("{0}", result.inFinalStateCountAndNotPublished);
        ExperienceEditorContext.instance.showNotification("notification", notificationTitle, true);
      },
      registerPageEditorNotificationHandler: function () {
        ExperienceEditor.Common.addOneTimeEvent(function () {
          return ExperienceEditor.getPageEditingWindow().Sitecore.PageModes.PageEditor;
        }, function (that) {
          ExperienceEditor.getPageEditingWindow().Sitecore.PageModes.PageEditor.notificationBar.addNotification = that.handleNotifications;
        }, 50, this);
      },
      handleNotifications: function (notification) {
        var notificationElement = ExperienceEditorContext.instance.showNotification(notification.type, notification.text, true);
        if (!notificationElement
          || !notification.onActionClick
          || !notification.actionText) {
          return;
        }

        var actionLink = $(notificationElement).append(DOMHelper.getNotificationOption(notification.actionText));
        $(actionLink).click(function () { notification.onActionClick(); });
      },
      showNotification: function (type, text, isClosable, clearMessages) {
        if (jQuery(ExperienceEditorContext.instance.NotificationBar.viewModel.$el).text().indexOf(text) != -1) {
          return;
        }

        if (clearMessages) {
          ExperienceEditorContext.instance.NotificationBar.removeMessages("");
        }

        ExperienceEditorContext.instance.NotificationBar.addMessage(type, {
          text: text,
          actions: [],
          closable: isClosable,
        });
        if (ExperienceEditor.Web.getUrlQueryStringValue("mode") === "edit") {
          ExperienceEditor.getPageEditingWindow().Sitecore.PageModes.DesignManager.sortingEnd();
        }

        ExperienceEditorContext.instance.setHeight();
        return ExperienceEditor.Common.searchElementWithText(text);
      },
      processItemLocking: function (context) {
        if (!Sitecore.Commands.Lock || !Sitecore.Commands.Lock.allowLock(context.getContext())) {
          return;
        }

        if (!context.currentContext.requireLockBeforeEdit) {
          return;
        }

        if (context.currentContext.isLocked) {
          return;
        }

        var notificationTitle = TranslationUtil.translateText(TranslationUtil.keys.You_must_lock_this_item_before_you_can_edit_it);
        var notification = this.showNotification("warning", notificationTitle, true);
        var notificationOption = $(DOMHelper.getNotificationOption(TranslationUtil.translateText(TranslationUtil.keys.Lock_and_edit)));
        notificationOption.click(function (e) {
          context.executeCommand("Lock");
        });

        $(notification).append(notificationOption);
      },
      initializeExperienceEditorObject: function (context) {
        // Execute hooks
        var hooks = Sitecore.ExperienceEditor.Hooks || [];
        $.each(hooks, function () {
          this.execute(context);
        });
      },
      setToggleShow: function () {
        ExperienceEditor.Common.addOneTimeEvent(function (that) {
          ExperienceEditorContext.isFrameLoaded = window.frameElement.contentWindow.document.readyState === "complete";
          var ribbonHeight = that.ScopedEl.height();
          return ExperienceEditorContext.isRibbonRendered && ExperienceEditorContext.isFrameLoaded && ribbonHeight > 0 && ribbonHeight < 500;
        }, function (that) {
          that.setHeight(that.ScopedEl.height());
        }, 50, this);

        if (!this.QuickRibbon
          || this.QuickRibbon.viewModel.$el.attr("style")) {
          return;
        }

        this.QuickRibbon.viewModel.$el.attr("style", "float:right");
        this.QuickRibbon.viewModel.$el.find("img").attr("src", "/sitecore/shell/client/Speak/Assets/img/Speak/Common/16x16/white/navigate_down.png");
        this.on("button:toggleshow", function (denyCollapse) {
          if (denyCollapse != true) {
            this.collapsed = !this.collapsed;
          }

          if (this.collapsed) {
            this.QuickRibbon.viewModel.$el.find("img").attr("src", "/sitecore/shell/client/Speak/Assets/img/Speak/Common/16x16/white/navigate_up.png");
            this.Ribbon.viewModel.$el.show();
            this.setHeight(this.ScopedEl.height());
          } else {
            this.QuickRibbon.viewModel.$el.find("img").attr("src", "/sitecore/shell/client/Speak/Assets/img/Speak/Common/16x16/white/navigate_down.png");
            this.Ribbon.viewModel.$el.hide();
            this.setHeight(this.ScopedEl.height());
          }

          if (denyCollapse == true) {
            return;
          }

          ExperienceEditor.Common.setCookie("sitecore_webedit_ribbon", !this.collapsed ? "0" : "1");

          if (!this.collapsed) {
            return;
          }

          var activeTabId = ExperienceEditor.getCurrentTabId();
          if (ExperienceEditorContext.instance && ExperienceEditorContext.instance.cachedCommands) {
            ExperienceEditor.CommandsUtil.runCommandsCollectionCanExecute(ExperienceEditorContext.instance.cachedCommands, function (stripId) {
              return stripId && stripId + "_ribbon_tab" !== activeTabId;
            }, true);
          }
        }, this);
      },
      setHeight: function (height) {
        DOMHelper.setRibbonHeight(height, this);
      },
      findId: function (target) {
        if (target === undefined || target === null)
          return undefined;
        var id = $(target).data("sc-id");
        if (id === undefined)
          id = this.findId(target.parentNode);
        return id;
      },
      canExecute: function (commandQuery, commandContext) {
        var result = false;
        var that = this;
        this.postServerRequest(commandQuery, commandContext, function (response) {
          if (!response.error) {
            result = response.value || response.responseValue.value;
          } else {
            that.handleResponseErrorMessage(response);
          }
        });
        return result;

      },
      postServerRequest: function (requestType, commandContext, handler, async) {
        ExperienceEditor.Web.postServerRequest(requestType, commandContext, handler, async);
      },
      handleResponseErrorMessage: function (responseData, decodeMessage) {
        var errorMessage = TranslationUtil.translateText(TranslationUtil.keys.An_error_occured);
        var message = responseData.errorMessage !== undefined && responseData.errorMessage !== "" ? responseData.errorMessage : errorMessage;
        var element = this.showNotification("error", message, true, true);
        if (element && decodeMessage) {
          element.innerHTML = message;
        }

        var postScriptFunc = responseData.postScriptFunc;
        if (postScriptFunc) {
          try {
            eval(postScriptFunc);
          } catch (error) {
            console.warn("An '" + error + "' error occured during executing: \n" + postScriptFunc);
          }
        }

        return element;
      },
      refreshOnItem: function (context, allowParameterRedirection, keepVersion, keepSite) {
        ExperienceEditor.modifiedHandling(null, function (isOk) {
          if (allowParameterRedirection ||
            escape(ExperienceEditorContext.instance.currentContext.itemId) != escape(context.itemId)) {
            var url = "/?sc_itemid=" + context.itemId + "&sc_lang=" + context.language + "&sc_db=" + context.database + "&sc_device=" + context.deviceId + "&sc_mode=" + context.webEditMode;
            if (keepVersion) {
              url += "&sc_version=" + context.version;
            }

            if (keepSite) {
              url += "&sc_site=" + context.siteName;
            }

            ExperienceEditor.getPageEditingWindow().location = url;
            return;
          }

          ExperienceEditor.getPageEditingWindow().location.reload();
        });
      },
      enableButtonClickEvents: function () {
        this.on("button:click", function (event) {
          var button = this.getButton(event.sender.el);
          var that = this;
          var scriptUrl = this.getPageCodeScriptFileUrl(button);
          require(["sitecore", scriptUrl], function () {
            that.executeButtonCommand(button);
          });
        }, this);
        this.on("button:pressed", function (event) {
          var button = this.getButton(event.sender.el);
          this.setButtonPressed(button);
        }, this);
        this.on("button:check", function (event) {
          var button = this.getButton(event.sender.el);
          var that = this;
          var scriptUrl = this.getPageCodeScriptFileUrl(button);
          require(["sitecore", scriptUrl], function () {
            button.set({ isChecked: !button.get("isChecked") });
            that.executeButtonCommand(button);
          });
        }, this);
      },
      getPageCodeScriptFileUrl: function (button) {
        return button.viewModel.$el.attr('data-sc-PageCodeScriptFileName');
      },
      disableButtonClickEvents: function () {
        this.off("button:click");
        this.off("button:check");
      },
      clone: function (obj) {
        if (obj === null || typeof obj != "object")
          return obj;
        var copy = obj.constructor();
        for (var attr in obj) {
          if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
        }
        return copy;
      },
      getButton: function (eventTarget) {
        var id = this.findId(eventTarget);
        if (id === undefined)
          return undefined;
        return this[id];
      },

      setButtonPressed: function (button) {
        if (button == undefined) {
          return;
        }

        var buttonName = button.get("name");
        var isPressed = button.get("isPressed");
        $.each(this.Controls, function (index, control) {
          if (control.name == buttonName) {
            control.model.viewModel.set({ isPressed: !isPressed });
          }
        });
      },

      executeButtonCommand: function (button) {
        if (button.get("command") != undefined && button.get("command") != "") {
          this.executeCommand(button.get("command"), "", button);
        }
      },

      executeCommand: function (commandName, commandArgument, button) {
        if (!commandName | commandName == "") {
          return;
        }

        var context = this.getContext(button);

        context.currentContext.argument = commandArgument;
        Sitecore.Commands.executeCommand(this.formCommandName(commandName), context);
      },

      getCommand: function (commandName) {
        if (!commandName || commandName == "") {
          return null;
        }

        return Sitecore.Commands.getCommand(this.formCommandName(commandName));
      },

      formCommandName: function (commandName) {
        return "Sitecore.Speak.Commands." + commandName;
      },

      getContext: function (button) {
        return {
          app: this,
          button: button,
          currentContext: this.clone(this.currentContext)
        };
      }
    });

    return RibbonPageCode;
  });