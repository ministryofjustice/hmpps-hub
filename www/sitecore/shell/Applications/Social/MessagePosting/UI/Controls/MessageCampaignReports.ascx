<%@ Control Language="C#" AutoEventWireup="true" Inherits="Sitecore.Social.Client.MessagePosting.UI.Controls.MessageCampaignReports" %>
<div class="scsocCampaignReports">
  <h3 id="h3Campaign" runat="server">
    <asp:Literal runat="server" ID="ltCampaign" Mode="Encode" />:&nbsp;<asp:Literal runat="server" ID="ltCampaignName" Mode="Encode" /></h3>
  <div class="scsocCampaignStatsContainer">
  </div>
  <div class="scsocCampaignStatsInfo">
    <asp:Image runat="server" ID="imgHelp" AlternateText="?" />
  </div>
</div>
