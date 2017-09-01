define(["sitecore"], function (Sitecore) {
  var galleryHeight = {
    galleryOptionsHeight: function () {
      var outerHeight = 0;
      $(".sc-gallery-options").each(function () {
        outerHeight += $(this).outerHeight(true);
      });

      return outerHeight;
    }
  };

  window.setTimeout(function() {
    $(".sc-gallery-content").height($(document).height() - galleryHeight.galleryOptionsHeight());
  }, 200);
});