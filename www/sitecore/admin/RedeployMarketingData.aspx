<%@ Page Language="C#" AutoEventWireup="true" %>

<%@ Import Namespace="Sitecore.Data" %>
<%@ Import Namespace="Sitecore.Data.Items" %>
<%@ Import Namespace="Sitecore.Diagnostics" %>
<%@ Import Namespace="Sitecore.Workflows" %>
<%@ Import Namespace="System" %>
<%@ Import Namespace="System.Collections.Generic" %>
<%@ Import Namespace="Sitecore.Data" %>
<%@ Import Namespace="System.Linq" %>
<%@ Import Namespace="Sitecore.Sites" %>
<%@ Import Namespace="Sitecore" %>
<%@ Import Namespace="Sitecore.Data.Fields" %>
<%@ Import Namespace="Sitecore.Analytics.Configuration" %>
<%@ Import Namespace="Sitecore.Xdb.Configuration" %>
<%@ Import Namespace="Sitecore.PathAnalyzer.Data.Maps" %>
<%@ Import Namespace="Sitecore.PathAnalyzer.Data.Models" %>
<%@ Import Namespace="Sitecore.Configuration" %>
<%@ Import Namespace="Sitecore.Common" %>

<script runat="server">
    
    private readonly Database MasterDatabase = Factory.GetDatabase("master");
    private const string NoSiteContext = "Error: The context website is not available. <br />";

    /// <summary>
    /// Load method for page
    /// </summary>
    /// <param name="sender"></param>
    /// <param name="e"></param>
    public void Page_Load(object sender, EventArgs e)
    {
        CheckSecurity();
    }

    /// <summary>
    /// Starts redeployment
    /// </summary>
    public void Redeploy()
    {
        if (Request.Form["RedeployMaps"] == null)
        {
            return;
        }

        if (Sitecore.Context.Site == null)
        {
            Response.Write(NoSiteContext);
            return;
        }

        var reportDataCache = Sitecore.Caching.CacheManager.FindCacheByName("ReportDataCache");

        if (reportDataCache != null)
        {
            reportDataCache.Clear();
        }

        if (Sitecore.Context.Site.EnableWorkflow)
        {
            DeployMaps();
        }
        else
        {
            var shellContext = SiteContextFactory.GetSiteContext("shell");

            if (shellContext != null)
            {
                using (new SiteContextSwitcher(shellContext))
                {
                    DeployMaps();
                }
            }
        }
    }

    private const string NoMapRepository = "Error: The MapRepository object is not available. <br />";
    private const string NoTreeDefinitionService = "Error: The TreeDefinitionService object is not available. <br />";
    private const string NoMapDefinitionItems = "Error: No maps were found. <br />";
    private const string MapNoWorkflowStateFormat = "Skipped: The {0} ({1}) map does not contain a workflow state field. <br /><br />";
    private const string MapNoWorkflowFormat = "Skipped: The {0} ({1}) map was not deployed. The segment item is not assigned to a workflow. <br /><br />";
    private const string MapWorkflowStateChangedFormat = "The {0} ({1}) map has been moved to a different workflow state. <br />";
    private const string MapIncorrectWorkflowStateFormat = "Skipped: The {0} ({1}) map is not in the <i>Deployed</i> workflow state. <br /><br />";
    private const string MapWorkflowStateNotChangedFormat = "The {0} ({1}) map has not been moved to a different workflow state. <br />";
    private const string MapDeployedFormat = "Deployed: The {0} ({1}) map has been deployed. <br /><br />";
    private const string MapDeployFinishedFormat = "<b> Finished: {0} maps have been deployed sucessfully. {1} maps have been skipped. </b>";

    /// <summary>
    /// Deploys default maps
    /// </summary>
    private void DeployMaps()
    {
        pnlResults.Visible = true;

        var mapRepository = Sitecore.PathAnalyzer.ApplicationContainer.GetMapItemRepository();
        if (mapRepository == null)
        {
            Response.Write(NoMapRepository);
            return;
        }

        var treeDefsService = Sitecore.PathAnalyzer.ApplicationContainer.GetDefinitionService();
        if (treeDefsService == null)
        {
            Response.Write(NoTreeDefinitionService);
            return;
        }

        List<Guid> mapsInRepo = mapRepository.GetAll().Select(m => m.ID.Guid).ToList();

        if (!mapsInRepo.Any())
        {
            Response.Write(NoMapDefinitionItems);
            return;
        }

        List<Guid> mapsInRDb = treeDefsService.GetAllDefinitions().Select(d => d.Id).ToList();

        int processedMaps = 0;
        int skippedMaps = 0;

        var mapIdsToDeploy = mapsInRepo.Where(repoMapId => !mapsInRDb.Any(dbMapId => dbMapId == repoMapId));

        foreach (var mapId in mapIdsToDeploy)
        {
            var mapItem = MasterDatabase.GetItem(mapId.ToID());
            IWorkflow workflow = MasterDatabase.WorkflowProvider.GetWorkflow(mapItem);
            if (workflow == null)
            {
                Response.Write(string.Format(MapWorkflowStateNotChangedFormat, mapItem.Name, mapItem.ID.ToString()));
                Response.Write(string.Format(MapNoWorkflowFormat, mapItem.Name, mapItem.ID.ToString()));
                Response.Flush();

                skippedMaps++;
                continue;
            }

            Field field = mapItem.Fields["__Workflow state"];
            if (field == null)
            {
                Response.Write(string.Format(MapWorkflowStateNotChangedFormat, mapItem.Name, mapItem.ID.ToString()));
                Response.Write(string.Format(MapNoWorkflowStateFormat, mapItem.Name, mapItem.ID.ToString()));
                Response.Flush();

                skippedMaps++;
                continue;
            }

            if (!field.Value.Equals(Sitecore.PathAnalyzer.Constants.WorkflowIDs.InitializingState, StringComparison.OrdinalIgnoreCase))
            {
                mapItem.Editing.BeginEdit();
                field.Value = Sitecore.PathAnalyzer.Constants.WorkflowIDs.InitializingState;
                mapItem.Editing.EndEdit();

                Response.Write(string.Format(MapWorkflowStateChangedFormat, mapItem.Name, mapItem.ID.ToString()));
            }
            else
            {
                Response.Write(string.Format(MapWorkflowStateNotChangedFormat, mapItem.Name, mapItem.ID.ToString()));
                Response.Write(string.Format(MapIncorrectWorkflowStateFormat, mapItem.Name, mapItem.ID.ToString()));
                Response.Flush();

                skippedMaps++;
                continue;
            }

            workflow.Execute(Sitecore.PathAnalyzer.Constants.WorkflowIDs.DeployCommand, mapItem, string.Empty, false);

            Response.Write(string.Format(MapDeployedFormat, mapItem.Name, mapItem.ID.ToString()));
            Response.Flush();

            processedMaps++;
        }

        Response.Write(string.Format(MapDeployFinishedFormat, processedMaps, skippedMaps));
    }

    /// <summary>
    /// Checks the security.
    /// </summary>
    /// <returns></returns>
    protected void CheckSecurity()
    {
        if (Sitecore.Context.User.IsAdministrator)
        {
            return;
        }

        SiteContext site = Sitecore.Context.Site;

        string loginPage = (site != null ? site.LoginPage : string.Empty);

        if (loginPage.Length > 0)
        {
            Response.Redirect(loginPage, true);
        }
    }
