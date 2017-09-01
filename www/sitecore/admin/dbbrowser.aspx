<%@ Page CodePage="65001" language="c#" Codebehind="dbbrowser.aspx.cs" AutoEventWireup="false" EnableViewState="false" Inherits="Sitecore.Admin.DBBrowser.DBBrowserPage" %>
<!DOCTYPE html>
<html>
  <head>
    <title>DB Browser</title>
    <link rel="shortcut icon" href="/sitecore/images/favicon.ico" />
    <link href="https://fonts.googleapis.com/css?family=Open+Sans:400,300italic,400italic,600italic,700italic,300,600,700,800" rel="stylesheet" type="text/css" />
    <link href="/sitecore/admin/dbbrowser.css" rel="stylesheet">
  </head>
  <body>
    <form id="Form1" method="post" runat="server" onsubmit="return confirm('Are you sure?');">
      <div class="scStretch">
        <div class="header">
          <div class="caption">
            DB Browser
          </div>
          <div id="dataBases" class="dataBases caption" runat="server" />
        </div>
        <div class="content">
          <div id="tree" class="tree" runat="server"></div><!--
       --><div id="contentEditor" class="contentEditor" runat="server"></div>
        </div>
      </div>
    </form>
  </body>
</html>
