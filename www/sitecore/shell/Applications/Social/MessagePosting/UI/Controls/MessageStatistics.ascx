<%@ Control Language="C#" AutoEventWireup="true" Inherits="Sitecore.Social.Client.MessagePosting.UI.Controls.MessageStatistics" %>
<%@ Register Src="CampaignReportsToggle.ascx" TagName="CampaignReportsToggle" TagPrefix="scsoc" %>
<scsoc:CampaignReportsToggle runat="server" ID="ctrlCampaignReportsToggle" />
<div class="scsocMessageStatistics" id="divMessageStatistics" runat="server">
  <div class="scsocStatiticsList">
    <asp:DataList runat="server" ID="dtlMessageStatistics" RepeatLayout="Table" RepeatDirection="Horizontal"
      RepeatColumns="3" OnItemDataBound="MessageStatisticsItemDataBound">
      <ItemTemplate>
        <div class="scsocStatsCounter">
          <asp:Literal ID="ltrlCounterValue" runat="server" Mode="Encode" /></div>
        <div class="scsocStatsCounterTitle">
          <asp:Literal ID="ltrlCounterName" runat="server" Mode="Encode" /></div>
      </ItemTemplate>
      <SeparatorTemplate>
        <div class="scsocStatsSeparator"><hr /></div>
      </SeparatorTemplate>
    </asp:DataList>
  </div>
</div>
