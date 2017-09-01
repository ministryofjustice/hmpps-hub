<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="NonSecurePageDisabled.aspx.cs" Inherits="Sitecore.ExperienceContentManagement.Administration.NonSecurePageDisabled" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
    <head runat="server">
        <title>Non Secure Page Disabled</title>
        <link rel="Stylesheet" type="text/css" href="/sitecore/shell/themes/standard/default/WebFramework.css" />       
    </head>
    <body>
        <form id="Form1" runat="server" class="wf-container">
            <div class="wf-content">
                <h1>
                    <a href="/sitecore/admin/">Administration Tools</a> - Non Secure Page Disabled
                </h1>
                <br />
                Non secure pages are disabled. To enable it perform the following:
                <ul>
                    <li>Remove the file /sitecore/admin/disabled if it is present</li>
                    <li>Add the file /sitecore/admin/enabled if it is NOT present</li>
                </ul>
                <asp:Panel ID="RetryPanel" runat="server" Visible="False">
                    Please click <asp:LinkButton runat="server" ID="RetryLink" Text="here" /> to retry after you have performed the above listed steps
                </asp:Panel>
            </div>
        </form>
    </body>
</html>