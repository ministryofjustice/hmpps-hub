<%@ Control Language="C#" AutoEventWireup="true" CodeBehind="SelectPackageWizardPage.ascx.cs"
  Inherits="Sitecore.Update.Wizard.SelectPackageWizardPage" %>

<script type="text/javascript">

  var index = -1;
  var onUploadChanged = function() {
    if ($(".UploadFileElement").attr("value")) {
      if ($(".packageList").attr("selectedIndex") > -1) {
        index = $(".packageList").attr("selectedIndex");
      }

      $(".packageList").attr("selectedIndex", -1);
      $(".packageList").attr("disabled", "disabled");
    }
    else {
      $(".packageList").removeAttr("disabled");
      $(".packageList").attr("selectedIndex", index);
    }
  }
</script>

<p style="margin-bottom: 0; line-height: 18px">
  Upload a new package:</p>
<asp:FileUpload ID="Upload" Width="100%" class="UploadFileElement" onchange="javascript:onUploadChanged();"
  onkeyup="onUploadChanged();" runat="server" />
<div id="PackageListPanel" style="display: block;">
  <p style="margin-bottom: 0; line-height: 18px">
    Existing packages:</p>
  <asp:ListBox ID="PackageList" class="packageList" SelectionMode="Single" Height="210px"
    Width="100%" Style="border: solid 1px #ccc; padding: 4px 8px;" runat="server">
  </asp:ListBox>
  <div id="FFHook" runat="server" visible="false" style="padding-bottom: 0; margin-bottom:0; border:none; height:1em;">
    &nbsp;</div>
</div>

