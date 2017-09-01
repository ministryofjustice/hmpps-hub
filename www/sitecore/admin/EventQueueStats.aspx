<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="EventQueueStats.aspx.cs" Inherits="Sitecore.ExperienceContentManagement.Administration.EventQueueStats" %>

<%@ Assembly Name="Sitecore.Kernel" %>
<%@ Import Namespace="Sitecore.Configuration" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head id="Head1" runat="server">
    <title>EventQueue Statistics</title>
    <link rel="Stylesheet" type="text/css" href="/sitecore/shell/themes/standard/default/WebFramework.css" />
    <link rel="Stylesheet" type="text/css" href="./default.css" />
    <style type="text/css">
        td.value {
            text-align: right;
        }
    </style>
</head>
<body>
    <form id="Form1" runat="server" class="wf-container">
        <div class="wf-content" style="overflow: hidden;">
            <h1><a href="/sitecore/admin/">Administration Tools</a> - EventQueue Statistics</h1>
            <br />
            <h4>Instance Name: <%= Settings.InstanceName %></h4>
            <br />
            <asp:Literal runat="server" ID="lt"></asp:Literal>
            <div class="root">
                <asp:Repeater runat="server" ID="EQStatsRepeater">
                    <ItemTemplate>
                        <div class="chunk" style="float: left">
                            <h3><%# DataBinder.Eval(Container.DataItem, "DatabaseName") %></h3>
                            <hr />
                            <table width="100%">
                                <tr>
                                    <td>Events total:
                                    </td>
                                    <td class="value"><%# DataBinder.Eval(Container.DataItem, "NumberOfRecords") %></td>
                                </tr>
                                <tr>
                                    <td>Last processed timestamp:
                                    </td>
                                    <td class="value"><%# DataBinder.Eval(Container.DataItem, "LastProcessedTimestamp") %>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Last timestamp:
                                    </td>
                                    <td class="value"><%# DataBinder.Eval(Container.DataItem, "LastTimestamp") %></td>
                                </tr>
                                <tr>
                                    <td>Records to be processed:</td>
                                    <td class="value"><%# DataBinder.Eval(Container.DataItem, "RecordsToBeProcessed") %></td>
                            </table>
                        </div>
                    </ItemTemplate>
                </asp:Repeater>
                <div style="clear: both;"></div>
                <div class="chunk">
                    <h3>Cleanup EventQueue</h3>
                    <hr />
                    <table>
                        <tr>
                            <td colspan="2" class="result">
                                <asp:Label runat="server" CssClass="error" ID="CleanupResult" EnableViewState="false" />
                            </td>
                        </tr>
                        <tr>
                            <td>Database:</td>
                        </tr>
                        <tr>
                            <td>
                                <asp:DropDownList runat="server" ID="Databases" /></td>
                        </tr>
                        <tr>
                            <td></td>
                        </tr>
                        <tr>
                            <td>Interval to keep after cleanup:<br />
                                <i>in the format d.HH:mm:ss</i></td>
                        </tr>
                        <tr>
                            <td>
                                <asp:TextBox runat="server" ID="IntervalToKeep" Text="0.04:00:00" /><br />
                            </td>
                        </tr>
                        <tr>
                            <td></td>
                        </tr>
                        <tr>
                            <td>
                                <asp:Button runat="server" Text="Cleanup" OnClick="OnClick" /></td>
                        </tr>
                    </table>
                </div>
            </div>
        </div>
        <script type="text/javascript">
            function getQueryString() {
                var result = {}, queryString = location.search.substring(1), re = /([^&=]+)=([^&]*)/g, m;
                while (m = re.exec(queryString)) {
                    result[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
                }

                return result;
            }

            var str = getQueryString()["refresh"];
            if (str != undefined) {
                c = parseInt(str) * 1000;
                setTimeout("document.location.href = document.location.href;", c);
            }
        </script>
    </form>
</body>
</html>
