<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="MarketingAutomationPreviewer.aspx.cs" 
Inherits="Sitecore.Shell.MarketingAutomation.Web.Previewer.MarketingAutomationPreviewer" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title>Marketing Automation Previewer</title>
    <link id="Link1" rel="stylesheet" href="/sitecore/shell/Applications/MarketingAutomation/Styles/Style.css" type="text/css" runat="server" />
    <script type="text/javascript" src="/sitecore/shell/Applications/MarketingAutomation/Scripts/Silverlight.js"></script>
    <script type="text/javascript" src="/sitecore/shell/Applications/MarketingAutomation/Scripts/MarketingAutomation.js"></script>		
    <script type="text/javascript">
      // Open a new Window with the Flodesigner Application in Design mode
    function OpenEditor() {
      window.scForm.postEvent("", "", "OpenEditor");
    }

    function OpenMonitor() {         
      window.scForm.postEvent("", "", "OpenMonitor");
    }

    function OpenSupervisor() {
      window.scForm.postEvent("", "", "OpenSupervisor");
    }  
    </script>
    <script type="text/javascript" src="/sitecore/shell/Applications/Dialogs/SilverlightNotification/silverlightNotification.js"></script>  
  </head>
<body>
<form id="form1" runat="server" style="height:100%;">
  <div id="silverlightControlHost" style="height:100%; text-align:center;">
    <object data="data:application/x-silverlight-2," type="application/x-silverlight-2" width="100%" height="100%" id="scSilverlightEngagementPlan">
      <param name="source" value="/sitecore/shell/ClientBin/Sitecore.Shell.MarketingAutomation.Previewer.xap"/>
      <param name="onError" value="onSilverlightError" />
      <param name="background" value="white" />
      <asp:placeholder runat="server" id="Parameters" />
      <param name="minRuntimeVersion" value="5.0.61118.0" />
      <param name="autoUpgrade" value="true" />
      <param name="Windowless" value ="true" />
      <div style="width: 100%; height: 100%;">
      <table cellpadding="0" cellspacing="0" border="0" align="center">
        <tr>
          <td>
            <h2>
              Marketing Automation Previewer</h2>
          </td>
        </tr>
        <tr>
          <td align="left">
            <p>
              Marketing Automation Previewer requires Microsoft Silverlight 5 to run.<br />
              Silverlight is a small, safe, cross-platform browser plugin created and supported
              by Microsoft.</p>
            <br />
            <div align="center">
              <a href="http://go.microsoft.com/fwlink/?LinkID=149156&v=5.0.61118.0" style="text-decoration: none">
                <img src="/sitecore/shell/ClientBin/SilverlightMedaglion.png" alt="Get Microsoft Silverlight"
                  style="border-style: none" /></a>
            </div>
          </td>
        </tr>
      </table>
    </div></object><iframe id="_sl_historyFrame" style="visibility:hidden;height:0px;width:0px;border:0px"></iframe></div>
</form>      
</body>
</html>
