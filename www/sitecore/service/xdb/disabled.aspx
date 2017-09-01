<%@ OutputCache Location="None" VaryByParam="none" %>
<%@ Register TagPrefix="sc" Namespace="Sitecore.Web.UI.WebControls" Assembly="Sitecore.Analytics" %>
<%@ Page Language="c#" CodeBehind="disabled.aspx.cs" EnableViewState="false" AutoEventWireup="True" Inherits="SitecoreClient.Page.Disabled, Sitecore.Xdb.Client" %>
<!DOCTYPE html>
<html>
<head>
  <title>xDB is disabled</title>
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <link href="/sitecore/shell/client/Speak/Assets/css/speak-default-theme.css" rel="stylesheet" />
  <style>
    .sc-text-label {
      white-space: nowrap;
      width: 1%;
    }
  </style>
</head>
<body class="sc">
    <form id="form1" runat="server">
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
            The requested document cannot be accessed as xDB is disabled
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
        <h3>Cause:
        </h3>

        <ul>
          <li>The resource you are looking for (or one of its 
            dependencies) is unavailable as xDB is disabled.
          </li>
          <li>The URL listed below cannot be accessed when this configuration is deployed.
          </li>
        </ul>

        <br />

        <h4>What you can do:
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
            <tr>
            <td class="sc-text sc-text-label">User Name:</td>
            <td class="sc-text sc-text-value">
              <asp:PlaceHolder ID="UserName" runat="server" />
            </td>
            </tr>
            <tr>
            <td class="sc-text sc-text-label">Site Name:</td>
            <td class="sc-text sc-text-value">
              <asp:PlaceHolder ID="SiteName" runat="server" />
            </td>
            </tr>
        </table>
        <p>
            If you wish to enable xDB please refer to xDB configuration guide found on the <a href="https://doc.sitecore.net/">doc.sitecore.net</a> website.
        </p>
      </div>
    </section>
  </div>

  <sc:VisitorIdentification runat="server" />
    </form>
</body>
</html>
