<%@ Page Language="C#" AutoEventWireup="false" CodeBehind="FillDB.aspx.cs" Inherits="Sitecore.Buckets.Client.sitecore.admin.FillDB" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head id="Head1" runat="server">
    <title>Fill DB</title>
    <link href="/sitecore/shell/themes/standard/default/WebFramework.css" rel="Stylesheet" />
    <link href="/sitecore/admin/Wizard/UpdateInstallationWizard.css" rel="Stylesheet" />

    <script type="text/javascript" src="/sitecore/shell/Controls/lib/jQuery/jquery.js"></script>

    <script type="text/javascript" src="/sitecore/shell/controls/webframework/webframework.js"></script>
</head>
<body>
    <form id="form1" class="wf-container" runat="server">

        <div style="margin-top: 50px; margin-bottom: 10px; margin-left: 20px">
            <h1>FillDB - Sitecore Item Generator</h1>
            <div class="wf-content">
                <span id="error" class="Error" Visible="False" runat="server"></span>
                <span id="success" Visible="true" runat="server"></span>
            </div>

            <div class="wf-content" style="padding: 2em 100px 0 32px;">
                <h2>Key Settings:</h2>
                <div style="margin-top: 10px; margin-bottom: 10px; margin-left: 20px">
                    Database Name:
                </div>
                <div style="margin-left: 20px">
                    <input type="text" id="database" name="database" style="width: 600px" value="master" runat="server" />
                </div>
                <div style="margin-top: 10px; margin-bottom: 10px; margin-left: 20px">
                    Words Directory:
                </div>
                <div style="margin-left: 20px">
                    <input type="text" id="wordsDir" name="wordsDir" style="width: 600px" value="/data/words" runat="server" />
                </div>
            </div>

            <div class="wf-content" style="padding: 2em 100px 0 32px;">
                <h2>Steps:</h2>

                <div style="margin-left: 20px">
                    <div style="margin: 5px; padding: 5px">
                        <h3>1. Prepare database</h3>
                        <label><input type="checkbox" id="runsql" name="runsql" runat="server" />Run this step</label>                    
                        <div style="margin-top: 10px; margin-bottom: 10px; margin-left: 20px">
                            Script Path:
                        </div>
                        <div style="margin-left: 20px">
                            <input type="text" id="sqlScript" name="sqlScript" style="width: 600px" value="/sitecore/admin/SqlScripts/ItemGenerator.sql" runat="server" />
                        </div>
                    </div>

                    <div style="margin: 5px; padding: 5px">
                        <h3>2. Prepare words directory</h3>
                        <label><input type="checkbox" id="runWordsDir" name="runWordsDir" runat="server" />Run this step</label>
                    </div>

                    <div style="margin: 5px; padding: 5px">
                        <h3>3. Download word files</h3>
                        <label><input type="checkbox" id="runDownloadFiles" name="runDownloadFiles" runat="server" />Run this step</label>
                        <div style="margin-top: 10px; margin-bottom: 10px; margin-left: 20px">
                            We reccomend free text books from <a href="http://www.gutenberg.org/" target="_blank" title="Project Gutenberg">Project Gutenberg</a>
                        </div>
                        <div style="margin-top: 10px; margin-bottom: 10px; margin-left: 20px">
                            File Paths (one per line):
                        </div>
                        <div style="margin-left: 20px">
                            <textarea rows="5" cols="75" id="downloadFiles" name="downloadFiles" runat="server">
http://www.gutenberg.org/files/19033/19033.txt
http://www.gutenberg.org/files/19002/19002.txt
http://www.gutenberg.org/files/36308/36308.txt
</textarea>
                        </div>
                    </div>

                    <div style="margin: 5px; padding: 5px">
                        <h3>4. Clear site caches</h3>
                        <label><input type="checkbox" id="runCacheClear" name="runCacheClear" runat="server" />Run this step</label>
                    </div>

                    <div style="margin: 5px; padding: 5px">
                        <h3>5. Generate Items</h3>
                        <label><input type="checkbox" id="runGenerate" name="runGenerate" runat="server" />Run this step</label>
                         <div style="margin-top: 10px; margin-bottom: 10px; margin-left: 20px">
                             Name Prefix:
                         </div>
                        <div style="margin-left: 20px">
                            <input type="text" id="namePrefix" name="namePrefix" style="width: 600px" value="Auto" runat="server" />
                        </div>
                        <div style="margin-top: 10px; margin-bottom: 10px; margin-left: 20px">
                            Number of items:
                        </div>
                        <div style="margin-left: 20px">
                            <input type="text" id="itemCount" name="itemCount" style="width: 600px" value="100" runat="server" />
                        </div>
                        <div style="margin-top: 10px; margin-bottom: 10px; margin-left: 20px">
                            Template Guid:
                        </div>
                        <div style="margin-left: 20px">
                            <input type="text" id="templateGuid" name="templateGuid" style="width: 600px" value="{76036F5E-CBCE-46D1-AF0A-4143F9B557AA}" runat="server" />
                        </div>
                        <div style="margin-top: 10px; margin-bottom: 10px; margin-left: 20px">
                            Template Fields (one per line):
                        </div>
                        <div style="margin-left: 20px">
                            <textarea rows="5" cols="75" id="templateFields" name="templateFields" runat="server">
{A60ACD61-A6DB-4182-8329-C957982CEC74}
{75577384-3C97-45DA-A847-81B00500E250}</textarea>
                        </div>
                        <div style="margin-top: 10px; margin-bottom: 10px; margin-left: 20px">
                            Max words per field:
                        </div>
                        <div style="margin-left: 20px">
                            <input type="text" id="wordsPerField" name="wordsPerField" style="width: 600px" value="25" runat="server" />
                        </div>
                        <div style="margin-top: 10px; margin-bottom: 10px; margin-left: 20px">
                            Parent Guid:
                        </div>
                        <div style="margin-left: 20px">
                            <input type="text" id="parentGuid" name="parentGuid" style="width: 600px" value="{110D559F-DEA5-42EA-9C1C-8A5DF7E70EF9}" runat="server" />
                        </div>
                    </div>
                    
                     <div style="margin: 5px; padding: 5px">
                        <h3>6. Rebuild Index</h3>
                         <label><input type="checkbox" id="runIndex" name="runIndex" runat="server" />Run this step</label>
                         <div style="margin-top: 10px; margin-bottom: 10px; margin-left: 20px">
                            Index Name (if left blank all indexes will be processed):
                        </div>
                        <div style="margin-left: 20px">
                            <input type="text" id="indexName" name="indexName" style="width: 600px" runat="server" />
                        </div>
                        <div style="margin-top: 10px; margin-bottom: 10px; margin-left: 20px">
                            Index roots (one per line):
                        </div>
                        <div style="margin-left: 20px">
                            <textarea rows="5" cols="75" id="indexRoots" name="indexRoots" runat="server"></textarea>
                        </div>
                     </div>
                </div>
            </div>

            <div class="wf-footer">
                <asp:Button OnClick="ButtonClicked" runat="server" ID="goButton" Text="Go!" />
            </div>
        </div>
    </form>
</body>
</html>
