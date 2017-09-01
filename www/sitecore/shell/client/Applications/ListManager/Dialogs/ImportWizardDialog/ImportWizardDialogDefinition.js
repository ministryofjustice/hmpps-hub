(function () {
  var dependencies = (typeof window !== "undefined") ? ["sitecore", "/-/speak/v1/listmanager/commonPagesDefinition.js"] : [null, "../../commonPagesDefinition"];

  define(dependencies, function(sitecore, commonPagesDefinition) {
    var uploadTabId = "{63FD6D91-04E2-4CAE-80D3-6EA2362639B6}",
        mapTabId = "{C40FA9D8-76B4-4158-812B-AAE6A3219468}",
        summaryTabId = "{87C0ECCD-8FAB-43B0-BBF2-2B6170314E4C}",
        selectedTabProperty = "selectedTab",
        importContactsMode = "ImportContacts",
        importContactsFromMediaLibraryAndCreateListUrl = "/sitecore/api/ssc/ListManagement/Import/{id}/ImportContactsFromMediaLibraryAndCreateList",
        importContactsFromMediaLibraryUrl = "/sitecore/api/ssc/ListManagement/Import/{id}/ImportContactsFromMediaLibrary",
        contactListPagePattern = "/sitecore/client/Applications/List Manager/Taskpages/Contact list?id=",
        notificationKey = "The import process may take a while. You can close this dialog and continue your work in Sitecore. You will not lose your work. You will be able to access your contacts when the import is complete.",
        theFileTypeIsInvalid = "The file type is invalid. Please select another file and try again.",
        onlyOneFileAtATime = "You can upload only one file at a time. Please remove all other files and try again.",
        contactsNotImported = "The contacts have not been imported.",
        notificationTimeout = 10000,
        importWarningKey = "Your contacts have been imported. However please note that they will only become available to view in the database after they have been indexed. This process may take some time.",
        yourImportWillNotBeSaved = "Your import will not be saved. Do you want to continue?",
        self;

    return {
      initialized: function() {
        self = this;

        self.CallBackFunction = null;
        self.Mode = "";
        self.ImportBatchId = "";
        self.UploadedFileInfo = [];
        self.ImportControllerUrl = self.ImportDataSource.get("url");
        self.ButtonNext.viewModel.$el.parent('.pull-right').css({ 'position': 'absolute', 'clear': 'left', 'right': '11px', 'top': '35px' });
        self.nextTimeout = null;
        self.nextTimeoutDelay = 1500;

        /*local triggers*/
        self.on("import:wizard:dialog:button:previous:clicked", function() { self.buttonPreviousClick(); }, self);
        self.on("import:wizard:dialog:button:next:clicked", function() { self.buttonNextClick(); }, self);

        self.on("import:wizard:dialog:button:finish:clicked", function() { self.buttonFinishClick(); }, self);

        self.on("upload-fileAdded-error", function(file) { self.tabUploadOnFileAddedError(file); }, self);
        self.on("upload-error", function(file) { self.tabUploadOnFileAddedError(file); }, self);

        self.ImportMapTo1.on("import:mapto:select:changed", function() { self.tabMapToSelectChanged(); }, self);

        self.Uploader.on("uploadCompleted", function() { self.tabUploadOnFileUploadedComplete(); }, self);
        self.ImportDataSource.on("change:isBusy", function (response) { self.tabUploadOnFileUploadCompleteReadHeader(response); }, self);

        self.tabUploadInitUploader();

        var el = $("a.sc-dialogWindow-close");
        if (el.length > 0) {
          el.click(function (e) {
            var selectedTab = self.ImportWizardTabControl.get(selectedTabProperty);
            if (selectedTab === summaryTabId) {
              self.buttonFinishClick();
              return e;
            }
            var confirmationMessage = self.StringDictionary.get(yourImportWillNotBeSaved);
            if (confirm(confirmationMessage)) {
              self.cleanUp();
              return e;
            } else {
              return false;
            }
          });
        }
        
        $("div.sc-dialogWindow.modal").on("hidden", function () {
          self.cleanUp();
        });

        $(window).unload(function () {
          self.cleanUp();
        });

        self.on("app:loaded", function () {
          sitecore.trigger("dialog:loaded", self);
        });

        sitecore.on("import:wizard:dialog:show", function (mode, callback) {
          self.showDialog({ mode: mode, callback: callback });
        }, self);
      },
      cleanUp: function () {
        if (typeof self.Spinner !== "undefined" && self.Spinner !== null) {
          self.Spinner.set("isBusy", false);
        }
        if (typeof self.UploadedFileInfo.ItemId !== "undefined" && self.UploadedFileInfo.ItemId !== null) {
          var removeMediaUrl = self.ImportControllerUrl + "/" + encodeURI(self.UploadedFileInfo.ItemId) + "/RemoveMedia";
          commonPagesDefinition.callControllerDirectly(removeMediaUrl);
        }
      },
      buttonPreviousClick: function() {
        var current = self;
        if (typeof current === "undefined" || current === null) {
          current = this;
        }
        switch (current.ImportWizardTabControl.get(selectedTabProperty)) {
        case mapTabId:
          if (current.isTabEnabled(uploadTabId)) {
            current.ImportWizardTabControl.set(selectedTabProperty, uploadTabId);
            current.updateButtonStatus();
          }
          break;
        }
      },
      buttonNextClick: function() {
        var current = self;
        if (typeof current === "undefined" || current === null) {
          current = this;
        }
        if (current.nextTimeout !== null) {
          clearTimeout(current.nextTimeout);
          current.nextTimeout = null;
        }
        switch (current.ImportWizardTabControl.get(selectedTabProperty)) {
        case uploadTabId:
          if (current.isTabEnabled(mapTabId)) {
            current.ImportWizardTabControl.set(selectedTabProperty, mapTabId);
            current.updateButtonStatus();
          }
          break;
        case mapTabId:
          current.importContacts();
          break;
        }
      },
      updateButtonStatus: function() {
        var current = self;
        if (typeof current === "undefined" || current === null) {
          current = this;
        }

        current.ButtonPrevious.set("isEnabled", current.ImportWizardTabControl.get(selectedTabProperty) != uploadTabId);

        switch (current.ImportWizardTabControl.get(selectedTabProperty)) {
        case uploadTabId:
          {
            current.ButtonNext.set("isEnabled", current.UploadedFileInfo.length != 0);
            if (current.UploadedFileInfo.length != 0) {
              current.enableTab(mapTabId);
            } else {
              current.disableTab(mapTabId);
            }

            break;
          }
        case mapTabId:
          {
            current.ButtonNext.set("isEnabled", current.ImportMapTo1.viewModel.allRequiredSelected());

            break;
          }
        }
      },
      buttonFinishClick: function() {
        if (self.Mode == importContactsMode) {
          self.hideDialog();
        } else {
          if (self.CallBackFunction) {
            self.hideDialog();
            self.CallBackFunction(self.ImportBatchId);
          } else {
            window.location.href = contactListPagePattern + self.ImportBatchId;
          }
        }
      },
      importContacts: function() {
        var current = self;

        var actionUrl = importContactsFromMediaLibraryAndCreateListUrl;
        var mapping = current.ImportMapTo1.viewModel.getMappingModel();
        var mappingModel = "";
        var counter = 0;

        if (current.Mode == importContactsMode) {
          actionUrl = importContactsFromMediaLibraryUrl;
        }

        actionUrl = actionUrl.replace("{id}", encodeURI(current.UploadedFileInfo.ItemId));

        for (var index = 0; index < mapping.length; ++index) {
          if (mapping[index].key != "") {
            if (mappingModel != "") {
              mappingModel += '&';
            }
            mappingModel = mappingModel + '[' + counter + "].key=" + mapping[index].key + "&[" + counter + "].value=" + mapping[index].value;
            ++counter;
          }
        }

        current.ButtonPrevious.set("isEnabled", false);
        current.ButtonNext.set("isEnabled", false);

        current.disableTab(uploadTabId);
        current.disableTab(mapTabId);

        current.Spinner.set("isBusy", true);

        var notification = this.StringDictionary.get(notificationKey);
        var timeout = setTimeout(function() {
          commonPagesDefinition.showPinnedNotification(notification, current.ImportWizardDialogMessageBar);
        }, notificationTimeout);
        var successCallback = function(data) {
          current.showSummary(data, timeout);
        };
        var errorCallback = function() {
           current.showErrorSummary(timeout);
        }
        commonPagesDefinition.callControllerDirectly(actionUrl, mappingModel, successCallback, errorCallback);
      },
      showSummary: function(importSummary, timeout) {
        var current = self;

        clearTimeout(timeout);
        current.ImportWizardDialogMessageBar.removeMessages("");

        current.RecipientsImportedText.set("text", importSummary.ImportedContactsCount);
        current.UpdatedContactsText.set("text", importSummary.ExpectedExistingContactsCount);
        current.NotProvidedEmailAddressesText.set("text", importSummary.ContactsWithoutEmailCount);
        current.RequiredFieldsNotAvailableText.set("text", importSummary.ContactsWithoutRequiredFieldsCount);
        current.ContactsLockedText.set("text", importSummary.ContactsLockedOrUnavailableInDatabaseCount);

        current.ButtonPrevious.set("isVisible", false);
        current.ButtonNext.set("isVisible", false);
        current.ButtonFinish.set("isVisible", true);
        current.Spinner.set("isBusy", false);

        current.ImportWizardTabControl.set(selectedTabProperty, summaryTabId);
        current.ImportBatchId = importSummary.ImportBatchId;

        if (current.Mode == importContactsMode) {
          var warning = current.StringDictionary.get(importWarningKey);
          commonPagesDefinition.showWarning(warning, current.ImportWizardDialogMessageBar, 0, true);
        }
      },
      showErrorSummary: function(timeout) {
        var current = self;
        current.showSummary({}, timeout);
        commonPagesDefinition.showError(this.StringDictionary.get(contactsNotImported), current.ImportWizardDialogMessageBar);
        current.Mode = importContactsMode;
      },
      tabUploadInitUploader: function() {
        var current = self;

        current.Uploader.set("destinationUrl", "/sitecore/media library/System/List Manager");
        current.Uploader.set("acceptfiletypesregularexpression", /(\.|\/)(csv)$/i);
      },
      tabUploadOnFileAddedError: function(file) {
        if (!file) {
          return;
        }
        var current = self;
        if (typeof current === "undefined" || current === null) {
          current = this;
        }
        var message;
        switch (file.error) {
        case "INVALID_FILE_TYPE":
          message = this.StringDictionary.get(theFileTypeIsInvalid);
          break;
        case "ONLY_ONE_FILE_ALLOWED":
          message = this.StringDictionary.get(onlyOneFileAtATime);
          break;
        default:
          message = this.StringDictionary.get(contactsNotImported);
          break;
        }

        current.ImportWizardDialogMessageBar.removeMessages("");
        current.ImportWizardDialogMessageBar.addMessage("error", { text: message, actions: [], closable: true });
        setTimeout(function() { current.ImportWizardDialogMessageBar.removeMessages(""); }, 10000);
      },
      tabUploadOnFileUploadCompleteReadHeader: function(importDataSource) {
        var current = self;
        if (typeof current === "undefined" || current === null) {
          current = this;
        }
        if (importDataSource.get("hasResponse") === true) {
          var importModel = JSON.parse(importDataSource.get("response"));
          current.ImportMapTo1.viewModel.addRows(importModel);

          current.ImportDataSource.set("url", current.ImportControllerUrl);
          current.enableTab(mapTabId);

          current.nextTimeout = setTimeout(function () {
            current.moveFromUploadToMapTab();
          }, current.nextTimeoutDelay);

          current.updateButtonStatus();
        }
      },
      tabUploadOnFileUploadedComplete: function() {
        var current = self;
        if (typeof current === "undefined" || current === null) {
          current = this;
        }
        current.UploadedFileInfo = current.Uploader.viewModel.getUploadedFileItems()[0];
        var getFileHeaderUrl = current.ImportControllerUrl + "/" + encodeURI(current.UploadedFileInfo.ItemId) + "/GetContactFileHeaders";
        current.ImportDataSource.set("url", getFileHeaderUrl);
        current.ImportDataSource.refresh();
      },
      tabUploadRefresh: function() {
        var current = self;
        if (typeof current === "undefined" || current === null) {
          current = this;
        }
        current.ImportDataSource.set("nameSpace", "");
        current.ImportDataSource.set("parameters", {});
        current.ImportDataSource.set("requestType", "");
        current.ImportDataSource.set("response", "");
        current.ImportDataSource.set("isBusy", false);
        current.ImportDataSource.set("hasResponse", false);
        current.Uploader.set("hasFilesToUpload", null);
        current.Uploader.set("totalFiles", 0);
        current.Uploader.set("totalSize", "0 bytes");
        current.Uploader.set("uploadedFileItems", []);
        current.Uploader.viewModel.reset();
        current.UploaderInfo.viewModel.$el.find(".remove").trigger("click");
        current.UploaderInfo.viewModel.$el.find(".sc-uploaderInfo-row").remove();

      },
      tabMapToSelectChanged: function() {
        var current = self;
        if (typeof current === "undefined" || current === null) {
          current = this;
        }
        current.updateButtonStatus();
      },
      tabMapToRefresh: function() {
        var current = self;
        if (typeof current === "undefined" || current === null) {
          current = this;
        }
        current.ImportMapTo1.viewModel.resetRows();
      },
      showDialog: function(dialogParams) {
        var current = self;
        if (typeof current === "undefined" || current === null) {
          current = this;
        }

        var callback = dialogParams.callback;

        current.CallBackFunction = null;

        if (typeof callback != "undefined" && callback != null && typeof callback == "function") {
          current.CallBackFunction = callback;
        }

        current.Mode = dialogParams.mode;
        current.UploadedFileInfo = [];

        current.enableTab(uploadTabId);
        current.disableTab(summaryTabId);
        current.updateButtonStatus();

        current.ButtonPrevious.set("isVisible", true);
        current.ButtonNext.set("isVisible", true);
        current.ButtonFinish.set("isVisible", false);
        current.Spinner.set("isBusy", false);

        current.tabUploadRefresh();
        current.tabMapToRefresh();

        current.ImportWizardTabControl.set(selectedTabProperty, uploadTabId);
        current.ImportWizardDialogMessageBar.removeMessages("");

        current.ImportWizardDialog.show();
      },
      isTabEnabled: function(tabId) {
        var current = self;
        if (typeof current === "undefined" || current === null) {
          current = this;
        }
        var returnValue = false;
        $.map(current.ImportWizardTabControl.viewModel.$el.find("> ul li[data-tab-id]"), function(tab) {
          var $tab = $(tab);


          var theTabId = $tab.attr("data-tab-id");
          if (theTabId == tabId) {
            var ahrefAttr = $tab.find("a").attr("href");
            if (typeof ahrefAttr !== 'undefined' && ahrefAttr !== false) {
              returnValue = true;
            }
          }
        });
        return returnValue;
      },
      disableTab: function(tabId) {
        var current = self;
        if (typeof current === "undefined" || current === null) {
          current = this;
        }
        $.map(current.ImportWizardTabControl.viewModel.$el.find("> ul li[data-tab-id]"), function(tab) {
          var $tab = $(tab);

          var theTabId = $tab.attr("data-tab-id");
          if (theTabId == tabId) {
            $tab.find("a").removeAttr("href");
            $tab.unbind("click");
          }
        });
      },
      enableTab: function(tabId) {
        var current = self;
        if (typeof current === "undefined" || current === null) {
          current = this;
        }
        if (typeof current.ImportWizardTabControl !== "undefined" && current.ImportWizardTabControl !== null) {
          $.map(current.ImportWizardTabControl.viewModel.$el.find("> ul li[data-tab-id]"), function(tab) {
            var $tab = $(tab);

            var theTabId = $tab.attr("data-tab-id");
            if (theTabId == tabId) {
              $tab.find("a").attr('href', '#');
              $tab.click(function(event) {
                current.ImportWizardTabControl.viewModel.onTabClicked.call(current.ImportWizardTabControl.viewModel, event);
                current.updateButtonStatus();
              });
            }
          });
        }
      },
      hideDialog: function() {
        var current = self;
        if (typeof current === "undefined" || current === null) {
          current = this;
        }
        current.ImportWizardDialog.hide();
      },
      moveFromUploadToMapTab: function () {
        var current = self;
        if (current.ImportWizardTabControl.get(selectedTabProperty) === uploadTabId) {
          current.buttonNextClick();
        }
      }
    };
  });
})();