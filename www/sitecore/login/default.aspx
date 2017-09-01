<%@ Page Language="C#" AutoEventWireup="true" Async="true" CodeBehind="Default.aspx.cs" Inherits="Sitecore.sitecore.login.Default" %>

<%@ Import Namespace="Sitecore.Configuration" %>
<%@ Import Namespace="Sitecore.SecurityModel.License" %>

<!DOCTYPE html>

<html>
<head runat="server">
    <title>Welcome to Sitecore</title>
    <link rel="shortcut icon" href="/sitecore/images/favicon.ico" />
    <meta name="robots" content="noindex, nofollow" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <link href="https://fonts.googleapis.com/css?family=Open+Sans:400,300italic,400italic,600italic,700italic,300,600,700,800" rel="stylesheet" type="text/css" />
    <script type="text/javascript">
        if (window != top) {
            var urlParams = encodeURIComponent(top.location.pathname + top.location.search + top.location.hash);
            if (urlParams) {
                top.location.href = '<%#GetLoginPageUrl()%>' + '?returnUrl=' + (top.location.pathname[0] == '/' ? '' : '/') + urlParams;
          }
      }
    </script>

    <!-- Bootstrap for testing -->
  <link href="Login.css" rel="stylesheet" />

    <style>
        .login-outer {
            background: url('<%#GetBackgroundImageUrl() %>') no-repeat center center fixed;
            background-size: cover;
        }
    </style>
