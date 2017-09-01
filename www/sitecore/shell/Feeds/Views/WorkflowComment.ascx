<%@ Control Language="C#" AutoEventWireup="true" CodeBehind="WorkflowComment.ascx.cs" Inherits="Sitecore.Shell.Feeds.Views.WorkflowComment" %>
<div id="CommentArea">
  <div id="Result">
    
    <div id="ActionInfo">
      <asp:TextBox runat="server" ToolTip="Workflow comment" CssClass="comment-box" ID="Comment" Width="100%" style="margin-top: 2.5em" />
      
      <button id="WorkflowButton" class="scButton" onclick="javascript:submitComment();return false;" style="margin-top: 8px; min-width: 85px">
        <asp:PlaceHolder runat="server" ID="Icon" /><span style="vertical-align: middle"> <asp:Literal runat="server" ID="ButtonText" /></span>
      </button>
      
      <img id="Loading" src="/sitecore/shell/Themes/Standard/Images/sc-spinner16.gif" style="float: left; display: none; margin-top: 8px;" />
    </div>
    
  </div>
</div>