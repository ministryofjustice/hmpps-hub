<%@ Page language="c#" AutoEventWireup="false" %>
<%@ Import namespace="Sitecore"%>
<%@ Import Namespace="Sitecore.Configuration" %>
<%@ Import namespace="Sitecore.Data.Items"%>
<%@ Import namespace="Sitecore.Publishing"%>
<%
  Sitecore.Configuration.State.Client.NoDesktop = true;
  PreviewManager.StoreShellUser(Settings.Preview.AsAnonymous);
  Response.Redirect("/?sc_mode=preview");
%>