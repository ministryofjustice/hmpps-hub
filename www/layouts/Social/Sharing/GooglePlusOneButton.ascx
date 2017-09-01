<%@ Control Language="C#" AutoEventWireup="true" Inherits="Sitecore.Social.GooglePlus.Client.Sharing.Controls.GooglePlusOneButton" %>
<%@ Import Namespace="Sitecore.Social.Client.Common.Helpers" %>
<%@ Import Namespace="Sitecore.Data" %>

<%
  var shareButtonId = string.Format("plusOne_{0}", ShortID.NewId());
%>

<div id="<%= shareButtonId %>" style="float: right;">
  <div class="g-plusone" data-size="medium" data-callback="googlePlusOneSubscribe" data-href="<%= SharingHelper.GetSharePageUrlWithAnalyticsParameters(this.CampaignId) %>"></div>
</div>

<!-- Place this tag after the last +1 button tag. -->
<script type="text/javascript">
  (function() {
    var po = document.createElement('script'); po.type = 'text/javascript'; po.async = true;
    po.src = 'https://apis.google.com/js/platform.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(po, s);
  })();
</script>

<script>
  (function () {
    var previous = window.googlePlusOneSubscribe;

    window.googlePlusOneSubscribe = function (jsonParam, that) {
      if (previous) {
        previous.call(this, jsonParam);
      }

      if (jsonParam.state === 'on' && this.vF.parentElement.id === '<%= shareButtonId %>') {
        <%= this.CallbackScript %>
      }
    };
  })();
</script>
