define(["sitecore"], function (sc) {
  return sc.Definitions.App.extend({
    initialized: function () {
    },
    
    showContact: function()
    {
      window.location.assign("contact?cid=" + this.contactId);
    }
  });
});