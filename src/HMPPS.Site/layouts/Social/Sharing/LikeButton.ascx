<%@ Control Language="C#" AutoEventWireup="true" Inherits="Sitecore.Social.Facebook.Client.Sharing.Controls.LikeButton" %>
<%@ Import Namespace="Sitecore.Social.Client.Common.Helpers" %>
<%@ Import Namespace="Sitecore.Data" %>

<%
  var shareButtonId = string.Format("likeButton_{0}", ShortID.NewId());
%>

<script>(function (d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) return;
  js = d.createElement(s); js.id = id;
  js.src = "//connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.6";
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));</script>

<div style="float: right;">
  <div id="<%= shareButtonId %>" class="fb-like" data-href="<%= SharingHelper.GetSharePageUrlWithAnalyticsParameters(this.CampaignId) %>" data-layout="button_count" data-action="like" data-show-faces="true" data-share="false"></div>
</div>

<script>
  (function () {
    var previous = window.fbAsyncInit;
    window.fbAsyncInit = function () {
      if (previous) {
        previous();
      }

      FB.Event.subscribe('edge.create', function (response, target) {
        if (target.id === '<%= shareButtonId %>') {
          <%= this.CallbackScript %>
        }
      });
    };
  })();
</script>
