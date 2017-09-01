<%@ Control Language="C#" AutoEventWireup="true" Inherits="Sitecore.Social.Client.MessagePosting.UI.Controls.MessageContentButtons" %>
<%@ Register TagPrefix="scsoc" Namespace="Sitecore.Social.Client.MessagePosting.UI.WebControls" Assembly="Sitecore.Social.Client" %>
<div class="scsocContentButtonsContainer">
  <div class="scsocContentButtonsLeftContainer scsocContentButtonBottomAlign">
    <scsoc:ContentButton ID="btnEdit" runat="server" TextTranslateKey="Edit" ToolTipTranslateKey="EditTheMessage" 
      OnClientClick="return scsocSocialCenter.editMessage('{0}','{1}','{2}');" 
      OnFormatClientClick="BtnEditFormatClientClick" />·<scsoc:ContentButton 
        ID="btnDelete" runat="server" TextTranslateKey="Delete" ToolTipTranslateKey="DeleteTheMessage" 
        OnClientClick="return scsocSocialCenter.deleteMessage('{0}','{1}','{2}');" OnFormatClientClick="BtnDeleteFormatClientClick" /><span
        runat="server" id="pnlRefreshButton">·<scsoc:ContentButton ID="btnRefreshStatistics"
          runat="server" TextTranslateKey="RefreshStatistics" ToolTipTranslateKey="RefreshTheMessageStatistics"
          OnClientClick="scsocSocialCenter.refreshStatisticsBeginAsync('{0}','{1}');return false;"
          OnFormatClientClick="BtnRefreshStatisticsClientClick" /></span></div>
  <div class="scsocContentButtonsRightContainer"><asp:Button ID="btnPost" runat="server" CssClass="scsocPostButton" /></div>
  <div class="scsocContentButtonsRightContainer scsocContentButtonBottomAlign"><asp:Literal ID="ltPostedAutomatically" runat="server" Mode="Encode" /></div>  
  <div class="scsocContentButtonsRightContainer scsocContentButtonBottomAlign scsocMessagePostingStatus" runat="server" id="divMessagePostingStatus"><asp:Literal runat="server" ID="ltMessagePostingStatus" /></div>
</div>