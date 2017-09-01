<%@ Page language="c#" AutoEventWireup="false" %>
<%@ Import namespace="Sitecore.Globalization"%>
<%@ Import namespace="Sitecore.Data.Items"%>
<%
  Sitecore.Configuration.State.Client.NoDesktop = true;
  Sitecore.Configuration.State.Client.UsesBrowserWindows = true;
  
  Item item = Sitecore.Context.Database.Items["/sitecore/content/Applications/Workbox"];
  
  if (item != null && item.Access.CanRead()) {
    Response.Redirect("/sitecore/shell/Applications/Workbox.aspx?mo=fs");
  }
  
  Response.Redirect("/sitecore/login/default.aspx?sc_error=You do not have access to the Workbox.");
%>