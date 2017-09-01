<%@ Page Language="C#" AutoEventWireup="true" Codebehind="UpdateInstallationWizard.aspx.cs"
   Inherits="Sitecore.Update.UpdateInstallationWizard" MaintainScrollPositionOnPostback="true"
   EnableEventValidation="false" %>

<%@ Register Src="Wizard/PickTaskWizardPage.ascx" TagName="PickTaskWizardPage" TagPrefix="pages" %>
<%@ Register Src="Wizard/SelectPackageWizardPage.ascx" TagName="SelectPackageWizardPage"
   TagPrefix="pages" %>
<%@ Register Src="Wizard/WelcomeWizardPage.ascx" TagName="WelcomeWizardPage" TagPrefix="pages" %>
<%@ Register Src="Wizard/PreviewMetadataWizardPage.ascx" TagName="PreviewMetadataWizardPage"
   TagPrefix="pages" %>
<%@ Register Src="Wizard/FixInstallationErrorsPage.ascx" TagName="FixInstallationErrorsPage"
   TagPrefix="pages" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
   <title>Update Installation Wizard</title>
   <link href="/sitecore/shell/themes/standard/default/WebFramework.css" rel="Stylesheet" />
   <link href="/sitecore/admin/Wizard/UpdateInstallationWizard.css" rel="Stylesheet" />

   <script type="text/javascript" src="/sitecore/shell/Controls/lib/jQuery/jquery.js"></script>

   <script type="text/javascript" src="/sitecore/shell/controls/webframework/webframework.js"></script>

</head>
<body class="wf-layout-wide">
  <form id="form1" class="wf-container" runat="server">
      <div class="wf-content">
         <asp:Label ID="lblError" CssClass="Error" Visible="false" runat="server"></asp:Label>
         <h1 runat="server" id="lblHeader">
         </h1>
         <asp:PlaceHolder runat="server" ID="pnlContent" EnableViewState="true" />
      </div>
      <div class="wf-footer">
         <asp:Button ID="btnBack" CssClass="wf-backbutton" Text="<< Back" runat="server" OnClick="InstallationWizard_BackButtonClick" />
         <asp:Button ID="btnNext" Text="Next >>" runat="server" OnClick="InstallationWizard_NextButtonClick" TabIndex="0" />
      </div>
   </form>
</body>
</html>
