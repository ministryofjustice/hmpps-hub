<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="UploadManager.aspx.cs" Inherits="Sitecore.Shell.Applications.Media.UploadManager.UploadManagerPage" %>
<%@ Register Assembly="Sitecore.Kernel" Namespace="Sitecore.Web.UI.HtmlControls" TagPrefix="sc" %>
<!DOCTYPE html>
<html>
<head runat="server">
  <title>Sitecore</title>
  <sc:Head runat="server" />
</head>
  <frameset frameborder="0" rows="50%,*,0">
    <frame id="Upload" runat="server" name="Upload" scrolling="no" marginwidth="0" marginheight="0" frameborder="0" />
    <frame id="Result" runat="server" name="Result" marginwidth="0" marginheight="0" frameborder="0" style="border-top:2px solid #e3e3e3" />
    <frame id="SitecoreUpload" marginheight="0" marginwidth="0" name="SitecoreUpload" frameborder="0" noresize="noresize" />
  </frameset>
</html>
