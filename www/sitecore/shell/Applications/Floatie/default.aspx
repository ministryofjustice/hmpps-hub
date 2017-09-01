<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="default.aspx.cs" Inherits="Sitecore.Shell.Applications.Floatie.DefaultPage" %>
<%@ Register TagPrefix="sc" Namespace="Sitecore.Web.UI.HtmlControls" Assembly="Sitecore.Kernel" %>
<%@ Register TagPrefix="sc" Namespace="Sitecore.Web.UI.WebControls" Assembly="Sitecore.Kernel" %>
<asp:PlaceHolder id="DocumentType" runat="server" />
<html>
<head runat="server">
  <title>Sitecore</title>
  <sc:Stylesheet runat="server" Src="Content Manager.css" DeviceDependant="true"/>
  <sc:Stylesheet runat="server" Src="Floatie.css" DeviceDependant="true"/>
  <sc:Stylesheet runat="server" Src="Floatiebar.css"/>
  <sc:Stylesheet runat="server" Src="/sitecore/portal/tech/tech.css"/>
  <sc:Script runat="server" Src="/sitecore/shell/Controls/Sitecore.Runtime.js"/>
  <sc:Script runat="server" Src="/sitecore/shell/Applications/Floatie/Floatie.js"/>
</head>
<body>
  <form id="Form" runat="server">
  <table class="scPanel" cellpadding="0" cellspacing="0" border="0" 
    onmouseover="javacript:return Sitecore.Floatie.mouseOver(this, event)"
    onmouseout="javacript:return Sitecore.Floatie.mouseOut(this, event)">
    <tr>
      <td id="CaptionTopLine"><img src="/sitecore/images/blank.gif" alt="" /></td> 
    </tr>
    
    <tr>
      <td class="scFloatieCaption" 
        onmousedown="javascript:return Sitecore.Floatie.mouseDown(this, event);"
        onmousemove="javascript:return Sitecore.Floatie.mouseMove(this, event);"
        onmouseup="javascript:return Sitecore.Floatie.mouseUp(this, event);">
        <sc:Border runat="server" Class="scFloatieWindowButtions" Click="javascript:Sitecore.Floatie.toggle()">
          <sc:ThemedImage runat="server" ID="WindowButton" Src="Images/Window Management/page_switcher.png" Class="scWindowManagementButton" Alt="Expand/Collapse" RollOver="true"/>
        </sc:Border>

        <sc:Literal runat="server" Text="Sitecore" />
      </td>
    </tr>
  
    <tr runat="server" id="CollapsableWindow">
      <td id="FloatieRibbon">
        <div>
          <asp:PlaceHolder runat="server" ID="Portal" />
        </div>
      </td>
    </tr>
  </table>
  </form>
</body>
</html>
