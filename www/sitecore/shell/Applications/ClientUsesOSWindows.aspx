<%@ Page language="c#" AutoEventWireup="false" %>
<%@ Import namespace="Sitecore.Data.Items"%>
<%
  Sitecore.Configuration.State.Client.UsesBrowserWindows = true;
  Sitecore.Configuration.State.Client.NoDesktop = true;
  
  Item item = Sitecore.Context.Database.Items["/sitecore/content/Applications/Content Editor"];
  
  if (item != null && item.Access.CanRead()) {
    Response.Redirect("/sitecore/shell/Applications/Content editor.aspx?sc_bw=1");
  }
  
  Response.Redirect("/sitecore/login/default.aspx?sc_error=You do not have access to the Content Editor.");
%>