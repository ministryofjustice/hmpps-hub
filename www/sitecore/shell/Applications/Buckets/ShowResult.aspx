<%@ Page Language="C#" MasterPageFile="~/sitecore/shell/Applications/Buckets/ItemBucketsSearchResult.Master" AutoEventWireup="true" CodeBehind="ShowResult.aspx.cs" Inherits="Sitecore.Buckets.Module.ShowResult" %>

<%@ Register TagPrefix="sc" TagName="BucketSearchUI" Src="BucketSearchUI.ascx" %>
<%@ OutputCache Location="None" VaryByParam="none" %>

<asp:Content ContentPlaceHolderID="head" runat="server">
    <style type="text/css">
        .selectable .ui-selecting {
            background: #EBF3FC;
        }

        .selectable .ui-selected {
            background: #ABD2FF;
        }
    </style>

<%--    <link rel="stylesheet" type="text/css" href="./Styles/IB_vd.css" />--%>
</asp:Content>

<asp:Content ContentPlaceHolderID="body" runat="server">
    <sc:BucketSearchUI BucketsView="ContinueSearch" runat="server" />
</asp:Content>