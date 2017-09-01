<%@ Page Language="C#" AutoEventWireup="true" EnableEventValidation="false" Inherits="Sitecore.Social.Client.MessagePosting.UI.SocialCenter" %>

<%@ Register Src="Controls/MessageList.ascx" TagName="MessageList" TagPrefix="scsoc" %>
<%@ Register Src="Controls/MessagePostInfo.ascx" TagName="MessagePostInfo" TagPrefix="scsoc" %>
<%@ Register Src="Controls/MessageCreatePanel.ascx" TagName="MessageCreatePanel" TagPrefix="scsoc" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
  <title runat="server" />
  <asp:PlaceHolder runat="server" ID="hldScripts" />
  <asp:PlaceHolder runat="server" ID="hldCssStyles" />
</head>
<body class="scsocBody">
  <form id="mainForm" runat="server">
  <div class="scsocArea">
    <scsoc:MessagePostInfo runat="server" ID="ctrlMessagePostInfo" />
    <scsoc:MessageCreatePanel runat="server" ID="ctrMessageCreatePanel" />
    <scsoc:MessageList ID="ctrlMessageList" runat="server" />
  </div>
  </form>
  <div class="scsocModal"></div>
</body>
</html>