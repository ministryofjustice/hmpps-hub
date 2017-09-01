<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="RemoveBrokenLinks.aspx.cs" Inherits="Sitecore.sitecore.admin.RemoveBrokenLinks" %>

<!DOCTYPE html>

<html>
<head runat="server">
  <title>Remove Broken Links</title>
  <link rel="shortcut icon" href="/sitecore/images/favicon.ico" />
  <link href="https://fonts.googleapis.com/css?family=Open+Sans:400,300italic,400italic,600italic,700italic,300,600,700,800" rel="stylesheet" type="text/css" />
  <link rel="Stylesheet" type="text/css" href="/sitecore/shell/themes/standard/default/WebFramework.css" />
  <script type="text/javascript" src="/sitecore/shell/controls/lib/jQuery/jquery.js"></script>
  <script type="text/javascript" src="/sitecore/shell/controls/lib/jQuery/jquery.watermark.js"></script>
  <script type="text/javascript" src="/sitecore/shell/controls/webframework/webframework.js"></script>
</head>
<body>
  
  <form id="form1" runat="server" class="wf-container">
    <div class="wf-content">
      <h1>Remove Broken Links</h1>
      <p class="wf-subtitle">Removes the broken links to missing items.</p>
      <div class="wf-configsection">
        <h2>Select databases</h2>
        <asp:CheckBoxList ID="Databases" runat="server"></asp:CheckBoxList>
      </div>
      <div class="wf-configsection">
        <h2>Serialization</h2>
        <asp:CheckBox runat="server" ID="ShouldSerializeItem" Text="Serialize the altered items" />
      </div>
      <div class="wf-configsection">
        <h2>Fix</h2>
        <asp:Button ID="FixButton" runat="server" Text="Remove" OnClick="FixBrokenLinksOnClick" />
      </div>

      <asp:Panel ID="Results" runat="server" Visible="False">
        <div class="wf-configsection">
          <h2>Links</h2>
        </div>
      </asp:Panel>
    </div>
  </form>
</body>
</html>
