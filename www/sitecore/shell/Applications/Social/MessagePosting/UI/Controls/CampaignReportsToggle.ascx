<%@ Control Language="C#" AutoEventWireup="true" Inherits="Sitecore.Social.Client.MessagePosting.UI.Controls.CampaignReportsToggle" %>
<%@ Register TagPrefix="scsoc" Namespace="Sitecore.Social.Client.MessagePosting.UI.WebControls" Assembly="Sitecore.Social.Client" %>
<div class="scsocCampaignReportsSwitcher">
  <scsoc:ToggleButton ID="btnOpenToggle" runat="server" TextTranslateKey="ShowCampaignReports"
    ToggleState="Open" OnClientClick="scsocSocialCenter.getInlineCampaignIndicatorsBeginAsync('{0}','{1}','{2}');return false;"
    OnFormatClientClick="BtnOpenToggleFormatClientClick" />
  <scsoc:ToggleButton ID="btnCloseToggle" runat="server" TextTranslateKey="HideCampaignReports"
    ToggleState="Close" OnClientClick="scsocSocialCenter.toggleCampaignReports('{0}');return false;"
    OnFormatClientClick="BtnCloseToggleFormatClientClick" />
</div>
