<%@ Page Language="C#" AutoEventWireup="true" %>
<%@ Import Namespace="System" %>
<%@ Import Namespace="System.Xml" %>
<%@ Import Namespace="Sitecore.Configuration" %>
<%
      XmlDocument configuration = Factory.GetConfiguration();
      this.Response.ContentType = "text/xml";
      this.Response.Write(configuration.OuterXml);
%>
