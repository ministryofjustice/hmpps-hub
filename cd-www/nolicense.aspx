<%@ OutputCache Location="None" VaryByParam="none" %>
<%@ Page Language="c#" CodeBehind="nolicense.aspx.cs" EnableViewState="false" AutoEventWireup="True" Inherits="SitecoreClient.Page.NoLicense" %>
<!DOCTYPE html>
<html>
<head>
  <title>License Missing</title>
  <meta http-equiv="X-UA-Compatible" content="IE=edge"> 
  <link href="<%="" + Sitecore.Configuration.Settings.DefaultFontUrl%>" rel="stylesheet" type="text/css" />
  <link href="/sitecore/shell/client/Speak/Assets/css/speak-default-theme.css" rel="stylesheet" />
  <style>
    .sc-text-label {
      white-space: nowrap;
      width: 1%;
    }
  </style>
</head>
<body class="sc">
  <div class="sc-task">
    <header class="sc-globalHeader">
      <div class="row sc-globalHeader-content">
        <div class="col-md-3">
          <div class="sc-globalHeader-startButton">
            <a class="sc-global-logo medium" title="Go to the start page" href="/"></a>
          </div>
        </div>
      </div>
    </header>

    <header class="sc-applicationHeader">
      <div class="sc-applicationHeader-row1">
        <div class="sc-applicationHeader-content">
          <div class="sc-applicationHeader-title">
            A required license is missing
          </div>
        </div>
      </div>
    </header>

    <section class="sc-dialogContent-toolbar">
      <div class="container">
        <div class="row sc-dialogContent-toolbar-back">
          <button class="btn sc-backbutton" type="button" onclick="javascript:history.go(-1);"><span class="sc-backbutton-text">Back</span></button>
        </div>
      </div>
    </section>

    <section class="sc-applicationContent">
      <div class="col-md-12 sc-applicationContent-main">
        <h3>Most likely causes:
        </h3>

        <ul>
          <li>The resource you are trying to access requires the following license:
            <asp:Label ID="RequiredLicense" runat="server">[license name]</asp:Label>.
          </li>
        </ul>

        <br />

        <h4>What you can try:
        </h4>

        <ul>
          <li>
            <a href="javascript:history.go(-1)">Go back to the previous page
            </a>
          </li>
          <li>
            <a href="/">Go to the start page
            </a>
          </li>
        </ul>

        <br />

        <h4>Additional Information:
        </h4>

        <table class="table">
          <tr>
            <td class="sc-text sc-text-label">Requested URL:</td>
            <td class="sc-text sc-text-value">
              <asp:PlaceHolder ID="RequestedUrl" runat="server" />
            </td>
          </tr>
        </table>
        <p>
          <asp:PlaceHolder ID="Information" runat="server" />
        </p>
      </div>
    </section>
  </div>
</body>
</html>
