<%@ Page Language="C#" %>
<%@ Import Namespace="Sitecore.Diagnostics"%>
<%@ Import Namespace="Sitecore.Text"%>
<%@ Import Namespace="Sitecore"%>
<%@ Import Namespace="Sitecore.Configuration" %>
<%@ Import Namespace="Sitecore.Web" %>
<script language="c#" runat="server">
  override protected void OnInit([NotNull] EventArgs e) {
    Assert.ArgumentNotNull(e, "e");
    
    var url = new UrlString("/sitecore/shell/Applications/Content Manager/default.aspx");

    var header = string.Empty;

    var applicationItem = Client.CoreDatabase.GetItem("{7B2EA99D-BA9D-45B8-83B3-B38ADAD50BB8}");
    if (applicationItem != null) {
      header = applicationItem["Display name"];
    }

    if (header.Length == 0) {
      header = "Media Library";
    }

    url.Add("he", header);
    url.Add("pa", "1");
    url.Add("ic", "Applications/16x16/photo_scenery.png");
    url.Add("mo", "media");
    url.Add("ro", ItemIDs.MediaLibraryRoot.ToString());
    if (WebUtil.GetQueryString(State.Client.UsesBrowserWindowsQueryParameterName) == "1")
    {
      url.Add(State.Client.UsesBrowserWindowsQueryParameterName, "1");
    }
    
    Response.Redirect(url.ToString());   
  }
</script>
