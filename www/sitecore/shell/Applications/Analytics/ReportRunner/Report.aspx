<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Report.aspx.cs" Inherits="Sitecore.Shell.Applications.Analytics.ReportRunner.ReportPage, Sitecore.Xdb.Client" %>
<%@ Register Assembly="Stimulsoft.Report.Web" Namespace="Stimulsoft.Report.Web" TagPrefix="cc1" %>
<%@ Register Assembly="Stimulsoft.Report.WebDesign" Namespace="Stimulsoft.Report.Web" TagPrefix="cc2" %>
<%@ Register Assembly="Sitecore.Kernel" Namespace="Sitecore.Web.UI.HtmlControls" TagPrefix="sc" %>
<%@ register tagprefix="ds" tagname="dateselector" src="/sitecore/shell/Applications/Analytics/ReportRunner/DateSelector.ascx" %>
<!DOCTYPE html>
<html>
<head runat="server">
  <meta http-equiv="X-Frame-Options" content="SAMEORIGIN">
  <title>Sitecore</title>
  <script src="/sitecore/shell/controls/lib/prototype/prototype.js" type="text/javascript"></script>
  <script src="/sitecore/shell/controls/Sitecore.Runtime.js" type="text/javascript"></script>
</head>
<body onload="javascript:onLoad()">
  <form id="form1" runat="server" style="height:auto">
    <asp:scriptmanager id="ScriptManager" runat="server" />
    <table width="100%" height="100%" cellpadding="0" cellspacing="0" border="0" >
      <tr>
        <td id="Toolbar" runat="server">
          <ds:dateselector id="DateSelector" runat="server" />
        </td>
      </tr>
      <tr>
        <td height="100%">
          <pre id="ErrorMessage" runat="server" visible="false"></pre>
          <cc1:stiwebviewer id="ReportViewer" runat="server" buttonimagespath="/sitecore/shell/Themes/Standard/Reports/" width="100%" height="100%" PageBorderColorDark="#dddddd" PageBorderColorLight="#999999" ViewMode="WholeReport" CurrentPage="0" PrintDestination="Pdf" />
          <cc2:StiWebDesigner id="Designer" runat="server" OnSaveReport="Designer_SaveReport"  OnGetPreviewDataSet="Designer_GetPreviewDataSet" />    
          <asp:Button runat="server" id="Design" OnClick="Design_Click" style="display:none"  />
        </td>
      </tr>
    </table>
  </form>
  
  <script language="javascript" type="text/javascript">
    function onLoad() {
      $$("A").each(function(element) { element.target = '' });

      window.parent.scDesign(false)

      patchStyle("ReportViewer_Print");
      patchStyle("ReportViewer_Save");
      patchStyle("ReportViewer_Zoom");
      patchStyle("ReportViewer_ViewMode");

      window.setTimeout(fixSaveMenuItems, 1000);
      Sitecore.UI.alignButtons($$("#Toolbar > BUTTON"));
    }

    function fixSaveMenuItems() 
    {
      $$(".menuBorder > TBODY > TR > TD > TABLE > TBODY > TR > TD > A").each(function(link) {
        link.setStyle({ width: "140px" });
      });
    }

    function patchStyle(id) {
      var element = $(id);
      var elu = element.up();
      elu.style.width = "75px";
      elu.style.height = "25px";
      
      element.style.width = "auto";

      var eld = element.down();
      if (eld) {
          eld.setStyle({ 'verticalAlign': 'middle' });

          var next = eld.next();
          if (next) {
              next.setStyle({ 'verticalAlign': '' });
          }
      }
    }

      
  
    function scMail() {
      var itemId = '<asp:placeholder runat=server id="ItemId" />';
      
      return window.parent.scForm.postRequest("","","","Email_Click");
    }  

    function scDesign() {
      window.parent.scDesign(true);
      $("Design").click();
      return false;
    }

    function scJump(id) {
    }

    function scFilter() {
      return window.parent.scForm.postRequest("", "", "", "Filter_Click");
    }

    function scShowModalDialog(url, dialogArguments, features, request) {
      return window.parent.scForm.showModalDialog(url, dialogArguments, features, request);
    }

    var cell = $$('#ReportViewer_ReportViewer_toolBar tr td').first();

    if (cell) {
        cell.innerHTML = "<div class=\"webMenu\"><a onclick=\"javascript:return scMail();\" style=\"white-space:nowrap;border:1px solid #e9e9e9;background:#f9f9f9;margin:1px 0px 0px 0px;padding:4px 4px 0px 4px; height:25px;font:8pt tahoma\"><img src=\"/sitecore/shell/Themes/Standard/Reports/MenuMail.gif\" align=\"absmiddle\" width=\"16\" height=\"16\" style=\"width:16px;height:16px\" />&nbsp;<%=Sitecore.Globalization.Translate.Text(Sitecore.Texts.MailReport) %></a></div>";
    }
  </script>
  
  <style type="text/css">
    div.webToolbar img.hover {
      background:#d5effc url(/sitecore/shell/themes/standard/Images/Tree/TreeNodeActiveBackground.png) repeat-x;
	    border: 1px solid #99defd;
	  }
     
    div.webToolbar img.active {
      background:#d5effc url(/sitecore/shell/themes/standard/Images/Tree/TreeNodeActiveBackground.png) repeat-x;
	    border: 1px solid #99defd;
	  }

    div.webMenu div.vertMenu {
	    position: absolute;
	    visibility: hidden;
	    color: black;
	  }
     
    div.webMenu a {
      float:none;
      display:block;
	    border: 1px solid #e9e9e9;
	    font-family: Tahoma, "MS Sans Serif" , Serif;
	    font-size: 8pt;
	    color: black;
	    cursor: default;
	    text-align: left; 
	    background:#f9f9f9;
	    height:25px;
	    white-space:nowrap;
	    padding:2px 0px 2px 0px;
	    vertical-align:middle;
    }
        
    div.webMenu a.hover {
	    background:#d5effc url(/sitecore/shell/themes/standard/Images/Tree/TreeNodeActiveBackground.png) repeat-x;
	    border: 1px solid #99defd;
	  }
     
    div.webMenu div.vertMenu a.hover {
      background:#d5effc url(/sitecore/shell/themes/standard/Images/Tree/TreeNodeActiveBackground.png) repeat-x;
	    border: 1px solid #99defd;
      height:auto;
    }

    div.webMenu div.vertMenu a {
	    padding:2px 0px 2px 0px;
      border:1px solid #f9f9f9;
      height:auto;
	  }
    	
    div.webMenu div.horzMenu a {
      padding: 4px 4px 0px 4px; 
    }
     
    div.webMenu table {
	    border: 0px;
	    font-family: tahoma, "MS Sans Serif", Serif;
      font-size: 8pt;
      border-collapse: collapse; 
    }
     
    div.webMenu div.vertMenu table.menuBorder {
	    background-color: #999999;
	  }
     
    div.webMenu div.vertMenu table {
	    background-color: #f9f9f9; 
	  }
     
    div.webMenu img {
	    border: 0px;
	    width: 16px;
	    height: 16px; 
	  }
  </style>
</body>
</html>
