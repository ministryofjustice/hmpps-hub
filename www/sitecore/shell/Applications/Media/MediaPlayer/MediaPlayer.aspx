<%@ Page Language="C#" AutoEventWireup="true" Inherits="System.Web.UI.Page" %>
<%@ Import namespace="Sitecore.Web"%>
<!DOCTYPE html>
<html>
<head runat="server">
  <title>Sitecore - Media Player</title>
  <style type="text/css">
  html {
    width:100%;
    height:100%;
  }
  body {
    width:100%;
    height:100%;
    margin:0px;
  }
  form {
    width:100%;
    height:100%;
  }
  </style>
</head>
<body>
    <form id="form1" runat="server">
      <object id="mediaPlayer" classid="CLSID:22d6f312-b0f6-11d0-94ab-0080c74c7e95" codebase="http://activex.microsoft.com/activex/controls/mplayer/en/nsmp2inf.cab#Version=5,1,52,701"
        standby="Loading Microsoft Windows Media Player components..." type="application/x-oleobject"
        width="100%" height="100%">
        <param name="fileName" value="<% =WebUtil.GetSafeQueryString("fi") %>" />
        <param name="animationatStart" value="true" />
        <param name="transparentatStart" value="true" />
        <param name="autoStart" value="true" />
        <param name="showControls" value="true" />
      </object>
    </form>
</body>
</html>

<script language="C#" runat="server">

protected void Page_Load(object sender, EventArgs args)
{
  if (!Sitecore.Context.User.IsAuthenticated)
  {
    WebUtil.RedirectToLoginPage();
  }
}

</script>