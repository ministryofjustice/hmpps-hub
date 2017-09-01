<%@ Page language="c#" AutoEventWireup="false" %>
<%@ Import namespace="Sitecore"%>
<%@ Import namespace="Sitecore.Data.Items"%>
<%
  Sitecore.Configuration.State.Client.NoDesktop = true;  
  Response.Redirect("/?sc_mode=edit");
%>