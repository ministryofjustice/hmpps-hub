<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="restore.aspx.cs" Inherits="Sitecore.sitecore.admin.Restore" %>

<!DOCTYPE html>
<html>
<head runat="server">
    <title>Restore</title>
    <link rel="shortcut icon" href="/sitecore/images/favicon.ico" />
</head>
<body>
  <form id="form1" runat="server">
    <table>
      <tr>
        <td>
          Original database:
        </td>
        <td>
          <asp:TextBox ID="ctlDatabase" runat="server" Width="100" Text="master" />
        </td>
      </tr>
      <tr>
        <td>
          Archive name:
        </td>
        <td>
          <asp:TextBox ID="ctlArchive" runat="server" Width="100" Text="archive" />
        </td>
      </tr>
      <tr>
        <td>
          Path to archived item (in archive database):
        </td>
        <td>
          <asp:TextBox ID="ctlPath" runat="server" Width="500" />
        </td>
      </tr>
      <tr>
        <td>
        </td>
        <td>
                <asp:Button runat="server" ID="btnGo" Text="Restore" OnClick="ButtonGo_Click" />
        </td>
      </tr>
    </table>
  </form>
</body>
</html>