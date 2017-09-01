<%@ Control Language="C#" AutoEventWireup="true" Codebehind="FixInstallationErrorsPage.ascx.cs"
   Inherits="Sitecore.Update.Wizard.FixInstallationErrorsPage" %>
<div class="wf-statebox wf-statebox-error">
   <p style="margin: 0">
      The ASP.NET process does not have sufficient permissions to overwrite the files.
      The installation wizard has created a batch that you must run to complete the installation.</p>
   <p style="margin: 1em 0 0 0">
      Please run the bat file at:<br />
      <span id="BatchFileLocation" runat="server"></span>
   </p>
</div>
<p style="padding: 2em 0 0 0">
   Click the button below to complete the installation after running the file.
</p>
