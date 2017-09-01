<%@ Control Language="C#" AutoEventWireup="true" CodeBehind="ChooseAppropriateUpdatePackage.ascx.cs" Inherits="Sitecore.Update.Wizard.ChooseAppropriateUpdatePackagePage" %>
<style type="text/css">
      #actionarea { margin-top: 3em; margin-bottom: 3em} 
      #actionarea table input {margin: 0px 3px 1px 5px;}
      #actionarea table label {vertical-align: bottom;}
      .selector-label{ display: block;margin-bottom: 5px;}
    </style>
<h1 runat="server" id="lblHeader"></h1>

<div class="wf-statebox wf-statebox-warning">
  <p style="margin: 0">
    This is an aggregated upgrade package. We were not able to automatically determine which upgrade package should be installed.
  </p>
  <p style="margin: 0">Please select the upgrade path that is appropriate for your solution.</p>
</div>
<div id="actionarea">
  <span class="selector-label">Select the Sitecore version that your solution is based on:</span>
  <asp:RadioButtonList ID="ActionsList" runat="server">
  </asp:RadioButtonList>
</div>

