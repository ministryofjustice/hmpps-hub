<%@ Page Language="C#" AutoEventWireup="true" %>

<script runat="server">

// TODO: to enable the page, set enableUnlockButton = true;
private bool enableUnlockButton = false;

protected void Page_Load(object sender, EventArgs e)
{
    this.unlockButton.Enabled = this.enableUnlockButton;
}

protected void unlockButton_Click(object sender, EventArgs e)
{
    if (!this.enableUnlockButton)
    {
        return;
    }

    Membership.GetUser("sitecore\\admin").UnlockUser();
    this.resultMessageLiteral.Visible = true;
    this.unlockButton.Visible = false;
}

protected void descriptionLiteral_PreRender(object sender, EventArgs e)
{
    this.descriptionLiteral.Visible = !this.enableUnlockButton;
}

</script>

<!DOCTYPE html>

<html>

<head>
    <title>Unlock Administrator Page</title>
    <link rel="shortcut icon" href="/sitecore/images/favicon.ico" />
    <link href="https://fonts.googleapis.com/css?family=Open+Sans:400,300italic,400italic,600italic,700italic,300,600,700,800" rel="stylesheet" type="text/css" />
    <style type="text/css">

        body {
            font-family: 'Open Sans', Arial, sans-serif;
            font-size: 11pt;
        }

        button, input, optgroup, select, textarea {
            font-family: inherit;
        }

    .Warning
    {
        color: red;
    }

    </style>

</head>

<body>

<form runat="server" id="form">

<asp:Literal
    runat="server"
    ID="descriptionLiteral"
    EnableViewState="false"
    OnPreRender="descriptionLiteral_PreRender">
    <p>This page is currently disabled.</p>
    <p>To enable the page, modify the ASPX page and set enableUnlockButton = true.</p>
</asp:Literal>
<asp:Literal
    runat="server"
    ID="resultMessageLiteral"
    Visible="false">
    <p>The Administrator user has been successfully unlocked.</p>
    <p class="Warning">Do not forget to set enableUnlockButton = false in the ASPX page again.</p>
</asp:Literal>
<asp:Button
    runat="server"
    ID="unlockButton"
    Text="Unlock Administrator"
    OnClick="unlockButton_Click"/>

</form>

</body>

</html>