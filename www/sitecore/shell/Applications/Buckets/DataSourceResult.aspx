<%@ Page Language="C#" MasterPageFile="~/sitecore/shell/Applications/Buckets/ItemBucketsSearchResult.Master" AutoEventWireup="true" CodeBehind="DataSourceResult.aspx.cs" Inherits="Sitecore.Buckets.Module.DatasetResult" %>

<%@ Register TagPrefix="sc" TagName="BucketSearchUI" Src="BucketSearchUI.ascx" %>
<%@ OutputCache Location="None" VaryByParam="none" %>
<asp:Content ContentPlaceHolderID="head" runat="server">
<%--TODO: Disabled javascript include--%>
    <script type="text/javascript"  src="./Scripts/BucketLink.js"></script>
    <!-- [if IE] 
<style type="text/css">
    

    body {
        overflow: scroll;
    }

    
</style>
        -->
</asp:Content>

<asp:Content ContentPlaceHolderID="body" runat="server">
    <sc:BucketSearchUI BucketsView="DataSource" runat="server" />
</asp:Content>