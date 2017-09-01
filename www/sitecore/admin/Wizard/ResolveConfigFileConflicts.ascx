<%@ Control Language="C#" AutoEventWireup="true" CodeBehind="ResolveConfigFileConflicts.ascx.cs" Inherits="Sitecore.Update.Wizard.ResolveConfigFileConflicts" %>
<%@ Import Namespace="Sitecore.IO" %>
<%@ Import Namespace="Sitecore.Update.Installer" %>

<link href="/sitecore/admin/Wizard/Lib/jsdifflib/diffview.css" rel="Stylesheet" />

<link href="/sitecore/admin/Wizard/Lib/jquery.ui.1.7.3/jquery-ui.css" rel="Stylesheet" />


<link href="/sitecore/admin/Wizard/ResolveConfigFileConflicts.css" rel="Stylesheet" />

<asp:ScriptManager ID="ScriptManager" runat="server">
</asp:ScriptManager>
<img src="/sitecore/admin/Wizard/Images/ajax-loader.gif" style="position: absolute; top: -1000px;"/>

<asp:MultiView ID="MainMultiView" runat="server" ActiveViewIndex="0">
    <asp:View runat="server" ID="ReviewConflictsView">
        <div class="wf-statebox wf-statebox-warning" style="margin: 2em 0">
            <p style="margin: 0">
                To resolve the changes in a configuration file, click <b>Edit</b>.<br />
                To apply the configuration file changes and analyze the results, click <b>Apply and analyze changes</b>.<br />
                To apply the configuration file changes and then install the upgrade package, click <b>Apply and install package</b>.<br />
            </p>
        </div>

        <div class="conflicts-list-wrapper">
            <asp:GridView runat="server" AutoGenerateColumns="False" ID="ConflictsGrid">
                <Columns>
                    <asp:TemplateField HeaderText="Configuration file">
                        <ItemTemplate>
                            <asp:Label runat="server" ID="ConfigName" Text='<%# FileUtil.UnmapPath(((ContingencyEntry)Container.DataItem).CustomData["TargetFilePath"], false) %>'></asp:Label>
                        </ItemTemplate>
                        <ItemStyle />
                    </asp:TemplateField>
                    <asp:TemplateField HeaderText="Message">
                        <ItemTemplate>
                            <asp:Label runat="server" ID="ShortDescription" Text="<%# ((ContingencyEntry)Container.DataItem).ShortDescription %>"></asp:Label>
                        </ItemTemplate>
                        <ItemStyle />
                    </asp:TemplateField>
                    <asp:TemplateField HeaderText="Action">
                        <ItemTemplate>
                            <asp:LinkButton runat="server" CssClass="edit-link" ID="EditLink" ToolTip="Edit conflict" OnCommand="Edit_OnClick" CommandArgument="<%# Container.DataItemIndex %>" Text="Edit" />
                        </ItemTemplate>
                        <ItemStyle />
                    </asp:TemplateField>
                </Columns>
            </asp:GridView>
        </div>

        <asp:Panel ID="ConflictsGridFooter" class="conflicts-list-footer" runat="server">
            <span id="DownloadPanel" runat="server">
                <asp:LinkButton ID="DownloadLink" runat="server" Text="Download list as a file" OnClick="DownloadLink_OnClick" />
            </span>
        </asp:Panel>
        <div style="clear: both"></div>
    </asp:View>

    <asp:View runat="server" ID="EditConflictView">
        <asp:Panel runat="server" ID="ConflictDetailsWrapper">
            <div id="header">
                <asp:Label runat="server" ID="HeaderText"></asp:Label>
            </div>
            <asp:Panel runat="server" ID="ConflictDetailsPanel">
                <div class="difftitle">Differences between the original file and the customized file</div>
              <div class="diff-wrapper">
                <div class="diff-progress"></div>
                <div id="diffcontainer" class="xmlContainer">
                </div>
              </div>
                <div class="legend-wrapper">
                    <table class="difflegend">
                        <tr>
                            <td class="color">
                                <div class="original"></div>
                            </td>
                            <td class="description">Original file</td>
                            <td class="color">
                                <div class="custom"></div>
                            </td>
                            <td class="description">Customized file</td>
                        </tr>
                    </table>
                </div>
                <div id="PatchWrapper" runat="server">
                    <div class="difftitle">
                        <asp:Label runat="server" ID="PatchTitle">Patch file</asp:Label>
                    </div>
                    <div id="patchcontainer" class="xmlContainer">
                        <asp:TextBox ID="PatchFile" TextMode="MultiLine" runat="server"></asp:TextBox>
                    </div>
                </div>
                <div class="legend-wrapper">
                    <span id="patch-hint">You can edit the patch file in this window</span>
                </div>
                <div class="wf-actionbuttons">
                    <asp:LinkButton ID="btnSkipFile" CssClass="wf-actionbutton" runat="server" OnClick="btnSkipFile_OnClick">
                        <img alt="Skip" src="/~/icon/Applications/32x32/document_warning.png.aspx" />
                        <span  class="wf-title">Skip</span >
                        <span  class="wf-subtitle">Skip this configuration file and manually resolve it later.<br />&nbsp;</span >
                    </asp:LinkButton><!--
                 --><asp:LinkButton ID="btnSaveFile" runat="server" OnClick="btnSaveFile_OnClick" CssClass="wf-actionbutton">
                     <img alt="Resolve" src="/~/icon/Applications/32x32/document_ok.png.aspx" />
                     <span class="wf-title">Resolve</span>
                     <span class="wf-subtitle" runat="server" id="btnSaveFileSubTitle">Save the patch file, and replace the customized file with the original one.</span>
                 </asp:LinkButton>
                </div>
            </asp:Panel>
        </asp:Panel>
    </asp:View>
</asp:MultiView>

<div id="dialog-confirm" title="Warning">
    <table>
        <tr>
            <td>
                <img id="icon-warning" src="/~/icon/Applications/32x32/Warning.png.aspx" alt="">
            <td>
                <div>
                    <span id="text-warning">You have not resolved all the configuration file changes.<br />
                        Do you want to skip them?</span>
                </div>
            </td>
        </tr>
    </table>
</div>

<asp:HiddenField ID="SourceFile" runat="server" />
<asp:HiddenField ID="TargetFile" runat="server" />
<script src="/sitecore/admin/Wizard/Lib/jsdifflib/diffview.js" type="text/javascript"></script>
<script src="/sitecore/admin/Wizard/Lib/jsdifflib/difflib.js" type="text/javascript"></script>
<script src="/sitecore/admin/Wizard/Lib/jquery.ui.1.7.3/jquery-ui.min.js" type="text/javascript"></script>
<script src="/sitecore/admin/Wizard/ResolveConfigFileConflicts.js" type="text/javascript"></script>