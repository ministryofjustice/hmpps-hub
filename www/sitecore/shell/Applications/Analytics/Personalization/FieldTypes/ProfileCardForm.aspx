<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="ProfileCardForm.aspx.cs"
  Inherits="Sitecore.Shell.Applications.Analytics.Personalization.ProfileCardForm" %>

<%@ Register Assembly="Telerik.Web.UI" Namespace="Telerik.Web.UI" TagPrefix="telerik" %>
<%@ Register Assembly="Sitecore.Marketing.Client" Namespace="Sitecore.Shell.Applications.Analytics.Personalization"
  TagPrefix="sc" %>
<!DOCTYPE html>
<html>
<head runat="server">
	<meta http-equiv="X-Frame-Options" content="SAMEORIGIN">
  <title>Profile Card Values</title>
  <script type="text/javascript" src="/sitecore/shell/Controls/lib/prototype/prototype.js"></script>
  <script type="text/javascript">
    function SetModified() {
      if (window.parent == null) {
        return;
      }

      var parentForm = window.parent.scForm;
      if (parentForm == null) {
        return;
      }

      parentForm.setModified(true);
    }
  </script>
  <link rel="stylesheet" href="/sitecore/shell/themes/standard/default/Default.css"/>
  <style>
    .profileKeyName
    {
      width:180px;
      height: 30px;  
    }

    .RadarChart{
      width:250px;
      height:170px;
      margin:10px;
      padding:0;
    }

    .RadComboBox table td.rcbInputCell, .RadComboBox .rcbInputCell .rcbInput {
      min-height: 1px;
    }
  </style>
</head>
<body>
  <form id="ProfileCard" runat="server">
  <telerik:RadScriptManager runat="server" ID="ScriptManager" />
  <table width="100%">
    <tr>
      <td style="width: 320px;">
        <div runat="server" style="width: 100%; height: 190px; border: 0; overflow-y: auto; padding: 5px 5px 0 5px;" id="ProfileKeyContainer">
        </div>
      </td>
      <td align="left" valign="top" style="padding:0 10px 5px 10px; height:185px;">
        <div id="ChartContainer" runat="server" style="width: 280px; height: 100%;">
          <sc:RadarChart runat="server" ID="Chart" CssClass="RadarChart" />
        </div>
      </td>
    </tr>
  </table>
  </form>
</body>
</html>
