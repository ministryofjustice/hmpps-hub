var integrationHandlerUrl = "/sitecore/shell/ClientBin/MarketingAutomation/Integration.ashx";

/*
* Opens a new PageEventSubscription dialog.
*/
function OpenPageEventSubscriptionDialog(pageEventsIds) {
  var action = "action=getPageEventSubscriptionDialog";
  var parameters = action + "&s=" + pageEventsIds;
  setTimeout(function () {
    new Ajax.Request(
        integrationHandlerUrl,
        {
          asynchronous: false,
          method: "post",
          onSuccess: function (result) {
            pageEventSubscriptionDialogUrl = result.responseText;
          },
          parameters: parameters
        });

    var dialogStyle = "dialogWidth: 450px; dialogHeight: 600px; resizable: yes";
    scForm.showModalDialog(pageEventSubscriptionDialogUrl, null, dialogStyle, null, function(returnValue) {
      if (!returnValue) {
        return;
      }
      
      var control = document.getElementById("scSilverlightEngagementPlan");
      if (control) {
        control.Content.Main.SavePageEvents(returnValue);
      }
    });
  }
  , 100);
}

/*
* Opens a new SelectItem dialog.
*/
function OpenSaveAsWindow(selectedItemId, title, description, saveAsRootId) {
  // The SelectItem dialog parameters.
  var action = "action=getSelectCampaignDialogUrl";
  var icon = "&ic=" + encodeURIComponent("Software/16x16/element.png");
  var rootId = "&ro=" + encodeURIComponent(FixGuid(saveAsRootId));
  var selectedItemId = "&fo=" + encodeURIComponent(FixGuid(saveAsRootId));
  var text = "&txt=" + description.replace(" ", "+");
  var title = "&ti=" + title.replace(" ", "+");
  // Sending Ajax request to the SelectItem HTTP handler to get URL of the SelectItem dialog.
  
  var parameters = action + icon + rootId + selectedItemId + text + title;
  new Ajax.Request(
      integrationHandlerUrl,
      {
        asynchronous: false,
        method: "post",
        onSuccess: function(result) {
          selectItemDialogUrl = result.responseText;
        },
        parameters: parameters
      });

  // Displaying SelectItem dialog.
  var dialogStyle = "dialogWidth: 450px; dialogHeight: 600px; resizable: yes";
  scForm.showModalDialog(selectItemDialogUrl, null, dialogStyle, null, function(returnValue) {
    if (!returnValue) {
      return;
    }

    SetSaveAsParentId(returnValue);
  });
}

/*
* Save the selected parent ID.
*/
function SetSaveAsParentId(parentId) {
  var control = document.getElementById("scSilverlightEngagementPlan");
  control.Content.Main.SetSaveAsParentId(parentId);
}

// ------------------------------------------------------------------------------------------------------------------
// Field Editor dialog.
// ------------------------------------------------------------------------------------------------------------------

/*
* Opens a new window with the Field Editor.
*/
function OpenFieldsEditorWindow(itemId, stateId, planId, templateId, fieldValues, isAction, isNewItem, isCommand) {

  GetFieldEditorUrl(itemId, stateId, planId, templateId, fieldValues, isAction, isNewItem, isCommand);
  setTimeout(function () {
    var dialogStyle = "dialogWidth: 600px; dialogHeight: 600px; resizable: yes";
    scForm.showModalDialog(fieldEditorUrl, null, dialogStyle, null, function(returnValue) {
      if (!returnValue) {
        return;
      }
      GetFieldValues(returnValue);
    });
  }
  , 100);
}

/*
* Requests FieldValues HTTP handler to get Field Editor URL.
*/
function GetFieldEditorUrl(itemId, stateId, planId, templateId, fieldValues, isAction, isNewItem, isCommand) {

    var parameters = null;

    var action = "getFieldEditorUrl";
    if (isAction == "true") {
        action = "getActionFieldEditorUrl";
    }

  // When item is stored in the database.
    if ((isNewItem != "true") && (fieldValues != "") && (itemId != "")) {
      parameters =
        "action=" + action +
        "&itemId=" + encodeURIComponent(FixGuid(itemId)) +
        "&planId=" + encodeURIComponent(FixGuid(planId)) +
        "&isNewItem=" + isNewItem +
        "&fieldValues=" + encodeURIComponent(fieldValues);
    }

    // When item is not stored in the database.
    else if ((isNewItem == "true") && templateId != "") {
      parameters =
        "action=getFieldEditorUrl" +
        "&planId=" + encodeURIComponent(FixGuid(planId)) +
        "&isNewItem=" + isNewItem +
        "&fieldValues=" + encodeURIComponent(fieldValues) +
        "&templateId=" + encodeURIComponent(FixGuid(templateId));
    }
    else {
      alert("ERROR: Item template ID is not specified.");
      return;
    }

  if (stateId != "") {
    parameters = parameters + "&stateId=" + encodeURIComponent(FixGuid(stateId));
  }

  if (typeof isCommand === "undefined" || isCommand === null) {
    isCommand = false;
  }

  parameters = parameters + "&isCommand=" + isCommand;

  // When arguments are not valid.
  if (parameters == null) {
    alert("ERROR: Field values and template ID are not specified.");
    return;
  }

  // Sending Ajax request to get Field Editor URL.
  new Ajax.Request(
      integrationHandlerUrl,
      {
        asynchronous: false,
        method: "post",
        onSuccess: function(result) {
          fieldEditorUrl = result.responseText;
        },
        parameters: parameters
      });
}

/*
* Requests FueldValues HTTP handler to get information about field changes.
*/
function GetFieldValues(fieldEditorResult) {
  var parameters = "action=getFieldValues&hdl=" + fieldEditorResult;
  new Ajax.Request(
      integrationHandlerUrl,
      {
        asynchronous: false,
        method: "get",
        onSuccess: function (result) {
          fieldChanges = result.responseText;
          var control = document.getElementById("scSilverlightEngagementPlan");
          if (control) {
            control.Content.Main.SaveFieldEditorValues(fieldChanges);
          }
        },
        parameters: parameters
      });
}
    