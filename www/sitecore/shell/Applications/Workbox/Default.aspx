<%@ Page Language="C#" AutoEventWireup="true" Codebehind="Default.aspx.cs" Inherits="Sitecore.Shell.Applications.Workbox.WorkboxPage" %>
<%@ Register TagPrefix="sc" Namespace="Sitecore.Web.UI.HtmlControls" Assembly="Sitecore.Kernel" %>
<%@ Register src="~/sitecore/shell/Applications/GlobalHeader.ascx" tagName="GlobalHeader" TagPrefix="uc" %>

<!DOCTYPE html>
<html>
<head runat="server">
  <title><sc:Literal Text="Workbox" runat="server"></sc:Literal></title>
  <asp:placeholder id="BrowserTitle" runat="server"></asp:placeholder>
  <sc:Stylesheet runat="server" Src="Content Manager.css" DeviceDependant="true" />
  <sc:Stylesheet runat="server" Src="Workbox.css" DeviceDependant="true" />
  <script type="text/JavaScript" src="/sitecore/shell/controls/SitecoreObjects.js"></script>
  <script type="text/JavaScript" src="/sitecore/shell/controls/SitecoreWindow.js"></script>
  <script type="text/JavaScript" src="/sitecore/shell/Applications/Content Manager/Content Editor.js"></script>
</head>
<body class="scWindowBorder1">
  <form id="WorkboxForm" runat="server">
  <uc:GlobalHeader runat="server" />
  <div class="scPanel scFlexColumnContainer scWorkboxPanel scWindowBorder2">
      <div id="CaptionTopLine">
        <img src="/sitecore/images/blank.gif" alt="" style="display: block" />
      </div> 
    
      <div class="scWorkboxWindowCaption scCaption scWindowHandle"
        onmousedown="scWin.mouseDown(this, event)"
        onmousemove="scWin.mouseMove(this, event)"
        onmouseup="scWin.mouseUp(this, event)"
        ondblclick="scWin.maximizeWindow()"
        onactivate="scWin.activate(this, event)">

        <div class="scWorkboxWindowButtons">
          <asp:PlaceHolder ID="WindowButtonsPlaceholder" runat="server" />
        </div> 

      </div>
  
      <div class="scFlexContent">
        
        <div class="scPanel " style="position: absolute;">
          
            <div class="scWindowBorder3"><img src="/sitecore/images/blank.gif" class="scWindowBorder4" alt="" style="display: block" /></div>

            <div id="WorkboxFrame" class="" style="height: 100%">
              <iframe src="/sitecore/shell/default.aspx?xmlcontrol=Workbox&mo=preview" style="width: 100%;height: 100%; box-sizing: border-box;"></iframe>
            </div>
            
            <div class="scWindowBorder3"><img src="/sitecore/images/blank.gif" class="scWindowBorder4" style="display: block"  alt="" /></div>
          
        </div>
        
      </div>
    
    <div class="scWindowBorder3" style="height: 2px;"><img src="/sitecore/images/blank.gif"  alt=""  /></div>
    
    <div class="scPager scDockBottom">
      <asp:PlaceHolder ID="Pager" runat="server" />
    </div>
    
  </div>
  </form>
</body>
</html>
