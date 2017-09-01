<%@ Control Language="C#" AutoEventWireup="true" Inherits="Sitecore.Social.Client.MessagePosting.UI.Controls.TopBoard" %>
<asp:MultiView runat="server" ID="mvwTopButtons">
  <asp:View runat="server" ID="vwButtons">
    <div class="scsocTopBoard">
      <asp:Repeater runat="server" ID="rpTopButtons" OnItemDataBound="RpTopButtonsItemDataBound">
        <ItemTemplate>
          <asp:Button runat="server" ID="btnNewMessage" />
        </ItemTemplate>
      </asp:Repeater>
      <p class="scsocTopBoardMessage">
        <asp:Literal ID="ltPublishInfoMsg" runat="server" />
      </p>
    </div>
  </asp:View>
  <asp:View runat="server" ID="vwMessage">
    <p class="scsocTopBoardMessage">
      <asp:Literal runat="server" ID="ltMessage" Mode="Encode" /></p>
  </asp:View>
</asp:MultiView>