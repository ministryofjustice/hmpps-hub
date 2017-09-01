<%@ Control Language="C#" AutoEventWireup="true" Codebehind="InstallationLog.ascx.cs"
   Inherits="Sitecore.Update.Wizard.InstallationLog" %>
<div id="progressContainer">
   <h2 id="updatingHeader">
      Updating...</h2>
   <div id="progressPanel">
      <div id="progressBar">
      </div>
   </div>
   <div id="updatingText">
      &nbsp;</div>
</div>
<input type="button" style="float: left;margin-bottom:5px;" id="btnHide" onclick="javascript:ShowHideLog()" value="Hide Details" />
<iframe id="logPanel" runat="server" scrolling="auto" src="">
</iframe>

<script type="text/javascript">
function ShowHideLog()
{
   var logFrame = window.document.getElementById('logPanel');
   if(!logFrame)
   {
      return;
   }
   
   var button = window.document.getElementById('btnHide');
   if(logFrame.style.display == "none")
   {
      logFrame.style.display = "block";
      if(button)
      {
         button.value = "Hide Details";
      }
   }
   else
   {
      logFrame.style.display = "none";
      if(button)
      {
         button.value = "Show Details";
      }
   }
}
</script>

