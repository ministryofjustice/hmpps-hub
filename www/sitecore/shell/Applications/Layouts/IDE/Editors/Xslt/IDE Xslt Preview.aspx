<%@ Page language="c#" Codebehind="IDE Xslt Preview.aspx.cs" AutoEventWireup="false" Inherits="Sitecore.Shell.Applications.Layouts.IDE.Editors.Xslt.IDEXsltPreview" %>
<%@ register TagPrefix="sc" Namespace="Sitecore.Web.UI.WebControls" Assembly="Sitecore.Kernel" %>
<%@ OutputCache Location="None" VaryByParam="none" %>
<!DOCTYPE html> 
<html>
  <head>
    <title>XSLT Preview</title>
    <meta name="GENERATOR" Content="Microsoft Visual Studio .NET 7.1">
    <meta name="CODE_LANGUAGE" Content="C#">
    <meta name=vs_defaultClientScript content="JavaScript">
    <meta name=vs_targetSchema content="http://schemas.microsoft.com/intellisense/ie5">
    <link href="<asp:placeholder ID='Stylesheet' runat='server'/>" rel="stylesheet">
  </head>
  <body>
    <form id="Form" method="post" runat="server">
      <sc:xslfile id="XslFile" runat="server" />
      <asp:placeholder id="ErrorMessage" runat="server"/>
    </form>
  </body>
</html>
