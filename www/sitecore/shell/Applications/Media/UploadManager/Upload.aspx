<%@ Page AutoEventWireup="true" Inherits="Sitecore.Shell.Applications.Media.UploadManager.UploadPage" Language="C#" %>
<%@ Import Namespace="Sitecore.Globalization" %>
<%@ Register Assembly="Sitecore.Kernel" Namespace="Sitecore.Web.UI.HtmlControls" TagPrefix="sc" %>
<%@ Register Assembly="Sitecore.Kernel" Namespace="Sitecore.Web.UI.WebControls" TagPrefix="sc" %>
<!DOCTYPE html>
<html >
<head runat="server">
  <title>Sitecore</title>
  <sc:Head runat="server" />
  <sc:Script runat="server" Src="/sitecore/shell/Controls/Sitecore.Runtime.js"/>
  <sc:Script runat="server" Src="/sitecore/shell/Applications/Media/UploadManager/Upload.aspx.js"/>
  <link href="/sitecore/shell/themes/standard/default/Dialogs.css" rel="stylesheet">
  
  <style type="text/css">
    form { height:100%; }
    #Grid { height:100% }
    #FileListCell { height:100%; vertical-align:top }
    #FileList {
      background:white; 
      border:1px solid #e3e3e3; 
      height:100%; 
      padding:5px 10px 5px; 
      overflow: auto; 
      margin-top: 10px;
    }
    #FileList input {  
      width:100%; 
      margin: 5px 0;
    }
    #Buttons { vertical-align:bottom }
    #HeadTable { background:white; position:relative }
    #OptionTableWrapper {
      position: relative; 
      bottom: 165px; 
      margin: 0 15px; 
      overflow: hidden; 
      text-align:right;
      line-height: 1.7em;
    }
    #OptionTableWrapper table { white-space: nowrap;text-align: left;}
    #FileListWrapper {
      width: 100%; 
      height: 100%; 
      -webkit-box-sizing: border-box; 
      -moz-box-sizing: border-box; 
      box-sizing: border-box; 
      padding: 15px 15px 220px 15px;
    }
    td label { white-space: nowrap;}
    
  </style>
  
</head>
<body>
  <form id="UploadForm" runat="server" enctype="multipart/form-data" target="SitecoreUpload">
    <input id="Uri" runat="server" name="Item" type="hidden" value="" />
    <input id="Folder" runat="server" name="Path" type="hidden" value="" />
    <input id="Uploading" runat="server" type="hidden" value="1" />
    <input id="UploadedItems" runat="server" type="hidden" value="" />
    <input id="UploadedItemsHandle" runat="server" type="hidden" value="" />
    <input id="ErrorText" runat="server" type="hidden" value="" />
    

        <table id="HeadTable" border="0" cellpadding="0" cellspacing="0" width="100%">
          <tr>
            <td valign="top">
            </td>
            <td valign="top" width="100%">
              <div class="scFormDialogHeader">
                <div class="DialogHeader">
                  <sc:Literal runat="server" Text="Batch Upload"/>
                </div>
                <div class="DialogHeaderDescription">
                  <sc:Literal runat="server" Text="Choose the file that you want to upload. You can select as many files as you want."/>
                </div>
              </div>
            </td>
          </tr>
        </table>

              <div id="FileListWrapper">
                <sc:Literal runat="server" Text="Select the files to upload here:" Style="font-size:14px;"/>
                <div id="FileList">
                    <input id="File0" name="File0" type="file" value="browse" onchange="javascript:return Sitecore.Upload.change(this)"/>
                </div>
              </div>

            
        <div id="OptionTableWrapper">
            <table border="0" cellpadding="0" cellspacing="0" width="100%">
              <tr>
                <td>
                  <input id="Unpack" name="Unpack" type="checkbox" value="1" /><label for="Unpack"><sc:Literal runat="server" Text="Unpack ZIP archives"></sc:Literal></label>
                </td>
                <td>
                  <input runat="server" id="Versioned" name="Versioned" type="checkbox" value="1" /><label for="Versioned"><sc:Literal runat="server" Text="Make uploaded media items versionable"></sc:Literal></label>
                </td>
              </tr>
              <tr>
                <td runat="server" id="OverwriteCell">
                  <input runat="server" id="Overwrite" name="Overwrite" type="checkbox" value="1" /><label for="Overwrite"><sc:Literal runat="server" Text="Overwrite existing media items"></sc:Literal></label>
                </td>
                <td runat="server" id="AsFilesCell">
                  <input runat="server" id="AsFiles" name="AsFiles" type="checkbox" value="1" /><label for="AsFiles"><sc:Literal runat="server" Text="Upload as files"></sc:Literal></label>
                </td>
              </tr>
            </table>
            <input id="Upload" class="scButton scButtonPrimary" type="Submit" value='<%= Translate.Text("Upload")  %>' />
        </div>
  </form>
</body>
</html>
