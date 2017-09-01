(function () {
  var dependencies = (typeof window !== "undefined") ? ["sitecore", "/-/speak/v1/listmanager/cookieParser.js"] : [null, "./cookieParser"];
  define(dependencies, function (sitecore, cookieParser) {
    var pageIndexKey = "pageIndex",
        ieAccessDeniedMessage = "At the moment, you cannot use or edit the list. Another user is using the list or its source. Please try again later.";

    return {
      cookieParser: cookieParser,
      getTargetControl: function (parameters) {
        var targetControlName = parameters.control;
        return this[targetControlName];
      },
      getSelectedItemId: function (parameters) {
        var targetControl = this.getTargetControl(parameters);
        if (typeof targetControl !== "undefined" && targetControl !== null) {
          return targetControl.get("selectedItemId");
        }
        return "";
      },
      getSelectedItemType: function (parameters) {
        var targetControl = this.getTargetControl(parameters);
        if (typeof targetControl !== "undefined" && targetControl !== null) {
          var selectedItem = targetControl.get("selectedItem");
          if (selectedItem !== "") {
            return selectedItem.get("Type");
          }
        }

        return "";
      },
      showMoreCalled: function (parameters, callback) {
        var targetDataSourceName = parameters.entityDataSource,
        targetDataSource = this[targetDataSourceName];
        var pageIndex = targetDataSource.query.__parameters[pageIndexKey];
        pageIndex = new Number(pageIndex);
        pageIndex = pageIndex + 1;
        targetDataSource.query.__parameters[pageIndexKey] = pageIndex;
        var baseStructure = Array.prototype.filter.call(this.baseStructures, function (e) {
          return e.dataSource == targetDataSource;
        })[0];
        baseStructure.concatItems = true;
        callback(baseStructure, this);
      },
      getAntiForgeryToken: function () {
        return sitecore.Helpers.antiForgery.getAntiForgeryToken();
      },
      callController: function (parameters, urlQuery, onSuccessCallback, onErrorCallback) {
        var actionData = this.extractActionData(parameters);
        var actionsDefaultUrl = actionData.url;
        var actionUrl = actionsDefaultUrl + urlQuery;
        this.callControllerDirectly(actionUrl, "", onSuccessCallback, onErrorCallback);
      },
      callControllerDirectly: function (actionUrl, data, onSuccessCallback, onErrorCallback, contentType) {
        if (typeof contentType === "undefined" || contentType === null || contentType === "") {
          contentType = "application/x-www-form-urlencoded; charset=UTF-8";
        }
        var current = this;
        var csrfToken = this.getAntiForgeryToken();
        this.ajax({
          type: "POST",
          beforeSend: function (request) {
            request.setRequestHeader(csrfToken.headerKey, csrfToken.value);
          },
          url: actionUrl,
          data: data,
          contentType: contentType,
          success: function (returnData, state, obj) {
            onSuccessCallback(returnData, current, state, obj);
          },
          error: function (jqXhr) {
			var message =  JSON.parse(jqXhr.responseText || "{}").Message
            onErrorCallback(jqXhr.status, message || jqXhr.statusText);
          }
        });
      },
      ajax: function (call) {
        $.ajax(call);
      },
      extractActionData: function (parameters) {
        var targetDataSourceName = parameters.actionsDataSource,
          targetDataSource = this[targetDataSourceName];

        return {
          dataSource: targetDataSource,
          url: targetDataSource.get("url")
        };
      },
      showDefaultError: function (status, statusText, defaultText, messageContainer) {
        this.showError(status === 500 ? defaultText : statusText, messageContainer);
      },
      showError: function (text, messageContainer) {
        this.showMessage(text, messageContainer, "error", 10000);
      },
      showWarning: function (text, messageContainer, timeout, keepPrevious) {
        this.showMessage(text, messageContainer, "warning", timeout, keepPrevious);
      },
      showNotification: function (text, messageContainer) {
        this.showMessage(text, messageContainer, "notification", 10000);
      },
      showNotificationWithPreviousMessage: function (text, messageContainer) {
        this.showMessage(text, messageContainer, "notification", 10000, true);
      },
      showPinnedNotification: function (text, messageContainer) {
        this.showMessage(text, messageContainer, "notification", 0);
      },
      showMessage: function (text, messageContainer, messageType, timeout, keepPrevious) {
        if (!keepPrevious) {
          messageContainer.removeMessages("");
        }

        if (!Array.isArray(text)) text = [text];

        for (var i = 0; i < text.length; i++) {
          messageContainer.addMessage(messageType, {
            text: text[i],
            actions: [],
            closable: true,
            temporary: true
          });
        }

        if (messageContainer.get("totalMessageCount") > 1) {
            messageContainer.set("expanded", true);
        }

        if (timeout > 0) {
          setTimeout(function () {
            messageContainer.removeMessages("");
          }, timeout);
        }
      },
      getIsConfirm: function (isConfirm) {
        if (typeof isConfirm === "undefined" || isConfirm === null) {
          isConfirm = true;
        }
        return isConfirm;
      },
      mergeListPages: function (parent, child) {
        var returnObject = {};
        for (var attr in parent) { returnObject[attr] = parent[attr]; }
        for (attr in child) { returnObject[attr] = child[attr]; }
        return returnObject;
      },
      defaultIfValueIsUndefinedOrNull: function (value, defaultValue) {
        if ((typeof value == "undefined") || (value == null)) {
          return defaultValue;
        }

        return value;
      },
      // ToDo: remove when file-downloader will be added to framework
      downloadFile: function (fileUrl, onErrorCallback) {
        var hiddenIFrameId = 'hiddenDownloader',
        iframe = document.getElementById(hiddenIFrameId);
        if (typeof iframe === "undefined" || iframe === null) {
          iframe = document.createElement('iframe');
          iframe.id = hiddenIFrameId;
          iframe.style.display = 'none';
          iframe.onload = $.proxy(function () { this.onLoadHandler(iframe, onErrorCallback); }, this);
          document.body.appendChild(iframe);
        }
        iframe.src = fileUrl;
      },
      // ToDo: remove when file-downloader will be added to framework
      onLoadHandler: function (iframe, onErrorCallback) {
        // This is specific IE case. Unknown type is presented in JScript
        // implementation of ECMAScript
        if (typeof iframe.contentDocument === "unknown") {
          onErrorCallback(ieAccessDeniedMessage);
        }
          // Chrome case
        else if (typeof iframe.contentDocument.body.innerText !== "undefined" && iframe.contentDocument.body.innerText !== "") {
          onErrorCallback(JSON.parse(iframe.contentDocument.body.innerText).Message);
        }
          // Firefox case
        else if (typeof iframe.contentDocument.body.textContent !== "undefined" && iframe.contentDocument.body.textContent !== "") {
          onErrorCallback(JSON.parse(iframe.contentDocument.body.textContent).Message);
        }
      },
      getLanguage: function () {
        return this.cookieParser.getCookieByName("shell#lang");
      },
      parseIsoDate: function (date) {
        return sitecore.Helpers.date.parseISO(date);
      }
    };
  });
})();