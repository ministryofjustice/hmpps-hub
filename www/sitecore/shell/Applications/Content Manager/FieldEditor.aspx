<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="FieldEditor.aspx.cs" Inherits="Sitecore.Shell.Applications.ContentManager.FieldEditorPage" %>
<%@ Import Namespace="Sitecore.Globalization"%>
<%@ Register TagPrefix="sc" Namespace="Sitecore.Web.UI.HtmlControls" Assembly="Sitecore.Kernel" %>
<asp:PlaceHolder id="DocumentType" runat="server" />

<html>
<head runat="server">
  <asp:placeholder id="BrowserTitle" runat="server" />
  <sc:Stylesheet runat="server" Src="Content Manager.css" DeviceDependant="true"/>
  <asp:placeholder id="Stylesheets" runat="server" />
  
  <script type="text/JavaScript" src="/sitecore/shell/Controls/Lib/jQuery/jquery-1.10.2.min.js"></script>
  <script type="text/javascript">if (!window.$sc) $sc = jQuery.noConflict();</script>
  <script type="text/JavaScript" src="/sitecore/shell/controls/SitecoreObjects.js"></script>
  <script type="text/JavaScript" src="/sitecore/shell/controls/SitecoreKeyboard.js"></script>
  <script type="text/JavaScript" src="/sitecore/shell/controls/SitecoreVSplitter.js"></script>

  <script type="text/JavaScript" src="/sitecore/shell/Applications/Content Manager/Content Editor.js"></script>
  <script type="text/JavaScript" src="/sitecore/shell/controls/TreeviewEx/TreeviewEx.js"></script>  
  
  <script type="text/javascript">
    function OnResize() {
      var header = $("HeaderRow");
      var footer = $("FooterRow");

      var editor = $("EditorPanel");
      
      var height = window.innerHeight - header.getHeight() - footer.getHeight() + 'px';

      editor.setStyle({ height: height });
    }

    if (Prototype.Browser.Gecko) {
      Event.observe(window, "load", OnResize);
      Event.observe(window, "resize", OnResize);
    }

    if (scForm) {
      scForm.enableModifiedHandling();
    }
  </script>
  
  <style type="text/css">
    html, body {
      overflow: hidden;
    }

     #Editors, #MainPanel, .scValidatorPanel, .scEditorSections {
       background: white;  
     }
    
    .scEditorPanelCell {
      padding-bottom: 1px;
    }
    
    #HeaderRow {
      display: none;
    }

    #FooterRow {
      background-color: #f0f0f0;
      border-top: 1px solid #e3e3e3;
      padding: 8px 15px 9px;
      height: 56px;
    }
    
    #FooterRow>div {
      float: right;
      white-space: nowrap;
    }
  </style>
</head>
<body runat="server" id="Body" style="background-color: #e9e9e9">
  <form id="ContentEditorForm" style="" runat="server"><sc:CodeBeside runat="server" Type="Sitecore.Shell.Applications.ContentManager.FieldEditorForm,Sitecore.Client"/>
  <asp:PlaceHolder id="scLanguage" runat="server" />
  <asp:Literal runat="server" EnableViewState="false" ID="CustomParamsContainer"></asp:Literal>
  <input type="hidden" id="scEditorTabs" name="scEditorTabs" />
  <input type="hidden" id="scActiveEditorTab" name="scActiveEditorTab" />
  <input type="hidden" id="scPostAction" name="scPostAction" />
  <input type="hidden" id="scShowEditor" name="scShowEditor" />
  <input type="hidden" id="scSections" name="scSections" />
  <div id="outline" class="scOutline" style="display:none"></div>
  <span id="scPostActionText" style="display:none"><sc:Literal ID="Literal1" Text="The main window could not be updated due to the current browser security settings. You must click the Refresh button yourself to view the changes." runat="server" /></span>
  <iframe id="feRTEContainer" src="about:blank" style="position: absolute; width: 100%; height: 100%; top: 0px; left: 0px; right: 0px; bottom: 0px; z-index: 999;border:none; display:none" frameborder="0" allowtransparency="allowtransparency"></iframe>                                                                                                                                        
  <div class="scStretch scFlexColumnContainer">
    <div id="HeaderRow">
      <table cellpadding=0 cellspacing=0 style="background: white">
        <tr>
          <td><sc:ThemedImage Margin="4px 8px 4px 8px" ID="DialogIcon" Src="people/32x32/cubes_blue.png" runat="server" Height="32" Width="32" /></td>
            
          <td valign="top" width="100%">
            <div style="padding: 2px 16px 0px 0px;">
              <div style="padding: 0px 0px 4px 0px; font-weight: 600;font-size: 9pt; color: black"><sc:Literal Text="Field Editor" ID="DialogTitle" runat="server" /></div>
              <div style="color: #333333"><sc:Literal ID="DialogText" Text="Edit the fields" runat="server" /></div>
            </div>
          </td>
        </tr>
      </table>
    </div>
    <div class="scMessageBar scWarning" Visible="False" id="WarningRow" runat="server">
      <div class="scMessageBarIcon"></div>
      <div class="scMessageBarTextContainer">
        <sc:Literal class="scMessageBarText" ID="warningText" runat="server"/>
      </div>
    </div>
    <div id="MainPanel" class="scFlexContent" onclick="javascript:scContent.onEditorClick(this, event);">
      <div id="MainContent" class="scStretchAbsolute scMarginAbsolute">
        <sc:Border ID="ContentEditor" runat="server" Class="scEditor" style="margin-top: -1px"/>
      </div>
    </div>
    <div id="FooterRow">
      <div>
        <asp:Literal runat="server" ID="Buttons" />
      </div>
    </div>
  </div>
  <sc:KeyMap runat="server" />
  </form>
</body>
</html>
