<%@ Page Language="C#" %>
<%@ Import Namespace="Sitecore.Diagnostics"%>
<%@ Import Namespace="Sitecore.Text"%>
<%@ Import Namespace="Sitecore"%>
<%@ Import Namespace="Sitecore.Configuration" %>
<%@ Import Namespace="Sitecore.Web" %>
<meta http-equiv="X-Frame-Options" content="SAMEORIGIN">
<script language="c#" runat="server">
  override protected void OnInit([NotNull] EventArgs e) {
    Assert.ArgumentNotNull(e, "e");

    Assert.CanRunApplication("Analytics/Marketing Control Panel");
    
    var url = new UrlString("/sitecore/shell/Applications/Content Manager/default.aspx");

    var header = string.Empty;

    var applicationItem = Client.CoreDatabase.GetItem("{9BAF0FF0-6D76-4766-B5B6-8D8455BDDC78}");
    if (applicationItem != null) {
      header = applicationItem["Display name"];
    }

    if (header.Length == 0) {
        header = "Marketing Control Panel";
    }
    
    var marketingCenter = Client.ContentDatabase.GetItem(ItemIDs.Analytics.MarketingCenterItem);
    if (marketingCenter == null)
    {
      return;
    }

    url.Add("he", header);
    url.Add("pa", "0");
    url.Add("ic", "People/16x16/megaphone.png");
    url.Add("ro", marketingCenter.ID.ToString());
    if (WebUtil.GetQueryString(State.Client.UsesBrowserWindowsQueryParameterName) == "1")
    {
      url.Add(State.Client.UsesBrowserWindowsQueryParameterName, "1");
    }
    
    url["mo"] = "templateworkspace";
    
    Response.Redirect(url.ToString());   
  }
</script>
