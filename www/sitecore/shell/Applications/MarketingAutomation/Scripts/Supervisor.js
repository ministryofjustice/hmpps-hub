var integrationHandlerUrl = "/sitecore/shell/ClientBin/MarketingAutomation/Integration.ashx";

// ------------------------------------------------------------------------------------------------------------------
// Change Timeout Trigger.
// ------------------------------------------------------------------------------------------------------------------
/*
* Opens a new window with the Change Timeout Trigger dialog.
*/
function OpenChangeTimeoutTriggerWindow(stateId) {
  setTimeout(function () {
    var dialogUrl = "/sitecore/shell/default.aspx?xmlcontrol=Supervisor.ChangeTimeOut&stateId=" + stateId;
    var dialogStyle = "dialogWidth: 500px; dialogHeight: 600px; resizable: yes";
    scForm.showModalDialog(dialogUrl, null, dialogStyle, null, function(returnValue) {
      if (!returnValue) {
        return;
      }

      Reload();
    });
  }
  , 100);
}

/*
* Opens a new window with the Simulate/Force trigger dialog.
*/
function OpenSimulateTriggerWindow(stateId) {

  // The dialog parameters.
  var action = "action=getForceTriggerWizardUrl";
  var stateIdParam = "&stateId=" + encodeURIComponent(FixGuid(stateId));    
  var parameters = action + stateIdParam;
  // Sending Ajax request to the getForceTriggerWizardUrl HTTP handler to get URL of the dialog.  
  new Ajax.Request(
      integrationHandlerUrl,
      {
        asynchronous: false,
        method: "post",
        onSuccess: function (result) {
          dialogUrl = result.responseText;
        },
        parameters: parameters
      });

  // Displaying the dialog.
  setTimeout(function() {
    var dialogStyle = "dialogWidth: 500px; dialogHeight: 600px; resizable: yes";
    scForm.showModalDialog(dialogUrl, null, dialogStyle, null, function(returnValue) {
      if (!returnValue) {
        return;
      }

      Reload();
    });
  }, 100);
}

// ------------------------------------------------------------------------------------------------------------------
// Add a Contact.
// ------------------------------------------------------------------------------------------------------------------

/*
* Opens a new window with the Select User dialog.
*/
function OpenSelectUserWindow(stateId) {

  var control = document.getElementById("scSilverlightEngagementPlan");

  // The dialog parameters.
  var action = "action=getSelectUserDialogUrl";
  var stateIdParam = "&stateId=" + encodeURIComponent(FixGuid(stateId));  
  var parameters = action + stateIdParam;
  
  new Ajax.Request(
      integrationHandlerUrl,
      {
        asynchronous: false,
        method: "post",
        onSuccess: function(result) {
          dialogUrl = result.responseText;
        },
        parameters: parameters
      });

  // Displaying the dialog.
  setTimeout(function () {
    var dialogStyle = "dialogWidth: 500px; dialogHeight: 600px; resizable: yes";
    scForm.showModalDialog(dialogUrl, null, dialogStyle, null, function (returnValue) {
      if (!returnValue) {
        return;
      }

      var indx = returnValue.indexOf("^", 0);
      if (indx > 0) {
        var userName = returnValue.substring(0, indx);
      }

      AddVisitor(stateId, userName);
    });
  }
  , 100);
}

/*
* Adds a Contact to a state.
*/
function AddVisitor(stateId, userName) {
   
  var control = document.getElementById("scSilverlightEngagementPlan");

  // The dialog parameters.
  var action = "action=addContact";
  var stateIdParam = "&stateId=" + encodeURIComponent(FixGuid(stateId));
  var userNameParam = "&userName=" + userName;

  var parameters = action + stateIdParam + userNameParam;
  new Ajax.Request(
    integrationHandlerUrl,
    {
        asynchronous: false,
        method: "post",
        onSuccess: function ()
        {
         control.Content.Supervisor.VisitorsAdded(true);
        },
        parameters: parameters
      });
}

