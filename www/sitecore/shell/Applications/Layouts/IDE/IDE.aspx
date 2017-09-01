<%@ Page language="c#" AutoEventWireup="false" %>
<%@ Import namespace="Sitecore.Data.Items"%>
<%
  Sitecore.Configuration.State.Client.UsesBrowserWindows = true;
  Sitecore.Configuration.State.Client.NoDesktop = true;
  
  Response.Redirect("/sitecore/shell/applications/Layouts/IDE.aspx");
%>