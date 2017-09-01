define(
  [
    "sitecore",
    "/-/speak/v1/ExperienceEditor/ExperienceEditor.Context.js",
    "/-/speak/v1/ExperienceEditor/ExperienceEditorProxy.js",
    "/-/speak/v1/ExperienceEditor/TranslationUtil.js"
  ],
  function (Sitecore, ExperienceEditorContext, ExperienceEditorProxy, TranslationUtil) {
  var experienceEditor = {
    getContext: function() {
      return ExperienceEditorContext;
    },

    getPageEditingWindow: function() {
      return window.parent;
    },

    getPageDatasourcesItemIDs: function() {
      var itemsArray = experienceEditor.getPageEditingWindow().Sitecore.LayoutDefinition.getRenderingsWithDatasources();
      var itemIDs = [];
      $.each(itemsArray, function () {
        var datasource = this["@ds"];
        if (datasource != "") {
          var itemVersion = experienceEditor.getRenderingDatasourceItemVersion(this);
          var itemIdWithVersion = datasource + "," + itemVersion;
          itemIDs.push(itemIdWithVersion);
        }
      });

      return itemIDs;
    },

    getRenderingDatasourceItemVersion: function (renderingDefinition) {
      var shortRenderingId = experienceEditor.getPageEditingWindow().Sitecore.LayoutDefinition.getShortID(renderingDefinition["@id"]);
      var chromes = experienceEditor.getPageEditingWindow().Sitecore.PageModes.ChromeManager._chromes;
      var itemVersion;
      $.each(chromes, function () {
        if (!this.data || !this.data.custom || !this.data.custom.renderingID) {
          return;
        }

        if (this.data.custom.renderingID == shortRenderingId) {
          itemVersion = experienceEditor.Common.getItemVersion(this.data.contextItemUri);
        }
      });

      return itemVersion;
    },

    isShowDatasourcesIsTicked: function() {
      if (!Sitecore.Commands.ShowDataSources
        || !Sitecore.Commands.ShowDataSources.reEvaluate()) {
        return false;
      }

      var showDataSourcesCheckControl = experienceEditor.CommandsUtil.getControlsByCommand(experienceEditor.getContext().instance.Controls, "ShowDataSources")[0];
      if (!showDataSourcesCheckControl) {
        return false;
      }

      if (showDataSourcesCheckControl.model.get("isChecked") != "1") {
        return false;
      }

      return true;
    },

    getDatasourceUsagesWithFinalWorkflowStep: function (context, func) {
      var itemId = context.currentContext.itemId.toLowerCase();
      experienceEditor.PipelinesUtil.generateRequestProcessor("ExperienceEditor.Datasources.GetDatasourceUsagesWithFinalWorkflowStep", function (response) {
        var isInFinalStep = null;
        $.each(response.responseValue.value, function () {
          if (isInFinalStep == false) {
            return;
          }

          if (itemId.indexOf(this.ItemId) == -1) {
            isInFinalStep = this.IsFinalWorkflowStep;
          }
        });

        if (func) {
          func(response, isInFinalStep);
        }
      }).execute(context);
    },

    areItemsInFinalWorkflowState: function (context, itemsArray, func) {
      var itemId = context.currentContext.itemId.toLowerCase();
      if (itemsArray) {
        context.currentContext.value = itemsArray.join("|");
      }

      experienceEditor.PipelinesUtil.generateRequestProcessor("ExperienceEditor.Workflow.AreItemsInFinalWorkflowState", function (response) {
        var notInFinalStateCount = 0;
        var inFinalStateCount = 0;
        var inFinalStateCountAndNotPublished = 0;
        $.each(response.responseValue.value, function () {
          if (itemId.indexOf(this.ItemId) != -1) {
            return;
          }

          if (this.IsFinalWorkflowStep === false) {
            notInFinalStateCount ++;
          }

          if (this.IsFinalWorkflowStep === true) {
            inFinalStateCount++;
          }

          if (this.IsFinalWorkflowStep === true
            && this.IsPublished === false) {
            inFinalStateCountAndNotPublished++;
          }
        });

        var resultObject = {
          context: response.context,
          collection: response.responseValue.value,
          notInFinalStateCount: notInFinalStateCount,
          inFinalStateCount: inFinalStateCount,
          inFinalStateCountAndNotPublished: inFinalStateCountAndNotPublished
        };

        if (func) {
          func(resultObject);
        }
      }).execute(context);
    },

    isInMode: function (mode) {
      return experienceEditor.getContext().instance.currentContext.webEditMode.toLowerCase() == mode.toLowerCase();
    },

    isDebugging: function () {
      return experienceEditor.Web.getUrlQueryStringValue("sc_debug") == "1";
    },

    canToggleDebug: function () {
      if (experienceEditor.canDebug == null) {
        experienceEditor.canDebug = experienceEditor.getContext().instance.canExecute("ExperienceEditor.ToggleDebugRequests.CanToggleDebug", experienceEditor.getContext().instance.currentContext);
      }

      return experienceEditor.canDebug;
    },

    trigger: function(eventName) {
      jQuery(experienceEditor.getPageEditingWindow().document.body).trigger(eventName);
    },

    on: function (eventName, func) {
      jQuery(experienceEditor.getPageEditingWindow().document.body).on(eventName, func);
    },

    isInSharedLayout: function(context) {
      var editAllVersionsControls = this.CommandsUtil.getControlsByCommand(Sitecore.ExperienceEditor.Context.instance.Controls, "SelectLayout");
      if (editAllVersionsControls.length < 1
        || !editAllVersionsControls[0]
        || !editAllVersionsControls[0].model
        || !editAllVersionsControls[0].model.get) {
        return false;
      }

      return context.app.canExecute("ExperienceEditor.Versions.GetStatus", context.currentContext);
    },

    isEditingAndDesigningAllowed: function() {
      var isAllowed = (Sitecore.Commands.EnableEditing && Sitecore.Commands.EnableEditing.isEnabled) || (Sitecore.Commands.EnableDesigning && Sitecore.Commands.EnableDesigning.isEnabled);
      if (!isAllowed) {
        var commands = ["EnableEditing", "EnableDesigning"];
        for (var i = 0; i < commands.length; i++) {
          var controls = this.CommandsUtil.getControlsByCommand(this.getContext().instance.Controls, commands[i]);
          if (controls[0] && controls[0].model.get("isChecked") == "1") {
            isAllowed = true;
            break;
          }
        }
      }

      return isAllowed;
    },

    setSaveButtonState: function (isEnabled) {
      var saveButtonControls = experienceEditor.CommandsUtil.getControlsByCommand(ExperienceEditorContext.instance.Controls, "Save");
      if (saveButtonControls.length < 1
        || !saveButtonControls[0]
        || !saveButtonControls[0].view
        || !saveButtonControls[0].view.$el) {
        return;
      }

      var saveButton = saveButtonControls[0].view.$el;
      if (isEnabled) {
        saveButton.removeClass("disabled");
      } else {
        saveButton.addClass("disabled");
      }
    },

    modifiedHandling: function (disableRedirection, onCloseCallback) {
      if (!ExperienceEditorContext.isModified) {
        if (onCloseCallback) {
          return onCloseCallback(null);
        }

        return null;
      }

      experienceEditor.Dialogs.confirm(TranslationUtil.translateText(TranslationUtil.keys.The_item_has_been_modified), function (isOk) {
        if (!isOk) {
          if (onCloseCallback) {
            return onCloseCallback(isOk);
          }

          return null;
        }

        ExperienceEditorContext.instance.disableRedirection = disableRedirection;
        Sitecore.Commands.Save.execute(ExperienceEditorContext.instance);
        experienceEditor.Common.addOneTimeEvent(function () {
          return !ExperienceEditorContext.isModified;
        }, function () {
          if (onCloseCallback) {
            return onCloseCallback(isOk);
          }
        }, 100, this);

        return null;
      });
    },

    handleIsModified: function () {
      try {
        if (!Sitecore) {
          return;
        }

        if (!ExperienceEditorContext.isModified) {
          return;
        }

        return TranslationUtil.translateText(TranslationUtil.keys.There_are_unsaved_changes);
      } catch (e) {
        return;
      }
    },

    processInModifiedHandlingMode: function (callbackFunc) {
      if (!experienceEditor.getContext().isModified) {
        callbackFunc();
        return;
      }

      experienceEditor.modifiedHandling(true, function (isOk) {
        if (isOk) {
          eval(callbackFunc());
        }
      });
    },

    generatePageContext: function(context, doc) {
      var postElements;
      var scFieldValues = doc.getElementById("scFieldValues");
      if (scFieldValues) {
        postElements = scFieldValues.getElementsByTagName("input");
      }
      var fields = {};
      if (postElements) {
        for (var i = 0; i < postElements.length; i++) {
          fields[postElements[i].id] = experienceEditor.Web.encodeHtml(postElements[i].value);
        }
      }
      context.currentContext.scValidatorsKey = "VK_SC_PAGEEDITOR";
      context.currentContext.scFieldValues = fields;

      return context;
    },

    generateDefaultContext: function () {
      var currentLanguage = experienceEditor.Web.getUrlQueryStringValue("sc_lang");
      if (currentLanguage == '') {
        currentLanguage = ExperienceEditorProxy.language();
      }
      return {
        currentContext: {
          language: currentLanguage,
          version: "",
          isHome: false,
          itemId: experienceEditor.Web.getUrlQueryStringValue("itemId"),
          database: experienceEditor.Web.getUrlQueryStringValue("database"),
          deviceId: experienceEditor.Web.getUrlQueryStringValue("deviceId"),
          isLocked: false,
          webEditMode: experienceEditor.Web.getUrlQueryStringValue("mode"),
          argument: ""
        }
      };
    },

    navigateToItem: function (itemId) {
      var origin = experienceEditor.getPageEditingWindow().location.origin;
      if (!origin) {
        origin = experienceEditor.getPageEditingWindow().location.protocol + "//" + experienceEditor.getPageEditingWindow().location.hostname + (experienceEditor.getPageEditingWindow().location.port ? ':' + experienceEditor.getPageEditingWindow().location.port : '');
      }

      var virtualFolder = experienceEditor.getContext().instance.currentContext.virtualFolder;
      if (virtualFolder != "/" && virtualFolder != "") {
        origin = origin + virtualFolder;
      }

      var url = origin + experienceEditor.getPageEditingWindow().location.search;
      url = experienceEditor.Web.replaceItemIdParameter(url, itemId);
      url = experienceEditor.Web.setQueryStringValue(url, "sc_ee_fb", "false");
      url = experienceEditor.Web.removeQueryStringParameter(url, "sc_version");

      experienceEditor.navigateToUrl(url);
    },

    navigateToItemInCE: function (itemId) {
      var context = experienceEditor.generateDefaultContext();
      context.currentContext.value = itemId;
      var usePopUpContentEditor = experienceEditor.getPageEditingWindow().Sitecore.WebEditSettings.usePopUpContentEditor;
      if (usePopUpContentEditor) {
        experienceEditor.PipelinesUtil.generateRequestProcessor("ExperienceEditor.Breadcrumb.EditItem", function (response) {
          var value = response.responseValue.value.split('|');
          if (value.length != 2) {
            return;
          }

          var dialogUrl = value[0];
          var dialogFeatures = value[1];
          experienceEditor.Dialogs.showModalDialog(dialogUrl, null, dialogFeatures);
        }).execute(context);

        return;
      }

      experienceEditor.PipelinesUtil.generateRequestProcessor("ExperienceEditor.Item.GetUri", function (response) {
        var url = experienceEditor.Web.replaceCEParameter(window.top.location.toString(), "1");
        url = experienceEditor.Web.setQueryStringValue(url, "sc_ce_uri", encodeURIComponent(response.responseValue.value));
        experienceEditor.navigateToUrl(url);
      }).execute(context);
    },

    navigateToUrl: function (url) {
      experienceEditor.modifiedHandling(true, function (isOk) {
        experienceEditor.getPageEditingWindow().location = url;
      });
    },

    ribbonFrame: function () {
      return experienceEditor.getPageEditingWindow().document.getElementById("scWebEditRibbon");
    },

    ribbonDocument: function () {
      return experienceEditor.ribbonFrame().contentWindow.document;
    },

    ribbonIsCollapsed: function () {
      var isCollapsedCookie = experienceEditor.Common.getCookieValue("sitecore_webedit_ribbon");
      if (isCollapsedCookie === "") {
        return false;
      }

      return isCollapsedCookie === "1" ? false : true;
    },

    getCurrentTabId: function () {
      var previewTabId = "VersionStrip_ribbon_tab";
      var currentTab = experienceEditor.Common.getCookieValue("sitecore_webedit_activestrip");
      if (experienceEditor.Web.getUrlQueryStringValue("mode") == "preview"
        && document.getElementById(previewTabId) != null) {
        currentTab = previewTabId;
      }

      return currentTab;
    }
  };

  experienceEditor.Common = {
    getItemVersion: function (contextItemUri) {
      var fragments = contextItemUri.split("/")[contextItemUri.split("/").length - 1].split("?");
      if (!fragments
        || fragments.length === 0) {
        return "";
      }
      var verFragments = fragments[1].split(";ver=");
      if (!verFragments
        || verFragments.length === 0) {
        return "";
      }

      return verFragments[1];
    },

    registerDocumentStyles: function (stylesCollection, documentElement) {
      var doc = documentElement || document;
      for (var i = 0; i < stylesCollection.length; i++) {
        var cssHref = stylesCollection[i].toLowerCase();
        var isExists = false;
        for (var j = 0; j < doc.styleSheets.length; j++) {
          if (doc.styleSheets[j]
            && doc.styleSheets[j].href
            && doc.styleSheets[j].href.toLowerCase() == cssHref) {
            isExists = true;
            break;
          }
        }
        if (!isExists) {
          var link = document.createElement("link");
          link.href = cssHref;
          link.type = "text/css";
          link.rel = "stylesheet";
          doc.getElementsByTagName("head")[0].appendChild(link);
        }
      }
    },

    searchElementWithText: function (text, element) {
      var el = element || window.document.body;
      var elements = el.getElementsByTagName("*");
      for (var i = 0; i < elements.length; i++) {
        if ($(elements[i]).text() == text) {
          return elements[i];
        }
      }
      return null;
    },

    closeFullContentIframe: function (iframe) {
      if (!iframe && ExperienceEditorContext.openedFullContentIframe) {
        ExperienceEditorContext.openedFullContentIframe.ownerDocument.body.removeChild(ExperienceEditorContext.openedFullContentIframe);
        return;
      }

      if (iframe && iframe.parentNode === experienceEditor.getPageEditingWindow().document.body) {
        experienceEditor.getPageEditingWindow().document.body.removeChild(iframe);
      }
    },

    getCookieValue: function (cookieName) {
      var name = cookieName + "=";
      var cookies = document.cookie.split(';');
      for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i].trim();
        if (cookie.indexOf(name) == 0) {
          return cookie.substring(name.length, cookie.length);
        }
      }

      return "";
    },

    displayTab: function(tabControl) {
      if (!tabControl) {
        var tabs = jQuery(".sc-quickbar-tab");
        tabs.first().addClass("sc-quickbar-tab-selected");
        return;
      }

      if (ExperienceEditorContext.instance && ExperienceEditorContext.instance.cachedCommands) {
        experienceEditor.CommandsUtil.runCommandsCollectionCanExecute(ExperienceEditorContext.instance.cachedCommands, function (stripId) {
          if (stripId + "_ribbon_tab" != tabControl.id) {
            return true;
          }

          return experienceEditor.ribbonIsCollapsed();
        }, true);
      }

      var clickedTab = jQuery(tabControl);
      var selectedClassName = "sc-quickbar-tab-selected";
      var tabs = jQuery(".sc-quickbar-tab");
      var strips = jQuery(".sc-strip");

      tabs.removeClass(selectedClassName);
      clickedTab.addClass(selectedClassName);

      var tabIndex = tabs.index(clickedTab);
      strips.hide().eq(tabIndex).show();
      document.cookie = "sitecore_webedit_activestrip" + "=" + escape(tabControl.id);
    },

    setCookie: function (name, value, expires, path, domain, secure) {
      if (expires == null) {
        expires = new Date();
        expires.setMonth(expires.getMonth() + 3);
      }

      if (path == null) {
        path = "/";
      }

      document.cookie = name + "=" + escape(value) +
      (expires ? "; expires=" + expires.toGMTString() : "") +
      (path ? "; path=" + path : "") +
      (domain ? "; domain=" + domain : "") +
      (secure ? "; secure" : "");
    },

    addOneTimeEvent: function (conditionFunc, doFunc, interval, context) {
      var intervalFunc = window.setInterval(function () {
        if (conditionFunc(context)) {
          window.clearInterval(intervalFunc);
          doFunc(context);
        }
      }, interval);
    },

    showGallery: function (url, initiator, dimensions) {
      experienceEditor.Common.registerDocumentStyles(["/-/speak/v1/ribbon/Gallery.css"], experienceEditor.getPageEditingWindow().document);
      var clientRect = initiator.getBoundingClientRect();
      var iframeContentStyle = "z-index: 10000; display: none; overflow:auto; position: fixed; top: " + clientRect.top + "px; left: " + clientRect.left + "px; width: " + dimensions.width + "; height: " +
        dimensions.height;
      var iframeContent = document.createElement("iframe");
      iframeContent.className = "scGalleryFrame";
      iframeContent.contentEditable = "true";
      iframeContent.style.cssText = iframeContentStyle;
      iframeContent.src = url;
      iframeContent.id = "ee_iframeGallery";
      ExperienceEditorContext.openedFullContentIframe = iframeContent;

      iframeContent.onload = function () {
        iframeContent.style.display = "block";

        window.document.onclick = function () {
          experienceEditor.Common.closeFullContentIframe(iframeContent);
        };

        experienceEditor.getPageEditingWindow().document.onclick = function () {
          experienceEditor.Common.closeFullContentIframe(iframeContent);
        };
      };
      experienceEditor.getPageEditingWindow().document.body.appendChild(iframeContent);
    },

    getElementById: function (id) {
      return document.querySelector('[data-sc-id="' + id + '"]');
    },

    removeNotificationMessage: function(messageText) {
      experienceEditor.getContext().instance.NotificationBar.removeMessage(function (message) {
        return message.text == messageText;
      });

      if (!experienceEditor.getPageEditingWindow().Sitecore
        || !experienceEditor.getPageEditingWindow().Sitecore.PageModes
        || !experienceEditor.getPageEditingWindow().Sitecore.PageModes.DesignManager) {
        return;
      }

      experienceEditor.getPageEditingWindow().Sitecore.PageModes.DesignManager.sortingEnd();
    }
  };

  experienceEditor.Dialogs = {
    alert: function (message, onCloseCallback) {
      window.alert(message);
      if (onCloseCallback) {
        onCloseCallback();
      }
    },

    confirm: function (message, onCloseCallback, okButtonText, cancelButtonText, dialogHeader, dialogWidth, dialogHeight, messageWidth, messageHeight) {
      var dialogUrl = "/sitecore/client/Applications/ExperienceEditor/Dialogs/Confirm/?message=" + message;
      if (okButtonText) {
        dialogUrl += "&okButtonText=" + okButtonText;
      }

      if (cancelButtonText) {
        dialogUrl += "&cancelButtonText=" + cancelButtonText;
      }

      if (dialogHeader) {
        dialogUrl += "&dialogHeader=" + dialogHeader;
      }

      if (dialogWidth) {
        dialogUrl += "&dialogWidth=" + dialogWidth;
      }

      if (dialogHeight) {
        dialogUrl += "&dialogHeight=" + dialogHeight;
      }

      if (messageWidth) {
        dialogUrl += "&messageWidth=" + messageWidth;
      }

      if (messageHeight) {
        dialogUrl += "&messageHeight=" + messageHeight;
      }

      experienceEditor.Dialogs.showModalDialog(dialogUrl, "", "", null, onCloseCallback);
    },

    prompt: function (message, defaultValue, onCloseCallback) {
      var dialogUrl = "/sitecore/client/Applications/ExperienceEditor/Dialogs/Prompt/?message=" + message + "&defaultValue=" + defaultValue;
      experienceEditor.Dialogs.showModalDialog(dialogUrl, "", "", null, onCloseCallback);
    },

    showModalDialog: function (dialogUrl, dialogArguments, dialogFeatures, request, onCloseCallback) {
      this.setDialogLoadedEvent();
      var dialogFrame = this.getjqueryModalDialogsFrame();
      if (!dialogFrame) {
        return;
      }

      if (dialogUrl.toLowerCase().indexOf("/sitecore/client/applications/experienceeditor/dialogs/") == 0) {
        dialogFrame.style.opacity = "0";
        dialogFrame.style.filter = 'alpha(opacity=0)';
      }

      if (!dialogFeatures) {
        dialogFeatures = "dialogHeight: 700px;dialogWidth: 800px;";
      }

      if (!request) {
        request = {
          dialogResult: "",
          resume: function (data) { }
        };
      }

      dialogFrame.contentWindow.showModalDialog(dialogUrl, dialogArguments, dialogFeatures, request, null, window, onCloseCallback);
    },

    setDialogLoadedEvent: function () {
      var jqueryModalDialogsFrame = this.getjqueryModalDialogsFrame();
      if (!jqueryModalDialogsFrame) {
        return;
      }

      jQuery(jqueryModalDialogsFrame.contentWindow.document).one("DOMSubtreeModified", function () {
        var scContentIframeId0 = jqueryModalDialogsFrame.contentWindow.document.getElementById("scContentIframeId0");
        if (!scContentIframeId0) {
          return;
        }

        scContentIframeId0.onload = function () {
          jQuery(document).trigger("dialog:loaded", scContentIframeId0.contentWindow.document);
        };
      });
    },

    getjqueryModalDialogsFrame: function () {
      return experienceEditor.getPageEditingWindow().parent.parent.document.getElementById("jqueryModalDialogsFrame");
    }
  };

  experienceEditor.Web = {
    downloadFile: function (filename) {
      var sitecore = scSitecore.prototype;
      var request = { pipeline: "DownloadFile" };
      var command = { value: filename };
      sitecore.state = {};
      sitecore.process(request, command, "Download");
    },

    updateHtml5Cache: function () {
      if (!navigator.onLine) {
        return;
      }

      window.applicationCache.addEventListener('updateready', function (e) {
        if (window.applicationCache.status == window.applicationCache.UPDATEREADY) {
          window.applicationCache.swapCache();
        }
      }, false);
      try {
        window.applicationCache.update();
      } catch (err) {
        console.log("ApplicationCache is not declared.");
      }
    },

    encodeHtml: function (htmlSource) {
      return jQuery('<div/>').text(htmlSource).html();
    },

    getUrlQueryStringValue: function (parameterName) {
      return this.getQueryStringValue(location.href, parameterName);
    },

    getQueryStringValue: function (url, parameterName) {
      parameterName = parameterName.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
      var regex = new RegExp("[\\?&]" + parameterName + "=([^&#]*)");
      var results = regex.exec(decodeURIComponent(url));
      return results == null ? "" : results[1].replace(/\+/g, " ");
    },

    setQueryStringValue: function (url, parameterName, newValue) {
      url = url.toLowerCase();
      parameterName = parameterName.toLowerCase();
      if (url.indexOf("&" + parameterName + "=") == -1 && url.indexOf("?" + parameterName + "=") == -1) {
        var divider = url.indexOf("?") == -1 ? "?" : "&";
        url += divider + parameterName + "=" + newValue;
      } else {
        var regExp = new RegExp("(" + parameterName + "=)[^\&]+");
        url = (url.replace(regExp, '$1' + newValue));
      }

      return url;
    },

    removeQueryStringParameter: function (url, parameterName) {
      url = url.toLowerCase();
      parameterName = parameterName.toLowerCase();
      if (url.indexOf("?" + parameterName + "=") != -1) {
        url = url.replace(new RegExp("(" + parameterName + "=)[^\&]+\&?"), "");
      }

      if (url.indexOf("&" + parameterName + "=") != -1) {
        url = url.replace(new RegExp("(\&" + parameterName + "=)[^\&]+"), "");
      }

      return url;
    },

    replaceItemIdParameter: function (url, itemId) {
      return experienceEditor.Web.setQueryStringValue(url, "sc_itemid", itemId);
    },

    replaceCEParameter: function (url, value) {
      return experienceEditor.Web.setQueryStringValue(url, "sc_ce", value);
    },

    postServerRequest: function (requestType, commandContext, handler, async) {
      var token = $('input[name="__RequestVerificationToken"]').val();
      jQuery.ajax({
        url: "/-/speak/request/v1/expeditor/" + requestType,
        data: {
          __RequestVerificationToken: token,
          data: unescape(JSON.stringify(commandContext))
        },
        success: handler,
        type: "POST",
        async: async != undefined ? async : false
      });
    }
  };

  experienceEditor.PipelinesUtil = {
    generateDialogCallProcessor: function (options) {
      var pipelineProcessor = {
        priority: 1,
        execute: function(context) {
          context.suspend();
          experienceEditor.Dialogs.showModalDialog(options.url(context), options.arguments, options.features, options.request, function(responseValue) {
            if (!responseValue || responseValue.length <= 0) {
              context.abort();
              return;
            }

            if (options.onSuccess) {
              options.onSuccess(context, responseValue);
            }

            context.resume();
          });
        }
      };

      return pipelineProcessor;
    },

    generateRequestProcessor: function (requestType, onSuccess, customContext) {
      var pipelineProcessor =
      {
        priority: 1,
        execute: function (context, appPostRequest) {
          if (context == null) {
            context = experienceEditor.generateDefaultContext();
          }
          var postContext = !customContext ? context.currentContext : customContext;
          var app = !appPostRequest ? context.app : appPostRequest;
          if (!app || !app.postServerRequest) {
            if (!app) {
              app = {};
            }
            app.postServerRequest = experienceEditor.Web.postServerRequest;
          }
          app.postServerRequest(requestType, postContext, function (response) {
            if (response.error) {
              if (app && app.handleResponseErrorMessage) {
                app.handleResponseErrorMessage(response, true);
              } else {
                if (response.errorMessage) {
                  //experienceEditor.Dialogs.alert(response.errorMessage);
                }
              }

              if (context.abort) {
                context.abort();
              }

              return;
            }

            if (!response.responseValue) {
              console.log(requestType + " is not implemented on server side.");
              context.abort();
              return;
            }

            if (response.responseValue.abortMessage
              && response.responseValue.abortMessage != "") {
              experienceEditor.Dialogs.alert(response.responseValue.abortMessage);
              context.abort();
              return;
            }

            if (response.responseValue.confirmMessage
              && response.responseValue.confirmMessage != "") {
              experienceEditor.Dialogs.confirm(response.responseValue.confirmMessage, function (isOk) {
                if (!isOk) {
                  context.abort();
                  return;
                }

                context.resume();
                experienceEditor.PipelinesUtil.onRequestProcessorSuccessCallback(onSuccess, context, postContext, response);
              });
              context.suspend();
              return;
            }

            experienceEditor.PipelinesUtil.onRequestProcessorSuccessCallback(onSuccess, context, postContext, response);
          }, false);
        }
      };

      return pipelineProcessor;
    },

    onRequestProcessorSuccessCallback: function (onSuccess, context, postContext, response) {
      if (!onSuccess) {
        return;
      }

      var responseContext = {};
      if (context) {
        responseContext = context;
      } else {
        responseContext.currentContext = postContext;
      }
      response.context = responseContext;

      onSuccess(response);
    },

    executeProcessors: function (pipeline, context, onPipelineFinished) {
      if (pipeline == null) {
        return;
      }
      var processors = pipeline.processors;
      var list = _.sortBy(processors, function (processor) {
        return processor.priority;
      });

      var firstProcessor = list[0];
      if (!firstProcessor) {
        return;
      }

      context.pipelineProcessors = list;
      context.currentProcessorIndex = 0;

      experienceEditor.PipelinesUtil.runProcessor(context, onPipelineFinished);
    },

    runProcessor: function (context, onPipelineFinished) {
      var processor = context.pipelineProcessors[context.currentProcessorIndex];
      if (!processor) {
        if (onPipelineFinished) {
          onPipelineFinished(context);
        }

        return;
      }

      context.suspend = function () {
        context.suspended = true;
      };

      context.resume = function () {
        context.suspended = false;
        context.currentProcessorIndex++;
        experienceEditor.PipelinesUtil.runProcessor(context, onPipelineFinished);
      };

      context.abort = function () {
        context.aborted = true;
        if (onPipelineFinished) {
          onPipelineFinished(context);
        }
      };

      processor.execute(context);
      if (context.aborted) {
        return;
      }

      if (context.suspended) {
        return;
      }

      context.resume();
    },

    executePipeline: function (pipeline, executionFunction) {
      if (pipeline.get("isPipelineReady")) {
        executionFunction();
      } else {
        pipeline.loadAndInitPipeline();
        pipeline.on("pipelineready", executionFunction);
      }
    },
  };

  experienceEditor.CommandsUtil = {
    dropDownMenuItemCommands: new Array(),

    addDropDownMenuItemCommand: function (menuItemId, commandName) {
      if (menuItemId == "" || commandName == "") {
        return;
      }

      this.dropDownMenuItemCommands.push({
        menuItemId: menuItemId,
        commandName: commandName
      });
    },

    runCommandsCollectionCanExecute: function(commands, skipConditionFuncByStripId, skipEvaluated) {
      $.each(commands, function () {
        if (this.postponed && skipConditionFuncByStripId && skipConditionFuncByStripId(this.stripId)) {
          return;
        }

        if (this.command === undefined) {
          var controlStateResult = this.initiator.viewModel.$el.attr("data-sc-controlstateresult");
          if (controlStateResult && controlStateResult != "") {
            this.initiator.set({ isEnabled: controlStateResult == "True" });
          }
          return;
        }

        if (skipEvaluated && this.evaluated) {
          return;
        }

        var context = experienceEditor.getContext().instance.getContext(this.initiator);
        var clonedContext = experienceEditor.getContext().instance.clone(context);
        this.initiator.set({ isEnabled: this.command.canExecute(clonedContext, this) });
        this.evaluated = true;
      });
    },

    getCommandByDropDownMenuItemId: function (dropDownMenuItemId) {
      if (dropDownMenuItemId == "") {
        return null;
      }

      var command = null;

      $.each(this.dropDownMenuItemCommands, function () {
        if (this.menuItemId == dropDownMenuItemId) {
          command = this;
        }
      });

      return command;
    },

    runCommandCanExecute: function (commandName, context) {
      var command = ExperienceEditorContext.instance.getCommand(commandName);
      if (!command) {
        return false;
      }

      return command.canExecute(context);
    },

    runCommandExecute: function (commandName, context) {
      var command = ExperienceEditorContext.instance.getCommand(commandName);
      if (!command) {
        return;
      }

      command.execute(context);
    },

    getControlsByCommand: function (app, command) {
      var controls = [];
      $.each(app, function () {
        if (this.get && this.get("command") == command
          || this.model && this.model.get && this.model.get("command") == command) {
          controls.push(this);
        }
      });

      return controls;
    },

    triggerControlStateByCommand: function (that, isPressedModelName) {
      that.toggleInternalPressed();
      var id = that.$el.attr("data-sc-id");
      var subscribedControls = experienceEditor.CommandsUtil.getControlsByCommand(that.app, that.model.get("command"));
      var buttonValue = that.model.get(isPressedModelName);
      $.each(subscribedControls, function () {
        if (this.viewModel.toggleInternalPressed
          && id != this.viewModel.$el.attr("data-sc-id")) {

          this.viewModel.updatePressed(buttonValue);
        }
      });
    },
  };

  return experienceEditor;
});