// ------------------------------------------------------------------------------------------------------------------
// Add a Contacts from segment.
// ------------------------------------------------------------------------------------------------------------------
function OpenSegmentBuilderWindow(stateId) {
  var control = document.getElementById("scSilverlightEngagementPlan");

  // The dialog parameters.
  var action = "action=getSegmentBuilderDialogUrl";
  var stateIdParam = "&stateId=" + encodeURIComponent(FixGuid(stateId));
  var parameters = action + stateIdParam

  new Ajax.Request(
      integrationHandlerUrl,
      {
        asynchronous: false,
        method: "post",
        onSuccess: function (result) {
          dialogUrl = result.responseText;
        },
        parameters: parameters
      });

  // Displaying the dialog.
      setTimeout(function () {
        var dialogStyle = "dialogWidth: 500px; dialogHeight: 600px; resizable: yes";
        scForm.showModalDialog(dialogUrl, null, dialogStyle, null, function(returnValue) {
          if (!returnValue) {
            return;
          }
          
          AddVisitorsFromSegment(stateId, returnValue);
        });
      }
  , 100);
}

/*
* Adds Contacts to a state.
*/
function AddVisitorsFromSegment(stateId, rule) {
  var control = document.getElementById("scSilverlightEngagementPlan");

  // The dialog parameters.
  var action = "action=addContactsFromSegment";
  var stateIdParam = "&stateId=" + encodeURIComponent(FixGuid(stateId));
  var ruleParam = "&rule=" + rule;
  
  var parameters = action + stateIdParam + ruleParam;
  new Ajax.Request(
    integrationHandlerUrl,
    {
      asynchronous: true,
      method: "post",
      onSuccess: function () {
         control.Content.Supervisor.VisitorsAdded(true);
      },
      parameters: parameters
    });        
  }

// ------------------------------------------------------------------------------------------------------------------
// Add a Contacts from a role.
// ------------------------------------------------------------------------------------------------------------------

/*
* Opens a new window with the Select Role dialog.
*/
function OpenSelectRoleWindow(stateId) {   
  var control = document.getElementById("scSilverlightEngagementPlan");
  
  // The dialog parameters.
  var action = "action=getSelectRoleDialogUrl";
  var stateIdParam = "&stateId=" + encodeURIComponent(FixGuid(stateId));  
  var parameters = action + stateIdParam
  
  new Ajax.Request(
      integrationHandlerUrl,
      {
        asynchronous: false,
        method: "post",
        onSuccess: function(result) {
          dialogUrl = result.responseText;
        },
        parameters: parameters
      });
      
  // Displaying the dialog.
  setTimeout(function () {
    var dialogStyle = "dialogWidth: 500px; dialogHeight: 600px; resizable: yes";
    scForm.showModalDialog(dialogUrl, null, dialogStyle, null, function(returnValue) {
      if (!returnValue) {
        return;
      }

      var indx = returnValue.indexOf("^", 0);
      if (indx > 0) {
        var roleName = returnValue.substring(0, indx);
      }

      AddVisitors(stateId, roleName);
    });
  }
  , 100);
}

/*
* Adds Contacts to a state.
*/
function AddVisitors(stateId, roleName)
{
  var control = document.getElementById("scSilverlightEngagementPlan");

  // The dialog parameters.
  var action = "action=addContacts";
  var stateIdParam = "&stateId=" + encodeURIComponent(FixGuid(stateId));
  var roleNameParam = "&roleName=" + roleName;
    
  var parameters = action + stateIdParam + roleNameParam;
  new Ajax.Request(
    integrationHandlerUrl,
    {
        asynchronous: true,
        method: "post",
        onSuccess: function ()
        {
            control.Content.Supervisor.VisitorsAdded(true);
        },
        parameters: parameters
      });
 }
  
// ------------------------------------------------------------------------------------------------------------------
// Add Contacts from a CSV file.
// ------------------------------------------------------------------------------------------------------------------

/*
* Opens a new window with the Import Contacts wizard.
*/
function OpenImportVisitorsWindow(stateId) {

  var control = document.getElementById("scSilverlightEngagementPlan");
  
  // The dialog parameters.
  var action = "action=getImportVisitorsWizardUrl";
  var stateId = "&stateId=" + encodeURIComponent(FixGuid(stateId));
  
  var parameters = action + stateId;
  new Ajax.Request(
      integrationHandlerUrl,
      {
        asynchronous: false,
        method: "post",
        onSuccess: function(result) {
          dialogUrl = result.responseText;
        }, 
        parameters: parameters
      });

  setTimeout(function () { 

    // Displaying the dialog.
    var dialogStyle = "dialogWidth: 520px; dialogHeight: 600px; resizable: yes";
    scForm.showModalDialog(dialogUrl, null, dialogStyle, null, function(returnValue) {
      if (!returnValue) {
        return;
      }

      control.Content.Supervisor.VisitorsAdded(true);
    });
  }
  , 100);
}

