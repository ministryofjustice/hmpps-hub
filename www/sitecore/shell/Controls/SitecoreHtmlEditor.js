function scGetFrameValue() {
  return scQueryMessage(this, "HtmlEditor.control:value(get=1)");
}

function scEditHtml() {
  var value = scQueryMessage(this, "HtmlEditor.control:value");
  
  Application.HtmlUtil.ShowModalWindow("control:HtmlEditorDialog", "", 
    "HtmlEditor.contenthtmleditor:sethtml", 1000, 600, value);
}

function scEditXHtml() {
  var value = scQueryMessage(this, "HtmlEditor.control:value");
  
  Application.HtmlUtil.ShowModalWindow("control:HtmlEditorDialog", "", 
    "HtmlEditor.contenthtmleditor:sethtml", 1000, 600, value);
}

function scSetHtml(html) {
  scSendMessage(this, "HtmlEditor.control:value", new Array("set", html));
}

function scSendCommand(msg) {
  scPostMessage(this, msg);
}
