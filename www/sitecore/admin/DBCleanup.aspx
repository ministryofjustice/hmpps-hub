<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="DbCleanup.aspx.cs" Inherits="Sitecore.ExperienceContentManagement.Administration.DbCleanup" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
    <head runat="server">
        <title>Database Cleanup</title>
        <link rel="Stylesheet" type="text/css" href="/sitecore/shell/themes/standard/default/WebFramework.css" />
        <link rel="Stylesheet" type="text/css" href="./default.css" />
    </head>
    <body>
        <form id="form1" runat="server" class="wf-container">
            <div class="wf-content">
                <h1>
                    <a href="/sitecore/admin/">Administration Tools</a> - Database Cleanup
                </h1>
                <br/>
                <div class="root">
                    <asp:ScriptManager runat="server"></asp:ScriptManager>
                    <table>
                        <tr>
                            <td class="top">
                                <div class="chunk">
                                    <h3>Databases</h3>
                                    <asp:CheckBoxList runat="server" ID="databaseList" />
                                </div>
                            </td>
                            <td class="top">
                                <div class="chunk">
                                    <h3>Tasks</h3>
                                    <asp:CheckBoxList runat="server" ID="taskList" />
                                </div>
                            </td>
                        </tr>
                    </table>
                    <asp:Button style="float: right" runat="server" ID="run" OnClick="RunOnClick" Text="Execute Cleanup" />
                    <div style="clear:both;"></div>
                    
                    <asp:UpdatePanel runat="server" ID="updatePanel" ChildrenAsTriggers="true">
                        <ContentTemplate>
                            <div>
                                <h3>Status</h3>
                                <asp:TextBox runat="server" ID="log" TextMode="MultiLine" Rows="40" Style="width:100%"></asp:TextBox>
                            </div>
                            <asp:Timer runat="server" Interval="1000" ID="logRefreshTimer"></asp:Timer>
                        </ContentTemplate>
                    </asp:UpdatePanel>
                </div>
            </div>
        </form>
    </body>
</html>
