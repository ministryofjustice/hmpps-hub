<%@ OutputCache Location="None" VaryByParam="none" %>
<%@ Page Language="c#" CodeBehind="notfound.aspx.cs" EnableViewState="false" AutoEventWireup="True" Inherits="SitecoreClient.Page.NotFound" %>
<!DOCTYPE html>
<html>
<head>
  <title>Document Not Found</title>
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <link href="https://fonts.googleapis.com/css?family=Open+Sans:400,300italic,400italic,600italic,700italic,300,600,700,800" rel="stylesheet" type="text/css" />
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
            The requested document was not found
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
          <li id="PageEditor" runat="server">If you are using the Page Editor and just deleted an item, the current item no longer exists.
            You can go back until you reach a page that is displayable.
          </li>
          <li>The resource you are looking for (or one of its dependencies) has been removed, had its name changed, or is temporarily unavailable.
              Please review the following URL and make sure that it is spelled correctly.</li>
        </ul>

        <br />

        <h4>What you can try:
        </h4>

        <ul>
          <li>
            <a href="javascript:history.go(-1);">Go back to the previous page
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
          If the page you are trying to display exists, please check that an appropriate prefix has been added to the IgnoreUrlPrefixes setting in the web.config.
        </p>
      </div>
    </section>
  </div>
  <sc:VisitorIdentification runat='server'/> 
 </body>
</html>
