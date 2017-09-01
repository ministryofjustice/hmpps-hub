<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="UserInfo.aspx.cs" Inherits="Sitecore.ExperienceContentManagement.Administration.UserInfo" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title>User Information</title>
    <link rel="Stylesheet" type="text/css" href="/sitecore/shell/themes/standard/default/WebFramework.css" />
    <link rel="Stylesheet" type="text/css" href="./default.css" />
    <style type="text/css">
        div.chunk.fullwidth {
            width: 100%;
        }

        .chunk table {
            width: 100%;
        }

        .chunk table td {
            width: 50%;
        }

        .error {
            font-style: italic;
            color: red;
        }
        .form-label {
            width: 100px;
            display: inline-block;
        }
    </style>
</head>
<body>
    <form id="Form1" runat="server" class="wf-container">
        <div class="wf-content" style="overflow: hidden;">
            <h1><a href="/sitecore/admin/">Administration Tools</a> - User Information</h1>
            <br />
            <asp:Panel runat="server">
                <asp:Panel runat="server" ID="loginPanel">
                    <div class="chunk fullwidth">
                        <h3>Please key in admin credentials in order to view the contents of the page</h3>
                        <asp:PlaceHolder ID="ErrorMessage" runat="server" />
                        
                        <div class="login-form">
                            <span class="form-label">Username : </span><asp:TextBox ID="LoginTextBox" CssClass="wf-watermarked" ToolTip="Login" runat="server" Text="sitecore\admin" />  <br />
                            <span class="form-label">Password : </span><asp:TextBox ID="PasswordTextBox" CssClass="wf-watermarked" ToolTip="Password" TextMode="Password" runat="server" /> <br />
                            <span class="form-label"></span><asp:Button runat="server" Text="Login" OnClick="LoginClick" />
                        </div>
                    </div>
                </asp:Panel>
                <asp:Panel runat="server" ID="infoPanel" Visible="false">
                    <div class="chunk fullwidth">
                        <h3>Security</h3>
                        <hr />
                        <table>
                            <tr>
                                <td>User:</td>
                                <td>
                                    <asp:Label Style="font-weight: bold;" runat="server" ReadOnly="True" ID="UserName"></asp:Label>
                                </td>
                            </tr>
                            <tr>
                                <td>AccountType</td>
                                <td>
                                    <asp:Literal ID="ltAccountType" runat="server" EnableViewState="False" /></td>
                            </tr>
                            <tr>
                                <td>IsAuthenticated</td>
                                <td>
                                    <asp:Literal ID="ltIsAuthenticated" runat="server" EnableViewState="False" /></td>
                            </tr>
                            <tr>
                                <td>IsAdministrator</td>
                                <td>
                                    <asp:Literal ID="ltIsAdministrator" runat="server" EnableViewState="False" /></td>
                            </tr>
                            <tr>
                                <td>Roles</td>
                                <td>
                                    <asp:Literal runat="server" ID="ltRoles" EnableViewState="False" /></td>
                            </tr>
                        </table>
                        <hr />
                        <table>
                            <tr>
                                <td>Runtime: IsVirtual</td>
                                <td>
                                    <asp:Literal runat="server" ID="ltIsVirtual" EnableViewState="False" /></td>
                            </tr>
                            <tr>
                                <td>Runtime: IsAdministrator</td>
                                <td>
                                    <asp:Literal runat="server" ID="ltIsAdministratorRuntime" EnableViewState="False" /></td>
                            </tr>
                            <tr>
                                <td>Runtime: AddedRoles</td>
                                <td>
                                    <asp:Literal runat="server" ID="ltRolesRuntime" EnableViewState="False" /></td>
                            </tr>
                            <tr>
                                <td>Runtime: RemovedRoles</td>
                                <td>
                                    <asp:Literal ID="ltRemovedRolesRuntime" runat="Server" EnableViewState="False" /></td>
                            </tr>
                        </table>
                    </div>
                    <div class="chunk fullwidth">
                        <h3>Custom profile properties</h3>
                        <hr />
                        <asp:Literal runat="server" ID="ltProfile" EnableViewState="False" />
                    </div>
                </asp:Panel>
            </asp:Panel>
        </div>
    </form>
</body>
</html>
