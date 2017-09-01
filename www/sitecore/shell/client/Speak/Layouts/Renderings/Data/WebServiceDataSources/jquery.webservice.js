define(["jquery"], function (jQuery) {
  /*
  *﻿  Plugin name : jquery.webservice
  *﻿  Author : Jimmy Hattori
  *﻿  Created on : 2009-06-11
  *﻿  Description : Enable to access .Net webservice.
  *﻿  Options:
  *﻿  ﻿  As this plugin is written based on jQuery.ajax, options are exact same as jQuery.ajax except "data" option
  *﻿  ﻿  and other few extra custom options. Followings are options that are specific to this plugin.
  *
  *       - requestType   string  (optional)
  *           Four options of request type.            
  *               * "soap1.1" (SOAP 1.1) - default
  *               * "soap1.2" (SOAP 1.2)
  *               * "httpget" (HTTP GET)
  *               * "httppost" (HTTP POST)
  *
  *﻿  ﻿  - nameSpace﻿  string﻿  *only required if "soap1.1" or "soap1.2" were selected.
  *﻿  ﻿  ﻿  Namespace of webservice. In .Net webservice, default is "http://tempurl.org".
  *
  *﻿  ﻿  - methodName﻿  string﻿  *required
  *﻿  ﻿  ﻿  Name of the webmethod to access
  *
  *﻿  ﻿  - data﻿  Object﻿  (optional)
  *﻿  ﻿  ﻿  parameters to be sent to the server if the web method requires values to its arguments.
  *﻿  ﻿  ﻿  Needs to be written in JSON. (i.e. {memberID:111,firstName:"Foo",lastName:"Foo"})
  *﻿  ﻿  
  *﻿  ﻿  For the rest of options document, see http://docs.jquery.com/Ajax/jQuery.ajax#options.
  *
  *﻿  Example:
  *﻿  ﻿  $.webservice({
  *﻿  ﻿  ﻿  url: "Foo.asmx",
  *﻿  ﻿  ﻿  data: {fooID:1,fooText:"foo-eee!"},
  *﻿  ﻿  ﻿  dataType: "text",
  *﻿  ﻿  ﻿  nameSpace: "http://tempuri.org/",
  *﻿  ﻿  ﻿  methodName: "fooWebMethod",
  *﻿  ﻿  ﻿  success:function(data,textStatus){﻿  ﻿  ﻿  ﻿  
  *﻿  ﻿  ﻿  ﻿  $("#divFood").html(data);
  *﻿  ﻿  ﻿  }
  *﻿  ﻿  });﻿  ﻿  
  */

  jQuery.webservice = function (options) {
    try {

      var settings = {
        requestType: "soap1.1",
        error: function (XMLHttpRequest, textStatus, errorThrown) {
          throw XMLHttpRequest.responseText;
        }
      };
      $.extend(settings, options);

      var oBuffer = new Array();

      if (settings.requestType == "soap1.1" || settings.requestType == "soap1.2") {
        settings.nameSpace += (settings.nameSpace.length - 1 == settings.nameSpace.lastIndexOf("/")) ? "" : "/";
      }

      switch (settings.requestType) {
      case "soap1.2":
        settings.methodType = "POST";
        settings.contentType = "application/soap+xml";

        oBuffer.push("<soap12:Envelope ");
        oBuffer.push("xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" ");
        oBuffer.push("xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" ");
        oBuffer.push("xmlns:soap12=\"http://www.w3.org/2003/05/soap-envelope\">");
        oBuffer.push("<soap12:Body>");
        oBuffer.push("<" + settings.methodName + " xmlns=\"" + settings.nameSpace + "\">");
        for (key in settings.data) {
          if (key != "length" && typeof(settings.data[key].prototype) == "undefined") {
            oBuffer.push("<" + key + ">" + settings.data[key] + "</" + key + ">");
          }
        }

        oBuffer.push("</" + settings.methodName + ">");
        oBuffer.push("</soap12:Body>");
        oBuffer.push("</soap12:Envelope>");

        settings.requestData = oBuffer.join("");

        break;
      case "httpget":
        settings.methodType = "GET";
        settings.contentType = "text/xml";

        for (key in settings.data) {
          if (key != "length" && typeof(settings.data[key].prototype) == "undefined") {
            oBuffer.push(key + "=" + settings.data[key]);
          }
        }

        settings.url += ("/" + settings.methodName + "?" + oBuffer.join("&"));
        settings.requestData = "";

        break;
      case "httppost":
        settings.methodType = "POST";
        settings.contentType = "application/x-www-form-urlencoded";

        for (key in settings.data) {
          if (key != "length" && typeof(settings.data[key].prototype) == "undefined") {
            oBuffer.push(key + "=" + settings.data[key]);
          }
        }

        settings.url += ("/" + settings.methodName);
        settings.requestData = oBuffer.join("&");

        break;
      default:
        settings.requestType = "soap1.1";
        settings.methodType = "POST";
        settings.contentType = "text/xml";

        oBuffer.push("<soap:Envelope ");
        oBuffer.push("xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" ");
        oBuffer.push("xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" ");
        oBuffer.push("xmlns:soap=\"http://schemas.xmlsoap.org/soap/envelope/\">");
        oBuffer.push("<soap:Body>");
        oBuffer.push("<" + settings.methodName + " xmlns=\"" + settings.nameSpace + "\">");
        for (key in settings.data) {
          if (key != "length" && typeof(settings.data[key].prototype) == "undefined") {
            oBuffer.push("<" + key + ">" + settings.data[key] + "</" + key + ">");
          }
        }
        oBuffer.push("</" + settings.methodName + ">");
        oBuffer.push("</soap:Body>");
        oBuffer.push("</soap:Envelope>");

        settings.requestData = oBuffer.join("");

        break;
      }

      $.ajax({
        type: settings.methodType,
        cache: false,
        url: settings.url,
        data: settings.requestData,
        contentType: settings.contentType,
        dataType: settings.dataType,
        parseData: false,
        success: settings.success,
        error: settings.error,
        beforeSend: function (XMLHttpRequest) {
          if (settings.requestType == "soap1.1" || settings.requestType == "soap1.2") {
            XMLHttpRequest.setRequestHeader("SOAPAction", settings.nameSpace + settings.methodName);
          }
          
          // XMLHttpRequest.setRequestHeader("Content-Length", settings.requestData.length);
          // XMLHttpRequest.setRequestHeader("Connection", "close");
        }
      });
    } catch (err) {
      alert("Error occurred in jquery.webservice.js.");
    }
  };
});