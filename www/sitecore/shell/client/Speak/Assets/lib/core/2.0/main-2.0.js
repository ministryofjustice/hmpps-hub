(function (global) {
 define("GlobalizeLib", ['Globalize'], function( globalize ){
    window.Globalize = globalize;
    return globalize;
  });

  //backward compatibility
  define("sitecore", function () {
    window._sc = window.Sitecore.Speak;
    return window.Sitecore.Speak;
  } );

  define( "HandlebarsLib", function ( handlebars ) {
      window.Handlebars = handlebars;
      return handlebars;
  } );

  require( ["Sitecore", "performance", "scSpeakPresenter", "jquery", "underscore"], function ( Sitecore, performanceUtil ) {
      if (Sitecore.isDebug()) {
          performanceUtil.enablePerformanceTracking();
      }
    Sitecore.init();
  });
})(this);
