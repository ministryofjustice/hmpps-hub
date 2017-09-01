<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="PublishQueueStats.aspx.cs" Inherits="Sitecore.ExperienceContentManagement.Administration.PublishQueueStats" %>

<%@ Assembly Name="Sitecore.Kernel" %>
<%@ Import Namespace="Sitecore.Configuration" %>
<%@ Import Namespace="System.Data" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head id="Head1" runat="server">
    <title>PublishQueue Statistics</title>
    <link rel="Stylesheet" type="text/css" href="/sitecore/shell/themes/standard/default/WebFramework.css" />
    <link rel="Stylesheet" type="text/css" href="./default.css" />
    <style type="text/css">
        div.chunk.fullwidth {
            width: 100%;
        }

        td.value {
            text-align: left;
        }

        th {
            text-align: left;
        }

        .publishing-targets {
            width: 100%;
        }
        .publishing-targets-title {
            font-weight: bold;
            margin-top: 10px;
            text-decoration: underline;
        }

        .database-info {
            width: 100%;
        }
        
        .database-info .cell, .cleanup-table td {
            width: 50%;
        }
        .cleanup-input {
            width: 200px;
        }
    </style>
</head>
<body>
    <form id="Form1" runat="server" class="wf-container">
        <div class="wf-content" style="overflow: hidden;">
            <h1><a href="/sitecore/admin/">Administration Tools</a> - PublishQueue Statistics</h1>
            <br />
            <h4>Instance Name: <%= Settings.InstanceName %></h4>
            <br />
            <asp:Literal runat="server" ID="lt"></asp:Literal>
            <div class="root">
                <asp:Repeater runat="server" ID="PublishQueueStatsRepeater">
                    <ItemTemplate>
                        <div class="chunk fullwidth" style="float: left">
                            <h3><%# DataBinder.Eval(Container.DataItem, "DatabaseName") %></h3>
                            <hr />
                            <table class="database-info">
                                <tr>
                                    <td class="cell">Number of Items:
                                    </td>
                                    <td class="value cell"><%# DataBinder.Eval(Container.DataItem, "NumberOfRecords") %></td>
                                </tr>
                                <tr>
                                    <td colspan="2">
                                        <div class="publishing-targets-title">Publishing Targets</div>
                                        <table class="publishing-targets">
                                            <tr>
                                                <th>Database Name</th>
                                                <th>Language Name</th>
                                                <th>Last Publish Date</th>
                                                <th>Items to Process</th>
                                            </tr>
                                            <asp:Repeater ID="childRepeater" DataSource='<%#DataBinder.Eval(Container.DataItem, "PublishingTargetStats") %>' runat="server">

                                                <ItemTemplate>
                                                    <tr>

                                                        <td><%# DataBinder.Eval(Container.DataItem, "DatabaseName")%></td>
                                                        <td><%# DataBinder.Eval(Container.DataItem, "LanguageName")%></td>
                                                        <td><%# DataBinder.Eval(Container.DataItem, "LastPublishingDate")%></td>
                                                        <td><%# DataBinder.Eval(Container.DataItem, "RecordsToBeProcessed")%></td>

                                                    </tr>
                                                </ItemTemplate>

                                            </asp:Repeater>
                                        </table>
                                    </td>
                                </tr>

                            </table>
                        </div>
                    </ItemTemplate>
                </asp:Repeater>
                <div style="clear: both;"></div>
                <div class="chunk fullwidth">
                    <h3>Cleanup Publish Queue</h3>
                    <hr />
                    <table class="cleanup-table">
                        <tr>
                            <td colspan="2" class="result">
                                <asp:Label runat="server" CssClass="error" ID="CleanupResult" EnableViewState="false" />
                            </td>
                        </tr>
                        <tr>
                            <td>Database:</td>
                            <td>
                                <asp:DropDownList runat="server" ID="Databases" CssClass="cleanup-input" /></td>
                        </tr>
                        <tr>
                            <td>Interval to keep after cleanup: <i>in the format d.HH:mm:ss</i></td>
                            <td>
                                <asp:TextBox runat="server" ID="IntervalToKeep" Text="0.04:00:00" CssClass="cleanup-input" /><br />
                            </td>
                        </tr>
                        
                        <tr>
                            <td></td>
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
