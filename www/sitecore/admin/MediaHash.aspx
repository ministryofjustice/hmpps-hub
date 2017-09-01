<%@ Page Language="C#" AutoEventWireup="false" Debug="true" %>

<%@ Import Namespace="Sitecore.Sites" %>
<%@ Import Namespace="Sitecore.Resources.Media" %>
<%@ Import Namespace="Sitecore.Text" %>
<script runat="server" language="c#">

  /// <summary>
  /// Page Load event handler.
  /// </summary>
  protected override void OnLoad(EventArgs e)
  {    
    base.OnLoad(e);
    CheckSecurity();
  }

  /// <summary>
  /// Process media URL hash code generation.
  /// </summary>
  public void GenerateButton_Click(object sender, EventArgs e)
  {
    if (!MediaManager.IsMediaUrl(this.MediaURL.Text) || !this.IsValidUri(this.MediaURL.Text))
    {
      this.vldMediaUrl.Text = "The URL you have entered is not a valid Sitecore media URL.";
      this.vldMediaUrl.IsValid = false;
      this.Results.Visible = false;
      return;
    }

    var urlString = new UrlString(this.MediaURL.Text);
    if (urlString.Parameters.AllKeys.Contains(Sitecore.Configuration.Settings.Media.RequestProtection.HashParameterName, StringComparer.InvariantCultureIgnoreCase))
    {
      urlString.Parameters.Remove(Sitecore.Configuration.Settings.Media.RequestProtection.HashParameterName);
    }

    string output = HashingUtils.ProtectAssetUrl(urlString.ToString());

    Results.Visible = true;
    Output.Text = output;
  }

  /// <summary>
  /// Checks the security.
  /// </summary>    
  protected void CheckSecurity()
  {
    if (Sitecore.Context.User.IsAdministrator)
    {
      return;
    }

    SiteContext site = Sitecore.Context.Site;
    string url = (site != null) ? site.LoginPage : string.Empty;
    string pageUrl = string.Format("/sitecore/admin/mediahash.aspx{0}", (string.IsNullOrEmpty(this.Request.QueryString.ToString()) ? string.Empty : "?" + this.Request.QueryString.ToString()));
    url += "?returnUrl=" + this.Server.UrlEncode(pageUrl);
    if (url.Length > 0)
    {
      Response.Redirect(url, true);
    }
  }
  
  /// <summary>
  /// Validates the URI.
  /// </summary>
  private bool IsValidUri(string uri)
  {
    Uri validatedUri;
    return Uri.TryCreate(uri, UriKind.RelativeOrAbsolute, out validatedUri);
  }

</script>
<!DOCTYPE html>

<html>
<head runat="server">
    <title>Media Hash Generator</title>
    <link rel="shortcut icon" href="/sitecore/images/favicon.ico" />
    <link href="https://fonts.googleapis.com/css?family=Open+Sans:400,300italic,400italic,600italic,700italic,300,600,700,800" rel="stylesheet" type="text/css" />
    <link rel="Stylesheet" type="text/css" href="/sitecore/shell/themes/standard/default/WebFramework.css" />
    <script type="text/javascript" src="/sitecore/shell/controls/lib/jQuery/jquery.js"></script>
    <script type="text/javascript" src="/sitecore/shell/controls/lib/jQuery/jquery.watermark.js"></script>
    <script type="text/javascript" src="/sitecore/shell/controls/webframework/webframework.js"></script>
    <script type="text/javascript">
        jQuery.fn.selText = function () {
            var obj = this[0];
            if ($.browser.msie) {
                var range = obj.offsetParent.createTextRange();
                range.moveToElementText(obj);
                range.select();
            } else if ($.browser.mozilla || $.browser.opera) {
                var selection = obj.ownerDocument.defaultView.getSelection();
                var range = obj.ownerDocument.createRange();
                range.selectNodeContents(obj);
                selection.removeAllRanges();
                selection.addRange(range);
            } else if ($.browser.safari) {
                var selection = obj.ownerDocument.defaultView.getSelection();
                selection.setBaseAndExtent(obj, 0, obj, 1);
            }
            return this;
        }
    </script>
</head>
<body>
    <form id="form1" runat="server" class="wf-container">
        <div class="wf-content">
            <h1>Media Hash Generator</h1>
            <p class="wf-subtitle">Lets you generate hash values for dynamic image scaling URLs.</p>
            <p class="wf-subtitle">For example, this is useful when you need a valid media URL with dynamic image scaling parameters for use in a CSS file or a layouts file.</p>
            <div class="wf-configsection">
                <h2>Enter media URL</h2>
                <p>
                    <asp:TextBox ID="MediaURL" runat="server" Width="100%" />
                    <asp:RequiredFieldValidator ID="vldMediaUrl" runat="server" ControlToValidate="MediaURL" ValidateRequestMode="Enabled" EnableClientScript="True" Text="Please enter media URL." ForeColor="Red" />
                </p>
                <p>
                    <asp:Button ID="GenerateButton" OnClick="GenerateButton_Click" runat="server" Text="Generate hash" />
                </p>
            </div>

            <asp:Panel ID="Results" runat="server" Visible="False">
                <div class="wf-configsection">
                    <h2>Result</h2>
                    <p onclick="$(this).selText()">
                        <asp:Literal ID="Output" runat="server"></asp:Literal>
                    </p>
                </div>
            </asp:Panel>
        </div>
    </form>
</body>
</html>
