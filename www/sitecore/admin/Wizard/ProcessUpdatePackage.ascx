<%@ Control Language="C#" AutoEventWireup="true" Codebehind="ProcessUpdatePackage.ascx.cs"
   Inherits="Sitecore.Update.Wizard.ProcessUpdatePackage" %>

<script type="text/javascript">

var showInstallationLog = function()
{
   $("#progressDetailsPanel").slideDown("slow");
   $(".wf-more a img").attr('src', '/sitecore/shell/Themes/Standard/Images/Progress/more_expanded.png');
   $(".wf-more a span").text('Less information');
}

var hideInstallationLog = function()
{
   $("#progressDetailsPanel").slideUp();
   $(".wf-more a img").attr('src', '/sitecore/shell/Themes/Standard/Images/Progress/more_collapsed.png');
   $(".wf-more a span").text('More information');
}

var showHideInstallationLog = function(){
         if($("#progressDetailsPanel").is(":hidden"))
         {
            showInstallationLog();
         }
         else
         {
            hideInstallationLog();
         }
      }

$(document).ready(function(){
   $(".wf-more a").click(showHideInstallationLog)
  })
</script>

<input type="hidden" id="HistoryPath" runat="server" />
<input type="hidden" id="HasError" runat="server" />
<div class="wf-progress" style="padding: 2em 0">
   <div class="wf-progress-bar" id="progressBarContainer">
      <p id="updatingText">
         Processing ...</p>
      <div class="wf-progress-background">
         <div style="width: 353px;position:relative;">
            <div class="wf-progress-filler" id="progressBar">
            </div>
         </div>
      </div>
   </div>
   <p class="wf-more">
      <a>
         <img src="/sitecore/shell/Themes/Standard/Images/Progress/more_collapsed.png" alt="More Information"
            border="0" /><span style="padding-left: 3px;padding-bottom:5px;">More information</span></a></p>
   <div style="display: none;" id="progressDetailsPanel">
      <div style="border: solid 1px #ccc;">
         <iframe id="logArea" runat="server" scrolling="auto" src="" class="wf-progress-details">
         </iframe>
      </div>
      <div>
         <a id="downloadLogLink" style="padding-top: 5px;
            float: right;" runat="server" href="" target="_blank">Download as file</a>
      </div>
      <div style="margin:0;padding:0;clear:both;height:0px;">&nbsp</div>
   </div>
</div>
