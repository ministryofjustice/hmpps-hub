<%@ Page Language="C#" EnableEventValidation="false" AutoEventWireup="true" CodeBehind="Action.aspx.cs" Inherits="Sitecore.Shell.Feeds.ActionPage" %>
<%@ Import Namespace="Sitecore"%>
<%@ Import Namespace="Sitecore.Globalization"%>

<%@ Register Assembly="Sitecore.Kernel" Namespace="Sitecore.Web.UI.HtmlControls" TagPrefix="sc" %>
<%@ Register Assembly="Sitecore.Kernel" Namespace="Sitecore.Web.UI.WebControls" TagPrefix="sc" %>

<%@ Import Namespace="Sitecore.Shell.Feeds"%>
<%@ Import Namespace="Sitecore.Data.Items"%>
<%@ Import Namespace="Sitecore.Syndication"%>

<!DOCTYPE html>

<html>
<head id="Head" runat="server">
  <title><%= Title %></title>
    <link rel="Stylesheet" type="text/css" href="/sitecore/shell/themes/standard/default/WebFramework.css" />  
    <link href="/sitecore/shell/feeds/Action.css" rel="stylesheet" />
    
    <script type="text/javascript" src="/sitecore/shell/controls/lib/jQuery/jquery.noconflict.js"></script>
    <script type="text/javascript" src="/sitecore/shell/controls/lib/jQuery/jquery.watermark.js"></script>
    <script type="text/javascript" src="/sitecore/shell/controls/webframework/webframework.js"></script></head>
    <script type="text/javascript" src="Action.js" ></script>
</head>
<body>
  <form id="mainform" runat="server" class="wf-container">
    <sc:AjaxScriptManager runat="server"/>
    <sc:ContinuationManager runat="server" />
  
    <div id="Body" class="wf-content">
      
      <asp:Panel runat="server" ID="UpdateArea">
        <h1><asp:Literal runat="server" ID="TitleLiteral" /></h1>
      
        <asp:Panel runat="server" ID="MainArea">
          <div id="Result">
            <%= RenderActionText() %>
            </div>
          
          <% if (Links.Count > 0) { %>
          <div id="Additional">
            <h3><%= Translate.Text(Texts.RelatedActions) %></h3>
            <ul>
              <% foreach(var link in ViewData.Links) { %>
              <li><a href="<%= link.Href %>"><%= link.Text %></a></li>
              <% } %>
            </ul>
          </div>
          <% } %>
          
        </asp:Panel>
        
        <asp:PlaceHolder runat="server" ID="ViewPlaceholder" />
      </asp:Panel>
    </div>
    <div class="wf-footer">
    </div>
  </form>
</body>
</html>
