<!DOCTYPE html>
<html>
  <head>
    <title>Sitecore</title>
    <style>
      html, body {
        height: 100%;
        margin:0;
        overflow: hidden;
      }
      .message {
        height: calc(100% - 50px);
        overflow: auto;
        padding: 15px;
        box-sizing: border-box;
      }
      .icon {
        line-height:30px;
        width:32px;
        float:left;
      }
      .text {
        font-size:  8pt;
      }
      .right {
        margin-left: 42px;
      }
      .skip{
        text-align: left;
        float:left;
      }
      .footer {
        overflow: auto;
        text-align: right;
        padding: 0 10px 15px;
        width:100%;
        box-sizing: border-box;
      }
      #chromeMessage,#edgeMessage {
        display:none;
      }
    </style>
  </head>
  <body onload='javascript:onLoad();' scroll="no">
    <div id="message" class="message">
      <div class="icon">
        <img id="imgIcon" src="/~/icon/Applications/32x32/warning.png" width="32" height="32" border="0" alt="0" />
      </div>
      <div id="chromeMessage"class="text right">
        <%= Sitecore.Globalization.Translate.Text("Sitecore has a number of applications that use Microsoft Silverlight. When you use Google Chrome version 42.0 (or later) to access one of these applications, you see that some content is missing or the Install Microsoft Silverlight badge is displayed.") %>
        <br />
        <br />
        <%= Sitecore.Globalization.Translate.Text("To view an application that uses Silverlight, please use Microsoft Internet Explorer, Mozilla Firefox, or Apple Safari. For further information please refer to the Sitecore Knowledgebase article") %> <a href="https://kb.sitecore.net/articles/604276" target="_blank">KB604276</a>
      </div>
      <div id ="edgeMessage" class="text right chrome">
        <%= Sitecore.Globalization.Translate.Text("Sitecore has a number of applications that use Microsoft Silverlight. When you use the Microsoft Edge browser (available in Windows 10) to access one of these applications, you may see that some content is missing.") %>
        <br />
        <br />
        <%= Sitecore.Globalization.Translate.Text("To view an application that uses Silverlight, please use Microsoft Internet Explorer, Mozilla Firefox, or Apple Safari. For further information please refer to the Sitecore Knowledgebase article") %> <a href="https://kb.sitecore.net/articles/990938" target="_blank">KB990938</a>
      </div>
    </div>
    <div class="footer text">
      <hr />
      <div class="skip text">
        <input type="checkbox" id="doNotShowAgain"><%= Sitecore.Globalization.Translate.Text("Do not show again")%>
      </div>
      <button id="Close1" style="width: 75px; height: 25px;" onclick="javascript:onClose();">Close</button>
    </div>
  </body>
  <script language="javascript">
    function onClose() {
      top.scForm.setCookie("sitecore_silverlight_notification_skip", document.getElementById("doNotShowAgain").checked ? "1" : "0");
      window.top.dialogClose();
    }
    function onLoad(){
      if (navigator.userAgent.indexOf('Edge') > -1) {
        document.getElementById('edgeMessage').style.display  = 'block'
      } else {
        document.getElementById('chromeMessage').style.display  = 'block'
      }
      var messageElement = document.getElementById('message');
      messageElement.style.overflow = 'hidden';
      var initialDialogHeight = window.innerHeight;
          maxDialogHeight = top.innerHeight - 90;
          textHeight = document.getElementById('message').scrollHeight,
          footerHeight = 80;

      if (textHeight + footerHeight > initialDialogHeight) {
        var dialogContentIframe = top._scDialogs[0].contentIframe;
        var newHeight = textHeight + footerHeight;
        dialogContentIframe.dialog("option", "height", newHeight < maxDialogHeight ? newHeight : maxDialogHeight);
      }
      messageElement.style.overflow = 'auto';
    }
  </script>
</html>
