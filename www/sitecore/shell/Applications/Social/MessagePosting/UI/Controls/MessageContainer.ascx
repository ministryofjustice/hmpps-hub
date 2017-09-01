<%@ Control Language="C#" AutoEventWireup="true" Inherits="Sitecore.Social.Client.MessagePosting.UI.Controls.MessageContainer" %>
<%@ Register TagPrefix="scsoc" TagName="MessageContentButtons" Src="MessageContentButtons.ascx" %>
<%@ Register TagPrefix="scsoc" TagName="MessageStatistics" Src="MessageStatistics.ascx" %>
<%@ Register TagPrefix="scsoc" TagName="MessageCampaignReports" Src="MessageCampaignReports.ascx" %>
<%@ Register TagPrefix="scsoc" TagName="MessageAccount" Src="MessageAccount.ascx" %>
<%@ Register TagPrefix="scsoc" TagName="MessageContent" Src="MessageContent.ascx" %>
<div class="scsocMessage" id="divMessageContainer" runat="server">
  <a href="#" class="scsocMessageAnchor"></a>
  <table border="0" cellspacing="0" cellpadding="0" width="100%" class="scsocMessageContainer">
    <tbody>
      <tr>
        <td class="scsocMessageCenterPanelContainer">
          <table border="0" cellpadding="0" cellspacing="0" class="scsocMessageCenterPanelContainer">
            <tr>
              <td>
              </td>
              <td class="scsocMessageButtonsContainer">
                <scsoc:MessageContentButtons ID="ctrlMessageContentButtons" runat="server" />
              </td>
            </tr>
            <tr>
              <td class="scsocNetworkLogoContainer" rowspan="2">
                <asp:Image runat="server" ID="imgNetworkLogo" CssClass="scsocNetworkLogo" />
              </td>
              <td class="scsocMessageAccountContainer" runat="server">
                <scsoc:MessageAccount ID="ctrlMessageAccount" runat="server"/>
              </td>
            </tr>
            <tr>
              <td class="scsocMessageContentContainer">
                <scsoc:MessageContent ID="ctrlMessageContent" runat="server" />
              </td>
            </tr>
            <tr>
              <td class="scsocRefreshingAnimationContainer">
                <div class="scsocRefreshingAnimation" />
              </td>
              <td class="scsocMessageStatisticsContainer">
                <scsoc:MessageStatistics ID="ctrlMessageStatistics" runat="server" />
                <scsoc:MessageCampaignReports ID="ctrlMessageCampaignReports" runat="server" />
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </tbody>
  </table>
</div>
