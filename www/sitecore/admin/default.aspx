<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="default.aspx.cs" Inherits="Sitecore.ExperienceContentManagement.Administration.Default" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title>Administration Tools</title>
    <link rel="Stylesheet" type="text/css" href="/sitecore/shell/themes/standard/default/WebFramework.css" />
    <link rel="Stylesheet" type="text/css" href="./default.css" />
    <style type="text/css">
        h3.pageReference {
            font-weight: normal;
            display: inline;
        }
        td {
            border-bottom: 1px solid #ddd;
            width: 50%;
        }
    </style>
</head>
<body>
    <div class="wf-container">
        <div class="wf-content" style="overflow: hidden;">
            <h1><a href="/sitecore/admin/">Administration Tools</a></h1>
            <br />
            <p>
                <b>Version:</b>
                <asp:Label runat="server" ID="Version" />
            </p>
            <i>This page may not list all of the administration tools that are available in the /sitecore/admin folder.</i>
            <br />
            <br />
            <div class="root">
                <table>
                    <asp:Repeater runat="server" ID="PagesRepeater">
                        <ItemTemplate>
                            <tr>
                                <td>
                                    <h3 class="pageReference"><a href="<%# DataBinder.Eval(Container.DataItem, "Link") %>"><%# DataBinder.Eval(Container.DataItem, "Name") %></a></h3>
                                </td>
                                <td><%# DataBinder.Eval(Container.DataItem, "Description") %></td>
                            </tr>
                        </ItemTemplate>
                    </asp:Repeater>
                </table>
            </div>
        </div>
    </div>
</body>
</html>

