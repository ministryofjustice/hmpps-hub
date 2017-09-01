var scOldValue = "";
var scReady = false;
var scMode = "WYSIWYG";

function OnClientLoad(editor) {
  editor.set_useClassicDialogs(true);

  editor.attachEventHandler("ondrop", scOnDrop);
  editor.attachEventHandler("onkeydown", scOnKeyDown);

  if (Prototype.Browser.IE && editor.get_newLineMode() == Telerik.Web.UI.EditorNewLineModes.P) {
    editor.attachEventHandler("onkeydown", function (e) {
      if (e.keyCode == 13) {
        var oCmd = new Telerik.Web.UI.Editor.GenericCommand("Enter", editor.get_contentWindow(), editor);
        editor.executeCommand(oCmd);
      }
    });
  }

  scOldValue = editor.get_html(true);
  scReady = true;

  if (isIE7()) {
    scFixToolbars(editor);
  }
  
  window.setInterval(scKeepAlive, 1800 * 1000);
}

function scGetForm() {
  var frame = null;
  var agent = navigator.userAgent.toLowerCase();

  if (agent.indexOf("msie") >= 0 && agent.indexOf("opera") < 0) {
    frame = window.frameElement;
  }
  else {
    var list = window.parent.document.getElementsByTagName("IFRAME");
  
    for(var n = 0; n < list.length; n++) {
      var ctl = list[n];
      
      if (ctl.contentWindow == window) {
        frame = ctl;
        break;
      }
    }
  }
  
  if (frame != null) {
    if (agent.indexOf("msie") >= 0 && agent.indexOf("opera") < 0) {
      return frame.ownerDocument.parentWindow.scForm;
    }
    else {
      return window.parent.scForm;
    }
  }
  
  return null;
}

function OnClientModeChange(editor) {
  // this is only called when the editor is in ShowDialogMode
  scMode = (scMode == "WYSIWYG" ? "HTML" : "WYSIWYG");
  scConvert(editor);
}

function OnClientCommandExecuted(editor, commandName, oTool) {
  if (commandName == "InsertSnippet") {
    scConvert(editor);
  }
}

function scConvert(editor) {
  try {
    var win = window.dialogArguments[0];
  }
  catch(e) {
    win = window;
  }
  
  var form = win.scForm;
  
  if (form != null) {
    var request =  new win.scRequest();
   
    request.form = "html=" + encodeURIComponent(editor.get_html());
    
    request.build("", "", "", 'Convert(\"' + scMode + '\")', true);
   
    var url = "/sitecore/shell/Applications/Content Manager/Execute.aspx?cmd=Convert&mode=" + scMode;
                                                        
    request.url = url;
   
    request.send();
   
    if (request.httpRequest != null && request.httpRequest.status == "200") {
     editor.set_html(request.httpRequest.responseText);
    } 
  }
}

function scGetFrameValue(value, request) {
  var editor = scGetEditor();
  
  if (scReady && editor != null) {
    var html = editor.get_html(true);
    
    if (html != scOldValue) {
      var form = scGetForm()
      
      if (form != null) {
        form.setModified(true);
      }
      
      if (request != null) {
        request.form += "&EditorChanged=" + encodeURIComponent("1");
      }
    }

    return html;
  }
  
  return null;
}

function scGetValue() {
  var editor = scGetEditor();
  
  if (scReady && editor != null) {
    return editor.get_html(true);
  }
  
  return null;
}

function scOnDrop() {
  var editor = scGetEditor();
  
  if (editor != null) {
    var evt = (event == null ? editor.ContentWindow.event : event);
    
    if (evt != null) {
      var data = evt.dataTransfer.getData("text");
  	  
      if (data != null && data != "") {
        if (data.substring(0, 9) == "sitecore:") {
          var form = scGetForm();
          
          if (form != null) {
            form.postEvent("", evt, "DropInRichText(\"" + data + "\")");
            
            evt.cancelBubble = true;
            
            return false;
          }
        }
      }
    }
  }
}

