<%@ Control Language="C#" AutoEventWireup="true" Codebehind="InstallationResult.ascx.cs"
   Inherits="Sitecore.Update.Wizard.InstallationResult" %>
<style type="text/css">
      
      .table-wrapper { height: 400px; margin-bottom:1em; overflow: auto; overflow-y: auto; margin-top: 0.5em; clear: both; }
      .table-wrapper table th { white-space:nowrap; text-align: left; border-bottom: solid 1px #ccc; padding-right: 8px; }
      .table-wrapper table td { vertical-align: top; padding: 4px 12px 4px 0;}
      .table-wrapper table td.message { width:150px;}
      .table-wrapper table td.action { width:80px;}  
      .table-wrapper table td.database { width:60px;}    
      .table-wrapper tr.Row, .table-wrapper tr.AlternativeRow { cursor: pointer; }
      
      .filters { margin-top: 2em; overflow: auto;}
      #search { float: right; margin-top: 0.5em}  
      #search label { padding-right: 4px; }
      #search input { width: 350px; }
      
      .table-wrapper table tr.Row:hover, .table-wrapper table tr.AlternativeRow:hover{ background: #e8f5fd; }

      .table-wrapper td.message { padding-left: 24px; }
     
      .table-wrapper tr.Row:hover td.error, .table-wrapper tr.AlternativeRow:hover td.error { background: #e8f5fd url(/sitecore/admin/wizard/images/bullet_square_red.png) no-repeat 0 0; }
      .table-wrapper td.error { background: Transparent url(/sitecore/admin/wizard/images/bullet_square_red.png) no-repeat 0 0; }
      .table-wrapper tr.Row:hover td.warning, .table-wrapper tr.AlternativeRow:hover td.warning { background: #e8f5fd url(/sitecore/admin/wizard/images/bullet_square_yellow.png) no-repeat 0 0;  }
      .table-wrapper td.warning { background: Transparent url(/sitecore/admin/wizard/images/bullet_square_yellow.png) no-repeat 0 0;  }
      .table-wrapper tr.Row:hover td.collision, .table-wrapper tr.AlternativeRow:hover td.collision { background: #e8f5fd url(/sitecore/admin/wizard/images/bullet_square_blue.png) no-repeat 0 0;  }
      .table-wrapper td.collision { background: Transparent url(/sitecore/admin/wizard/images/bullet_square_blue.png) no-repeat 0 0;  }
      .table-wrapper tr.Row:hover td.info, .table-wrapper tr.AlternativeRow:hover td.info { background: #e8f5fd url(/sitecore/admin/wizard/images/bullet_square_grey.png) no-repeat 0 0;  }
      .table-wrapper td.info { background: Transparent url(/sitecore/admin/wizard/images/bullet_square_grey.png) no-repeat 0 0;  }
      
      .table-wrapper table td.description span.short-description:hover{ text-decoration: underline;}

      .table-wrapper .description .description-wrapper {
        max-width: 460px;
        word-wrap: break-word;
      }

      .table-wrapper .description .long-description br {
        display: block;
        margin-bottom: 6px;
        content: " ";
      }

      .table-wrapper .description .long-description-wrapper {
        margin-bottom: 8px;
      }

      .table-wrapper .messagetype-wrapper {
        word-wrap: break-word;
      }

      .feedback-link-wrapper {
          margin-bottom: 10px;
      }
    </style>

<script language="javascript" type="text/javascript">
  
var showHideDescription = function(id){
   $("#" + id).parent().toggle();
   if($("#" + id).parent().is(":hidden"))
   {
      $("#" + id).parent().prev().attr("title", "Click to show more details");
   }
   else
   {
      $("#" + id).parent().prev().attr("title", "Click to hide details");
   }
}
   

var showMessages = function()
{
   $(".messages-list").slideDown("slow");
   $(".wf-more a img").attr('src', '/sitecore/shell/Themes/Standard/Images/Progress/more_expanded.png');
   $(".wf-more a span").text('Hide installation messages');
}

var hideMessages = function()
{
   $(".messages-list").slideUp();
   $(".wf-more a img").attr('src', '/sitecore/shell/Themes/Standard/Images/Progress/more_collapsed.png');
   $(".wf-more a span").text('Show installation messages');
}

var showHideMessages = function(){
         if($(".messages-list").is(":hidden"))
         {
            showMessages();
         }
         else
         {
            hideMessageTypes();
            hideMessages();
         }
      }

var showHideMessageTypes = function(){
         if($("#MessageGroupsPanel").is(":hidden"))
         {
            showMessageTypes();
         }
         else
         {
            hideMessageTypes();
         }
      }

var showMessageTypes = function(){
   if($("#MessageGroupsPanel").is(":hidden"))
   {
      $("#MessageGroupsPanel").show();
   }
}

var hideMessageTypes = function(){
   if(!$("#MessageGroupsPanel").is(":hidden"))
   {
      $("#MessageGroupsPanel").hide();
   }
}


$(document).ready(function(){
   $(".wf-more a").click(showHideMessages);
   $("body").attr("class", "wf-layout-wide");
   
   $(document).click(function(e) { 
      if(!$("#MessageGroupsPanel").is(":hidden"))
      {
         var element = $(e.target);
         if (!element.is("#MessageGroupsPanel *") && !element.is(".MessageTypesFilter *")) 
         {
            hideMessageTypes();
         }
      }
   });
  })   
   
   
  function SetSelection(target) {
    var rng, sel;
    if ( document.createRange ) {
    rng = document.createRange();
    rng.selectNode( target )
    sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange( rng );
    } else {
    var rng = document.body.createTextRange();
    rng.moveToElementText( target );
    rng.select();
  }
}
</script>

<asp:ScriptManager ID="MANAGER" runat="server">
</asp:ScriptManager>
<div style="margin: 2em 0 1em 0;" id="InformationPanel" runat="server">
   <p id="lblInformation" runat="server">
   </p>
</div>
<div class="InformationPanel" visible="true">
   <p class="wf-more" id="hidePanel" runat="server" style="padding: 1em 0; margin:0;">
      <a id="btnHide" runat="server">
         <img src="/sitecore/shell/Themes/Standard/Images/Progress/more_collapsed.png" alt="Show\Hide Messages"
            border="0" id="hideImage" />
         <span id="hideText">Show installation messages</span></a>
   </p>
</div>
<div id="ResultPanel" class="messages-list" runat="server" enableviewstate="true">
   <div runat="server" class="filters" style="margin-top:0; padding-top:0;">
      <div id="search" style="margin-bottom: 1em;">
         <table>
            <tr>
               <td>
                  <label for="TxtSearchText">
                     Search:</label></td>
               <td>
                  <asp:UpdatePanel ID="UpdatePanel2" runat="server">
                     <Triggers>
                        <asp:AsyncPostBackTrigger ControlID="MessagesFilter" />
                        <asp:AsyncPostBackTrigger ControlID="BtnSearch" />
                     </Triggers>
                     <ContentTemplate>
                        <asp:TextBox ID="TxtSearchText" runat="server" TabIndex="0"></asp:TextBox></ContentTemplate>
                  </asp:UpdatePanel>
               </td>
               <td>
                  <asp:ImageButton ID="BtnSearch" ToolTip="Search in Description Field" ImageUrl="/~/icon/Core/32x32/Search.png.aspx"
                     Height="16px" Width="16px" runat="server" CssClass="Button" OnClick="BtnSearch_Click" />
               </td>
            </tr>
         </table>
      </div>
      <p id="MessageTypesFilterPanel" class="MessageTypesFilter" runat="server" style="margin-bottom: 0;">
         &darr; <a onclick="showHideMessageTypes();" style="cursor: pointer;">Filter by message types:</a>
      </p>
      <div id="MessageGroupsPanel" style="width: 300px; border: solid 1px #CCC; display: none;
         z-index: 5; position: absolute; background-color: White;">
         <span style="overflow: auto; width: 300px;">
            <asp:UpdatePanel ID="UpdatePanel1" runat="server">
               <ContentTemplate>
                  <asp:CheckBoxList RepeatLayout="Table" RepeatDirection="Vertical" RepeatColumns="1"
                     runat="server" ID="MessagesFilter" AutoPostBack="true" OnSelectedIndexChanged="MessagesFilter_Changed"
                     Visible="true">
                  </asp:CheckBoxList>
                  <a onclick="hideMessageTypes();" style="float: right; padding: 0 1em 0.5em 0; cursor: pointer;">
                     close</a>
               </ContentTemplate>
            </asp:UpdatePanel>
         </span>
      </div>
   </div>
   <div class="table-wrapper">
      <asp:UpdatePanel ID="ResultGridUpdatePanel" runat="server">
         <Triggers>
            <asp:AsyncPostBackTrigger ControlID="MessagesFilter" />
            <asp:AsyncPostBackTrigger ControlID="BtnSearch" />
         </Triggers>
         <ContentTemplate>
            <asp:GridView ID="ResultGrid" AllowSorting="True" BorderWidth="0px" runat="server"
               AutoGenerateColumns="False" AllowPaging="True" Width="98%" OnRowDataBound="ResultGrid_RowDataBound"
               OnRowCreated="ResultGrid_RowCreated" OnSorted="ResultGrid_Sorted" OnSorting="ResultGrid_Sorting"
               OnPageIndexChanged="ResultGrid_PageIndexChanged" OnPageIndexChanging="ResultGrid_PageIndexChanging"
               GridLines="None" ShowFooter="true" PageSize="50" EmptyDataRowStyle-CssClass="EmptyGridMessage">
               <Columns>
                  <asp:TemplateField HeaderText="Message Type" SortExpression="Level">
                     <ItemTemplate>
                       <div class="messagetype-wrapper"><asp:Label ID="MessageType" runat="server" Text='<%# Bind("MessageGroupDescription") %>'></asp:Label></div>
                     </ItemTemplate>
                     <ItemStyle />
                  </asp:TemplateField>
                  <asp:TemplateField HeaderText="Description" SortExpression="ShortDescription">
                     <ItemTemplate>
                        <div class="description-wrapper"><asp:Label ID="ShortDescription" CssClass="short-description" ToolTip="Click to show more details" runat="server"></asp:Label></div><div Style="display: none;" class="description-wrapper long-description-wrapper"><p style="padding:0;margin:0;">&nbsp</p>
                        <asp:Label ID="Description" CssClass="long-description" runat="server"></asp:Label>
                        </div>
                     </ItemTemplate>
                     <ItemStyle CssClass="description" />
                  </asp:TemplateField>
                  <asp:TemplateField HeaderText="Database" SortExpression="Database">
                     <ItemTemplate>
                        <asp:Label ID="DatabaseLbl" runat="server" Text='<%# Bind("Database") %>'></asp:Label>
                     </ItemTemplate>
                     <ItemStyle CssClass="database" />
                  </asp:TemplateField>
                  <asp:TemplateField HeaderText="Action" SortExpression="Action">
                     <ItemTemplate>
                        <asp:Label ID="Action" runat="server" Text='<%# Bind("Action") %>'></asp:Label>
                     </ItemTemplate>
                     <ItemStyle CssClass="action" />
                  </asp:TemplateField>
               </Columns>
               <AlternatingRowStyle CssClass="AlternativeRow" />
               <HeaderStyle CssClass="HeaderBorder" />
               <PagerSettings Mode="NumericFirstLast" Position="TopAndBottom" />
               <PagerStyle CssClass="Paging" />
               <RowStyle CssClass="Row" />
            </asp:GridView>
         </ContentTemplate>
      </asp:UpdatePanel>
   </div>
   <div style="width: 100%;">
      <span id="generalStatisticsText" runat="server" style="float: left"></span><span
         id="DownloadPanel" runat="server" align="right" style="float: right;">
         <asp:LinkButton ID="DownloadLink" runat="server" Text="Download grid as xml file"
            OnClick="DownloadInstallationLog" />
      </span>
   </div><div style="clear:both;margin:0;padding:0;">&nbsp</div>
   <div id="additionalInformation" style="padding-top: 1.5em;" runat="server">
   </div>
</div>

<div id="FeedbackPanel" runat="server" Visible="False" class="feedback-link-wrapper">
    <asp:HyperLink ID="FeedbackLink" Text="Tell us what you think about the upgrade" NavigateUrl="https://bit.ly/2cOYFex" Target="_blank" runat="server"></asp:HyperLink>
</div>

<div id="Spacer" runat="server" visible="false" style="padding: 1em 0 0 0; margin: 0 0 0 0">
</div>