</script>

<!DOCTYPE html>

<html>
<head runat="server">
    <title>Redeploy Marketing Data</title>
    <link rel="shortcut icon" href="/sitecore/images/favicon.ico" />
    <link rel="Stylesheet" type="text/css" href="/sitecore/shell/themes/standard/default/WebFramework.css" />
</head>
<body>
    <form id="form2" runat="server" class="wf-container">
        <div class="wf-content">
            <h2>Redeploy maps</h2>
            <p class="wf-subtitle">Redeploy the default Path Analyzer maps and populate the database.</p>
            <p class="wf-subtitle">This process performs two tasks:</p>
            <ol>
                <li>Moves each deployed map that does not have any data in the <i>Analytics</i> database to the <i>Initializing</i> workflow state.</li>
                <li>Redeploys each map.</li>
            </ol>
            <p class="wf-subtitle">
                Note: Only maps that are in the <i>Deployed</i> workflow state and that do not have any data in the <i>Analytics</i> database will be redeployed.
            </p>
            <p>
                <input type="submit" name="RedeployMaps" value="Redeploy maps" />
            </p>

            <asp:Panel ID="pnlResults" runat="server">
                <div class="wf-configsection">
                    <h2><span>Result</span></h2>
                    <p>
                        <% Redeploy(); %>
                    </p>
                </div>
            </asp:Panel>
        </div>
    </form>
</body>
</html>
