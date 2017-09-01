<%@ Control Language="C#" AutoEventWireup="true" Inherits="Sitecore.Social.Client.MessagePosting.UI.Controls.MessageAccount" %>
<div runat="server" class="scsocMessageAccount">
  <div class="scsocMessageAccountTitle">
    <img src="/sitecore/~/Icon/People/16x16/user1.png" style="width: 16px; height: 16px" alt="" /><asp:Literal runat="server" ID="ltAccountName" Mode="Encode" />
  </div>
  <div id="divMessageWorkflowCommands" runat="server" class="scsocMessageWorkflowCommands">
    <div style="float: right;">
    <asp:Repeater runat="server" ID="rptMessageWorkflowCommands" OnItemDataBound="MessageWorkflowCommandsItemDataBound" ItemType="Sitecore.Workflows.WorkflowCommand">
      <HeaderTemplate>
        <ul>
      </HeaderTemplate>
      <ItemTemplate>
        <li><asp:Image runat="server" ID="imgMessageWorkflowCommandIcon" GenerateEmptyAlternateText="True" /><asp:HyperLink runat="server" ID="lnkMessageWorkflowCommand" Text='<%# Item.DisplayName %>' /></li>
      </ItemTemplate>
      <FooterTemplate></ul></FooterTemplate>
    </asp:Repeater></div>
    <div class="scsocMessageWorkflowState">
      <asp:Literal runat="server" ID="ltWorkflowState" /><asp:HyperLink runat="server" ID="lnkShowMessageWorkflowCommands" NavigateUrl="javascript:void()" />
    </div>
  </div>
</div>
