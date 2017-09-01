<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="SetSACEndpoint.aspx.cs" Inherits="Sitecore.sitecore.admin.SetSACEndpoint" %>

<!DOCTYPE html>

<html>
<head runat="server">
    <title>Application Center endpoint address</title>
    <link rel="shortcut icon" href="/sitecore/images/favicon.ico" />
</head>
<body>
    <form id="form1" runat="server">
    <h2>Change Application Center endpoint address</h2>
    <div>
    Endpoint URI: <br />
    <asp:TextBox runat="server" Width="300px" ID="endpoint" />&nbsp;<asp:Button runat="server" Text="Save" ID="saveButton" />
    <asp:RequiredFieldValidator runat="server" Display="Dynamic" ControlToValidate="endpoint" EnableClientScript="true" ErrorMessage="The uri cannot be empty" /> 
    <asp:RegularExpressionValidator runat="server" Display="Dynamic" ControlToValidate="endpoint" ErrorMessage="Wrong endpoint format" ValidationExpression="(http|ftp|https):\/\/[\w\-]+\.[\w\-]+.*" />
    </div>

    <asp:Label Visible="false" runat="server" ID="restart" >You need to restart the Sitecore server to apply the changes.</asp:Label>
    </form>
</body>
</html>
