<%@ Page Language="c#" AutoEventWireup="True" Codebehind="Frame.aspx.cs" Inherits="Sitecore.Shell.Applications.WebDAV.WebDAVViewForm" %>
<%@ Import Namespace="Sitecore.Web"%>
<%@ Register TagPrefix="sc" Namespace="Sitecore.Web.UI.WebControls" Assembly="Sitecore.Kernel" %>
<%@ Register TagPrefix="schtml" Namespace="Sitecore.Web.UI.HtmlControls" Assembly="Sitecore.Kernel" %>
<%@ OutputCache Location="None" VaryByParam="none" %>
<!DOCTYPE html>
<html lang="en">
<head runat="server">
  <title>
    <%=Sitecore.Globalization.Translate.Text(Sitecore.Texts.DragAndDrop)%></title>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="CODE_LANGUAGE" content="C#" />
  <meta name="vs_defaultClientScript" content="JavaScript" />
  <meta name="vs_targetSchema" content="http://schemas.microsoft.com/intellisense/ie5" />
  <link href="/default.css" rel="stylesheet" />
</head>

<body>
  <form id="mainform" method="post" runat="server">
  <schtml:WebFolderView runat="server" ID="DAVFrame" Width="100%" Height="100%" Visible="false"/>
  </form>
</body>
</html>
