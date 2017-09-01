<%@ Page language="c#" Codebehind="Cache.aspx.cs" AutoEventWireup="false" Inherits="Sitecore.sitecore.admin.CacheAdmin" %>
<!DOCTYPE html>
<HTML>
  <HEAD>
    <title>Cache Admin</title>
      <link rel="shortcut icon" href="/sitecore/images/favicon.ico" />
<meta content=C# name=CODE_LANGUAGE>
<meta content=JavaScript name=vs_defaultClientScript>
<meta content=http://schemas.microsoft.com/intellisense/ie5 name=vs_targetSchema>
  </HEAD>
<body>
<form id=Form1 method=post runat="server">
<TABLE id=Table1 style="WIDTH: 594px; HEIGHT: 154px" cellSpacing=1 cellPadding=1 
width=594 border=1>
  <TR>
    <TD><asp:label id=Caches runat="server" DESIGNTIMEDRAGDROP="79">Actions</asp:label></TD>
    <TD></TD>
    <TD><asp:button id=c_refresh runat="server" Text="Refresh"></asp:button>&nbsp;&nbsp;&nbsp;&nbsp;<asp:button id=c_clearAll runat="server" Text="Clear all"></asp:button></TD></TR>
  <TR>
    <TD><asp:label id=Label1 runat="server">Totals</asp:label></TD>
    <TD></TD>
    <TD><asp:label id=c_totals runat="server">[totals]</asp:label></TD></TR>
  <TR>
    <TD style="HEIGHT: 36px"></TD>
    <TD style="HEIGHT: 36px"></TD>
    <TD style="HEIGHT: 36px"></TD></TR>
  <TR>
    <TD vAlign=top><asp:label id=c_cacheTitle runat="server">Caches</asp:label></TD>
    <TD></TD>
    <TD><asp:PlaceHolder id=c_caches runat="server"></asp:PlaceHolder></TD></TR></TABLE></FORM>
  </body>
</HTML>
