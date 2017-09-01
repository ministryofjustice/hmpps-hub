<%@ Page language="c#" AutoEventWireup="false" %>
<%@ Import namespace="Sitecore.Data.Items"%>
<%
  Sitecore.Configuration.State.Client.UsesBrowserWindows = true;
  
  Response.Redirect("/sitecore/shell/applications/default.aspx?xmlcontrol=IDE");
%>