</head>
<body class="sc">
    <div class="login-outer">
        <div class="login-main-wrap">
            <div class="login-box">
                <div class="logo-wrap">
          <img src="login/logo_new.png" alt="Sitecore logo" />
                </div>

                <form id="LoginForm" runat="server" class="form-signin" role="form">

                    <div id="login">

                        <div class="scLoginFailedMessagesContainer">
                            <div id="credentialsError" class="scMessageBar scWarning" style="display: none">
                                <i class="scMessageBarIcon"></i>
                                <div class="scMessageBarTextContainer">
                                    <div class="scMessageBarText">
                                        <asp:Literal Text="Please enter your login credentials." runat="server"></asp:Literal>
                                    </div>
                                </div>
                            </div>
                            <asp:PlaceHolder runat="server" ID="FailureHolder" Visible="False">
                                <div id="loginFailedMessage" class="scMessageBar scWarning">
                                    <i class="scMessageBarIcon"></i>
                                    <div class="scMessageBarTextContainer">
                                        <div class="scMessageBarText">
                                            <asp:Literal ID="FailureText" Text="Login failed" runat="server"></asp:Literal>
                                        </div>
                                    </div>
                                </div>
                            </asp:PlaceHolder>
                        </div>

                        <asp:PlaceHolder runat="server" ID="SuccessHolder" Visible="False">
                            <div class="sc-messageBar">
                                <div class="sc-messageBar-head alert alert-info">
                                    <i class="alert-ico"></i>
                                    <span class="sc-messageBar-messageText">
                                        <asp:Literal runat="server" ID="SuccessText" />
                                    </span>
                                </div>
                            </div>
                        </asp:PlaceHolder>

                        <div class="form-wrap">
                            <asp:Label runat="server" ID="loginLbl" CssClass="login-label">User name:</asp:Label>
                            <asp:TextBox ID="UserName" CssClass="form-control" placeholder="Enter user name" autofocus runat="server" ValidationGroup="Login" />
                            <asp:RequiredFieldValidator ID="UserNameRequired" runat="server" ControlToValidate="UserName" ValidationGroup="Login" />
                            <asp:Label runat="server" ID="passLabel" CssClass="login-label">Password:</asp:Label>
                            <asp:TextBox ID="Password" CssClass="form-control" placeholder="Enter password" runat="server" TextMode="Password" ValidationGroup="Login" />
                            <asp:RequiredFieldValidator ID="RequiredFieldValidator1" runat="server" ControlToValidate="Password" ValidationGroup="Login" />
                        </div>

                        <asp:Button runat="server" ValidationGroup="Login" UseSubmitBehavior="True" CssClass="btn btn-primary btn-block" OnClick="LoginClicked" Text="Log in" />

                        <div class="remember-me-wrap">

                            <% if (!Settings.Login.DisableLicenseInfo)
                               { %>
                            <asp:PlaceHolder ID="PlaceHolder3" runat="server" Visible="<%# !Settings.Login.DisableLicenseInfo%>">
                                <div class="license-info-link-wrap">
                                    <a href="javascript:;" id="licenseOptionsLink" class="login-link">License options</a>
                                </div>
                            </asp:PlaceHolder>
                            <% } %>
                            <asp:PlaceHolder ID="PlaceHolder2" runat="server" Visible="<%# !Settings.Login.DisableRememberMe%>">
                                <div class="remember-me-lnk">
                                    <label class="checkbox login-label">
                                        <asp:CheckBox runat="server" ID="RememberMe" />
                                        Remember me
                                    </label>
                                </div>
                            </asp:PlaceHolder>

                            <asp:PlaceHolder ID="PlaceHolder1" runat="server" Visible="<%# !Settings.Login.DisablePasswordRecovery%>">
                                <div class="forgot-pass-link-wrap">
                                    <asp:PlaceHolder ID="PlaceHolder4" runat="server" Visible="<%# !Settings.Login.DisableRememberMe%>">
                                        <span class="forgot-pass-separator"></span>
                                    </asp:PlaceHolder>
                                    <a href="#" class="show-recovery">Forgot your password?</a>
                                </div>
                            </asp:PlaceHolder>
                        </div>
                    </div>

                    <div id="passwordRecovery" style="display: none">
                        <h2 class="form-signin-heading">Forgot your password?</h2>
                        <asp:PlaceHolder runat="server" Visible="<%# string.IsNullOrEmpty(Settings.MailServer)%>">
                            <div class="sc-messageBar">
                                <div class="sc-messageBar-head alert">
                                    <i class="alert-ico"></i>
                                    <span class="sc-messageBar-messageText">
                                        <asp:Literal runat="server" Text="Mail server settings has not been configured. Password recovery is not possible."></asp:Literal>
                                    </span>
                                </div>
                            </div>
                        </asp:PlaceHolder>
                        <asp:PlaceHolder runat="server" Visible="<%# !string.IsNullOrEmpty(Settings.MailServer)%>">
                            <asp:TextBox disabled ID="UserNameForgot" ValidationGroup="Recovery" CssClass="form-control" placeholder="User name" required runat="server" />
                            <asp:Button runat="server" ValidationGroup="Recovery" UseSubmitBehavior="True" CssClass="btn btn-lg btn-primary btn-block" OnClick="ForgotPasswordClicked" Text="Send" />
                        </asp:PlaceHolder>
                        <div class="forgot-pass-wrap">
                            <a class="hide-recovery login-link" href="javascript:;">&lt; Back</a>
                        </div>
                    </div>
                    <div id="licenseOptions" style="display: none;">
                        <%--            <h2 class="form-signin-heading">License and browser information</h2>--%>
                        <% if (!Settings.Login.DisableLicenseInfo)
                           { %>
                        <div class="license-info-wrap">
                            <ul>
                                <li>System information</li>
                                <li>License holder <%# License.Licensee%></li>
                                <li>License ID <%# License.LicenseID%></li>
                                <li>Sitecore version <%# About.VersionInformation()%></li>
                            </ul>
                            <% } %>
                            <iframe id="StartPage" runat="server" allowtransparency="true" frameborder="0" scrolling="auto"
                                marginheight="0" marginwidth="0" style="display: none; height: 105px;"></iframe>
                        </div>
                        <% if (!Settings.Login.DisableLicenseInfo)
                           { %>
                        <div class="login-link-wrap">
                            <a href="javascript:;" id="licenseOptionsBack" class="login-link">&lt; Back</a>
                        </div>
                        <% } %>
                    </div>
                </form>
            </div>
        </div>
    </div>
    <script type="text/javascript" src="/sitecore/login/login.js"></script>
</body>
</html>
