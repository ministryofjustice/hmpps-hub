<%@ Page Language="C#" %>
<%@ Register Assembly="Sitecore.Kernel" Namespace="Sitecore.Web.UI.HtmlControls" TagPrefix="sc" %>
<%@ Register Assembly="Sitecore.Kernel" Namespace="Sitecore.Web.UI.WebControls" TagPrefix="sc" %>
<!DOCTYPE html>
<html>
<head runat="server">
  <title>Sitecore</title>
  <link href="https://fonts.googleapis.com/css?family=Open+Sans:400,300italic,400italic,600italic,700italic,300,600,700,800" rel="stylesheet" type="text/css" />
  <style type="text/css">
    body { background:#fff; font-family:'Open Sans', Arial, sans-serif; font-size:12px;}
    #Progress { margin:75px 0px 16px 0px; }
  </style>
  
</head>
<body>
  <form id="form1" runat="server">
    <table id="Grid" border="0" cellpadding="4" cellspacing="0" width="100%">
      <tr>
        <td align="center">
          <div id="Progress">
            <sc:ThemedImage runat="server" Src="Images/sc-spinner32.gif" />
          </div>
          <div>
            <sc:Literal runat="server" Text="Uploading..."/>
          </div>
        </td>
      </tr>
    </table>
  </form>
</body>
</html>
