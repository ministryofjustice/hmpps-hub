  var fieldEditorUrl;
  var selectItemDialogUrl;
  var fieldChanges;

  var silverlightApplicationLoaded = null;

  function PluginLoaded(sender, args) {
    silverlightApplicationLoaded = sender.getHost();
  } 

  /*
  * Fixes GUID format.
  */
  function FixGuid(guid) {
    if ((guid == null) || (guid == "")) {
      return null;
    }

    return "{" + guid.replace("{", "").replace("}", "").toUpperCase() + "}";
  }
    
  function onSilverlightError(sender, args) {
    var appSource = "";
    if (sender != null && sender != 0) {
      appSource = sender.getHost().Source;
    }

    var errorType = args.ErrorType;
    var iErrorCode = args.ErrorCode;

    if (errorType == "ImageError" || errorType == "MediaError") {
      return;
    }

    var errMsg = "Unhandled Error in Silverlight Application " + appSource + "\n";

    errMsg += "Code: " + iErrorCode + "    \n";
    errMsg += "Category: " + errorType + "       \n";
    errMsg += "Message: " + args.ErrorMessage + "     \n";

    if (errorType == "ParserError") {
      errMsg += "File: " + args.xamlFile + "     \n";
      errMsg += "Line: " + args.lineNumber + "     \n";
      errMsg += "Position: " + args.charPosition + "     \n";
    }
    else if (errorType == "RuntimeError") {
      if (args.lineNumber != 0) {
        errMsg += "Line: " + args.lineNumber + "     \n";
        errMsg += "Position: " + args.charPosition + "     \n";
      }
      errMsg += "MethodName: " + args.methodName + "     \n";
    }

    throw new Error(errMsg);
  }

  function KeepAlive() {
  }


  // View visitors in a state window
  function OpenViewVisitorsWindow(id) {
    setTimeout(function () {
      var dialogUrl = "/sitecore/shell/~/xaml/Sitecore.Shell.Applications.MarketingAutomation.Dialogs.SelectStateVisitor.aspx?mode=readOnly&stateId=" + id;
      var dialogStyle = "dialogWidth: 500px; dialogHeight: 490px; resizable: yes";
      scForm.showModalDialog(dialogUrl, null, dialogStyle, null, function(returnValue) {
        if (!returnValue) {
          return;
        }

        Reload();
      });
    }
  , 100);
    
  }