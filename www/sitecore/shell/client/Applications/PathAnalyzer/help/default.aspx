<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="default.aspx.cs" Inherits="Sitecore.PathAnalyzer.Client.Sitecore.Shell.Client.Applications.PathAnalyzer.help._default" %>
<%@ Register TagPrefix="sc" Namespace="Sitecore.Web.UI.WebControls" Assembly="Sitecore.Kernel" %>
<!DOCTYPE html>
<html lang=en>
<head>
  <meta charset=utf-8>
  <meta http-equiv=X-UA-Compatible content="IE=edge">
  <meta name=viewport content="width=device-width,initial-scale=1">
  <meta name=description content="">
  <meta name=author content="">
  <title>Path Analyzer Help</title>
  <link href="https://fonts.googleapis.com/css?family=Open+Sans:400,300,300italic,400italic,600,600italic,700,700italic,800,800italic" rel="stylesheet" type="text/css">
  <link href="css/bootstrap.css" rel="stylesheet">
  <link href="css/help.css" rel="stylesheet">
</head>

<body>
  <form id="form1" runat="server">
        <a href="#" id="help-toggle" class="menuButton">
          <span class="glyphicon glyphicon-menu-hamburger" aria-hidden="true"></span>
        </a>


  <div class="container-fluid bs-docs-container">
    <div class=row-fluid>
      <div class="col-md-3 col-xs-3" style="display:none;" role="complementary" id="help-sidebar">
        <nav class="bs-docs-sidebar hidden-print affix">
          <ul class="nav bs-docs-sidenav"></ul>
        </nav>
      </div>
      <div class="col-md-9 col-xs-9" role="main" id="help-content">
        <div class=bs-docs-section>
          <div class="span12">
            <asp:Label runat="server" ID="contentLabel" />
          </div>
          <footer class="text-center small">
            <hr>
            <p>
              <asp:Label runat="server" ID="disclaimerLabel" />
              ver. <asp:Label runat="server" ID="versionLabel" />
            </p>
          </footer>
        </div>
      </div>
    </div>
    <script src=js/jquery.js></script>
    <script src=js/bootstrap.min.js></script>
    <script src=js/help.js></script>
</form>
</body>
</html>
