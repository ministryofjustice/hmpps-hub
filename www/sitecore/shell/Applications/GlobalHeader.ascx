<%@ Control Language="C#" AutoEventWireup="true" CodeBehind="GlobalHeader.ascx.cs" Inherits="Sitecore.Shell.Applications.GlobalHeader" %>
<%@ Register TagPrefix="sc" Namespace="Sitecore.Web.UI.HtmlControls" Assembly="Sitecore.Kernel" %>

<asp:PlaceHolder ID="placeHolder" Visible="False" runat="server">

  <link type="text/css" rel="stylesheet" href="/sitecore/shell/Themes/Standard/Default/GlobalHeader.css" />
  <header class="sc-globalHeader">
    <div class="sc-globalHeader-content">
      <div class="col2">
        <div class="sc-globalHeader-startButton">
          <a id="globalLogo" ClientIDMode="Static" class="sc-global-logo" href="#" runat="server"></a>
        </div>
      </div>
      <div class="col2">
        <div class="sc-globalHeader-loginInfo">

          <ul class="sc-accountInformation">
            <li>
              <span class="logout" onclick="javascript:return scForm.postEvent(this,event,'system:logout');"><sc:Literal Text="Log out" runat="server"/></span>
            </li>
            <li>
              <asp:Literal ID="globalHeaderUserName" runat="server" />
              <sc:ThemedImage ID="globalHeaderUserPortrait" runat="server"></sc:ThemedImage>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </header>
  <Script Type="text/javascript">
    Event.observe(window, "load", function () {
      if (window.scForm) {
          window.scForm.registerLaunchpadClick();
      }
    });
  </Script>
</asp:PlaceHolder>
