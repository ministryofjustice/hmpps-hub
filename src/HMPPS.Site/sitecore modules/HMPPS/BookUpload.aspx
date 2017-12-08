<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="BookUpload.aspx.cs" Inherits="HMPPS.Site.sitecore_modules.HMPPS.BookUpload" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title>Book Upload</title>
</head>
<body>
    <form id="form1" runat="server">
        <h1>Book upload tool</h1>
        <h2><asp:Literal runat="server" ID="statusLit"></asp:Literal></h2>
        <div>
            <label>Pick the book CSV to upload</label><br/>
            <asp:FileUpload runat="server" ID="csvFileUpload" AllowMultiple="False" />
            <asp:Button runat="server" id="importBtn" OnClick="importBtn_OnClick" Text="Start the import"/>
        </div>
    </form>
</body>
</html>