function scOnKeyDown(evt) {
  var editor = scGetEditor();
  
  if (editor != null && evt != null) {
    var form = scGetForm();
    
    if (form != null) {
      if (evt.ctrlKey && evt.keyCode == 83) {
        form.postEvent("", evt, "item:save");
      }
      else if (evt.ctrlKey && evt.keyCode == 13) {
        if (location.href.indexOf("mo=Editor") >= 0) {
          form.postRequest("", "", "", "Accept_Click");
          return;
        }
      }
      
      if (!form.isFunctionKey(evt, true)) {
        form.setModified(true);
      }
    }
  }
}

function scPaste(text) {
  text = text.replace(/\&quot;/gi, "\"");

  var editor = scGetEditor();
  
  if (editor != null) {
    editor.pasteHtml(text);
  }
}

function scSetDataSource(datasource) {
  var editor = scGetEditor();
  
  if (editor != null) {
    var doc = editor.get_document();
    
    for(var n = 0; n < doc.frames.length; n++) {
      var win = doc.frames[n];
      
      var href = win.location.href;
      
      var i = href.indexOf("sc_datasource");
      if (i < 0) {
        href += (href.indexOf("?") < 0 ? "?" : "&") + "sc_datasource=" + datasource;
      }
      else {
        var tail = "";
        
        var t = href.indexOf("&", i);
        if (t >= 0) {
          tail = href.substr(t);
        }
        
        href = href.substr(0, i) + "sc_datasource=" + datasource + tail;
      }
      
      win.location = href;
    }
  }
}

function scSetLiveMode(live) {
  var editor = scGetEditor();
  
  if (editor != null) {
    var doc = editor.get_document();
  
    for(var n = 0; n < doc.frames.length; n++) {
      var win = doc.frames[n];
      
      var href = win.location.href;
      
      if (href.indexOf("sc_live") < 0) {
        href += (href.indexOf("?") < 0 ? "?" : "&") + "sc_live=" + (live ? "1" : "0");
      }
      else {
        href = href.replace("sc_live=" + (live ? "0" : "1"), "sc_live=" + (live ? "1" : "0"));
      }
      
      win.location = href;
    }
  }
}

function scSetText(text) {
  var editor = scGetEditor();
  
  if (editor != null) {
    editor.set_html(text);
    
    scOldValue = editor.get_html(true);
  }
}

function scFire(command) {
  var editor = scGetEditor();
  
  if (editor != null) {
   var tool = editor.getToolByName(command);
    
    if (tool != null) {
      var element = tool.Element;
      
      if (element.tagName == "TABLE") {
        var button = element.getElementsByTagName("IMG")[1]; 
        
        if (button == null) {
          button = element.getElementsByTagName("IMG")[0]; 
        }
        
        element = button;
      }
      
      element.click(); 
    }
    else {
      editor.fire(command);
    }
  }
}

function scKeepAlive() {
  var img = document.getElementById("scKeepAlive");
  
  if (img == null) {
    img = document.createElement("img");

    img.id = "scKeepAlive";
    img.width = "1";
    img.height = "1";
    img.alt = "";
    img.style.position = "absolute";
    
    document.body.appendChild(img);
  }
  
  img.src="/sitecore/images/blank.gif?ts=" + Math.round(Math.random()*12361814);
}

function scFixToolbars(editor) {
  var editorVisible = false;
  $(window.parent.document.body).down('#Editor').visible() ? editorVisible = true : $(window.parent.document.body).down('#Editor').setStyle({ display: 'block', position: 'absolute', top: '-1000px', left: '-1000px' });
  $(editor._element).select('.reToolbar').each(function (reToolbar) {
    var reToolbarWidth = 0;
    reToolbar.childElements().each(function (element) {
      reToolbarWidth += element.offsetWidth;
    });
    reToolbar.setStyle({
      width: reToolbarWidth + 'px'
    });
  });
  $(window.parent.document.body).down('#Editor').setStyle(editorVisible ? {} : { display: 'none', position: 'static', top: 'auto', left: 'auto' });
}

function isIE7() {
  if (Prototype.Browser.IE) {
    var version = parseInt(navigator.userAgent.substring(navigator.userAgent.indexOf("MSIE") + 5));
    return version == 7;
  }

  return false;
}