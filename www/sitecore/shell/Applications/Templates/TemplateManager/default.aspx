<%@ Page Language="C#" %>
<%@ Import Namespace="Sitecore.Diagnostics"%>
<%@ Import Namespace="Sitecore"%>
<%@ Import namespace="Sitecore.Text"%>
<%@ Import namespace="Sitecore.Web"%>
<%@ Import Namespace="Sitecore.Shell.Applications.Templates.TemplateManager" %>

<script runat="server">
  override protected void OnInit([NotNull] EventArgs e) {
    Assert.ArgumentNotNull(e, "e");
    
    var url = new UrlString(HttpUtility.UrlDecode(WebUtil.GetQueryString()));
    
    var ro = !string.IsNullOrEmpty(url["ro"]) ? url["ro"] : Sitecore.ItemIDs.TemplateRoot.ToString();
    var fo = WebUtil.GetQueryString("id");

    ro = TemplateManagerForm.AlignRootToFolder(ro, fo);
    
    var header = string.Empty;

    var applicationItem = Client.CoreDatabase.GetItem("{32C5C2CD-93A7-4926-A6E0-8BB50BF8B297}");
    if (applicationItem != null) {
      header = applicationItem["Display name"];
    }
    
    if (header.Length == 0) {
      header = "Template Manager";
    }

    var destination = new UrlString("/sitecore/shell/Applications/Content Manager/default.aspx");
    destination["he"] = header;
    destination["pa"] = "0";
    destination["mo"] = "templateworkspace";
    destination["ic"] = "Software/16x16/components.png";
    destination["ro"] = ro;
    destination["fo"] = fo;
    destination["il"] = WebUtil.GetQueryString("il");
    
    Response.Redirect(destination.ToString());
  }
</script>
