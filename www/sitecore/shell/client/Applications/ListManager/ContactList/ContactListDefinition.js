(function () {
  // The trick to test in node and in browser.
  var dependencies = (typeof window !== "undefined")
    ? ["/-/speak/v1/listmanager/commonPagesDefinition.js",
       "/-/speak/v1/listmanager/urlParser.js",
       "/-/speak/v1/listmanager/storageMediator.js",
       "/-/speak/v1/listmanager/dialogs.js"]
    : ["../commonPagesDefinition", "../urlParser", "../storageMediator", null];

  define(dependencies, function (commonPagesDefinition, urlParser, storageMediator, dialogs) {
    var self,
      global = {},
      fakeLocation = {
        replace: function (path) {
        }
      },
      fakeDocument = {
        title: ""
      },

      addNewContactActionIds = ["965403EDD7524808913E0B69D55C8EA0"],
      setEntireDatabaseActionIds = ["EDE8F210CC444DC48AFDBC6CE5D5BAFC"],
      removeSourceIds = ["2870D2EA7E0040DA904FAB12ED7B03B6", "CDA1E30B5AE54D128B6B7021E9DDFB93"],
      removeAllContactsActionIds = ["715CC24E7AA846A2B5878C5D2AD9B400"],
      removeContactActionIds = ["12119562B43845DA9B79A65EF90909AD"],
      viewContactCardActionIds = ["A29930F63F5E4A5197F69A69882AE651", "8620AD7021BB43BC95F5BE7CAF182F64"],
      addSourceActionIds = ["598EDA5938F0485989DC37BC3E88D110", "00A55A2A1F0C4D0B9EE3A16383A8AC97"],
      addExclusionActionIds = ["12F78085A0B348ADB18126D175C4DDC3", "08DFF0549EFC4F67B0382267F491A708"],
      addNewConditionActionIds = ["85E89F67CC694CABA6F5C1BEAD335CD2"],
      deleteActionIds = ["FC47E28D97124B23A1B877E0D6A2B227", "5066350562384C7CB75A12118AB15F66", "225FAAB86B4C4DD38186642AFA32026C", "043A34CE15BF4FB7BAF6005E8BAC2803"],
      exportToCsvFileActionIds = ["59083A283E3545FBA2FA8D8E310B2C73", "B6FD42A5C59643AA96537C0669961405", "68FE4B4E7F1244D59D9E7CC3DF97D311", "C09D2914E7814B5C88A312FEF18B462F"],
      findDuplicatesActionIds = ["7EB1A29B64CF4509BFAFB191AD3500F1", "A16B6E7876CC4F85B7347B18406D49CD"],
      unlockListActionIds = ["7F77A08D5B4B4241B5345A8148118EF3"],
      replaceAllListsWithEntireDatabaseSource = "This option will replace all lists that are currently selected as sources. Do you want to continue?",
      convertListNotification = "The list has been converted to a Contact list.",
      deleteAllContactsConfirmation = "All the contacts will be removed from this list. The contacts will still be available in your Contacts database. Do you want to continue?",
      deleteContactConfirmation = "This contact will be removed from this list. The contact will still be available in your Contact database. Do you want to continue?",
      deleteAllContactsNotification = "All the contacts associated with this list have been removed.",
      deleteContactNotification = "The contact will be removed from the list once the indexing has finished and the list is unlocked.",
      contactsWereNotRemoved = "The contacts were not removed.",
      contactWasNotRemoved = "The contact was not removed.",
      lockedContactsCannotBeChanged = "Changes cannot be made to this contact as it is locked or currently active. Please try again later.",
      unlockListConfirmation = "This list is locked as it may currently be in the process of indexing. If you unlock, your list may be incomplete. Do you want to continue?",
      listUnlockedNotification = "The list was sucessfully unlocked.",
      listWasNotUnlocked = "The list was not unlocked.",
      deleteListConfirmation = "The list will be deleted and all the associations to the list will be removed. This cannot be undone. Do you want to continue?",
      duplicatesRemovedNotification = "duplicate contacts have been removed from this list.",
      duplicateContactsWereNotRemoved = "The duplicate contacts were not removed because an error occurred. Please contact your System Administrator.",
      saveListNotification = "The list has been saved.",
      entireDatabaseKey = "All contacts (Entire database)",
      listWasNotRemoved = "The list was not removed.",
      listSourceIsCurrentlyInUse = "List source is currently in use and cannot be added to or amended at this time. Please try again later.",
      listIdKey = "listId",
      filterKey = "filter",
      keyUpKeyCode = 13,
      fromExisting = "fromexisting",
      defaultSource = '{"AllDatabase":false,"ExcludedLists":[],"IncludedLists":[],"PredefinedText":""}',
      sourceEmptyText;

    if (typeof window !== "undefined") {
      global = window;
    } else {
      global.location = fakeLocation;
      global.document = fakeDocument;
    }

    var extensionObject = {
      listType: "Contact list",
      location: {},
      initialized: function () {
        self = this;
        this.dialogs = dialogs;
        this.location = global.location;
        this.document = global.document;
        this.UrlParser = urlParser;
        this.StorageMediator = storageMediator;
        this.RootPath = "";
        this.initializeDataSources();
        this.initializeActions();
        this.initializeSpecificControls();
        this.SaveButton.on("click", this.saveButtonClick, this);
        this.ContactsSearchButtonTextBox.viewModel.$el.keyup(this.contactSearchTextBoxKeyUp);
        this.ListOwnerDataSource.on("change:hasResponse", this.initializeList, this);
        this.ListAsimovEntityDataSource.on("change:entity", this.updateUiForList, this);
        this.initializeChangeTracking();
        this.performUrlAction();
        sourceEmptyText = this.IncludedSourcesListControl.get("empty");
        this.initializeAdditionalFields();
        this.dialogs.init(this.DialogsLoadOnDemandPanel);
      },
      saveButtonClick: function () {
        this.save();
      },
      save: function () {
        this.saveIfSourcesNotLocked();
      },
      initializeDataSources: function () {
        this.refreshDeferredDataSource(this.ListAsimovEntityDataSource);
        this.ListOwnerDataSource.refresh();
      },
      refreshDeferredDataSource: function (dataSource) {
        dataSource.IsDeferred = true;
        dataSource.refresh();
        dataSource.IsDeferred = false;
      },
      initializeSpecificControls: function () {
        var current = commonPagesDefinition.defaultIfValueIsUndefinedOrNull(self, this);
        current.baseStructures = [
            {
              control: current.ContactsList,
              dataSource: current.ContactsDataSource,
              accordion: current.ContactsAccordion
            }
        ];
        current.ContactsDataSource.on("itemsChanged", function (items) {
          current.updateEmbededList(items, current.baseStructures[0]);
        }, current);
        current.ContactsList.on("change:selectedItemId", current.updateContactActionsStatus);
        current.ExcludedSourcesListControl.on("change:selectedItem", function () { current.selectSourceItem(current.ExcludedSourcesListControl); }, current);
        current.IncludedSourcesListControl.on("change:selectedItem", function () { current.selectSourceItem(current.IncludedSourcesListControl); }, current);

        current.initializeDestinationControl();
      },
      initializeDestinationControl: function () {
        var buttonTextBox = this.GeneralInformationDestinationTextBox.viewModel.$el;
        this.StartItem = buttonTextBox.attr("Value");
        var inputs = buttonTextBox.find("input");
        Array.prototype.forEach.call(inputs, function (i) { i.disabled = true; });
      },
      initializeActions: function () {
        $.each(this.ListSourceActionControl.get("actions"), function () {
          if (removeSourceIds.indexOf(this.id()) > -1) {
            this.disable();
          }
        });
        this.on("view:contact", this.onViewContact, this);
        this.on("remove:contacts", this.onRemoveAllContacts, this);
        this.on("remove:contact", this.onRemoveContact, this);
        this.on("taskpage:add:source", this.addInclusion, this);
        this.on("taskpage:remove:source", this.removeSource, this);
        this.on("taskpage:add:exclusion", this.addExclusion, this);
        this.on("taskpage.select:folder", this.selectFolder, this);
        this.on("taskpage:remove:duplicates", this.onRemoveDuplicates, this);
        this.on("taskpage:unlock:list", this.onUnlockList, this);
        this.on("taskpage:set:entireDatabase", this.setEntireDatabase, this);
        this.on("taskpage:export:csv", this.onExportToCsv, this);
        this.initializeListActions();
      },
      performUrlAction: function () {
        var actionFromUrl = this.UrlParser.getParameterFromLocationSearchByName("action");
        if (actionFromUrl === "convert") {
          this.showNotification(convertListNotification, this.ContactListMessageBar);
        } else if (actionFromUrl === fromExisting) {
          var items = this.StorageMediator.getFromStorage("items");
          if (items !== null) {
            this.IncludedSourcesListControl.set("items", items);
          }
          this.StorageMediator.removeFromStorage("items");
        }
      },
      initializeListActions: function () {
        this.on("taskpage:add:contact", this.onAddContact, this);
        this.on("taskpage:delete:list", this.onDeleteList, this);
        this.initializeSpecificListActions();
        var entityId = this.UrlParser.getParameterFromLocationSearchByName("id");
        if (entityId === "") {
          this.ListActions.set("isVisible", false);
        }
      },
      initializeSpecificListActions: function () {
      },
      setActionEnabledStatus: function (list, actionIds, value) {
        Array.prototype.forEach.call(list.get("actions"), function (el) {
          if (actionIds.indexOf(el.id()) >= 0) {
            if (value) {
              el.enable();
            } else {
              el.disable();
            }
          }
        });
      },
      initializeList: function () {
        this.updateOwner();
        var entityId = this.UrlParser.getParameterFromLocationSearchByName("id");
        if (entityId === "") {
          this.updateContactActionsStatus();
          this.GeneralInformationNameValue.viewModel.focus();
        } else {
          this.ListAsimovEntityDataSource.set("entityID", entityId);

          var actionFromUrl = this.UrlParser.getParameterFromLocationSearchByName("action");
          if (actionFromUrl === "convert") {
            this.showNotification(this.StringDictionary.get(convertListNotification), this.ContactListMessageBar);
          }
        }
      },
      initializeContacts: function (entityId) {
        var current = commonPagesDefinition.defaultIfValueIsUndefinedOrNull(self, this);
        var baseStructure = current.baseStructures[0];

        baseStructure.dataSource.unset(listIdKey);
        baseStructure.dataSource.set(listIdKey, entityId);
      },
      executeAction: function (parameters, methodName, callback, isConfirm, confirmationText, showProgress, errorMessage) {
        var current = commonPagesDefinition.defaultIfValueIsUndefinedOrNull(self, this);
        var listId = current.ListAsimovEntityDataSource.get("entityID");
        if (listId !== "") {
          if (isConfirm === true) {
            if (!current.executeActionConfirm(current.StringDictionary.get(confirmationText))) {
              return;
            }
          }

          if (showProgress === true) {
            current.showContactsProgressBar();
          }

          current.callController(
            parameters,
            "/" + listId + "/" + methodName,
            callback,
            function (status, statusText) {
              current.defaultErrorCallback(status, statusText, errorMessage);
            });
        }
      },
      defaultErrorCallback: function (status, statusText, errorMessage) {
        var current = commonPagesDefinition.defaultIfValueIsUndefinedOrNull(self, this);
        current.showDefaultError(status, statusText, current.StringDictionary.get(errorMessage), current.ContactListMessageBar);
      },
      executeActionConfirm: function (message) {
        return confirm(message);
      },
      reloadEmbededList: function (baseStructure) {
        baseStructure.dataSource.refresh();
      },
      updateEmbededList: function (items, baseStructure) {
        if (items.length == 0) {
          this.setHeader(baseStructure, 0);
        }
        if (items.length > 0) {
          this.setHeader(baseStructure, items[0].Count);
        }
        this.updateContactActionsStatus();
      },
      showContactsProgressBar: function () {
        this.ContactsProgressIndicator.set("isBusy", true);
      },
      hideContactsProgressBar: function () {
        this.ContactsProgressIndicator.set("isBusy", false);
      },
      setHeader: function (baseStructure, count) {
        var header = baseStructure.accordion.get("origHeader");
        if (typeof header === "undefined") {
          header = baseStructure.accordion.get("header");
          baseStructure.accordion.set("origHeader", header);
        }
        baseStructure.accordion.set("header", header + " " + count);
      },
      onViewContact: function () {
        var contactId = this.ContactsList.get("selectedItemId");
        if (contactId == "") {
          return;
        }

        var url = "/sitecore/client/Applications/ExperienceProfile/contact?cid={" + encodeURI(contactId) + "}";
        this.showContactCard(url);
      },
      onAddContact: function () {
        var current = commonPagesDefinition.defaultIfValueIsUndefinedOrNull(self, this);
        var dialogParams = { save: current.onRealAddContact };

        current.dialogs.showDialog(current.dialogs.Ids.AddNewContactDialog, dialogParams);
      },
      onRealAddContact: function (dialog, model) {
        var current = commonPagesDefinition.defaultIfValueIsUndefinedOrNull(self, this);
        var listId = current.ListAsimovEntityDataSource.get("entityID");
        var url = "/sitecore/api/ssc/ListManagement/Actions/" + encodeURI(listId) + "/AddNewContact";
        var data = JSON.stringify(model);
        var contentType = "application/json; charset=utf-8";
        current.callControllerDirectly(url, data, current.addSuccess, current.addError, contentType);
      },
      addSuccess: function (t, current, state, obj) {
        current.showNotification(obj.statusText, current.ContactListMessageBar);
        current.ListAsimovEntityDataSource.refresh();
      },
      addError: function (status, message) {
        var current = commonPagesDefinition.defaultIfValueIsUndefinedOrNull(self, this);
        current.showError(message, current.ContactListMessageBar);
      },
      onDeleteList: function (parameters, isConfirm) {
        this.executeAction(parameters, "DeleteListById", this.onDeleteListFinished, this.getIsConfirm(isConfirm), deleteListConfirmation, false, listWasNotRemoved);
      },
      onDeleteListFinished: function () {
        var current = commonPagesDefinition.defaultIfValueIsUndefinedOrNull(self, this);
        current.location.href = current.Breadcrumb.get("prevPage");
      },
      onRemoveAllContacts: function (parameters, isConfirm) {
        this.executeAction(parameters, "RemoveAllContactAssociationsAndSources", this.onRemoveAllContactsFinished, this.getIsConfirm(isConfirm), deleteAllContactsConfirmation, true, contactsWereNotRemoved);
      },
      onRemoveContact: function (parameters, isConfirm) {
        var contactId = this.ContactsList.get("selectedItemId");
        if (contactId == "") {
          return;
        }

        this.executeAction(parameters, "RemoveContact?contactId=" + encodeURI(contactId), this.onRemoveContactFinished, this.getIsConfirm(isConfirm), deleteContactConfirmation, true, contactWasNotRemoved);
      },
      onRemoveAllContactsFinished: function () {
        var current = commonPagesDefinition.defaultIfValueIsUndefinedOrNull(self, this);
        current.showNotification(current.StringDictionary.get(deleteAllContactsNotification), current.ContactListMessageBar);
        current.ContactsList.set('items', []);
        current.IncludedSourcesListControl.set('items', []);
        current.ExcludedSourcesListControl.set('items', []);
        current.setHeader(current.baseStructures[0], 0);
        current.updateContactActionsStatus();
        current.hideContactsProgressBar();
      },
      onRemoveContactFinished: function (data) {
        var current = commonPagesDefinition.defaultIfValueIsUndefinedOrNull(self, this);

        if (data) {
          var entity = current.ListAsimovEntityDataSource.get("entity");
          entity.IsLocked = true;

          current.updateContactActionsStatus();
          current.hideContactsProgressBar();

          current.showNotification(current.StringDictionary.get(deleteContactNotification), current.ContactListMessageBar);
        } else {
          current.showWarning(current.StringDictionary.get(lockedContactsCannotBeChanged), current.ContactListMessageBar);
        }
      },
      onRemoveDuplicates: function (parameters) {
        this.executeAction(parameters, "RemoveDuplicates", this.onRemoveDuplicatesFinished, false, "", true, duplicateContactsWereNotRemoved);
      },
      onRemoveDuplicatesFinished: function (data) {
        var current = commonPagesDefinition.defaultIfValueIsUndefinedOrNull(self, this);
        var message = current.StringDictionary.get(duplicatesRemovedNotification);
        current.reloadEmbededList(current.baseStructures[0]);
        current.showNotification(data + " " + message, current.ContactListMessageBar);
        current.hideContactsProgressBar();
      },
      onUnlockList: function (parameters, isConfirm) {
        this.executeAction(parameters, "UnlockList", this.onUnlockListFinished, commonPagesDefinition.defaultIfValueIsUndefinedOrNull(isConfirm, true), unlockListConfirmation, true, listWasNotUnlocked);
      },
      onUnlockListFinished: function () {
        var current = commonPagesDefinition.defaultIfValueIsUndefinedOrNull(self, this);
        var message = current.StringDictionary.get(listUnlockedNotification);
        current.showNotification(message, current.ContactListMessageBar);
        current.hideContactsProgressBar();

        current.ListAsimovEntityDataSource.refresh();
      },
      onExportToCsv: function (parameters) {
        var entityId = this.UrlParser.getParameterFromLocationSearchByName("id");
        var targetDataSource = this[parameters.actionsDataSource];
        var actionUrl = targetDataSource.get("url") + "/" + encodeURI(entityId) + "/ExportContacts";

        this.downloadFile(actionUrl, this.onExportToCsvError);
      },
      onExportToCsvError: function (message) {
        self.showError(message, self.ContactListMessageBar);
      },
      showContactCard: function (url) {
        window.open(url, '_blank');
      },
      refreshListControl: function (listControl) {
        listControl.unset("items");
        listControl.set("items", []);
      },
      updateUiForList: function (dataSource, model) {
        var current = commonPagesDefinition.defaultIfValueIsUndefinedOrNull(self, this);

        this.setTitle(model.Name);
        this.GeneralInformationNameValue.set("text", model.Name);
        this.GeneralInformationDescriptionValue.set("text", model.Description);
        this.InfoSpotTypeText.set("text", model.TypeName);
        this.InfoSpotCreatedText.set("text", current.parseIsoDate(model.Created).toLocaleDateString());
        if (commonPagesDefinition.defaultIfValueIsUndefinedOrNull(model.Owner, "") !== "") {
          var items = this.GeneralInformationOwnerComboBox.get("items");
          var itemsToSelect = Array.prototype.filter.call(items, function (i) { return i.itemId == model.Owner; });
          if (itemsToSelect.length > 0) {
            this.GeneralInformationOwnerComboBox.set("selectedItems", itemsToSelect);
          }
        }
        this.setDestination(model.Destination);
        this.updateUiForAdditionalFields(model);
        var sourceIsLocked = this.updateUiForSources(model);

        current.setActionEnabledStatus(current.ListActions, deleteActionIds, !(model.IsLocked || model.IsInUse));
        current.setActionEnabledStatus(current.ListActions, findDuplicatesActionIds, !(model.IsLocked || model.IsInUse));
        if (current.SegmentationActionControl !== undefined) {
          current.setActionEnabledStatus(current.SegmentationActionControl, addNewConditionActionIds, !(model.IsLocked || model.IsInUse));
        }
        current.setActionEnabledStatus(current.ListActions, exportToCsvFileActionIds, !model.IsLocked);

        if (model.IsLocked) {
          current.showWarning(current.StringDictionary.get("Please note that this list is currently being built and is locked."), current.ContactListMessageBar, 0, true);
          
        } else if (model.IsInUse) {
          current.showWarning(current.StringDictionary.get("Please note that this list is currently in use."), current.ContactListMessageBar, 0, true);
        }

        if (model.Notification) {
            current.showWarning(model.Notification, current.ContactListMessageBar, 0, true);
        }

        current.setActionEnabledStatus(current.ListActions, unlockListActionIds, model.IsLocked);

        if (model.IsLocked || sourceIsLocked) {
          current.ContactsList.set("empty", current.StringDictionary.get("Currently building list. Contacts will be viewable when complete."));
          current.refreshListControl(current.ContactsList);
        }

        if (!model.IsLocked && !sourceIsLocked) {
          current.initializeContacts(model.Id);
        }

        this.SaveButton.set("isEnabled", false);
      },
      updateContactActionsStatus: function () {
        var current = commonPagesDefinition.defaultIfValueIsUndefinedOrNull(self, this);
        var contacts = current.ContactsList.get("items"),
            contactsLength = 0;
        if (typeof contacts !== "undefined" && contacts !== null && "length" in contacts) {
          contactsLength = contacts.length;
        }

        var isLockedOrInUse = current.ListAsimovEntityDataSource.get("entity").IsLocked || current.ListAsimovEntityDataSource.get("entity").IsInUse;
        var isNewlyCreatedList = commonPagesDefinition.defaultIfValueIsUndefinedOrNull(current.ListAsimovEntityDataSource.get("entityID"), "") === "";

        if (isLockedOrInUse) {
          current.setActionEnabledStatus(current.ContactsActionControl, removeAllContactsActionIds, false);
          current.setActionEnabledStatus(current.ContactsActionControl, removeContactActionIds, false);
          current.setActionEnabledStatus(current.ContactsActionControl, addNewContactActionIds, false);
        } else {
          current.setActionEnabledStatus(current.ContactsActionControl, removeAllContactsActionIds, (contactsLength > 0) && (current.PredefinedText === ""));
          current.setActionEnabledStatus(current.ContactsActionControl, removeContactActionIds, (contactsLength > 0) && (commonPagesDefinition.defaultIfValueIsUndefinedOrNull(current.ContactsList.get("selectedItemId"), "") !== ""));
          current.setActionEnabledStatus(current.ContactsActionControl, addNewContactActionIds, !isNewlyCreatedList);
        }
        current.setActionEnabledStatus(current.ContactsActionControl, viewContactCardActionIds, (!isNewlyCreatedList) && (contactsLength > 0) && (commonPagesDefinition.defaultIfValueIsUndefinedOrNull(current.ContactsList.get("selectedItemId"), "") !== ""));
      },
      updateUiForSources: function (model) {
        var current = commonPagesDefinition.defaultIfValueIsUndefinedOrNull(self, this);

        var source = JSON.parse(model.Source);

        current.PredefinedText = commonPagesDefinition.defaultIfValueIsUndefinedOrNull(source.PredefinedText, "");
        current.PredefinedSourceType = commonPagesDefinition.defaultIfValueIsUndefinedOrNull(source.PredefinedSourceType, "");
        current.PredefinedParameters = commonPagesDefinition.defaultIfValueIsUndefinedOrNull(source.PredefinedParameters, []);
        current.entireDatabase = source.AllDatabase == true;

        if (current.PredefinedText !== "") {
          current.PredefinedSourceLabel.set("text", source.PredefinedText);
          current.IncludedSourcesListControl.set("isVisible", false);
          current.ExcludedSourcesListControl.set("isVisible", false);
          current.ListSourceActionControl.set("isVisible", false);
        }

        current.updateContactActionsStatus();

        if (current.entireDatabase) {
          current.IncludedSourcesListControl.set("empty", this.StringDictionary.get(entireDatabaseKey));
          current.refreshListControl(current.IncludedSourcesListControl);
          current.setActionEnabledStatus(current.ListSourceActionControl, setEntireDatabaseActionIds, false);
        } else {
          current.IncludedSourcesListControl.set("empty", sourceEmptyText);
          current.refreshListControl(current.IncludedSourcesListControl);
          current.IncludedSourcesListControl.set("items", source.IncludedLists);
          current.setActionEnabledStatus(current.ListSourceActionControl, setEntireDatabaseActionIds, true);
        }

        current.ExcludedSourcesListControl.set("items", source.ExcludedLists);

        if (source.ExcludedLists.length > 0) {
          current.ExcludeSourceAccordion.set("isVisible", true);
        }

        if (model.IsLocked || model.IsInUse) {
          current.setActionEnabledStatus(current.ListSourceActionControl, addExclusionActionIds, false);
          current.setActionEnabledStatus(current.ListSourceActionControl, addSourceActionIds, false);
          current.setActionEnabledStatus(current.ListSourceActionControl, removeSourceIds, false);
          current.setActionEnabledStatus(current.ListSourceActionControl, setEntireDatabaseActionIds, false);
        }

        return current.hasAdditionalLockCondition(source);
      },
      hasAdditionalLockCondition: function (source) {
        return false;
      },
      getDestination: function () {
        var path = this.GeneralInformationDestinationTextBox.get("text");
        return this.RootPath + path;
      },
      setDestination: function (path) {
        if (typeof path !== "undefined" && path !== null && path !== "") {
          var index = path.indexOf(this.StartItem),
              pathToSet = path;
          if (index >= 0) {
            this.RootPath = path.substring(0, index);
            pathToSet = path.substring(index);
          }
          this.GeneralInformationDestinationTextBox.set("text", pathToSet);
        }
      },
      initializeAdditionalFields: function () {
      },
      updateUiForAdditionalFields: function (model) {
      },
      initializeChangeTracking: function () {
        this.GeneralInformationNameValue.viewModel.$el.keyup(function () { self.updateSaveButtonUi(self.updateSaveButtonUi, self.GeneralInformationNameValue.viewModel.$el.val(), "Name"); });
        this.GeneralInformationDescriptionValue.viewModel.$el.keyup(function () { self.updateSaveButtonUi(self.GeneralInformationDescriptionValue, self.GeneralInformationDescriptionValue.viewModel.$el.val(), "Description"); });
        this.GeneralInformationOwnerComboBox.on("change:selectedItemId", function (control, value) { this.updateSaveButtonUi(control, value, "Owner"); }, this);
        this.GeneralInformationDestinationTextBox.on("change:text", function (control, value) { this.updateSaveButtonUi(control, this.RootPath + value, "Destination"); }, this);
      },
      setTitle: function (title) {
        this.document.title = title;
        this.HeaderTitle.set("text", title);
      },
      updateSaveButtonUi: function (control, value, property) {
        var model = this.ListAsimovEntityDataSource.get("entity"),
            enabled = true;
        if (model !== null) {
          if (property === "Source") {
            this.refreshRequired = true;
          }
          if (property === "Query") {
            this.refreshRequired = true;
          } else {
            enabled = model[property] !== value ||
              this.GeneralInformationNameValue.viewModel.$el.val() !== model["Name"] ||
              this.GeneralInformationDescriptionValue.viewModel.$el.val() !== model["Description"] ||
              this.GeneralInformationOwnerComboBox.get("selectedItemId") !== model["Owner"] ||
              this.RootPath + this.GeneralInformationDestinationTextBox.get("text") !== model["Destination"] ||
              this.refreshRequired;
          }
        }
        enabled = enabled && this.GeneralInformationNameValue.viewModel.$el.val().trim().length > 0;
        this.SaveButton.set("isEnabled", enabled);
      },
      updateOwner: function () {
        if (this.ListOwnerDataSource.get("hasResponse") === true) {
          var response = this.ListOwnerDataSource.get("response");
          var data = JSON.parse(response);
          var items = Array.prototype.map.call(data, function (i) { return { "$displayName": i, "itemId": i }; });
          this.GeneralInformationOwnerComboBox.set("items", items);
          if (items.length > 0) {
            this.GeneralInformationOwnerComboBox.set("selectedItems", Array.prototype.slice.call(items, 0, 1));
          }
        }
      },
      contactSearchTextBoxKeyUp: function (e) {
        if (e.keyCode == keyUpKeyCode) {
          var current = commonPagesDefinition.defaultIfValueIsUndefinedOrNull(self, this);
          current.findContacts();
        }
      },
      findContacts: function () {
        var current = commonPagesDefinition.defaultIfValueIsUndefinedOrNull(self, this);
        var baseStructure = current.baseStructures[0];

        var searchText = current.ContactsSearchButtonTextBox.get("text");
        baseStructure.dataSource.set(filterKey, searchText);
      },
      saveList: function () {
        this.SaveButton.set("isEnabled", false);

        var listName = this.GeneralInformationNameValue.get("text");
        if (listName !== "") {
          var model,
              owner = this.GeneralInformationOwnerComboBox.get("selectedItemId"),
              description = this.GeneralInformationDescriptionValue.get("text"),
              destination = this.getDestination(),
              entityId = this.ListAsimovEntityDataSource.get("entityID");
          if (entityId === "") {
            model = {};
          } else {
            model = this.ListAsimovEntityDataSource.get("entity");
          }

          model.Name = listName;
          model.Owner = owner;
          model.Description = description;
          model.Destination = destination;
          model = this.saveListType(model);
          model = this.saveAdditionalFields(model);
          model.Source = this.getContactListSource();

          var headers = { "X-Requested-With": "XMLHttpRequest" };
          var csrfToken = this.getAntiForgeryToken();
          headers[csrfToken.headerKey] = csrfToken.value;

          if (entityId === "") {
            var id = this.ListAsimovEntityDataSource.Service.constructor.utils.guid.generate();
            model.Id = id;
            var query = this.ListAsimovEntityDataSource.Service.create(model, { headers: headers });
            var promise = query.execute();
            promise.then(this.updateEntityAndNotify, this.notifyAboutError);
          } else {
            model.options.headers = headers;
            model.save().then(this.notify, this.notifyAboutError);
          }
        } else {
          this.GeneralInformationNameValue.viewModel.focus();
          this.showError(this.StringDictionary.get("The 'List name' field should be specified."), this.ContactListMessageBar);
        }
      },
      saveListType: function (model) {
        model.Type = this.listType;
        return model;
      },
      saveAdditionalFields: function (model) {
        return model;
      },
      saveIfSourcesNotLocked: function () {
        var current = commonPagesDefinition.defaultIfValueIsUndefinedOrNull(self, this);
        var isFromExisting = this.UrlParser.getParameterFromLocationSearchByName("action") === fromExisting;
        if (current.pendingSources.length !== 0 || isFromExisting) {
          var allSourceLists = current.IncludedSourcesListControl.get("items").concat(current.ExcludedSourcesListControl.get("items"));
          var sourcesToCheck = allSourceLists.map(function (src) {
            return src.Id;
          });
          var url = current.ListSourcesDataSource.get("url");
          current.checkSourcesOnServer(sourcesToCheck, url, isFromExisting);
        } else {
          current.saveList();
        }
      },
      checkSourcesOnServer: function (sourcesToCheck, url, isFromExisting) {
        var current = commonPagesDefinition.defaultIfValueIsUndefinedOrNull(self, this);
        current.ajax({
          url: url,
          type: "GET",
          data: { idList: sourcesToCheck },
          success: function (result) {
            current.processSourcesFromServer(result, sourcesToCheck, isFromExisting);
          },
          error: function (jqXhr) {
            current.defaultErrorCallback(jqXhr.status, JSON.parse(jqXhr.responseText).Message, listSourceIsCurrentlyInUse);
          }
        });
      },
      processSourcesFromServer: function (result, sourcesToCheck, isFromExisting) {
        var current = commonPagesDefinition.defaultIfValueIsUndefinedOrNull(self, this);
        var isLocked = false;
        for (var i = 0; i < sourcesToCheck.length; i++) {
          if (result[sourcesToCheck[i]] === true) {
            current.showError(listSourceIsCurrentlyInUse, current.ContactListMessageBar);
            current.pendingSources = [];
            if (isFromExisting) {
              current.IncludedSourcesListControl.set("items", []);
            } else {
              isLocked = true;
              var model = current.ListAsimovEntityDataSource.get("entity");
              if (typeof model === "undefined" || model === null) {
                model = {};
              }
              if (!model.hasOwnProperty("Source")) {
                model.Source = defaultSource;
              }
              current.updateUiForSources(model);
            }

            break;
          }
        }

        if (!isLocked) {
          current.saveList();
        }
      },
      notify: function (model) {
        var current = commonPagesDefinition.defaultIfValueIsUndefinedOrNull(self, this);
        current.SaveButton.set("isEnabled", false);
        current.showNotification(current.StringDictionary.get(saveListNotification), current.ContactListMessageBar);
        if (current.refreshRequired === true) {
          current.initializeContacts(model.Id);
          current.refreshRequired = false;
        }
        current.updateUiForSources(model);
        current.setTitle(model.Name);
      },
      updateEntityAndNotify: function (model) {
        var current = commonPagesDefinition.defaultIfValueIsUndefinedOrNull(self, this);
        current.ListAsimovEntityDataSource.set("entityID", model.Id);
        current.showNotificationWithPreviousMessage(current.StringDictionary.get(saveListNotification), current.ContactListMessageBar);
        current.ListActions.set("isVisible", true);

        current.UrlParser.appendQueryParameter("id", model.Id);
        current.setTitle(model.Name);
      },
      notifyAboutError: function (error) {
        var current = commonPagesDefinition.defaultIfValueIsUndefinedOrNull(self, this);
        var message;
        try {
          var errorResponse = JSON.parse(error.message);
          if (errorResponse.ModelState) {
            message = [];
            for (var key in errorResponse.ModelState) {
              for (var i = 0; i < errorResponse.ModelState[key].length; i++) {
                message.push(errorResponse.ModelState[key][i]);
              }
            }
          } else {
            message = errorResponse.Message;
          }
        } catch (e) {
          message = error.message;
        }

        if (message == "Authorization has been denied for this request.") {
          current.location.reload();
        } else {
          current.showError(message, current.ContactListMessageBar);
        }
      },
      getContactListSource: function () {
        var current = commonPagesDefinition.defaultIfValueIsUndefinedOrNull(self, this);

        var includedLists = current.IncludedSourcesListControl.get("items");
        var excludedLists = current.ExcludedSourcesListControl.get("items");

        return JSON.stringify({ AllDatabase: current.entireDatabase, IncludedLists: includedLists, ExcludedLists: excludedLists, PredefinedText: current.PredefinedText, PredefinedSourceType: current.PredefinedSourceType, PredefinedParameters: current.PredefinedParameters });
      },
      selectSourceItem: function (control) {
        var current = commonPagesDefinition.defaultIfValueIsUndefinedOrNull(self, this);
        current.toggleRemoveAction();
        current.IncludedSourcesListControl.off("change:selectedItem");
        current.ExcludedSourcesListControl.off("change:selectedItem");
        if (control === current.ExcludedSourcesListControl) {
          current.resetSourceControl(current.IncludedSourcesListControl);
        } else {
          current.resetSourceControl(current.ExcludedSourcesListControl);
        }
        current.IncludedSourcesListControl.on("change:selectedItem", function () { current.selectSourceItem(current.IncludedSourcesListControl); }, current);
        current.ExcludedSourcesListControl.on("change:selectedItem", function () { current.selectSourceItem(current.ExcludedSourcesListControl); }, current);
      },
      resetSourceControl: function (sourceControl) {
        if (sourceControl.get("selectedItem") != "") {
          sourceControl.set("selectedItem", null);
          sourceControl.set("selectedItemId", null);
          sourceControl.set("defaultSelectedItemId", null);
        }
      },
      addInclusion: function () {
        var current = commonPagesDefinition.defaultIfValueIsUndefinedOrNull(self, this);
        current.addSource(current.IncludedSourcesListControl, function (items) {
          current.entireDatabase = false;
        });
      },
      addExclusion: function () {
        var current = commonPagesDefinition.defaultIfValueIsUndefinedOrNull(self, this);
        current.addSource(current.ExcludedSourcesListControl, function (items) {
          if (items.length > 0) {
            current.ExcludeSourceAccordion.set("isVisible", true);
          }
        });
      },
      pendingSources: [],
      addSource: function (sourcesListControl, additionalActions) {
        var current = commonPagesDefinition.defaultIfValueIsUndefinedOrNull(self, this);
        var callback = function (itemId, item) {
          if (typeof item != "undefined" && item != null) {
            var currentItems = sourcesListControl.get("items");
            var newItems = [];
            newItems.push(item);
            var items;
            if (currentItems.length > 0) {
              items = Array.prototype.concat.call(currentItems, newItems);
            } else {
              items = newItems;
            }

            sourcesListControl.set("items", items);
            additionalActions(items);
            current.updateSaveButtonUi(current.IncludedSourcesListControl, current.getContactListSource(), "Source");
            current.pendingSources.push(itemId);
          }
        };

        var includeItems = current.IncludedSourcesListControl.get("items");
        var excludeItem = current.ExcludedSourcesListControl.get("items");

        var allExcludeItems = Array.prototype.concat.call(includeItems, excludeItem);

        var allExcludeItemsIds = [];
        for (var i = 0; i < allExcludeItems.length; i++) {
          allExcludeItemsIds.push(allExcludeItems[i].Id);
        }

        var listId = this.UrlParser.getParameterFromLocationSearchByName("id");

        if (listId !== "") {
          listId = this.ListAsimovEntityDataSource.get("entity").Id;
        }

        var dialogParams = {
          callback: callback,
          excludelists: allExcludeItemsIds,
          currentListId: listId,
          filter: "getContactLists"
        };

        current.dialogs.showDialog(current.dialogs.Ids.SelectListDialog, dialogParams);
      },
      selectFolder: function () {
        var current = commonPagesDefinition.defaultIfValueIsUndefinedOrNull(self, this);
        var callback = function (itemId, item) {
          if (typeof item !== "undefined" && item !== null) {
            current.setDestination(item.$path);
          }
        };
        // TODO : We Need to be able to parse over the Id of the current Destination folder
        var selectedItemPath = "";
        var dialogParams = {
          callback: callback,
          rootId: current.RootPath,
          selectedItemId: selectedItemPath,
        };
        current.dialogs.showDialog(current.dialogs.Ids.SelectFolderDialog, dialogParams);
      },
      setEntireDatabase: function () {
        var current = commonPagesDefinition.defaultIfValueIsUndefinedOrNull(self, this);

        if (current.IncludedSourcesListControl.get("items").length > 0) {
          if (!confirm(this.StringDictionary.get(replaceAllListsWithEntireDatabaseSource))) {
            return;
          }
        }

        current.entireDatabase = true;
        current.IncludedSourcesListControl.set("items", []);
        current.updateUiForSources({ Source: current.getContactListSource() });
        current.updateSaveButtonUi(current.IncludedSourcesListControl, current.getContactListSource(), "Source");
      },
      toggleRemoveAction: function () {
        var current = commonPagesDefinition.defaultIfValueIsUndefinedOrNull(self, this);
        if (!current.ListAsimovEntityDataSource.get("entity").IsLocked && !current.ListAsimovEntityDataSource.get("entity").IsInUse) {
          if (current.IncludedSourcesListControl.get("selectedItem") != "" || current.ExcludedSourcesListControl.get("selectedItem") != "") {
            $.each(this.ListSourceActionControl.get("actions"), function () {
              if (removeSourceIds.indexOf(this.id()) > -1) {
                this.enable();
              }
            });
          } else {
            $.each(this.ListSourceActionControl.get("actions"), function () {
              if (removeSourceIds.indexOf(this.id()) > -1) {
                this.disable();
              }
            });
          }
        }
      },
      removeSource: function () {
        var current = commonPagesDefinition.defaultIfValueIsUndefinedOrNull(self, this);
        current.removeSourceFromControl(current.IncludedSourcesListControl, current);
        var newExcludedItems = current.removeSourceFromControl(current.ExcludedSourcesListControl, current);
        if (newExcludedItems.length == 0) {
          current.ExcludeSourceAccordion.set("isVisible", false);
        }

        current.updateSaveButtonUi(current.IncludedSourcesListControl, current.getContactListSource(), "Source");
        current.updateUiForSources({ Source: current.getContactListSource() });
      },
      removeSourceFromControl: function (sourceControl, current) {
        var oldItems;
        var newItems = [];
        var index;

        var selectedItemId = sourceControl.get("selectedItemId");
        if (selectedItemId !== "") {
          oldItems = sourceControl.get("items");

          for (index = 0; index < oldItems.length; ++index) {
            if (oldItems[index].Id != selectedItemId) {
              newItems.push(oldItems[index]);
            }
          }

          current.pendingSources = current.pendingSources.filter(function (id) {
            return id != selectedItemId;
          });

          sourceControl.off("change:selectedItem");
          sourceControl.set("selectedItem", null);
          sourceControl.set("selectedItemId", null);
          sourceControl.set("defaultSelectedItemId", null);
          sourceControl.set("items", newItems);
          sourceControl.on("change:selectedItem", function () { current.selectSourceItem(sourceControl); }, current);
          current.toggleRemoveAction();
        }

        return newItems;
      }
    };
    return commonPagesDefinition.mergeListPages(commonPagesDefinition, extensionObject);
  });
})();