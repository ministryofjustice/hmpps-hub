<%@ Page Language="C#" AutoEventWireup="true" EnableViewState="false" CodeBehind="RawSearch.aspx.cs" Inherits="Sitecore.ExperienceContentManagement.Administration.RawSearch"%>
<%@ Import Namespace="Sitecore.ExperienceContentManagement.Administration.Helpers" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head id="Head1" runat="server">
	<title>Native Search</title>
    <link rel="Stylesheet" type="text/css" href="/sitecore/shell/themes/standard/default/WebFramework.css" />
    <link rel="Stylesheet" type="text/css" href="./default.css" />
</head>
<body>
	<form id="form1" runat="server" class="wf-container">
		<div class="wf-content">
			<h1>
				<a href="/sitecore/admin/">Administration Tools</a> - Raw Search
			</h1>
            <%= DataProviderHelper.IsOracleEnabled ? "<i style=\"color: red;\">*Search in item names and fields is not supported for Oracle provider</i><br/>" : string.Empty %>
			<br />
			<div class="root">
				<table>
					<tr>
						<td valign="top">
							<div class="chunk" style="height: 53px;">
								<asp:Label ID="Label1" runat="server" For="Query" Text="Exact phrase to match:" />
								<asp:TextBox runat="server" ID="Query" Text="sample" Width="173px" /><br />
                                <asp:Label style="color: red;" runat="server" ID="WarningLabel" Text="Phrase cannot be empty or contain only wildcards." Width="245px" Visible="false"/>
								<div style="float: right;">
									<asp:Button ID="Button1" runat="server" OnClick="DoSearch" Text="Search" />
								</div>
							</div>
							<div class="chunk" style="height: 84px;">
								<asp:CheckBox runat="server" ID="SearchItemNames" Text="Search in item names" /><br/>
								<asp:CheckBox runat="server" ID="SearchFields" Text="Search in field values" /><br/>
								<asp:CheckBox runat="server" ID="SearchFiles" Text="Search in file system" Checked="True" /><br />
								<asp:CheckBox runat="server" ID="IgnoreCase" Text="Ignore case" Checked="true" Enabled="false" />
							</div>
						</td>
						<td valign="top">
							<div class="chunk" style="height: 53px;">
							    <i>Use * as wildcard symbol.<br/><b>Important:</b> using wildcards may heavily affect website performance and block website users.</i>
							</div>
							<div class="chunk">
								Display upto
								<asp:TextBox runat="server" ID="NeibourSymbolsAroundFoundOccurance" Value="40" Width="32px" />
								chars around each occurance.<br />
								Display upto
								<asp:TextBox runat="server" ID="MaxCapturesAmount" Value="3" Width="32px" />
								occurances per field/file.<br />
								Exclude
								<asp:TextBox runat="server" ID="ExcludeFileExtensions" Text="gif,jpg,png,cab,cur,db,dll,swf,zip,tdf,svn-base" Width="120px"></asp:TextBox>
								extensions from search.<br />
							</div>
						</td>
					</tr>
				</table>
			</div>

			<hr />
			<h1>Results</h1>
			<asp:PlaceHolder ID="DatabaseSearchPlaceholder" runat="server" Visible="false">
				<h3>In the Databases</h3>
				<asp:PlaceHolder runat="server" ID="ItemNamesSearchPlaceholder" Visible="false">
					<h4>By Name:</h4>
					<ul>
						<asp:Literal runat="server" ID="ItemNamesResults" />
					</ul>
				</asp:PlaceHolder>
				<asp:PlaceHolder runat="server" ID="FieldsSearchPlaceholder" Visible="false">
					<h4>By Shared Field Value:</h4>
					<ul>
						<asp:Literal runat="server" ID="SharedFieldResults" />
					</ul>

					<h4>By Unversioned Field Value:</h4>
					<ul>
						<asp:Literal runat="server" ID="UnVersionedFieldResults" />
					</ul>

					<h4>By Versioned Field Value:</h4>
					<ul>
						<asp:Literal runat="server" ID="VersionedFieldResults" />
					</ul>
				</asp:PlaceHolder>
			</asp:PlaceHolder>

			<asp:PlaceHolder runat="server" ID="FileSystemSearch" Visible="false">
				<h3>In File System:</h3>
				<h4>By File Name</h4>
				<ul>
					<asp:Literal runat="server" ID="FileNamesResults" />
				</ul>

				<h4>By Folder Name:</h4>
				<ul>
					<asp:Literal runat="server" ID="FolderNamesResults" />
				</ul>

				<h4>By Contents:</h4>
				<ul>
					<asp:Literal runat="server" ID="FileContentsResults" />
				</ul>
			</asp:PlaceHolder>
		</div>
	</form>
</body>
</html>