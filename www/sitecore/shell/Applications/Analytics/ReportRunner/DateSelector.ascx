<%@ Control Language="C#" AutoEventWireup="false" CodeBehind="DateSelector.ascx.cs"
    Inherits="Sitecore.Shell.Applications.Analytics.ReportRunner.DateSelector, Sitecore.Xdb.Client" %>
<%@ Register TagPrefix="t" Namespace="Telerik.Web.UI" Assembly="Telerik.Web.UI" %>
<%@ Register TagPrefix="sc" Namespace="Sitecore.Web.UI.HtmlControls" Assembly="Sitecore.Kernel" %>
<div style="border: 1px solid #e9e9e9; margin: 8px 8px 0px 8px; font: 10pt tahoma;
    float: left; cursor: hand" onclick="javascript:$('Criteria').toggle()">
    <div style="float: left; padding: 4px">
        <sc:Literal ID="Dates" runat="server" />
    </div>
    <div style="float: left; background: #f9f9f9; border-left: 1px solid #e9e9e9">
        <sc:ThemedImage Src="Images/ContentSectionButton1.png" Width="16" Height="16" Margin="5px 0px 0px 0px"
            runat="server" />
    </div>
</div>
<div id="Criteria" style="border: 1px solid #e9e9e9; position: relative; background: #f9f9f9;
    padding: 4px; clear: left; float: left; margin: -1px 0px 0px 8px; font: 8pt tahoma;
    display: none">
    <div>    
        <sc:Literal ID="DatesRangeLiteral" runat="server" Text="Date Range" />
    </div>
    <table>
        <tr>
            <td>
                <sc:Panel runat="server" ID="StartDateCriteria" Style="padding: 2px 0px 0px 0px">
                    <t:RadDatePicker ID="StartDatePicker" enablemultiselect="false" usecolumnheadersasselectors="false"
                        Height="22" runat="server" Style="font: 8pt tahoma" />
                     &#160;-&#160;
                </sc:Panel>
            </td>
      
            <td>
                <sc:Panel runat="server" ID="EndDateCriteria" Style="padding: 2px 0px 0px 0px;">                   
                    <t:RadDatePicker ID="EndDatePicker" enablemultiselect="false" usecolumnheadersasselectors="false"
                        Height="22" runat="server" Style="font: 8pt tahoma" />
                </sc:Panel>
            </td>
        </tr>
    </table>
    <div style="padding: 4px 0px 0px 0px">
        <button type="submit" style="font: 8pt tahoma; padding: 2px 8px 2px 8px">
            <sc:Literal Text="Apply" runat="server" />
        </button>
    </div>
</div>
