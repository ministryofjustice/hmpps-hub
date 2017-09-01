<%@ Page Language="C#" MasterPageFile="~/sitecore/shell/Applications/Buckets/ItemBucketsSearchResult.Master" AutoEventWireup="true" CodeBehind="MiniResults.aspx.cs" Inherits="Sitecore.Buckets.Module.MiniResults" %>

<%@ Register TagPrefix="sc" TagName="BucketSearchUI" Src="BucketSearchUI.ascx" %>
<%@ Register TagPrefix="sc" Namespace="Sitecore.Web.UI.HtmlControls" Assembly="Sitecore.Kernel" %>
<%@ OutputCache Location="None" VaryByParam="none" %>

<asp:Content ContentPlaceHolderID="head" runat="server">
    <script type="text/javascript" src="./Scripts/InsertLinkOverride.js"></script>
    <style type="text/css">
        #closeRTEBox {
            font-size: 13px;
            position: absolute;
            left: 10px;
            z-index: 1;
        }
    </style>
</asp:Content>

<asp:Content ContentPlaceHolderID="body" runat="server">
    <sc:BucketSearchUI BucketsView="Rte" runat="server" />
</asp:Content>