<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Delete.aspx.cs" Inherits="Sitecore.Shell.Applications.WebEdit.DeletePage" %>
<%@ Register TagPrefix="sc" Namespace="Sitecore.Web.UI.HtmlControls" Assembly="Sitecore.Kernel" %>
<%@ OutputCache Location="None" VaryByParam="none" %>
<!DOCTYPE html>
<html>
<head runat="server">
  <title>Sitecore</title>
  <link rel="Stylesheet" href="/sitecore/shell/Applications/WebEdit/WebEditDialog.css" />
</head>
<body>
  <form id="DeleteForm" runat="server">
    <div id="scPage">
      <div id="scDialogBorder">
      <div id="scDialog">
        <div id="scCaption">
          <sc:ThemedImage runat="server" Src="Applications/16x16/delete2.png" Width="16" Height="16" Class="scCaptionIcon"/>
          <sc:Literal runat="server" Text="Delete"/>
        </div>
        
        <div id="scContentPanel">
        <table id="scContent" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td>
              <sc:ThemedImage runat="server" Src="Applications/32x32/warning.png" Width="32" Height="32" Class="scIcon"/>
            </td>
            <td>
              <sc:Literal runat="server" id="ConfirmationText" />
            </td>
          </tr>
        </table>
        </div>
        
        <div id="scButtons">
          <button type="submit" id="OK" name="OK"><sc:Literal runat="server" Text="OK" /></button>
          <button type="submit" id="Cancel" name="Cancel"><sc:Literal runat="server" Text="Cancel" /></button>
        </div>
      </div>
    </div>
    </div>
  </form>
</body>
</html>
