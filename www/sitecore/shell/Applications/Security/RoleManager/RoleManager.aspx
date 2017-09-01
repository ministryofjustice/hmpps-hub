<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="RoleManager.aspx.cs" Inherits="Sitecore.Shell.Applications.Security.RoleManager.RoleManager" %>

<%@ Register Assembly="Sitecore.Kernel" Namespace="Sitecore.Web.UI.HtmlControls" TagPrefix="sc" %>
<%@ Register Assembly="Sitecore.Kernel" Namespace="Sitecore.Web.UI.WebControls.Ribbons" TagPrefix="sc" %>
<%@ Register Assembly="ComponentArt.Web.UI" Namespace="ComponentArt.Web.UI" TagPrefix="ca" %>
<%@ Register Src="~/sitecore/shell/Applications/GlobalHeader.ascx" TagName="GlobalHeader" TagPrefix="uc" %>

<!DOCTYPE html>

<html>
<head runat="server">
  <meta http-equiv="X-UA-Compatible" content="IE=Edge"> 
  <title><sc:Literal runat="server" Text="Role Manager"></sc:Literal></title>
  <link rel="shortcut icon" href="/sitecore/images/favicon.ico" />
  <sc:Stylesheet Src="Content Manager.css" DeviceDependant="true" runat="server" />
  <sc:Stylesheet Src="Ribbon.css" DeviceDependant="true" runat="server" />
  <sc:Stylesheet Src="/sitecore/shell/Themes/Standard/default/Grid.css" DeviceDependant="true" runat="server" />
  <sc:Script Src="/sitecore/shell/Controls/Lib/jQuery/jquery.noconflict.js" runat="server" />
  <sc:Script Src="/sitecore/shell/Applications/Content Manager/Content Editor.js" runat="server" />
  <style type="text/css">
    html body {
      overflow: hidden;
    }
    .scRibbonClose{
          top: auto;
          bottom: 0px;
    }
    .scRibbonOpen {
          top: 0px;
          bottom: auto;
    }
    #RibbonPanel {
        position: relative;
        border-bottom: 1px solid #e3e3e3;
        background-color: #f7f7f7;
    }
  </style>
  <script type="text/javascript">

    function onDelete() {
      Roles.scHandler.deleteSelected();
    }

    function OnResize() {
      Roles.render && Roles.render();

      /* re-render again after some "magic amount of time" - without this second re-render grid doesn't pick correct width sometimes */
      setTimeout("Roles.render()", 150);
    }

    function Roles_onDoubleClick(sender, eventArgs) {
      scForm.postRequest("", "", "", "rolemanager:viewmembers");
    }

    function refresh() {
      Roles.scHandler.refresh();
    }

    window.onresize = OnResize;

    setInterval(function () {
      var searchBox = document.querySelector("[id$=searchBox]");
      if (searchBox && searchBox.value.indexOf('\"') != -1) {
        searchBox.value = searchBox.value.replace(/"/g, "");
      };
    }, 50);

  </script>

</head>
<body style="background: transparent" id="PageBody" runat="server">
  <form id="RoleManagerForm" runat="server">
    <sc:AjaxScriptManager runat="server" />
    <sc:ContinuationManager runat="server" />
    <uc:GlobalHeader runat="server" />
    <div class="scFlexColumnContainer scHeight100">
      <div id="RibbonPanel">
        <sc:Ribbon runat="server" ID="Ribbon" />
      </div>
      <div id="GridCell" class="scFlexContent">
        <sc:Border runat="server" Class="scStretchAbsolute scMarginAbsolute" Style="overflow: auto;">
          <ca:Grid ID="Roles"
            AutoFocusSearchBox="false"
            RunningMode="Callback"
            CssClass="Grid"
            FillContainer="true"
            ShowHeader="true"
            HeaderCssClass="GridHeader"
            FooterCssClass="GridFooter"
            GroupByText=""
            GroupingNotificationText=""
            GroupByCssClass="GroupByCell"
            GroupByTextCssClass="GroupByText"
            GroupBySortAscendingImageUrl="group_asc.gif"
            GroupBySortDescendingImageUrl="group_desc.gif"
            GroupBySortImageWidth="10"
            GroupBySortImageHeight="10"
            GroupingNotificationTextCssClass="GridHeaderText"
            GroupingPageSize="5"
            ManualPaging="true"
            PagerStyle="Slider"
            PagerTextCssClass="GridFooterText"
            PagerButtonHoverEnabled="True"
            PagerImagesFolderUrl="/sitecore/shell/themes/standard/componentart/grid/pager/"
            ShowSearchBox="true"
            SearchTextCssClass="GridHeaderText scTextAlignRight "
            SearchBoxCssClass="SearchBox scIgnoreModified"
            SliderHeight="20"
            SliderWidth="150"
            SliderGripWidth="24"
            SliderPopupOffsetX="20"
            SliderPopupClientTemplateId="SliderTemplate"
            TreeLineImagesFolderUrl="/sitecore/shell/themes/standard/componentart/grid/lines/"
            TreeLineImageWidth="22"
            TreeLineImageHeight="19"
            PreExpandOnGroup="false"
            ImagesBaseUrl="/sitecore/shell/themes/standard/componentart/grid/"
            IndentCellWidth="22"
            LoadingPanelClientTemplateId="LoadingFeedbackTemplate"
            LoadingPanelPosition="MiddleCenter"
            Width="100%" Height="100%" runat="server">

            <Levels>
              <ca:GridLevel
                DataKeyField="scGridID"
                ShowTableHeading="false"
                ShowSelectorCells="false"
                RowCssClass="Row"
                ColumnReorderIndicatorImageUrl="reorder.gif"
                DataCellCssClass="DataCell"
                HeadingCellCssClass="HeadingCell"
                HeadingCellHoverCssClass="HeadingCellHover"
                HeadingCellActiveCssClass="HeadingCellActive"
                HeadingRowCssClass="HeadingRow"
                HeadingTextCssClass="HeadingCellText"
                SelectedRowCssClass="SelectedRow"
                GroupHeadingCssClass="GroupHeading"
                SortAscendingImageUrl="asc.gif"
                SortDescendingImageUrl="desc.gif"
                SortImageWidth="13"
                SortImageHeight="13">
                <Columns>
                  <ca:GridColumn DataField="scGridID" Visible="false" />
                  <ca:GridColumn DataField="Name" Visible="false" />
                  <ca:GridColumn DataField="DisplayName" AllowSorting="false" AllowGrouping="false" IsSearchable="true" SortedDataCellCssClass="SortedDataCell" HeadingText="Role" />
                </Columns>
              </ca:GridLevel>
            </Levels>

            <ClientTemplates>
              <ca:ClientTemplate ID="LoadingFeedbackTemplate">
                <table cellspacing="0" cellpadding="0" border="0">
                  <tr>
                    <td style="font-size: 10px;">
                      <sc:Literal Text="Loading..." runat="server" />
                      ;</td>
                    <td>
                      <img src="/sitecore/shell/themes/standard/componentart/grid/spinner.gif" width="16" height="16" border="0"></td>
                  </tr>
                </table>
              </ca:ClientTemplate>

              <ca:ClientTemplate ID="SliderTemplate">
                <div class="SliderPopup">
                   ## DataItem.PageIndex + 1 ## / ## Roles.PageCount ##
                </div>
              </ca:ClientTemplate>
            </ClientTemplates>
          </ca:Grid>
        </sc:Border>
      </div>
    </div>
  </form>
</body>
</html>
