define(["jquery"], function ($) {
  "use strict";
  return {
    resolve: function() {
      return $('meta[data-sc-name=sitecoreLanguage]').attr("data-sc-content");
    }
  };
});