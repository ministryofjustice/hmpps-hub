function scOnLoad() {
  setTimeout(scMakeVisible, 10);

  // disable links
  var list = document.getElementsByTagName("A");
  for(var n = 0; n < list.length; n++) {
    list[n].onclick = scDoCancel;
  }
}

function scMakeVisible() {
  var scrollHeight = 0;
  try {
    scrollHeight = document.body.scrollHeight;
  }
  catch(err) {    
    return;
  }

  if (scrollHeight <= 1) {
    setTimeout(scMakeVisible, 10);
  }
  else {
     window.frameElement.style.height = document.body.scrollHeight;
     window.frameElement.style.width = document.body.scrollWidth;
  }
}

function scClick() {
  var click = window.frameElement.ownerDocument.parentWindow.scRenderingClicked;

  if (click != null) {
    click(window.event, window.frameElement);
  }
}

function scDblClick() {
  var page = "";

  var ctl = scForm.browser.getControl("CustomizePage");
  if (ctl != null && ctl.innerHTML != "") {
    page = ctl.innerHTML;
  }

  if (page == "disabled") {
    return;
  }

  if (page == "") {
    page = "/sitecore/shell/default.aspx?xmlcontrol=IDE.RenderingProperties";
  }

  var url = window.location.href;

  if (url.indexOf("?") >= 0) {
    url = url.substr(url.indexOf("?") + 1);
  }

  url = encodeURIComponent(url);

  var width = screen.width / 2;
  var height = screen.height / 2;
  var left = (screen.width - width) / 2;
  var top = (screen.height - height) / 2;

  var options = "help:no;scroll:auto;resizable:yes;status:no;center:yes;" +
    "dialogWidth:" + width + "px;dialogHeight:" + height + "px;" +
    "dialogTop:" + top + "px;dialogLeft:" + left + "px";

  url = page + "&pa=" + url;

  var result = scForm.showModalDialog(url, new Array(window), options);

  if (result != null && result != "__cancel") {
    url = window.location.href;

    var live = scGetUrlParameter(url, "sc_live");
    var datasource = scGetUrlParameter(url, "sc_datasource");

    if (url.indexOf("?") >= 0) {
      url = url.substr(0, url.indexOf("?") + 1);
    }

    url += result;
    url += (live != "" ? "&" + live : "");
    url += (datasource != "" ? "&" + datasource : "");

    var form = window.frameElement.ownerDocument.parentWindow.scForm;
    if (form != null) {
      form.postRequest("", "", "", "SetRenderingProperties(\"" + frameElement.id + "\", \"" + url + "\")");
    }
    else {
      form = window.frameElement.ownerDocument.parentWindow.frameElement.ownerDocument.parentWindow.frameElement.ownerDocument.parentWindow.scForm;
      form.postRequest("", "", "", "SetChanged");
    }

    try {
      window.frameElement.src = url;
    }
    catch(e) {
    }
  }
}

function scDoCancel() {
  var evt = window.event;

  if (evt != null) {
    evt.returnValue = false;
    evt.cancelBubble = true;
  }

  return false;
}

function scGetUrlParameter(url, name) {
  var n = url.indexOf(name);

  if (n >= 0) {
    var i = url.indexOf("&", n);

    if (i >= 0) {
      return url.substr(n, i - n);
    }

    return url.substr(n);
  }

  return "";
}
