<%@ Control Language="C#" AutoEventWireup="true" CodeBehind="DialogHeader.ascx.cs" ViewStateMode="Disabled" EnableViewState="false" Inherits="Sitecore.Shell.DialogHeader" %>
<%@ Register TagPrefix="sc" Namespace="Sitecore.Web.UI.HtmlControls" Assembly="Sitecore.Kernel" %>
<div class="scFormDialogHeader">
  <div class="DialogHeader"><sc:Literal ID="NameLiteral" runat="server"/></div>
  <div class="DialogHeaderDescription"><sc:Literal ID="DescriptionLiteral" runat="server"/></div>
</div>
