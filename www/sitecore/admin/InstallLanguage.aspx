<%@ Page Language="C#" AutoEventWireup="true" %>

<%@ Import Namespace="Sitecore.Globalization" %>
<%@ Import Namespace="Sitecore.Sites" %>
<%@ Import Namespace="Sitecore" %>
<%@ Import Namespace="Sitecore.Configuration" %>
<%@ Import Namespace="Sitecore.Data.Managers" %>
<%@ Import Namespace="Sitecore.IO" %>
<%@ Import Namespace="Sitecore.Data.Items" %>
<%@ Import Namespace="Sitecore.Data" %>
<%@ Import Namespace="System.Threading.Tasks" %>
<%@ Import Namespace="Sitecore.ContentSearch" %>
<%@ Import Namespace="Sitecore.Publishing" %>
<%@ Import Namespace="Sitecore.Xml" %>
<%@ Import Namespace="System.Xml" %>
<%@ Import Namespace="Sitecore.Web" %>
<%@ Import Namespace="Sitecore.Diagnostics" %>

<script runat="server">  
    private const string ConfigFilePath = @"/App_Config/Include/Sitecore.DefaultLanguage.config";
    private const string LanguageIsAlreadyInstalled = "The language you selected is already installed.";
    private const string LanguageWasInstalledSuccessfully = "The language was installed successfully.";
    private const string LanguageWasNotInstalled = "The language was not installed. See the log file for details.";
    private const string LogErrorMessage = "An exception occured during execution InstallLanguage.aspx";

    /// <summary>
    /// Handles OnInit event.
    /// </summary>
    /// <param name="e">Parameter object.</param>
    protected override void OnInit(EventArgs e)
    {
        foreach (var definition in LanguageDefinitions.Definitions)
        {
            var cultureInfo = Language.CreateCultureInfo(definition.Name);
            var listItem = new ListItem(Language.GetDisplayName(cultureInfo), definition.Name);
            this.languagesDropDown.Items.Add(listItem);
        }

        base.OnInit(e);
    }

    /// <summary>
    /// Handles Page Load event.
    /// </summary>
    /// <param name="sender">Sender object.</param>
    /// <param name="e">Parameter object.</param>
    protected void Page_Load(object sender, EventArgs e)
    {
        this.CheckSecurity();

        if (this.IsPostBack)
        {
            return;
        }

        if (!string.IsNullOrEmpty(Request.QueryString["Language"]))
        {
            string languageCode = Request.QueryString["Language"];
            bool republish = false, rebuildLinks = false, rebuildIndexes = false, setAsDefault = false;

            if (!string.IsNullOrEmpty(Request.QueryString["Republish"]))
            {
                bool.TryParse(Request.QueryString["Republish"], out republish);
            }

            if (!string.IsNullOrEmpty(Request.QueryString["RebuildLinks"]))
            {
                bool.TryParse(Request.QueryString["RebuildLinks"], out rebuildLinks);
            }

            if (!string.IsNullOrEmpty(Request.QueryString["RebuildIndexes"]))
            {
                bool.TryParse(Request.QueryString["RebuildIndexes"], out rebuildIndexes);
            }

            if (!string.IsNullOrEmpty(Request.QueryString["SetAsDefault"]))
            {
                bool.TryParse(Request.QueryString["SetAsDefault"], out setAsDefault);
            }

            this.DoInstallLanguage(languageCode, republish, rebuildLinks, rebuildIndexes, setAsDefault);
        }
    }

    /// <summary>
    /// Handles button click event.
    /// </summary>
    /// <param name="sender">Sender object.</param>
    /// <param name="e">Parameter object.</param>
    protected void btnInstallLanguage_Click(object sender, EventArgs e)
    {
        if (this.IsPostBack)
        {
            this.DoInstallLanguage(
                this.languagesDropDown.SelectedValue,
                this.checkBoxRepublish.Checked,
                this.checkBoxRebuildLinks.Checked,
                this.checkBoxRebuildIndexes.Checked,
                this.checkBoxEnableConfig.Checked);
        }
    }

    /// <summary>
    /// Install language to master database and performs needed activities.
    /// </summary>
    /// <param name="languageCode">Language code.</param>
    /// <param name="republish">Whether need to republish.</param>
    /// <param name="rebuildLinks">Whether need to rebuild links.</param>
    /// <param name="rebuildIndexes">Whether need to rebuild indexes.</param>
    /// <param name="setAsDefault">Whether need to set as default language.</param>
    private void DoInstallLanguage(string languageCode, bool republish, bool rebuildLinks, bool rebuildIndexes, bool setAsDefault)
    {
        try
        {
            var masterDb = Factory.GetDatabase("master");
            var webDb = Factory.GetDatabase("web");

            if (LanguageManager.IsLanguageNameDefined(masterDb, languageCode))
            {
                this.ShowResult(false, LanguageIsAlreadyInstalled);
            }
            else
            {
                var languageDefinition = LanguageDefinitions.Definitions.FirstOrDefault(x => x.Name == languageCode);
                if (languageDefinition == null || !this.CreateLanguage(languageDefinition, masterDb))
                {
                    this.ShowResult(false, LanguageWasNotInstalled);
                    return;
                }

                if (republish)
                {
                    var language = LanguageManager.GetLanguage(languageCode, masterDb);
                    this.Publish(masterDb, webDb, language);
                }

                if (rebuildLinks)
                {
                    this.RebuildLinkDatabase(new List<Database>
                    {
                        masterDb,
                        webDb
                    });
                }

                if (rebuildIndexes)
                {
                    this.RebuildIndexes();
                }

                if (setAsDefault)
                {
                    string configFilePath = FileUtil.MapPath(ConfigFilePath);
                    var document = XmlUtil.LoadXmlFile(configFilePath);
                    this.PatchChildNodes(document, languageCode);
                    document.Save(configFilePath);
                }
                this.ShowResult(true, LanguageWasInstalledSuccessfully);
            }
        }
        catch (Exception ex)
        {
            Log.Error(LogErrorMessage, ex, this.GetType());
            this.ShowResult(false, LanguageWasNotInstalled);
        }
    }

    /// <summary>
    /// Pathces language config file.
    /// </summary>
    /// <param name="node">The node.</param>
    /// <param name="languageCode">The language code</param>
    private void PatchChildNodes(XmlNode node, string languageCode)
    {
        foreach (XmlNode child in node.ChildNodes)
        {
            if (!child.HasChildNodes)
            {
                child.Value = languageCode;
            }
            else
            {
                this.PatchChildNodes(child, languageCode);
            }
        }
    }

    /// <summary>
    /// Creates language in the database.
    /// </summary>
    /// <param name="languageDefinition"></param>
    /// <param name="database"></param>
    /// <returns></returns>
    private bool CreateLanguage(LanguageDefinition languageDefinition, Database database)
    {
        TemplateItem languageTemplate = database.Templates[TemplateIDs.Language];
        Item root = database.GetItem(ItemIDs.LanguageRoot);

        if (root == null)
        {
            return false;
        }

        Item language = root.Add(languageDefinition.Name, languageTemplate);

        if (language == null)
        {
            return false;
        }

        language.Editing.BeginEdit();

        language["Regional ISO Code"] = languageDefinition.Name;
        language["ISO"] = languageDefinition.Id;
        language["Code page"] = languageDefinition.CodePage;
        language["Encoding"] = languageDefinition.Encoding;
        language["Charset"] = languageDefinition.CharSet;
        language["Dictionary"] = languageDefinition.Spellchecker;

        language.Appearance.Icon = languageDefinition.Icon;

        language.Editing.EndEdit();

        return true;
    }

    /// <summary>
    /// Rebuild indexes.
    /// </summary>
    private void RebuildIndexes()
    {
        Parallel.ForEach(ContentSearchManager.Indexes, index => index.Rebuild());
    }

    /// <summary>
    /// Publishes specific language form source to target database.
    /// </summary>
    /// <param name="dbSource">Source database.</param>
    /// <param name="dbTarget">Target database.</param>
    /// <param name="language">Language that should be published.</param>
    private void Publish(Database dbSource, Database dbTarget, Language language)
    {
        var options = new PublishOptions(dbSource, dbTarget, PublishMode.Full, language, DateTime.Now) { Deep = true, CompareRevisions = false };
        var publisher = new Publisher(options);

        publisher.Publish();
    }

    /// <summary>
    /// Rebuilds link database.
    /// </summary>
    /// <param name="databases">List of databases to rebuild.</param>
    private void RebuildLinkDatabase(IEnumerable<Database> databases)
    {
        Parallel.ForEach(databases, db => Globals.LinkDatabase.Rebuild(db));
    }

    /// <summary>
    /// Checks the security.
    /// </summary>
    private void CheckSecurity()
    {
        if (Sitecore.Context.User.IsAdministrator)
        {
            return;
        }

        SiteContext site = Sitecore.Context.Site;

        string loginPage = (site != null ? site.LoginPage : string.Empty);

        if (loginPage.Length > 0)
        {
            string redirectUrl = WebUtil.AddQueryString(loginPage, "returnUrl", Request.Url.LocalPath);
            Response.Redirect(redirectUrl, true);
        }
    }

    /// <summary>
    /// Shows operation result.
    /// </summary>
    /// <param name="success">Whether operation was success.</param>
    /// <param name="message">Result message.</param>
    private void ShowResult(bool success, string message)
    {
        this.resultBox.Visible = true;
        this.resultBox.Attributes["class"] = string.Format("wf-statebox {0}", success ? "wf-statebox-success" : "wf-statebox-error");
        this.resultText.Text = message;
    }
