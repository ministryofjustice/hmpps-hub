<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="stats.aspx.cs" Inherits="Sitecore.sitecore.admin.stats" %>

<!DOCTYPE html>

<html>
<head runat="server">
    <title>Statistics</title>
    <link rel="shortcut icon" href="/sitecore/images/favicon.ico" />
</head>
<body>
  <form id="form1" runat="server">
    <h1>Statistics</h1>  
    <h2>Renderings</h2>
    <div style="margin-bottom:10px" runat="server" id="siteSelector">
    </div>
    <asp:PlaceHolder ID="renderings" runat="server" />
    <asp:Button id="c_reset" runat="server" OnClick="c_reset_Click" Text="Reset" />
  </form>
</body>
</html>