// ------------------------------------------------------------------------------------------------------------------
// Move Contacts.
// ------------------------------------------------------------------------------------------------------------------

/*
* Opens the Select State dialog.
*/
function OpenSelectStateAsWindow(stateId, title, description, rootItemId, command) {

  var control = document.getElementById("scSilverlightEngagementPlan");

  // The dialog parameters.
  var action = "action=getSelectStateDialogUrl";
  var icon = "&ic=" + encodeURIComponent("Software/16x16/element.png");
  var rootId = "&ro=" + encodeURIComponent(FixGuid(rootItemId));
  var selectedItemId = "&fo=" + encodeURIComponent(FixGuid(stateId));
  var text = "&txt=" + description.replace(" ", "+");
  var title = "&ti=" + title.replace(" ", "+");

  // Sending Ajax request to the SelectItem HTTP handler to get URL of the dialog.
  var parameters = action + icon + rootId + selectedItemId + text + title;    
  new Ajax.Request(
      integrationHandlerUrl,
      {
        asynchronous: false,
        method: "post",
        onSuccess: function(result) {
          dialogUrl = result.responseText;
        },
        parameters: parameters
      });

  // Displaying the dialog.  
  setTimeout(function () { 

    var dialogStyle = "dialogWidth: 500px; dialogHeight: 600px; resizable: yes";
    scForm.showModalDialog(dialogUrl, null, dialogStyle, null, function(returnValue) {
      if (!returnValue) {
        return;
      }

      if (command == "move") {
        MoveVisitors(stateId, returnValue);
      }
      if (command == "copy") {
        CopyVisitors(stateId, returnValue);
      }
    });
  }
  , 100);
}

/*
* Move Contacts to another state.
*/
function MoveVisitors(sourceStateId, destinationStateId)
{
    var control = document.getElementById("scSilverlightEngagementPlan");

    // The dialog parameters.
    var action = "action=moveVisitors";
    var sourceStateId = "&sourceStateId=" + encodeURIComponent(FixGuid(sourceStateId));
    var destinationStateId = "&destinationStateId=" + encodeURIComponent(FixGuid(destinationStateId));
    
    var parameters = action + sourceStateId + destinationStateId;
    new Ajax.Request(
      integrationHandlerUrl,
      {
        asynchronous: false,
        method: "post",
        onSuccess: function () {
          control.Content.Supervisor.VisitorsMoved(true);
        },
        onFailure: function (response) {
          if (500 == response.status)
          { 
            alert(response.responseText);
          }
        },
        parameters: parameters
      });    
}

/*
* Move Contacts to another state.
*/
function CopyVisitors(sourceStateId, destinationStateId) {
  var control = document.getElementById("scSilverlightEngagementPlan");

  // The dialog parameters.
  var action = "action=copyVisitors";
  var sourceStateId = "&sourceStateId=" + encodeURIComponent(FixGuid(sourceStateId));
  var destinationStateId = "&destinationStateId=" + encodeURIComponent(FixGuid(destinationStateId));

  var parameters = action + sourceStateId + destinationStateId;
  new Ajax.Request(
      integrationHandlerUrl,
      {
        asynchronous: false,
        method: "post",
        onSuccess: function () {
          control.Content.Supervisor.VisitorsCopied(true);
        },
        onFailure: function (response) {
          if (500 == response.status)
          { 
            alert(response.responseText);
          }
        },
        parameters: parameters
      });
    }

// ------------------------------------------------------------------------------------------------------------------
// Remove Contacts.
// ------------------------------------------------------------------------------------------------------------------

/*
* Opens the Select State dialog.
*/
function RemoveVisitors(stateId) {

  var control = document.getElementById("scSilverlightEngagementPlan");

  // The dialog parameters.
  var action = "action=removeVisitors";
  var selectedItemId = "&sourceStateId=" + encodeURIComponent(FixGuid(stateId));  
  
  var parameters = action + selectedItemId;
  new Ajax.Request(
      integrationHandlerUrl,
      {
        asynchronous: false,
        method: "post",
        onSuccess: function (result) {                    
          control.Content.Supervisor.VisitorsRemoved(true);
        },
        onError: function (result) {
          control.Content.Supervisor.VisitorsRemoved(false);
        },
        parameters: parameters    
      });    
}

/*
* Reload.
*/
function Reload() {
  var control = document.getElementById("scSilverlightEngagementPlan");
  control.Content.Supervisor.Reload();
}
