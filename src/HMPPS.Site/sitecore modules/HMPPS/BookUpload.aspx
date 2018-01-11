<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="BookUpload.aspx.cs" Inherits="HMPPS.Site.sitecore_modules.HMPPS.BookUpload" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title>Book upload admin tool</title>
</head>
<body>
    <form id="uploadForm" runat="server">
        <h1>Book upload admin tool</h1>
        <p><asp:Literal runat="server" ID="statusLit"></asp:Literal></p>
        <p>Please ensure the book images and the book files are already uploaded in the Sitecore media library before performing the CSV upload below.</p>
        <p><asp:Literal runat="server" ID="sitecoreFolderInfo"></asp:Literal></p>
        <div>
            <p>
            <label>Pick the book CSV to upload</label>
            <asp:FileUpload runat="server" ID="csvFileUpload" AllowMultiple="False" />
             </p>  
        </div>
        <div>
            <p>
            <asp:Button runat="server" id="importBtn" OnClick="importBtn_OnClick" Text="Start the import"/>
            </p>
        </div>
        <div>
            <asp:Literal runat="server" ID="resultLit"></asp:Literal>
        </div>
    </form>
</body>
</html>
