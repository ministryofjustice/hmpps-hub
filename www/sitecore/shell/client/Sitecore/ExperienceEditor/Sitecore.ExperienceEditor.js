console.warn("Sitecore.ExperienceEditor.js is obsolete and will be removed in the next product version.");

var basePath = "/-/speak/v1/ExperienceEditor/";
define(
    [
        basePath + "PageEditorProxy.js",
        basePath + "Sitecore.ExperienceEditor.TranslationsUtils.js"
    ]
);

if (!Sitecore) {
  var Sitecore = {};
}

var experienceEditor = Sitecore.ExperienceEditor;
Sitecore.ExperienceEditor = {
  isModified: false,

  instance: null,

  isFrameLoaded: false,

  isRibbonRendered: false,

  canDebug: null,

  setSaveButtonState: function(isEnabled) {
    var saveButtonControls = Sitecore.ExperienceEditor.CommandsUtil.getControlsByCommand(Sitecore.ExperienceEditor.instance.Controls, "Save");
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
    if (!Sitecore.ExperienceEditor.isModified) {
      if (onCloseCallback) {
        return onCloseCallback(null);
      }

      return null;
    }

    Sitecore.ExperienceEditor.Dialogs.confirm(Sitecore.ExperienceEditor.TranslationsUtils.translateText(Sitecore.ExperienceEditor.TranslationsUtils.keys.The_item_has_been_modified), function(isOk) {
      if (!isOk) {
        if (onCloseCallback) {
          return onCloseCallback(isOk);
        }

        return null;
      }

      Sitecore.ExperienceEditor.instance.disableRedirection = disableRedirection;
      Sitecore.Speak.Commands.Save.execute(Sitecore.ExperienceEditor.instance);
      Sitecore.ExperienceEditor.Common.addOneTimeEvent(function () {
        return Sitecore.ExperienceEditor.isContentSaved;
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

      if (!Sitecore.ExperienceEditor.isModified) {
        return;
      }

      return Sitecore.ExperienceEditor.TranslationsUtils.translateText(Sitecore.ExperienceEditor.TranslationsUtils.keys.There_are_unsaved_changes);
    } catch (e) {
      return;
    }
  },

  generateDefaultContext: function () {
    var currentLanguage = Sitecore.ExperienceEditor.Web.getUrlQueryStringValue("sc_lang");
    if (currentLanguage == '') {
      currentLanguage = Sitecore.ExperienceEditor.PageEditorProxy.language();
      }
    return {
      currentContext: {
        language: currentLanguage,
        version: "",
        isHome: false,
        itemId: Sitecore.ExperienceEditor.Web.getUrlQueryStringValue("itemId"),
        database: Sitecore.ExperienceEditor.Web.getUrlQueryStringValue("database"),
        deviceId: Sitecore.ExperienceEditor.Web.getUrlQueryStringValue("deviceId"),
        isLocked: false,
        webEditMode: Sitecore.ExperienceEditor.Web.getUrlQueryStringValue("mode"),
        argument: ""
      }
    }
  },

  isInMode: function (mode) {
    return this.instance.currentContext.webEditMode.toLowerCase() == mode.toLowerCase();
  },

  isDebugging: function() {
    return Sitecore.ExperienceEditor.Web.getUrlQueryStringValue("sc_debug") == "1";
  },

  canToggleDebug: function() {
    if (this.canDebug == null) {
      this.canDebug = this.instance.canExecute("ExperienceEditor.ToggleDebugRequests.CanToggleDebug", this.instance.currentContext);
    }

    return this.canDebug;
  },

  navigateToItem: function (itemId) {
    var url = window.parent.location.origin + window.parent.location.search;
    url = Sitecore.ExperienceEditor.Web.replaceItemIdParameter(url, itemId);
    url = Sitecore.ExperienceEditor.Web.setQueryStringValue(url, "sc_ee_fb", "false");

    Sitecore.ExperienceEditor.navigateToUrl(url);
  },

  navigateToItemInCE: function (itemId) {
    var context = Sitecore.ExperienceEditor.generateDefaultContext();
    context.currentContext.value = itemId;
    var usePopUpContentEditor = window.parent.Sitecore.WebEditSettings.usePopUpContentEditor;
    if (usePopUpContentEditor) {
      Sitecore.ExperienceEditor.PipelinesUtil.generateRequestProcessor("ExperienceEditor.Breadcrumb.EditItem", function (response) {
        var value = response.responseValue.value.split('|');
        if (value.length != 2) {
          return;
        }

        var dialogUrl = value[0];
        var dialogFeatures = value[1];
        Sitecore.ExperienceEditor.Dialogs.showModalDialog(dialogUrl, null, dialogFeatures);
      }).execute(context);

      return;
    }

    Sitecore.ExperienceEditor.PipelinesUtil.generateRequestProcessor("ExperienceEditor.Item.GetUri", function (response) {
      var url = Sitecore.ExperienceEditor.Web.replaceCEParameter(window.top.location.toString(), "1");
      url = Sitecore.ExperienceEditor.Web.setQueryStringValue(url, "sc_ce_uri", encodeURIComponent(response.responseValue.value));
      Sitecore.ExperienceEditor.navigateToUrl(url);
    }).execute(context);
  },

  navigateToUrl: function(url) {
    Sitecore.ExperienceEditor.modifiedHandling(true, function(isOk) {
      window.parent.location = url;
    });
  },

  ribbonFrame: function () {
    return window.parent.document.getElementById("scWebEditRibbon");
  },

  ribbonDocument: function () {
    return Sitecore.ExperienceEditor.ribbonFrame().contentWindow.document;
  },
};

if (experienceEditor) {
  for (var k in experienceEditor) Sitecore.ExperienceEditor[k] = experienceEditor[k];
}

Sitecore.ExperienceEditor.Hooks = Sitecore.ExperienceEditor.Hooks || [];

Sitecore.ExperienceEditor.Common = {
  openedFullContentIframe: null,

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

  searchElementWithText: function(text, element) {
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
    if (!iframe && Sitecore.ExperienceEditor.Common.openedFullContentIframe) {
      Sitecore.ExperienceEditor.Common.openedFullContentIframe.ownerDocument.body.removeChild(Sitecore.ExperienceEditor.Common.openedFullContentIframe);
      return;
    }

    if (iframe && iframe.parentNode === window.parent.document.body) {
      window.parent.document.body.removeChild(iframe);
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
    Sitecore.ExperienceEditor.Common.registerDocumentStyles(["/-/speak/v1/ribbon/Gallery.css"], window.parent.document);
    var clientRect = initiator.getBoundingClientRect();
    var iframeContentStyle = "z-index: 10000; display: none; position: absolute; top: " + clientRect.top + "px; left: " + clientRect.left + "px; width: " + dimensions.width + "; height: " +
      dimensions.height;
    var iframeContent = document.createElement("iframe");
    iframeContent.className = "scGalleryFrame";
    iframeContent.contentEditable = "true";
    iframeContent.style.cssText = iframeContentStyle;
    iframeContent.scrolling = "no";
    iframeContent.src = url;
    iframeContent.id = "ee_iframeGallery";
    var ribbonWindow = window;
    this.openedFullContentIframe = iframeContent;
    
    iframeContent.onload = function () {
      iframeContent.style.display = "block";

      window.document.onclick = function () {
        Sitecore.ExperienceEditor.Common.closeFullContentIframe(iframeContent);
      };

      ribbonWindow.parent.document.onclick = function () {
        Sitecore.ExperienceEditor.Common.closeFullContentIframe(iframeContent);
      };
    };
    window.parent.document.body.appendChild(iframeContent);
  },

  getElementById: function (id) {
    return document.querySelector('[data-sc-id="' + id + '"]');
  },
};

Sitecore.ExperienceEditor.Dialogs = {
  alert: function (message, onCloseCallback) {
    window.alert(message);
    if (onCloseCallback) {
      onCloseCallback();
    }
  },

  confirm: function (message, onCloseCallback) {
    var dialogUrl = "/sitecore/client/Applications/ExperienceEditor/Dialogs/Confirm/?message=" + message;
    Sitecore.ExperienceEditor.Dialogs.showModalDialog(dialogUrl, "", "", null, onCloseCallback);
  },

  prompt: function (message, defaultValue, onCloseCallback) {
    var dialogUrl = "/sitecore/client/Applications/ExperienceEditor/Dialogs/Prompt/?message=" + message + "&defaultValue=" + defaultValue;
    Sitecore.ExperienceEditor.Dialogs.showModalDialog(dialogUrl, "", "", null, onCloseCallback);
  },

  showModalDialog: function (dialogUrl, dialogArguments, dialogFeatures, request, onCloseCallback) {
    var dialogFrame = window.parent.parent.parent.document.getElementById("jqueryModalDialogsFrame");
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
};

Sitecore.ExperienceEditor.Web = {
  downloadFile: function (filename) {
    var sitecore = window.parent.scSitecore.prototype;
    var request = { pipeline: "DownloadFile" };
    var command = { value: filename };
    sitecore.state = {};
    sitecore.process(request, command, "Download");
  },

  updateHtml5Cache: function() {
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
    htmlSource = htmlSource.replace(/\"/g, "\\\"");
    var encodedHtml = encodeURIComponent(htmlSource);
    return encodedHtml;
  },

  getUrlQueryStringValue: function (parameterName) {
    return this.getQueryStringValue(location.href, parameterName);
  },

  getQueryStringValue: function(url, parameterName) {
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
    return Sitecore.ExperienceEditor.Web.setQueryStringValue(url, "sc_itemid", itemId);
  },

  replaceCEParameter: function (url, value) {
    return Sitecore.ExperienceEditor.Web.setQueryStringValue(url, "sc_ce", value);
  },

  postServerRequest: function (requestType, commandContext, handler, async) {
    var token = $('input[name="__RequestVerificationToken"]').val();
    jQuery.ajax({
      url: "/-/speak/request/v1/expeditor/" + requestType,
      data: {
        __RequestVerificationToken: token,
        data: decodeURIComponent(decodeURIComponent(JSON.stringify(commandContext)))
      },
      success: handler,
      type: "POST",
      async: async != undefined ? async : false
    });
  },
};

Sitecore.ExperienceEditor.PipelinesUtil = {
  generateDialogCallProcessor: function (options) {
    var pipelineProcessor = {
      priority: 1,
      execute: function (context) {
        context.suspend();
        Sitecore.ExperienceEditor.Dialogs.showModalDialog(options.url(context), options.arguments, options.features, options.request, function (responseValue) {
          if (!responseValue || responseValue.length <= 0) {
            context.aborted = true;
            return;
          }

          if (options.onSuccess) {
            options.onSuccess(context, responseValue);
          }

          context.resume();
        });
      }
    }

    return pipelineProcessor;
  },

  generateRequestProcessor: function (requestType, onSuccess, customContext) {
    var pipelineProcessor =
    {
      priority: 1,
      execute: function (context, appPostRequest) {
        if (context == null) {
          context = Sitecore.ExperienceEditor.generateDefaultContext();
        }
        var postContext = !customContext ? context.currentContext : customContext;
        var app = !appPostRequest ? context.app : appPostRequest;
        if (!app || !app.postServerRequest) {
          if (!app) {
            app = {};
          }
          app.postServerRequest = Sitecore.ExperienceEditor.Web.postServerRequest;
        }
        app.postServerRequest(requestType, postContext, function (response) {
          if (response.error) {
            if (app && app.handleResponseErrorMessage) {
              app.handleResponseErrorMessage(response);
            } else {
              if (response.errorMessage) {
                //Sitecore.ExperienceEditor.Dialogs.alert(response.errorMessage);
              }
            }
            context.aborted = true;
            return;
          }

          if (!response.responseValue) {
            console.log(requestType + " is not implemented on server side.");
            context.aborted = true;
            return;
          }

          if (response.responseValue.abortMessage
            && response.responseValue.abortMessage != "") {
            Sitecore.ExperienceEditor.Dialogs.alert(response.responseValue.abortMessage);
            context.aborted = true;
            return;
          }

          if (response.responseValue.confirmMessage
            && response.responseValue.confirmMessage != "") {
            Sitecore.ExperienceEditor.Dialogs.confirm(response.responseValue.confirmMessage, function (isOk) {
              if (!isOk) {
                context.aborted = true;
                return;
              }

              context.resume();
              Sitecore.ExperienceEditor.PipelinesUtil.onRequestProcessorSuccessCallback(onSuccess, context, postContext, response);
            });
            context.suspend();
            return;
          }

          Sitecore.ExperienceEditor.PipelinesUtil.onRequestProcessorSuccessCallback(onSuccess, context, postContext, response);
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

  executeProcessors: function (pipeline, context) {
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

    Sitecore.ExperienceEditor.PipelinesUtil.runProcessor(context);
  },

  runProcessor: function (context) {
    var processor = context.pipelineProcessors[context.currentProcessorIndex];
    if (!processor) {
      return;
    }

    context.suspend = function () {
      context.suspended = true;
    };

    context.resume = function () {
      context.suspended = false;
      context.currentProcessorIndex++;
      Sitecore.ExperienceEditor.PipelinesUtil.runProcessor(context);
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

Sitecore.ExperienceEditor.CommandsUtil = {
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

  getCommandByDropDownMenuItemId: function(dropDownMenuItemId) {
    if (dropDownMenuItemId == "") {
      return null;
    }

    var command = null;

    $.each(this.dropDownMenuItemCommands, function() {
      if (this.menuItemId == dropDownMenuItemId) {
        command = this;
      }
    });

    return command;
  },

  runCommandCanExecute: function(commandName, context) {
    var command = Sitecore.ExperienceEditor.instance.getCommand(commandName);
    if (!command) {
      return false;
    }

    return command.canExecute(context);
  },

  runCommandExecute: function(commandName, context) {
    var command = Sitecore.ExperienceEditor.instance.getCommand(commandName);
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
    var subscribedControls = Sitecore.ExperienceEditor.CommandsUtil.getControlsByCommand(that.app, that.model.get("command"));
    var buttonValue = that.model.get(isPressedModelName);
    $.each(subscribedControls, function () {
      if (this.viewModel.toggleInternalPressed
        && id != this.viewModel.$el.attr("data-sc-id")) {

        this.viewModel.updatePressed(buttonValue);
      }
    });
  },
};

if (Sitecore.Speak) {
  var experienceEditor = Sitecore.Speak.ExperienceEditor;
  Sitecore.Speak.ExperienceEditor = Sitecore.ExperienceEditor;
  if (experienceEditor) {
    for (var k in experienceEditor) Sitecore.Speak.ExperienceEditor[k] = experienceEditor[k];
  }
}