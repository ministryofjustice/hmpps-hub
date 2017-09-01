<%@ Page Language="c#" CodeBehind="pipelines.aspx.cs" AutoEventWireup="false" EnableEventValidation="false" Inherits="Sitecore.sitecore.admin.Pipelines" %>

<!DOCTYPE html>
<html>
<head>
    <title>Pipelines profiling</title>
    <link rel="shortcut icon" href="/sitecore/images/favicon.ico" />
    <link rel="Stylesheet" type="text/css" href="/sitecore/shell/themes/standard/default/WebFramework.css" />
    <style type="text/css">
        .wf-container
        {
            min-width: 950px;
            display: inline-block;
            width: auto;
        }

        .wf-content
        {
            padding: 2em 2em;
        }

        #wf-dropshadow-right
        {
            display: none;
        }
        
        table.main
        {
            border: 1px solid #ccc;
            border-collapse: collapse;
            padding: 1em 1em;
        }
        
        table.main td
        {
            font-size: 10pt;
            border: 1px solid #ccc;
            padding: 5px;
        }

        table.main th
        {
            font-size: 10pt;
            text-align: center;
            border: 1px solid #ccc;
            font-weight: normal;
            padding: 5px;
        }

        .wf-configsection table th {
            background-color: #ccc;
        }
        
        td.datacell {
            text-align: right;
            white-space: nowrap;
        }

        table.main th.dataheader {
            text-align: center;
        }

        tr.groupheader {
            background-color: #bbb;
        }

        .top1 {
            background-image: url(/sitecore/shell/themes/Standard/Images/PipelineProfiling/font_char49_red_16.png);
            background-repeat: no-repeat;
            background-position: 5px 5px;
        }
        .top2 {
            background-image: url(/sitecore/shell/themes/Standard/Images/PipelineProfiling/font_char50_orange_16.png);
            background-repeat: no-repeat;
            background-position: 5px 5px;
        }
        .top3 {
            background-image: url(/sitecore/shell/themes/Standard/Images/PipelineProfiling/font_char51_yellow_16.png);
            background-repeat: no-repeat;
            background-position: 5px 5px;
        }

        table.main td.processor {
            padding-left: 30px;
        }

        .processorSummaryTable
        {
            font-size:  10pt;
            border: 0;
            padding: 5px 5px;
        }
        .processorSummaryTable th
        {
            border: 0;
        }
        .processorSummaryTable td
        {
            border: 0;
            padding: 0px 5px;
        }
    </style>
    <script type="text/javascript" src="/sitecore/shell/controls/lib/jQuery/jquery.js"></script>
    <script type="text/javascript" src="/sitecore/shell/controls/lib/jQuery/PipelinesProfiling/jquery.qtip.custom.pipelines.js"></script>
    <script type="text/javascript" src="/sitecore/shell/controls/lib/jQuery/jquery.watermark.js"></script>
    <script type="text/javascript" src="/sitecore/shell/controls/webframework/webframework.js"></script>
    <script type="text/javascript">
        var PP_Filter = {};
        PP_Filter.Instrument = function ()
        {
            this.searchDefaultText = "Filter by pipeline name";
            this.startSearchingLength = 3;
            this.selector = $("table.main td[pln-name]");
            this.searchBoxWrapper = "#ppFilter";
            this.searchBoxId = "ppFilterTextBox";
            this.activeCssClass = "active";
            this.highlightCssClass = "highlight";

            this.Cleanup = function ()
            {
                $(this.selector).each(function ()
                {
                    $(this).parent().css("display", "");
                });
            };

            this.init = function ()
            {
                var instance = this;

                $(this.searchBoxWrapper).html('<input type="text" id="' + this.searchBoxId + '"/>');
                var searchBox = "#" + this.searchBoxId;

                $(searchBox).attr("value", this.searchDefaultText)
                    .focus(function ()
                    {
                        if (this.value == instance.searchDefaultText)
                        {
                            this.value = "";
                            $(this).addClass(instance.activeCssClass);
                        }
                    }).
                    blur(function ()
                    {
                        if (this.value == "")
                        {
                            $(this).removeClass(instance.activeCssClass);
                            this.value = instance.searchDefaultText;
                        }
                    }).
                    keypress(function (e)
                    {
                        if (e.keyCode == 13)
                        {
                            e.preventDefault();
                        }
                        return;
                    }).
                    keyup(function (e)
                    {
                        if (e.keyCode == 27)
                        {
                            $(searchBox).val('');
                            instance.Cleanup();
                            return;
                        }
                        if (this.value.length < instance.startSearchingLength) {
                            instance.Cleanup();
                        }
                        else {
                            var searchText = escape(this.value);
                            var regx = new RegExp("(" + searchText + ")", 'i');

                            $(instance.selector).each(function ()
                            {
                                if (regx.test($(this).attr('pln-name'))) {
                                    $(this).parent().css("display", "");
                                } else {
                                    $(this).parent().css("display", "none");
                                }
                            });
                        }
                    });
            };
        };
    </script>
    <style>
        #ppFilterTextBox
        {
            font-style: italic;
            color: #999;
            width: 150px;
        }
        
        #ppFilterTextBox.active
        {
            font-style: normal;
            color: #000;
        }        
        .highlight
        {
            background-color: #ff0;
        }
    </style>
