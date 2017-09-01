Ajax = Class.extend({
  init: function () { },
  getXmlHttp: function () {
    var xmlhttp;
    try {
      xmlhttp = new ActiveXObject("Msxml2.XMLHTTP");
    } catch (e) {
      try {
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
      } catch (e) {
        xmlhttp = false;
      }
    }
    if (!xmlhttp && typeof window.XMLHttpRequest != 'undefined') {
      xmlhttp = new window.XMLHttpRequest();
    }
    return xmlhttp;
  },
  post: function (url, params, onComplete, onError) {
    var req = this.getXmlHttp();

    req.onreadystatechange = function () {
      if (req.readyState == 4) {
        if (req.status == 200) {
          var actionResult = JSON.parse(req.responseText);
          
          if (actionResult.ErrorMessage) {
            onError(actionResult.ErrorMessage, params);
          }
          else {
            onComplete(actionResult);  
          }
        } else {
          onError(req.statusText, params);
        }
      }
    };

    //req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    //req.setRequestHeader("Content-length", params.length);
    //req.setRequestHeader("Connection", "close");
    req.open('POST', url, true);

    req.send(params);
  }
});

SocialAjax = Ajax.extend({
  init: function () {
    this.url = "/sitecore/shell/Applications/Social/MVC/DataHandler.ashx";
  },
  post: function (controller, action, args, callback, onerror) {
    var params = {
      controller: controller,
      action: action,
      args: args
    };
    var strParams = JSON.stringify(params);
    var url = this.url;
    this._super(url, strParams, callback, onerror);
  }
});