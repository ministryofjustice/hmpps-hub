<%@ Control Language="C#" AutoEventWireup="true" Inherits="Sitecore.Social.Client.MessagePosting.UI.Controls.MessageCreatePanel" %>
<%@ Register TagPrefix="scsoc" Namespace="Sitecore.Social.Client.MessagePosting.UI.WebControls" Assembly="Sitecore.Social.Client" %>
<div class="scsocWarningPanel" id="divWarningPanel" runat="server" Visible="False">
    <table width="100%" cellspacing="0" cellpadding="0" border="0" class="scsocWarningPanelTable">
        <tbody>
            <tr>
                <td valign="top"><img border="0" alt="" class="scsocSectionCaptionIcon" src="/sitecore/~/Icon/Applications/16x16/warning.png"></td>
                <td width="100%"><div class="scsocWarningTitle"><asp:Literal runat="server" ID="ltWarningTitle" /></div></td>
            </tr>
        </tbody>
    </table>
</div>
<div class="scsocMessageCreateContainer">
    <div class="scsocMessageCreateTitleContainer">
        <asp:Literal runat="server" ID="ltrNewMessagePanelTitle"></asp:Literal>
    </div>
    <asp:Repeater runat="server" ID="rptButtons" OnItemDataBound="rptButtons_ItemDataBound">
        <ItemTemplate>
            <scsoc:NetworkImageButton ID="btnCreateMessage" CssClass="scsocMessageCreateButton"
                OnClientClick="return window.parent.scForm.postEvent(this,event,'{0}');" OnFormatClientClick="BtnMessageCreateFormatClientClick"
                runat="server">
            </scsoc:NetworkImageButton>
        </ItemTemplate>
    </asp:Repeater>
</div>
<div style="clear: both;">
</div>
