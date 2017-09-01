/*
* OnBeforeUnload handler
*/
var hasChanges = false;

if (usesBrowserWindows) {

  // Browser Window
  window.onbeforeunload = function () {
    if (hasChanges) {
      if (typeof (scForm) != "undefined") {
        event.returnValue = scForm.translate("There are unsaved changes.");
      }
      else {
        event.returnValue = "There are unsaved changes.";
      }
    }
    return;
  }
}
else {

  window.scForm.saveItem = function () {
    var control = document.getElementById("scSilverlightEngagementPlan");
    if (control != null) {
      control.Content.Main.ConfirmSaveBeforeExit();
      return false;
    }

    return true;
  }
}

function SetHasChanges(value) {
  hasChanges = (value == "True");
  if (!usesBrowserWindows) {
    var win = this;
    if (win != null) {
      win.scForm.setModified(value == "True");
    }
  }
}

function CloseWindow(value) {
  if ((value == "True")) {
    window.top.scManager.closeWindow(window);
  }
}