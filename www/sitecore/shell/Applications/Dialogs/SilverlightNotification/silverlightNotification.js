(function () {
  scForm.browser.attachEvent(window, "onload", function (evt) {
    if (scForm.browser.isChrome || navigator.userAgent.indexOf('Edge') > -1) {
      if (scForm.getCookie("sitecore_silverlight_notification_skip") != "1") {
        (function showModalDialogRetryer(parameters) {
          try {
            scForm.showModalDialog("/sitecore/shell/Applications/Dialogs/SilverlightNotification/silverlightNotification.aspx", [window], "dialogWidth:500px;dialogHeight:150px;scroll:no;status:off;help:no;center:yes;resizable:no");
          } catch (e) {
            setTimeout(showModalDialogRetryer, 100);
          }
        })();
      }
    }
  });
})();