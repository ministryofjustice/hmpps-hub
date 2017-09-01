<%@ Control Language="C#" AutoEventWireup="true" CodeBehind="BucketSearchUI.ascx.cs" Inherits="Sitecore.Buckets.Module.BucketSearchUI" %>
<%@ Register TagPrefix="sc" TagName="BucketSearchBox" Src="SearchBox.ascx" %>
<%@ Import Namespace="Sitecore.Globalization" %>
<%@ Import Namespace="Sitecore.Buckets.Localization" %>

<div id="MainPanel">
  <div class="content">
    <div id="ui_element" class="box">
      <span id="views">
        <a class="active list" id="list" title="<%= Translate.Text(Texts.ListView)%>"></a>
        <a class="grid" id="grid" title="<%= Translate.Text(Texts.GridView)%>"></a>
      </span>

      <sc:BucketSearchBox runat="server"/>

      <div id="slider"></div>
      <div class="hastip" title="<%= Translate.Text(Texts.NeedToEnterSomeSearchText)%>">
        <p><%= Translate.Text(Texts.NeedToEnterSomeSearchText)%></p>
      </div>
      <div class="errortip" id="search-error" title="<%= Translate.Text(Texts.ErrorThatStoppedSearch)%>">
        <p><%= Translate.Text(Texts.ErrorThatStoppedSearch)%></p>
      </div>
      <div class="errortip" id="facet-error" title="<%= Translate.Text(Texts.ErrorThatStoppedFacetsDisplaying) %>">
        <p><%= Translate.Text(Texts.ErrorThatStoppedFacetsDisplaying) %></p>
      </div>
      <div class="sb_dropdown" style="display: none;"></div>
    </div>

    <div id="resultInfoMessage"></div>
    <div class="contentAreaWrapper">
      <div class="pageSection">
        <div class="loadingSection" id="loadingSection"></div>
        <div class="selectable" id="results">
        </div>
      </div>
<%--	  <a href="#" id="facetsBTN" class="facetsBTN"></a>     --%>
      <div id="facets" class="facets facetsVis">
        <div class="contextdataarea"></div>  
        <div class="navAlpha slide-out-div"></div>
      </div>
      <div style="clear:both"></div> 
    </div>
  </div>
</div>
