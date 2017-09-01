<%@ Control Language="C#" AutoEventWireup="true" Codebehind="PreviewMetadataWizardPage.ascx.cs"
   Inherits="Sitecore.Update.Wizard.PreviewMetadataWizardPage" %>
<style type="text/css">
      .key { width: 80px; display: inline-block}
      
      .readme { height: 300px; overflow: auto; border: solid 1px #ccc; padding: 0px 8px;}
      
      #package-information { margin-top: 1em; }
    </style>
    
<div id="package-information">
   <div class="row">
      <span class="key">Name:</span> <span class="value" id="PackageName" runat="server">
      </span>
   </div>
   <div class="row">
      <span class="key">Location:</span> <span class="value" id="PackageLocation" runat="server">
      </span>
   </div>
   <div class="row">
      <span class="key">Version:</span> <span class="value" id="PackageVersion" runat="server">
      </span>
   </div>
   <div class="row">
      <span class="key">Author:</span> <span class="value" id="PackageAuthor" runat="server">
      </span>
   </div>
   <div class="row">
      <span class="key">Publisher:</span> <span class="value" id="PackagePublisher" runat="server">
      </span>
   </div>
   <p style="margin-bottom: 0; line-height: 18px">
      Readme:</p>
   <div class="readme" id="PackageReadme" runat="server">
   </div>
</div>