</head>
<body>
    <form id="Form1" method="post" runat="server" class="wf-container">
    <div class="wf-content">        
        <h1>
            Pipeline Profiler</h1>
        <p class="wf-subtitle">
            A snapshot from the pipeline profiler.</p>
        <asp:PlaceHolder runat="server" Visible="False" ID="profilerDisabledMessage">
            <h2>Pipeline profiling is disabled. No data is currently available.</h2>
            <p> 
                To enable pipeline profiling, rename the &#47;App_Config&#47;Include&#47;Sitecore.PipelineProfiling.config.disabled file to Sitecore.PipelineProfiling.config 
                and set the value of the &quot;Pipelines.Profiling.Enabled&quot; setting to &quot;true&quot; if it is set to &quot;false&quot;. 
            </p>
            <p> 
                To measure CPU usage during pipeline profiling, set the value of the &quot;Pipelines.Profiling.MeasureCpuTime&quot; setting to &quot;true&quot;.  
                Measuring CPU usage adds a performance overhead to the  pipeline but provides additional information about the behavior of the processors.
            </p>
        </asp:PlaceHolder>
        <asp:PlaceHolder runat="server" ID="actions">
            <div style="margin: 16px 0 16px 0;">
                <asp:Button runat="server" ID="refresh" Text="Refresh" OnClientClick="window.location=window.location" UseSubmitBehavior="False"/>&nbsp;
                <asp:Button runat="server" ID="reset" Text="Reset" UseSubmitBehavior="False" /><br />
            </div>
        </asp:PlaceHolder>
        <asp:PlaceHolder runat="server" Visible="False" ID="noDataMessage">
            <h2>No data is currently available.</h2>    
            <p>
              The profile counters were reset. To see an updated snapshot, refresh the page.
            </p>
        </asp:PlaceHolder>
        <div id="ppFilter"></div>
        <asp:PlaceHolder ID="resultTable" runat="server">
            <table class="main">
                <thead>
                    <tr>
                        <th title="<%=Columns.Name.Description %>" style="text-align: left"><%=Columns.Name.Header %></th>
                        <th title="<%=Columns.ExecutionCount.Description %>" class="dataheader"><%=Columns.ExecutionCount.Header %></th>
                        <th title="<%=Columns.WallTimePercent.Description %>" class="dataheader"><%=Columns.WallTimePercent.Header %></th>
                        <th title="<%=Columns.WallTime.Description %>" class="dataheader"><%=Columns.WallTime.Header %></th>
                        <th title="<%=Columns.MaxWallTime.Description %>" class="dataheader"><%=Columns.MaxWallTime.Header %></th>
                        <% if (this.DisplayCpuTime)
                           { %>
                            <th title="<%= Columns.CpuPercent.Description %>" class="dataheader"><%= Columns.CpuPercent.Header %></th>
                        <% } %>
                        <th title="<%=Columns.TimePerCall.Description %>" class="dataheader"><%=Columns.TimePerCall.Header %></th>
                    </tr>
                </thead>
                <tbody>
                    <% Response.BufferOutput = false;
                        foreach (var pipeline in this.GetPipelines()) {%>
                      <tr class="groupheader">
                          <td pln-name="<%=pipeline.Name %>"><%=pipeline.Name %></td>
                          <td title="<%=Columns.ExecutionCount.Header %>" class="datacell"><%=this.FormatNumber(pipeline.ExecutionCount) %></td>
                          <td title="<%=Columns.WallTimePercent.Header %>" class="datacell"/>
                          <td title="<%=Columns.WallTime.Header %>" class="datacell"><%=this.FormatNumber(pipeline.WallTime) %></td>
                          <td title="<%=Columns.MaxWallTime.Header %>" class="datacell"><%=this.FormatNumber(pipeline.MaxWallTime) %></td>
                          <% if (this.DisplayCpuTime) {%>
                              <td title="<%=Columns.CpuPercent.Header %>" class="datacell"/>
                          <%}%>
                          <td title="<%=Columns.TimePerCall.Header %>" class="datacell"><%=this.FormatNumber(pipeline.WallTime / pipeline.ExecutionCount) %>
                      </tr>
                    
                      <% if (!pipeline.Processors.Any()) { %>
                      <tr>
                          <td pln-name="<%=pipeline.Name %>" class="processor"><%= Empty %></td>
                          <td class="datacell"/>
                          <td class="datacell"/>
                          <td class="datacell" />
                          <td class="datacell"/>
                          <% if (this.DisplayCpuTime) {%>
                              <td class="datacell"/>
                          <%}%>
                          <td class="datacell"/>
                      </tr>
                      <%}%>

                      <% foreach (var processor in pipeline.Processors) {%>
                      <tr>
                          <td title="<%=processor.Name %>" alt="<%=processor.Details %>" pln-name="<%=pipeline.Name %>" class="processor top<%= processor.Rank %>"><%=this.ShortenProcessorName(processor.Name, 70) %></td>
                          <td class="datacell"><%=this.FormatNumber(processor.ExecutionCount) %></td>
                          <td class="datacell"><%=this.FormatPercentage(processor.WallTime / pipeline.WallTime) %></td>
                          <td class="datacell"><%=this.FormatNumber(processor.WallTime) %></td>
                          <td class="datacell"><%=this.FormatNumber(processor.MaxWallTime) %></td>
                          <% if (this.DisplayCpuTime) {%>
                              <td class="datacell"><%=this.FormatPercentage(processor.CpuTime / pipeline.CpuTime) %></td>
                          <%}%>
                          <td class="datacell"><%=this.FormatNumber(processor.WallTime / processor.ExecutionCount) %></td>
                      </tr>
                      <%}%>
                    
                    <%}%>
                </tbody>
            </table>
        </asp:PlaceHolder>
        <asp:PlaceHolder runat="server" ID="legend">
            <div class="wf-configsection" style="margin: 16px 0 16px 0;">
                <h2>
                    Legend</h2>
                <br />
                <table class="main">
                    <% foreach (var entry in Columns.AllColumns) { %>
                    <tr>
                        <th>
                            <%= entry.Header %>
                        </th>
                        <td>
                            <%= entry.Description %>
                        </td>
                    </tr>
                    <% } %>
                </table>
            </div>
        </asp:PlaceHolder>
    </div>
    </form>
    
    <asp:PlaceHolder runat="server" ID="qtip" Visible="false">
        <strong><%=this.FormatProcessorName(CurrentProcessor.Name) %></strong>
        <table class="processorSummaryTable">
            <tr>
                <td><%=Columns.WallTimePercent.Header %></td>
                <td style="text-align:right"><%= this.FormatPercentage(CurrentProcessor.WallTime / CurrentPipeline.WallTime) %></td>
            </tr>
            <tr>
                <td><%=Columns.WallTime.Header %></td>
                <td style="text-align:right"><%= this.FormatNumberExtended(CurrentProcessor.WallTime) %></td>
            </tr>
            <tr>
                <td><%=Columns.MaxWallTime.Header %></td>
                <td style="text-align:right"><%= this.FormatNumberExtended(CurrentProcessor.MaxWallTime) %></td>
            </tr>
            <% if (DisplayCpuTime)
               { %>
                <tr>
                    <td><%= Columns.CpuPercent.Header %></td>
                    <td style="text-align:right"><%= this.FormatPercentage(CurrentProcessor.CpuTime / CurrentPipeline.CpuTime) %></td>
                </tr>
            <% } %>
            <tr>
                <td><%=Columns.TimePerCall.Header %></td>
                <td style="text-align:right"><%= this.FormatNumberExtended(CurrentProcessor.WallTime / CurrentProcessor.ExecutionCount) %></td>
            </tr>
        </table>
    </asp:PlaceHolder>
    <script type="text/javascript">
        $('td[alt]').qtip(
            {
                style: { width: { max: 550 }, name: 'light', tip: false },
                position: {
                    corner: {
                        target: 'rightTop',
                        tooltip: 'topLeft'
                    },
                    adjust: {
                        x: 0,
                        y: 1
                    }
                }
            }
      );
    </script>
    <script type="text/javascript">
        $(document).ready(
            function ()
            {
                if ($("table.main td[pln-name]:first").length)
                {
                    var ppFilter = new PP_Filter.Instrument();
                    ppFilter.startSearchingLength = 3;
                    ppFilter.init();
                }
            }
        );
    </script>
</body>
</html>
