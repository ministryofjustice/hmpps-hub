// ToDo: remove when file-downloader will be added to framework
define(["jquery"], function ($) {
  "use strict";
  var ieAccessDeniedMessage = "Access is denied.";
  return {
    download: function (fileUrl, onErrorCallback) {
      var hiddenIFrameId = 'hiddenDownloader',
      iframe = document.getElementById(hiddenIFrameId);
      if (typeof iframe === "undefined" || iframe === null) {
        iframe = document.createElement('iframe');
        iframe.id = hiddenIFrameId;
        iframe.style.display = 'none';
        iframe.onload = $.proxy(function () { this.onLoadHandler(iframe, onErrorCallback); }, this);
        document.body.appendChild(iframe);
      }
      iframe.src = fileUrl;
    },
    onLoadHandler: function (iframe, onErrorCallback) {
      // This is specific IE case. Unknown type is presented in JScript
      // implementation of ECMAScript
      if (typeof iframe.contentDocument === "unknown") {
        onErrorCallback(ieAccessDeniedMessage);
      }
        // Chrome case
      else if (typeof iframe.contentDocument.body.innerText !== "undefined" && iframe.contentDocument.body.innerText !== "") {
        onErrorCallback(JSON.parse(iframe.contentDocument.body.innerText).Message);
      }
        // Firefox case
      else if (typeof iframe.contentDocument.body.textContent !== "undefined" && iframe.contentDocument.body.textContent !== "") {
        onErrorCallback(JSON.parse(iframe.contentDocument.body.textContent).Message);
      }
    },
  };
});