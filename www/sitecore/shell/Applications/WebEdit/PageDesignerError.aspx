<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="PageDesignerError.aspx.cs" Inherits="Sitecore.Shell.Applications.WebEdit.PageDesignerError" %>
<%@ OutputCache Location="None" VaryByParam="none" %>
<%@ register TagPrefix="sc" Namespace="Sitecore.Web.UI.HtmlControls" Assembly="Sitecore.Kernel" %>
<!DOCTYPE html>
<html>
  <head>
    <title>Sitecore</title>
    <link href="/sitecore/login/default.css" rel="stylesheet" />
    <script type="text/javascript" language="javascript">
    
    function toggleMore() {
      var more = document.getElementById("ErrorMorePanel");
      more.style.display = more.style.display == "none" ? "" : "none";
    }
    
    </script>
  </head>
  <body>
    <div id="Body">
      <div id="ErrorTopPanel">
        <div class="ErrorTitle">
          <sc:ThemedImage ID="ThemedImage1" runat="server" Src="Applications/48x48/garbage_empty.png" Width="48" Height="48" Align="absmiddle" Margin="0px 8px 0px 0px"/>
          The Page Designer failed to render.
        </div>
      </div>
      
      <div id="ErrorPanel">
        Most likely causes:
        <ul>
          <li>A sublayout was inserted into itself, making are circular reference.</li>
        </ul>
        
        The change has been undone.
      
        <div class="ErrorOptions">What you can try:</div>
        
        <div>
          <a class="ErrorOption" href="javascript:history.go(-1)">
            <sc:ThemedImage ID="ThemedImage2" runat="server" Src="Applications/16x16/bullet_ball_blue.png" Width="16" Height="16" Align="middle" Margin="0px 4px 0px 4px" />
            Go back to the previous page
          </a>
        </div>
      </div>
    </div>
  </body>
</html>
