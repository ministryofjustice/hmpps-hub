if (typeof (Sitecore) == "undefined") Sitecore = new Object();
if (typeof (Sitecore.Controls) == "undefined") Sitecore.Controls = new Object();

Sitecore.Controls.RichEditor = Class.create({
  initialize: function(editorId) {
    this.editorId = editorId;
  },

  onClientLoad: function(editor) {
    editor.attachEventHandler("onkeydown", this.onKeyDown.bind(this));
    if (!scForm.browser.isIE) {
      this.getEditor().get_element().style.minHeight = '';
    }

    fixIeObjectTagBug();

    // get the design mode
    var designModeBtn = $$('.reMode_design')[0];
    if (typeof (designModeBtn) != "undefined") {
        Event.observe(designModeBtn, 'click', function () {
      setTimeout(fixIeObjectTagBug, 100);
    });
    }

    if (Prototype.Browser.IE && editor.get_newLineMode() == Telerik.Web.UI.EditorNewLineModes.P) {
      editor.attachEventHandler("onkeydown", function (e) {
        if (e.keyCode == 13) {
          var oCmd = new Telerik.Web.UI.Editor.GenericCommand("Enter", editor.get_contentWindow(), editor);
          editor.executeCommand(oCmd);
        }
      });
    }

    this.oldValue = editor.get_html(true);
  },

  getEditor: function() {
    if (typeof ($find) == "function") {
      return $find(this.editorId);
    }

    return null;
  },

  saveRichText: function (html) {
    var w = scForm.browser.getParentWindow(window.frameElement.ownerDocument);
    if (w.frameElement) {
      w = scForm.browser.getParentWindow(w.frameElement.ownerDocument);
    }

    w.scContent.saveRichText(html);
  },

  setFocus: function() {
    var editor = this.getEditor();
    if (!editor) {
      return;
    }

    editor.setFocus();
  },

  setText: function(html) {
    var editor = this.getEditor();
    if (!editor) {
      return;
    }

    editor.set_html(html);
    fixIeObjectTagBug();
  },

  onKeyDown: function(evt) {
    var editor = this.getEditor();

    if (editor == null || evt == null) {
      return;
    }

    if (evt.ctrlKey && evt.keyCode == 13) {
      scSendRequest("editorpage:accept");
      return;
    }

    if (!scForm.isFunctionKey(evt, true)) {
      scForm.setModified(true);
    }
  }
});

function scCloseEditor() {
   var doc = window.top.document;
   
   // Field editor
   var w = doc.getElementById('feRTEContainer');

   if (w) {        
    $(w).hide();
   }
   else {
     // Page editor
     if (top._scDialogs.length != 0) {
       top.dialogClose();
     } else {
       scCloseRadWindow();
     }
   }
}

function scGetRadWindow() {
  var currentRadWindow = null;
  if (window.radWindow)
    currentRadWindow = window.radWindow;
  else if (window.frameElement.radWindow)
    currentRadWindow = window.frameElement.radWindow;
  return currentRadWindow;
}

function scCloseRadWindow() {
  var currentRadWindow = scGetRadWindow();
  if (currentRadWindow != null) {
    // Hack for IE. Window is not closed because code thinks that window is already closed. Calling 'show' before closing helps to solve the problem. 
    currentRadWindow.show();
    currentRadWindow.close();
  }
  return false;
}