define(["sitecore", "/-/speak/v1/experienceprofile/DataProviderHelper.js", "/-/speak/v1/experienceprofile/CintelUtl.js"], function (sc, providerHelper, cintelUtil)
{
  var app = sc.Definitions.App.extend({
    initialized: function () {
      cintelUtil.removeBreadCrumbLastLink(this.Breadcrumb);

      var cid = decodeURIComponent(cintelUtil.getQueryParam("cid"));
      if (!cid) {
        return;
      }
   
      var notificationMessage = this.NotFoundMessageBarText.get("text").replace("{0}", cid);
      this.ContactNotFoundMessageBar.addMessage("notification", notificationMessage);
    },

    findContacts: function () {
      window.location.assign('search?text=' + encodeURIComponent(this.SearchTextBox.get('text')));
    }
  });
  return app;
});

