<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="SqlShell.aspx.cs" Inherits="Sitecore.ExperienceContentManagement.Administration.SqlShell" %>
<%@ Import Namespace="Sitecore.ExperienceContentManagement.Administration.Helpers" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title>SQL Shell</title>
    <link rel="Stylesheet" type="text/css" href="/sitecore/shell/themes/standard/default/WebFramework.css" />
    <style>
        .sql-shell-output {
            width: auto;
            min-width: 100%;
            position: absolute;
            height: 100%;
            background: white; 
        }
        .sql-shell-output .output-title {
            margin-left: 10px;
        }
        .grid-view-container {
            margin: 0 auto;
            padding: 10px;
            background-color: white;
        }
        #Grid {
            margin: 0 auto;
        }
        .error {
            font-style: italic;
            color: red;
        }
        .wf-container {
            margin-bottom: 24px;
        }
    </style>
</head>
<body>
    <form id="Form1" runat="server">
        <div class="wf-container">
            <div class="wf-content">
                <h1>
                    <a href="/sitecore/admin/">Administration Tools</a> - SQL Shell
                </h1>
                <%= DataProviderHelper.IsOracleEnabled? "<i style=\"color: red;\">*Not supported for Oracle provider</i>":string.Empty %>
                <br />
                <asp:PlaceHolder ID="ErrorMessage" runat="server" ><p>&nbsp;</p></asp:PlaceHolder>
                <asp:TextBox TextMode="MultiLine" Rows="10" Columns="80" runat="server" ID="Query" />
                <br />
                <asp:DropDownList runat="server" ID="Databases"/><asp:Button ID="Button1" runat="server" OnClick="Execute" Text="Execute" />
                <div>&nbsp;</div>

            </div>
            
        </div>
            <asp:Panel class="sql-shell-output" runat="server" ID="OutputPanel">
                <h1 class="output-title" runat="server" ID="OutputTitle" EnableViewState="false">Output</h1>
                <div class="grid-view-container">
                    <asp:GridView runat="server" ID="Grid" AllowSorting="True" EnableViewState="false" />
                </div>
            </asp:Panel>
    </form>
</body>
</html>
