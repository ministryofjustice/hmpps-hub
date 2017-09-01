<%@ Control Language="C#" AutoEventWireup="true" Inherits="Sitecore.Social.Client.MessagePosting.UI.Controls.MessageList" %>
<%@ Register Src="MessageContainer.ascx" TagName="MessageContainer" TagPrefix="scsoc" %>
<asp:Repeater ID="rpMessages" OnItemDataBound="RpMessagesItemDataBound" runat="server">
  <ItemTemplate>
    <scsoc:MessageContainer ID="ctrlMessageContainer" runat="server" />
  </ItemTemplate>
</asp:Repeater>
<asp:HyperLink runat="server" ID="lnkSeeMore" NavigateUrl="javascript:void();" CssClass="scsocShowMoreMessages" />
