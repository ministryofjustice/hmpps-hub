define(["sitecore"], function (Sitecore) {
  return {
    execute: function (context) {
      Sitecore.Commands.SocialCenter.refreshMessagesCount(context);
    }
  };
});