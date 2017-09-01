<%@ Page Language="C#" MasterPageFile="~/sitecore/shell/Applications/Buckets/ItemBucketsSearchResult.Master" AutoEventWireup="true" CodeBehind="MediaBrowser.aspx.cs" Inherits="Sitecore.Buckets.Module.MediaBrowser" %>

<%@ Register TagPrefix="sc" TagName="BucketSearchUI" Src="BucketSearchUI.ascx" %>
<%@ OutputCache Location="None" VaryByParam="none" %>

<asp:Content ContentPlaceHolderID="head" runat="server">
<%--TODO: Disabled javascript include--%>
    <script type="text/javascript"  src="./Scripts/BucketLink.js"></script>
<style type="text/css">
    body {
        overflow-x: hidden;
    }
</style>
</asp:Content>

<asp:Content ContentPlaceHolderID="body" runat="server">
    <sc:BucketSearchUI BucketsView="Media" runat="server" />
</asp:Content>