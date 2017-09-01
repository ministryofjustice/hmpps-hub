<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="PackageItem.aspx.cs" Inherits="Sitecore.ExperienceContentManagement.Administration.PackageItem" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title>Package Item</title>
    <link rel="Stylesheet" type="text/css" href="/sitecore/shell/themes/standard/default/WebFramework.css" />
    <link rel="Stylesheet" type="text/css" href="./default.css" />
</head>
<body>
    <form id="form1" class="wf-container" runat="server">
        <div class="wf-content">
            <h1>
                <a href="/sitecore/admin/">Administration Tools</a> - Package Item
            </h1>
            <br />
            <asp:PlaceHolder ID="InputPlaceholder" runat="server">
                <p>
                    This page makes Sitecore package of the specified item and puts it into the <b>/temp</b> folder.<br />
                    Additionally, it includes:
                </p>
                <ul>
                    <li>All item references;</li>
                    <li>Presentation items and files (mvc presentation is not fully supported, so static references may not be retrieved);</li>
                    <li>Custom assembles if related code files cannot be found;</li>
                    <li>Related workflow items;</li>
                    <li>Custom templates.</li>
                </ul>
                <br />
                <table>
                    <tr>
                        <td>
                            <asp:Label ID="Label1" AssociatedControlID="txtDatabaseName" runat="server" Text="Database:" /></td>
                        <td>
                            <asp:TextBox runat="server" ID="txtDatabaseName" Text="master" /></td>
                    </tr>
                    <tr>
                        <td></td>
                        <td class="result">
                            <asp:Label ID="lblDatabaseNameValidation" CssClass="error" AssociatedControlID="txtDatabaseName" runat="server" Text="" /></td>
                    </tr>
                    <tr>
                        <td>
                            <asp:Label ID="Label2" AssociatedControlID="txtItemPath" runat="server" Text="Item Path:" /></td>
                        <td>
                            <asp:TextBox runat="server" ID="txtItemPath" Text="/sitecore/content/home" /></td>
                    </tr>
                    <tr>
                        <td></td>
                        <td class="result">
                            <asp:Label ID="lblItemPathValidation" CssClass="error" AssociatedControlID="txtItemPath" runat="server" Text="" /></td>
                    </tr>
                    <tr>
                        <td>
                            <asp:Label AssociatedControlID="txtItemPath2" runat="server" Text="Item Path:" /></td>
                        <td>
                            <asp:TextBox runat="server" ID="txtItemPath2" Text="" /></td>
                    </tr>
                    <tr>
                        <td></td>
                        <td class="result">
                            <asp:Label ID="lblItemPath2Validation" CssClass="error" AssociatedControlID="txtItemPath2" runat="server" Text="" /></td>
                    </tr>
                    <tr>
                        <td>
                            <asp:Label AssociatedControlID="txtItemPath3" runat="server" Text="Item Path:" /></td>
                        <td>
                            <asp:TextBox runat="server" ID="txtItemPath3" Text="" /></td>
                    </tr>
                    <tr>
                        <td></td>
                        <td class="result">
                            <asp:Label ID="lblItemPath3Validation" CssClass="error" AssociatedControlID="txtItemPath3" runat="server" Text="" /></td>
                    </tr>
                    <tr>
                        <td>
                            <asp:Label AssociatedControlID="txtItemPath4" runat="server" Text="Item Path:" /></td>
                        <td>
                            <asp:TextBox runat="server" ID="txtItemPath4" Text="" /></td>
                    </tr>
                    <tr>
                        <td></td>
                        <td class="result">
                            <asp:Label ID="lblItemPath4Validation" CssClass="error" AssociatedControlID="txtItemPath4" runat="server" Text="" /></td>
                    </tr>
                    <tr>
                        <td>
                            <asp:Label AssociatedControlID="txtItemPath5" runat="server" Text="Item Path:" /></td>
                        <td>
                            <asp:TextBox runat="server" ID="txtItemPath5" Text="" /></td>
                    </tr>
                    <tr>
                        <td></td>
                        <td class="result">
                            <asp:Label ID="lblItemPath5Validation" CssClass="error" AssociatedControlID="txtItemPath5" runat="server" Text="" /></td>
                    </tr>
                    <tr>
                        <td></td>
                        <td>
                            <asp:CheckBox runat="server" ID="cbWithDescendants" Text="all of them with descendant items" /></td>
                    </tr>
                </table>
                <br />
                <br />
                <asp:Button ID="Button1" runat="server" Text="Generate and download Package" OnClick="GeneratePackage" />
            </asp:PlaceHolder>
        </div>
        <asp:Literal runat="server" ID="lblStatus" />
    </form>
</body>
</html>
