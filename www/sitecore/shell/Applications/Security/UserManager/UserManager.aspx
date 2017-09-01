<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="UserManager.aspx.cs" Inherits="Sitecore.Shell.Applications.Security.UserManager.UserManager" %>

<%@ Register Assembly="Sitecore.Kernel" Namespace="Sitecore.Web.UI.HtmlControls" TagPrefix="sc" %>
<%@ Register Assembly="Sitecore.Kernel" Namespace="Sitecore.Web.UI.WebControls" TagPrefix="sc" %>
<%@ Register Assembly="Sitecore.Kernel" Namespace="Sitecore.Web.UI.WebControls.Ribbons" TagPrefix="sc" %>
<%@ Register Assembly="ComponentArt.Web.UI" Namespace="ComponentArt.Web.UI" TagPrefix="ca" %>
<%@ Register Src="~/sitecore/shell/Applications/GlobalHeader.ascx" TagName="GlobalHeader" TagPrefix="uc" %>

<!DOCTYPE html>

<html>
<head runat="server">
  <meta http-equiv="X-UA-Compatible" content="IE=edge"> 
  <title><sc:Literal runat="server" Text="User Manager"></sc:Literal></title>
  <link rel="shortcut icon" href="/sitecore/images/favicon.ico" />
  <sc:Stylesheet Src="Content Manager.css" DeviceDependant="true" runat="server" />
  <sc:Stylesheet Src="Ribbon.css" DeviceDependant="true" runat="server" />
  <sc:Stylesheet Src="Grid.css" DeviceDependant="true" runat="server" />
  <sc:Script Src="/sitecore/shell/Controls/SitecoreObjects.js" runat="server" />
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

    function Users_onDoubleClick(sender, eventArgs) {
      scForm.postRequest("", "", "", "usermanager:edituser");
    }

    function OnResize() {

      Users.render && Users.render();

      /* re-render again after some "magic amount of time" - without this second re-render grid doesn't pick correct width sometimes */
      setTimeout("Users.render()", 150);
    }

    function refresh() {
      Users.scHandler.refresh();
    }

    function OnLoad() {
    }

    window.onresize = OnResize;

    setInterval(function () {
      var searchBox = document.querySelector("[id$=searchBox]");
      if(searchBox && searchBox.value.indexOf('\"') != -1) {
        searchBox.value = searchBox.value.replace(/"/g, "");
      };
    }, 50);

  </script>

</head>
<body style="height: 100%;" id="PageBody" runat="server">
  <form id="UserManagerForm" runat="server">
    <sc:AjaxScriptManager runat="server" />
    <sc:ContinuationManager runat="server" />
    <uc:GlobalHeader runat="server" />
    <div class="scFlexColumnContainer scHeight100">
     <div id="RibbonPanel">
        <sc:Ribbon runat="server" ID="Ribbon" />
      </div>
      <div id="GridCell" class="scFlexContent">
        <div class="scStretchAbsolute scMarginAbsolute" style="overflow: auto">
          <ca:Grid ID="Users"
            AutoFocusSearchBox="false"
            RunningMode="Callback"
            CssClass="Grid"
            ShowHeader="true"
            HeaderCssClass="GridHeader"
            FillContainer="true"
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
            PageSize="15"
            PagerStyle="Slider"
            PagerTextCssClass="GridFooterText"
            PagerButtonHoverEnabled="True"
            PagerImagesFolderUrl="/sitecore/shell/themes/standard/componentart/grid/pager/"
            RenderSearchEngineStamp="True"
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
                  <ca:GridColumn DataField="scGridID" Visible="false" IsSearchable="false" />
                  <ca:GridColumn DataField="Name" Visible="false" IsSearchable="false" />
                  <ca:GridColumn DataField="Portrait" Visible="false" IsSearchable="false" />
                  <ca:GridColumn DataField="LocalName" AllowSorting="false" IsSearchable="true" AllowGrouping="false" SortedDataCellCssClass="SortedDataCell" HeadingText="User name" DataCellClientTemplateId="LocalNameTemplate" AllowHtmlContent="False" />
                  <ca:GridColumn DataField="Domain" AllowSorting="false" IsSearchable="false" AllowGrouping="false" SortedDataCellCssClass="SortedDataCell" HeadingText="Domain" AllowHtmlContent="False" />
                  <ca:GridColumn DataField="DisplayName" AllowSorting="false" IsSearchable="false" AllowGrouping="false" SortedDataCellCssClass="SortedDataCell" HeadingText="Fully qualified name" AllowHtmlContent="False" />
                  <ca:GridColumn DataField="Profile.FullName" AllowSorting="false" IsSearchable="false" AllowGrouping="false" SortedDataCellCssClass="SortedDataCell" HeadingText="Full name" DataCellServerTemplateId="FullNameTemplate" AllowHtmlContent="False" />
                  <ca:GridColumn DataField="Profile.Email" AllowSorting="false" IsSearchable="false" AllowGrouping="false" SortedDataCellCssClass="SortedDataCell" HeadingText="Email" AllowHtmlContent="False" />
                  <ca:GridColumn DataField="Profile.Comment" AllowSorting="false" IsSearchable="false" AllowGrouping="false" SortedDataCellCssClass="SortedDataCell" HeadingText="Comment" DataCellServerTemplateId="CommentTemplate" AllowHtmlContent="False" />
                  <ca:GridColumn DataField="Profile.ClientLanguage" AllowSorting="false" IsSearchable="false" AllowGrouping="false" SortedDataCellCssClass="SortedDataCell" HeadingText="Language" AllowHtmlContent="False" />
                  <ca:GridColumn DataField="Profile.State" AllowSorting="false" IsSearchable="false" AllowGrouping="false" SortedDataCellCssClass="SortedDataCell" HeadingText="Locked" AllowHtmlContent="False" />
                  <ca:GridColumn DataField="Profile.PortraitFullPath" Visible="false" IsSearchable="false" AllowHtmlContent="False" />
                </Columns>
              </ca:GridLevel>
            </Levels>

            <ClientEvents>
              <ItemDoubleClick EventHandler="Users_onDoubleClick" />
            </ClientEvents>
            <ServerTemplates>
              <ca:GridServerTemplate ID="CommentTemplate">
                <Template>
                  <asp:Label ID="CommentLabel" runat="server" />
                </Template>
              </ca:GridServerTemplate>
              <ca:GridServerTemplate ID="FullNameTemplate">
                <Template>
                  <asp:Label ID="FullNameLabel" runat="server" />
                </Template>
              </ca:GridServerTemplate>

            </ServerTemplates>
            <ClientTemplates>
              <ca:ClientTemplate ID="LocalNameTemplate">
                <img src="## DataItem.GetMember('Profile.PortraitFullPath').Value ##" class="scImageCircle" width="16" height="16" border="0" alt="" align="absmiddle" />
                ## DataItem.GetMember('LocalName').Value ##
              </ca:ClientTemplate>
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
                  ## DataItem.PageIndex + 1 ## / ## Users.PageCount ##
                </div>
              </ca:ClientTemplate>
            </ClientTemplates>
          </ca:Grid>
        </div>
      </div>
    </div>
  </form>
</body>
</html>
