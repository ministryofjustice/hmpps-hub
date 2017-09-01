define(["jquery", "sitecore"], function ($, Sitecore) {
  var KickUser = Sitecore.Definitions.App.extend({
    initialized: function () {

      this.on("action:kick", function () {
        var sessionId = this.KickUserList.get("selectedItemId");
        if (sessionId === "")
          return;
        this.kickSelectedUser(sessionId);
      }, this);
    },
    kickSelectedUser: function (sessionId) {
      
      $.ajax({
        url: "/api/sitecore/DomainAccessGuard/KickUser",
        type: "POST",
        data: "sid=" + sessionId,
        success: $.proxy(this.success, this),
        error: $.proxy(this.error, this)
      });
    },
    success: function (data) {
      window.location = data.Message;
    },
    error: function (data) {
      
    }
  });

  return KickUser;
});