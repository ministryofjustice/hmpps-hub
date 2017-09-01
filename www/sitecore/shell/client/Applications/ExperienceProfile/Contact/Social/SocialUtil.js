require.config({
  paths: {
    entityService: "/sitecore/shell/client/Services/Assets/lib/entityservice"
  }
});

define(["entityService"], function (entityService) {
  return {
    getEntityService: function (serviceUrl) {
      var service = new entityService({
        url: serviceUrl,
        headers: {
          "X-RequestVerificationToken": $('[name=__RequestVerificationToken]').val(),
          "X-Requested-With": "XMLHttpRequest"
        }
      });

      return service;
    }
  };
});
