<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="default.aspx.cs" Inherits="Sitecore.Shell.Applications.PageScreenshots.Default" %>
<%@ Import Namespace="Sitecore.Configuration" %>
<%@ Import Namespace="Sitecore.Globalization" %>

<!DOCTYPE html>

<html>
<head runat="server">
    <title></title>
    <link href="https://fonts.googleapis.com/css?family=Open+Sans:400,300italic,400italic,600italic,700italic,300,600,700,800" rel="stylesheet" type="text/css" />
    <link rel="Stylesheet" type="text/css" href="screenshots.css" />
    <link rel="Stylesheet" type="text/css" href="/sitecore/shell/Controls/Lib/Chosen/chosen.css" />
    <script type="text/javascript" src="/sitecore/shell/Controls/Lib/JSON/JSON2.min.js"></script>
    <script type="text/javascript" src="/sitecore/shell//Controls/Lib/jQuery/jquery.noconflict.js"></script>   
    <script type="text/javascript" src="/sitecore/shell/Controls/Lib/Chosen/chosen.jquery.js"></script>
    <script type="text/javascript" src="/sitecore/shell/Controls/Lib/jQuery/jquery.tmpl.min.js"></script>
    <script type="text/javascript" src="/sitecore/shell/Applications/Page Modes/Utility.js"></script> 
    <script type="text/javascript" src="/sitecore/shell/Controls/Lib/jQuery/jquery.scextensions.js"></script>          
    <script type="text/javascript" src="/sitecore/shell/Controls/Lib/iso8601/iso8601.min.js"></script>
    <script type="text/javascript" src="/sitecore/shell/Controls/Lib/Console/ConsoleStub.js"></script>
    <script type="text/javascript">
      var updatePreviewInterval = <%= Sitecore.Configuration.Settings.GetLongSetting("PagePreview.PreviewUpdateInterval", 20000) %>;
      var scTexts = {
        noDevicesAvailable : "<%= Translate.Text(Sitecore.Texts.Nodevicesavailable) %>",
        previewWillAppearSoon : "<%= Translate.Text(Sitecore.Texts.PleasewaitThepreviewwillappearheresoon) %>",
        previewIsNotAvailable: "<%= Translate.Text(Sitecore.Texts.Thepreviewisnotavailable) %>"
      };    
    </script>
    <script type="text/javascript" src="screenshots.js"></script>
    <script id="sessionTmpl" defer="defer" type="text/x-jquery-tmpl">
      <div class="session" id="${Id}">
           <div class="session-header"><span title="${$item.formatDateTime(Date)}">${$item.formatDate(Date)}</span>(${$item.data.Results.length})</div>
           <div class="screenshots-container">
             {{each Results}}
                <div data-client-id="${$value.PreviewClient.Id}" class="tile-container ${$value.State || "Complete"}">
                  <div class="tile" data-full-image="${$item.getPreviewImageUrl($value)}">
                    <div class="thumbnail" style="background-image:${$item.getThumbnailBackgroundImage($value)}">
                    </div>                                   
                    <div class="text">
                      ${$value.PreviewClient.Name}
                    </div>
                  </div>
                </div>
             {{/each}}
           </div>              
        </div>
    </script>
</head>
<body>    
    <form id="form1" runat="server">
    <div class="top">
      <div class="top-inner">
      <table class="controls" cellpadding="0" cellspacing="0">
        <tr class="header">
          <td valign="middle">
            <img class="dialog-icon" src="/sitecore/shell/~/icon/applicationsV2/24x24/find.png.ashx" /> <asp:Literal runat="server" ID="dialogHeader" /> 
          </td>  
        </tr>

        <tr class="toolbar">
          <td valign="middle">
            <table id="takeScreenshotToolbar" runat="server" cellpadding="0" cellspacing="0">
              <tr>                                            
                <td id="devicesCell">        
                  <img alt='' src="/sitecore/images/blank.gif" class='crosspiece' /> 
                  <select id="devices" style="display:none" data-placeholder="<%= Translate.Text(Sitecore.Texts.SelectadeviceHoldtheCtrLkeytoselectmultipleitems)%>" multiple="multiple" size="3">                 
                  </select>                                 
                  <span id="deviceEmptyListText" style="display:none">
                    <%= Translate.Text(Sitecore.Texts.Pleasewaitwhilethedeviceslistisbeingpopulated)%>
                  </span>       
                </td>

                 <td>
                  <div id="takeScreenshotsButton" class="action-button action-disabled">
                    <span class="text"><%= Translate.Text(Sitecore.Texts.TakeScreenshots)%></span>          
                  </div>                   
                </td>
              </tr>        
            </table>

            <table cellpadding="0" cellspacing="0" id="fullPreviewToolbar">
              <tr>
                <td>
                  <a id="backButton" href="javascript:void(0)">
                    <%= Translate.Text(Sitecore.Texts.BacktoScreenshotsList)%>           
                  </a>
                </td>

                <td align="center" valign="middle">                               
                  <span id="previewDisplayName"></span>
                </td>

                <td align="right" valign="middle">
                  <a class="nav-link" id="prev" href="javascript:void(0)"><%= Translate.Text(Sitecore.Texts.Previous)%></a>
                  <span class="delimeter">|</span>
                  <a class="nav-link" id="next" href="javascript:void(0)"><%= Translate.Text(Sitecore.Texts.Next)%></a>
                </td>
              </tr>
            </table>
          </td>        
        </tr>

      </table> 
      </div>    
    </div>
    
    <div class="notifications" runat="server" id="notifications">
    </div>

    <div class="center">             
        <div id="RecentSessions">        
        </div>
      
        <table runat="server" cellpadding="0" cellspacing="0" visible="false" id="welcomeText">
          <tr>
            <td valign="middle" align="center">
              <p><%= Translate.Text(Sitecore.Texts.ThePag)%></p> 
              <p><%= Translate.Text(Sitecore.Texts.Therearenoscreenshotsye)%></p>
           </td>
          </tr>
        </table>

        <div id="fullImagePreview">        
           <div id="waitImageText"> </div>                           
        </div>
    </div>
    </form>      
</body>
</html>
