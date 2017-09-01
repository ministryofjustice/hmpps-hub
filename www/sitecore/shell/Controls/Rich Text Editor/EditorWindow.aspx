<%@ Page Language="C#" AutoEventWireup="true" Inherits="Sitecore.Shell.Applications.ContentManager.EditorWindowPage" Codebehind="EditorWindow.aspx.cs" %>
<%@ Register TagPrefix="telerik" Namespace="Telerik.Web.UI" Assembly="Telerik.Web.UI" %>
<!DOCTYPE html>
<html>
<head id="Head1" runat="server">
<title>Sitecore</title>
  <script src="/sitecore/shell/controls/lib/prototype/prototype.js" type="text/javascript"></script>
  <script type="text/javascript">
    var currentKey = null;
    var windowWidth = null;
    var windowHeight = null;
    var isMaximized = null;

    function fixRadWindowMinWidth(radWindow) {
      var id = "RadWindowWrapper_MainWindow";
      var mainWindow = document.getElementById(id);
      mainWindow.style.minWidth = "1200px";
      radWindow.center();
    }

    function scClientClose() {
      var w = $find("MainWindow");
      windowWidth = w.GetWidth();
      windowHeight = w.GetHeight();
      isMaximized = w.IsMaximized();

      $(window.frameElement).hide();
      
      // Firefox cannot process parent.focus() properly https://bugzilla.mozilla.org/show_bug.cgi?id=554039
      if (Prototype.Browser.Gecko) {
        var focusWorkaround = getContentEditorWindow().document.getElementById('focusWorkaround');
        focusWorkaround.style.display = 'inline';
        focusWorkaround.focus();
        focusWorkaround.parentNode.removeChild(focusWorkaround);
      }
      else {
          getContentEditorWindow().focus();
      }
    }

    function getContentEditorWindow() {
      if (frameElement.id == 'overlayWindow') {
        // Content editor view
        return parent;
      }
      else {
        // Desktop view
        var frameElementId = frameElement.id;
        var contentEditorId = frameElementId.substring(0, frameElementId.indexOf('overlayWindow'));
        return Element.select(parent.document, '#' + contentEditorId)[0].contentWindow;
      }
    }

    function scLoad(url, key, html) {
      var w = $find("MainWindow");

      // Firefox cannot process parent.focus() properly https://bugzilla.mozilla.org/show_bug.cgi?id=554039
      if (Prototype.Browser.Gecko) {
        var focusWorkaround = document.createElement('input');
        focusWorkaround.type = 'text';
        focusWorkaround.id = 'focusWorkaround';
        focusWorkaround.style.display = 'none';
        getContentEditorWindow().document.body.appendChild(focusWorkaround);
      }

      if (key == currentKey) {
        var f = w.GetContentFrame();

        f.contentWindow.scRichText.setText(html);
        w.show();
        scResizeWindow(w);
        f.contentWindow.scRichText.setFocus();
        return;
      }

      currentKey = key;
      scResizeWindow(w);
      w.show();

      fixRadWindowMinWidth(w);

      w.setUrl(url);
    }

    function scResizeWindow(w) {
      if (windowWidth == null) {
       return;
      }

      if (isMaximized) {
        w.Maximize();
      }
    }

  </script>
  <style>
    .rwWindowContent {
      background-color: #ECECEC !important;
    }
  </style>
</head>
<body style="background:transparent">
  <form id="form1" runat="server">
    <telerik:RadScriptManager ID="RadScriptManager" runat="server"></telerik:RadScriptManager>

    <asp:UpdatePanel ID="UpdatePanel" runat="server">
      <ContentTemplate>
        <telerik:RadFormDecorator ID="RadFormDecorator" runat="server" />

        <telerik:RadWindowManager ShowContentDuringLoad="false" VisibleStatusbar="false" runat="server" >
          <Windows>
            <telerik:RadWindow ID="MainWindow" Behaviors="Resize,Move,Close,Maximize" runat="server" KeepInScreenBounds="true" Width="1000" Height="600" MinHeight="275" Modal="true" ReloadOnShow="false" Skin="Default" OnClientBeforeClose="scClientClose" />
          </Windows>
        </telerik:RadWindowManager>
      </ContentTemplate>
    </asp:UpdatePanel>
  </form>
</body>
</html>