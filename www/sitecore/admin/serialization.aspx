<%@ Page Language="C#" AutoEventWireup="true" %>
<%@ Import Namespace="System.Linq" %>
<%@ Import Namespace="Sitecore.StringExtensions"%>
<%@Import Namespace="System.IO"%>
<%@Import Namespace="Sitecore.Data"%>
<%@Import Namespace="Sitecore.Configuration"%>
<%@Import Namespace="Sitecore.Data.Serialization"%>
<%@Import Namespace="Sitecore.Data.Serialization.Presets"%>
<%@Import Namespace="Sitecore.Diagnostics"%>
<%@Import Namespace="Sitecore.Sites"%>
<script runat="server">

   readonly string[] builtins = new[] { "master", "core" };
   string[] selected;
   StringBuilder response = new StringBuilder();

    public void Page_Load(object sender, EventArgs e)
    {
       CheckSecurity();

       if (Request.Form["select"] != null)
       {
          selected = Request.Form.GetValues("select");
       }
       else
       {
          selected = builtins;
       }

       if (Request.Form["dump"] != null)
       {
          foreach (string name in selected)
          {
             response.Append(name);
             try {
               Database db = Factory.GetDatabase(name);
               Manager.DumpTree(db.GetRootItem());
               response.Append(" OK<br/>");
             }
             catch (Exception ex) {
               response.Append("<textarea class='exception'>" + ex + "</textarea><br/>");
             }
          }
       }
       else if (Request.Form["dump2"] != null)
       {
          Manager.DumpSet(PresetFactory.Create(Factory.GetConfigNode("serialization/default")));
       }
       else if (Request.Form["update"] != null || Request.Form["revert"] != null)
       {
          foreach (string name in selected)
          {
             response.Append(name);
             var options = new Sitecore.Data.Serialization.LoadOptions();
             options.ForceUpdate = Request.Form["revert"] != null;
             Manager.LoadTree(Path.Combine(PathUtils.Root, name), options);
             response.Append(" OK<br/>");
          }
       }
       else if (Request.Form["update path"] != null)
       {
          string path = Request.Form["updatePathText"];
          Assert.IsNotNullOrEmpty(path, "path");

          string fullpath = Path.Combine(PathUtils.Root, path);
          response.Append(fullpath);

          Manager.LoadTree(fullpath, new Sitecore.Data.Serialization.LoadOptions());
          response.Append(" OK <br/>");
       }
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

       string loginPage = (site != null ? site.LoginPage : "");

       if (loginPage.Length > 0)
       {
          Response.Redirect(loginPage, true);
       }
    }

    protected string WriteResultBox(string result)
    {
      if (string.IsNullOrEmpty(result))
      {
        return string.Empty;
      }
      
      string className = result.Contains("exception") ? "wf-statebox-error" : "wf-statebox-success";

      return "<div class='wf-statebox {0}'>{1}</div>".FormatWith(className, result);
    }

</script>
<!DOCTYPE html>
<html>
<head runat="server">
  <title>Serialize and revert databases</title>
  <link rel="shortcut icon" href="/sitecore/images/favicon.ico" />
  <link href="https://fonts.googleapis.com/css?family=Open+Sans:400,300italic,400italic,600italic,700italic,300,600,700,800" rel="stylesheet" type="text/css" />
  <link rel="Stylesheet" type="text/css" href="/sitecore/shell/themes/standard/default/WebFramework.css" />
  
  <script type="text/javascript" src="/sitecore/shell/controls/lib/jQuery/jquery.js"></script>
  <script type="text/javascript" src="/sitecore/shell/controls/lib/jQuery/jquery.watermark.js"></script>
  <script type="text/javascript" src="/sitecore/shell/controls/webframework/webframework.js"></script>

  <script type="text/javascript">
    function scUpdateDatabaseNames() {
      var names = "";

      $("input[type=checkbox]:checked").each(function() {
        if (names.length > 0) {
          names += ", ";
        }

        names += $(this).attr("value");
      });

      names = "{" + names + "}";

      $("input[type=submit]").val(function(index, value) {
        return value.replace("selected", names).replace(/\{.*\}/, names);
      });
    }

    $(document).ready(function() {
      scUpdateDatabaseNames();

      $("input[type=checkbox]").change(scUpdateDatabaseNames);
    });

  </script>
  
  <style type="text/css">
    .databases .database 
    {
      margin-top: 0.5em;
    }
    
    #updatePathText
    {
      width: 300px;
    }
    
    .wf-configsection
    {
      margin-bottom: 2em;
    }
    
    .exception
    {
      width: 100%;
      height: 120px;
    }
    
    .wf-statebox
    {
      max-height: 500px;
    }
  </style>
</head>
<body>
  <form id="form1" class="wf-container" runat="server">
    <div class="wf-content">
      <h1>Serialize and revert databases</h1>
      <p class="wf-subtitle">Synchronize Sitecore databases with filesystem.</p>
      
      <%= this.WriteResultBox(response.ToString()) %>
    
      <div class="wf-configsection databases">
        <h2>Select databases</h2>

        <% foreach (string name in Factory.GetDatabaseNames().Where(name => name != "filesystem")) { %>
        <div class="database">

          <input type="checkbox" id="<%= name %>_checkbox" name="select" value="<%=name %>" 
             <% if (Array.IndexOf(selected, name) >= 0) {%> 
               checked="checked" 
             <% } %> /><label for="<%= name %>_checkbox"><%= name %></label> 
        </div>
        <% } %>        
      </div>
      
      <div class="wf-configsection">
        <h2>Serialize databases</h2>
        <p><input id="dump" name="dump" type="submit" value="Serialize selected databases" /></p>
        <p><input id="dump2" name="dump2" type="submit" value="Serialize preconfigured"/></p>
      </div>
      
      <div class="wf-configsection">
        <h2>Update</h2>
        <p><input id="update" name="update" type="submit" value="Update selected databases" /></p>
        <p><input id="revert" name="revert" type="submit" value="Revert selected databases" /></p>
        <p>
           <input placeholder="Sitecore path to update" name="updatePathText" id="updatePathText" type="text" />
           <input id="updatepath" name="update path" type="submit" value="Update specific path" />
        </p>
      </div>
    </div>
  </form>
</body>
</html>
