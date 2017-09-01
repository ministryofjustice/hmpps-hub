<%@ Control Language="C#" AutoEventWireup="true" CodeBehind="PickTaskWizardPage.ascx.cs"
   Inherits="Sitecore.Update.Wizard.PickTaskWizardPage" %>
<style type="text/css">
     #actions { margin-top: 1em; }

   .expandable {
      margin-top: 1em;
      margin-bottom: 1em;
      display: block;
   }

      .expandable .expandable-content {
         display: none;
         padding-top: 1em;
      }
</style>
<p>
   You are about to install <em runat="server" id="PackageName"></em>.</p>
<div class="wf-statebox wf-statebox-success" id="installationModeStateBox">
   <p id="installationModeValidationText" style="margin: 0">
     If you do not select an advanced installation option, all the pre-selected files and items will be installed and the post-installation steps will be executed.
     Furthermore, the Event Queue and the History table are cleaned up before the package is installed.
   </p>
</div>
<div class="wf-statebox wf-statebox-warning">
   <p style="margin: 0">
      Overwritten or deleted files are saved in a backup folder.</p>
</div>
<div id="actions" class="wf-actionbuttons">
   <asp:LinkButton ID="AnalyzeInstall" CssClass="wf-actionbutton" runat="server" OnClick="AnalyzeBtn_Click">
      <img alt="Install" src="/~/icon/Applications/32x32/media_play_green.png.aspx" />
      <span  class="wf-title">
         Analyze</span >
      <span  class="wf-subtitle">
         Analyze the package to identify any potential conflicts.</span >
   </asp:LinkButton>
   <div class="expandable">
      <div class="expandable-header">
         <a href="#">Advanced options</a>
      </div>
      <div class="expandable-content">
         <div>
            <input type="checkbox" id="InstallFilesCheckBox" runat="server" checked class="expandable-content-checkbox" />
            <label for="InstallFilesCheckBox" class="expandable-content-label">Install files</label>
         </div>
         <div>
            <input type="checkbox" id="InstallItemsCheckBox" runat="server" checked class="expandable-content-checkbox" />
            <label for="InstallItemsCheckBox" class="expandable-content-label">Install items</label>
         </div>
         <div>
            <input type="checkbox" id="ExecutePostStepCheckBox" runat="server" checked class="expandable-content-checkbox" />
            <label for="ExecutePostStepCheckBox" class="expandable-content-label">Execute post-steps</label>
         </div>
         <div>
            <input type="checkbox" id="CleanupHistoryCbx" runat="server" checked class="expandable-content-checkbox" />
            <label for="CleanupHistoryCbx" class="expandable-content-label">Clean up History table before installation</label>
         </div>
         <div>
            <input type="checkbox" id="CleanupEventQueueCbx" runat="server" checked class="expandable-content-checkbox" />
            <label for="CleanupEventQueueCbx" class="expandable-content-label">Clean up Event Queue before installation</label>
         </div>
      </div>
   </div>
</div>
<script type="text/javascript">
   $('.expandable .expandable-header').click(function () {
      $('.expandable .expandable-content').slideToggle('slow');
   });

   $('.expandable .expandable-content .expandable-content-checkbox').each(function (a, b) {
      $(b).change(function () {
         validateUserSelection();
      });
   });

   function validateUserSelection() {
     var executePoststeps = $('#<%= ExecutePostStepCheckBox.ClientID %>').is(':checked');
     var installFiles = $('#<%= InstallFilesCheckBox.ClientID %>').is(':checked');
     var installItems = $('#<%= InstallItemsCheckBox.ClientID %>').is(':checked');
     var cleanHistory = $('#<%= CleanupHistoryCbx.ClientID %>').is(':checked');
     var cleanEventQueue = $('#<%= CleanupEventQueueCbx.ClientID %>').is(':checked');

     var validationResult;
     if (executePoststeps || installFiles || installItems) {
       if (executePoststeps && installFiles && installItems) {
         validationResult = 'success';
       } else {
         validationResult = 'warning';
       }
     } else {
       validationResult = 'error';
     }

     var validationText;
     if (validationResult === 'error') {
       validationText = 'You have not selected an installation option.';
     } else {
       validationText = $('<div><div>The following actions will be performed.</div></div>');
       var list = $('<ul/>');
       list.append($('<li>Items will' + (installItems ? '' : ' <u>not</u>') + ' be installed.</li>'));
       list.append($('<li>Files will' + (installFiles ? '' : ' <u>not</u>') + ' be installed.</li>'));
       list.append($('<li>Post-installation steps will' + (executePoststeps ? '' : ' <u>not</u>') + ' be executed.</li>'));
       list.append($('<li>History table will' + (cleanHistory ? '' : ' <u>not</u>') + ' be cleaned up before installation.</li>'));
       list.append($('<li>Event Queue will' + (cleanEventQueue ? '' : ' <u>not</u>') + ' be cleaned up before installation.</li>'));
       validationText.append(list);
     }

     showValidationResult(validationResult, validationText);
   }

   function showValidationResult(validationResult, validationText) {

     var newClass = 'wf-statebox wf-statebox-' + validationResult;

     $('#installationModeStateBox').removeClass();
     $('#installationModeStateBox').addClass(newClass);
     $('#installationModeValidationText').html(validationText);

     disableButtons(validationResult === 'error');
   }

  function disableButtons(disable) {
    var links = $('#<%= AnalyzeInstall.ClientID %>');

    if (disable) {
      links.css('pointer-events', 'none');
      links.css('color', 'Gray');
    } else {
      links.css('pointer-events', '');
      links.css('color', '');
    }
  }
</script>
