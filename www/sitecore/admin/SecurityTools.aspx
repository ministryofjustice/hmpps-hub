<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="SecurityTools.aspx.cs" Inherits="Sitecore.ExperienceContentManagement.Administration.SecurityTools" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
    <head id="Head1" runat="server">
        <title>Security Tools</title>
        <link rel="Stylesheet" type="text/css" href="/sitecore/shell/themes/standard/default/WebFramework.css" />
        <link rel="Stylesheet" type="text/css" href="./default.css" />
        <style type="text/css">
            table.information {
                border-spacing: 2px;
                border-collapse: separate;
            }

            table.information td{
                padding: 0;
            }

            table.information.custom-controls tr:last-of-type td:last-of-type {
                text-align: right;
            }

            .information td.button {
                text-align: right;
            }

            .information input[type="submit"] {
                min-width: 80px;
            }

            .information input[type="text"], .information input[type="password"] {
                width: 200px;
            }

            .information tr td:first-of-type label {
                text-align: right;
                display: inline-block;
                min-width: 80px;
            }

            .automargin {
                margin-left: auto;
                margin-right: auto;
            }
            
            /* styles to align aspnet login controls */
            .aspnet-login input[type="checkbox"] {
                margin-left: 85px;
            }

            .aspnet-login input[type="submit"] {
                margin-right: 5px;
            }
        </style>
    </head>
    <body>
        <form id="Form1" runat="server" class="wf-container">
            <div class="wf-content" style="overflow: hidden;">
                <h1><a href="/sitecore/admin/">Administration Tools</a> - Security Tools</h1>
                <br />
                <br />
                <div class="root">
                    <table>
                        <tr>
                            <td class="top">
                                <div class="chunk">
                                    <h3>Log In User</h3>
                                    <hr />
                                    <table class="information automargin custom-controls">
                                        <tr>
                                            <td colspan="2" class="result">
                                                <asp:Label runat="server" ID="ResultLoginWithoutValidation" EnableViewState="false" />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td><asp:Label id="LabelUserAccount" AssociatedControlId="UserAccount" Text="Log in as:" runat="server" /></td>
                                            <td>
                                                <asp:Textbox runat="server" ID="UserAccount" Text="sitecore\" />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>&nbsp;</td>
                                            <td><asp:Button ID="ButtonLoginWithoutValidation" runat="server" Text="Log In" OnClick="LoginWithoutValidation" /></td>
                                        </tr>
                                    </table>
                                </div>
                                <div class="chunk">
                                    <h3>ASP.NET Login Form</h3>
                                    <hr />
                                    <asp:Login TitleText="" ID="LoginAspNet" runat="server" CssClass="information automargin aspnet-login" />
                                </div>
                            </td>
                            <td class="top">
                                <div class="chunk">
                                    <h3>Reset User Password</h3>
                                    <hr />
                                    <table class="information automargin custom-controls">
                                        <tr>
                                            <td colspan="2" class="result">
                                                <asp:Label runat="server" ID="ResultResetPassword" EnableViewState="false" />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td><asp:Label id="LabelResetUserName" AssociatedControlId="ResetUserName" Text="User Name:" runat="server" /></td>
                                            <td>
                                                <asp:TextBox ID="ResetUserName" runat="server" Text="sitecore\" /></td>
                                        </tr>
                                        <tr>
                                            <td><asp:Label id="LabelResetUserPassword" AssociatedControlId="ResetUserPassword" Text="New Password:" runat="server" /></td>
                                            <td>
                                                <asp:TextBox ID="ResetUserPassword" runat="server" Text="b" /></td>
                                        </tr>
                                        <tr>
                                            <td>&nbsp;</td>
                                            <td><asp:Button ID="ButtonResetPassword" Text="Reset" OnClick="ResetUserPasswordClick" runat="server" /></td>
                                        </tr>
                                    </table>
                                </div>
                                <div class="chunk">
                                    <h3>Create New User</h3>
                                    <hr />
                                    <table class="information automargin custom-controls">
                                        <tr>
                                            <td colspan="2" class="result">
                                                <asp:Label runat="server" ID="ResultCreateUser" EnableViewState="false" />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td><asp:Label id="LabelCreateUserName" AssociatedControlId="CreateUserName" Text="User Name: " runat="server" /></td>
                                            <td>
                                                <asp:TextBox ID="CreateUserName" runat="server" Text="sitecore\" /></td>
                                        </tr>
                                        <tr>
                                            <td><asp:Label id="LabelCreateUserPassword" AssociatedControlId="CreateUserPassword" Text="Password: " runat="server" /></td>
                                            <td>
                                                <asp:TextBox ID="CreateUserPassword" runat="server" Text="b" /></td>
                                        </tr>
                                        <tr>
                                            <td><asp:Label id="LabelCreateUserRoles" AssociatedControlId="CreateUserRoles" Text="Roles: " runat="server" /></td>
                                            <td>
                                                <asp:TextBox ID="CreateUserRoles" runat="server" Text="sitecore\Author,sitecore\Designer" /></td>
                                        </tr>
                                        <tr>
                                            <td>&nbsp;</td>
                                            <td>
                                                <asp:CheckBox ID="IsAdminCreate" runat="server" Text="Is Administrator" /></td>
                                        </tr>
                                        <tr>
                                            <td>&nbsp;</td>
                                            <td>
                                                <asp:Button ID="ButtonCreateUser" Text="Create" OnClick="CreateUserClick" runat="server" /></td>
                                        </tr>
                                    </table>
                                    <br />
                                </div>
                            </td>
                        </tr>
                    </table>
                </div>
            </div>
        </form>
    </body>
</html>