</script>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title>Install language</title>
    <link rel="shortcut icon" href="/sitecore/images/favicon.ico" />
    <link rel="Stylesheet" type="text/css" href="/sitecore/shell/themes/standard/default/WebFramework.css" />
    <style type="text/css">
        .wf-configsection
        {
            margin-bottom: 2em;
        }

            .wf-configsection h2
            {
                margin-bottom: 1em;
            }

        .action
        {
            margin-top: 1em;
        }

        #button-container {
            margin-top: 3em;
        }
    </style>
</head>
<body>
    <form id="installLanguageForm" runat="server" class="wf-container">
        <div class="wf-content">
            <h1>Install a language</h1>
            <p class="wf-subtitle">
                Install a new language for your content in Sitecore.
                <br />
                The server will restart when the installation has finished.
            </p>

            <div class="wf-statebox" id="resultBox" runat="server" visible="False">
                <asp:Literal runat="server" ID="resultText"></asp:Literal>
            </div>

            <div class="wf-configsection">
                <h2><span>Select language</span></h2>
                <asp:DropDownList runat="server" ID="languagesDropDown" EnableViewState="False" />
                <div class="action">
                    <asp:CheckBox runat="server" ID="checkBoxRebuildIndexes" Text="Rebuild indexes" Checked="True" />
                </div>
                <div class="action">
                    <asp:CheckBox runat="server" ID="checkBoxRepublish" Text="Republish master database" Checked="True" />
                </div>
                <div class="action">
                    <asp:CheckBox runat="server" ID="checkBoxRebuildLinks" Text="Rebuild link databases" Checked="True" />
                </div>
                <div class="action">
                    <asp:CheckBox runat="server" ID="checkBoxEnableConfig" Text="Run the website and the Sitecore UI in this language" Checked="True" />
                </div>
            </div>

            <div id="button-container">
                <asp:Button runat="server" ID="btnInstallLanguage" Text="Install" OnClick="btnInstallLanguage_Click" />                    
            </div>
        </div>
    </form>
</body>
</html>
