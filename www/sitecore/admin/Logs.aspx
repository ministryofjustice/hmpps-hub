<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Logs.aspx.cs" Inherits="Sitecore.ExperienceContentManagement.Administration.Logs" EnableViewState="false" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
  <title>Logs</title>
  <meta http-equiv="X-Frame-Options" content="SAMEORIGIN">
  <link rel="shortcut icon" href="/sitecore/images/favicon.ico" />
  <link rel="Stylesheet" type="text/css" href="/sitecore/shell/themes/standard/default/WebFramework.css" />

  <script type="text/javascript" src="/sitecore/shell/controls/lib/jQuery/jquery.js"></script>
  <script type="text/javascript" src="/sitecore/shell/controls/lib/jQuery/jquery.watermark.js"></script>
  <script type="text/javascript" src="/sitecore/shell/controls/webframework/webframework.js"></script>

  <style type="text/css">
        .wf-content {
          min-height: 100%;
        }

        input {
          width: 300px;
          display: block;
          margin-bottom: 4px;
        }

        .error {
          margin-top: 2em;
        }

      .error span {
        background: #C10100;
        color: white;
        padding: 2px 4px;
      }

    .logfile {
      padding: 0;
      margin: 0;
      display: block;
      position: absolute;
      width: 100%;
    }

    .logfileInner {
      padding: 20px;
      margin: 0;
      font-family: Courier New;
      text-decoration: none;
      text-align: left;
      background: white;
      display: block;
    }

    form {
      height: 100%;
    }
  </style>
</head>
<body style="min-height: 100%;">
  <form id="form1" runat="server">
    <asp:Panel runat="server" ID="ListTypes" Visible="False" CssClass="wf-container">
      <div class="wf-content">
        <h1><a href="/sitecore/admin/">Administration Tools</a> - Logs</h1>
        <p>Choose log file type to open:</p>
        <asp:BulletedList runat="server" ID="LogTypes" DisplayMode="HyperLink" />
      </div>
    </asp:Panel>

    <asp:Panel runat="server" Visible="False" ID="LogTypeInfo" CssClass="wf-container">
      <div class="wf-content">
        <h1><a href="/sitecore/admin/">Administration Tools</a> - <a href="/sitecore/admin/Logs.aspx">Logs</a></h1>
        <p>Selected log type: <asp:Literal runat="server" ID="LogTypeInfoTypeName" /></p>
        <p>Last modified log file: <asp:Literal runat="server" ID="CurrentLogFileName" /></p>
        <ul>
          <li><asp:HyperLink runat="server" Text="Show file" ID="CurrentLogFileView" /></li>
          <li><asp:HyperLink runat="server" Text="Show last 10KB of file" ID="CurrentLogFileTailView" /></li>
          <li><asp:HyperLink runat="server" Text="Download file" ID="CurrentLogFileDownload" /></li>
        </ul>
        <p>Other files are available to download:</p>
        <asp:BulletedList runat="server" ID="DownloadFilesPlaceHolder" DisplayMode="HyperLink" />
      </div>
    </asp:Panel>

    <asp:Panel runat="server" Visible="False" ID="LogFileViewer">
      <div class="logfile">
        <asp:Label runat="server" ID="LogFileText" CssClass="logfileInner" />
      </div>
      <script>(function () { window.scrollTo(0, document.body.scrollHeight); })();</script>
    </asp:Panel>
  </form>
</body>
</html>
