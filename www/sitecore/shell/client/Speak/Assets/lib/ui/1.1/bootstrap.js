require.config({
  paths: {
      bootstraplib: "/sitecore/shell/client/Speak/Assets/lib/ui/1.1/deps/bootstrap/js/bootstrap.min"
  },
  shim: {
    'bootstraplib': { deps: ['jquery', 'jqueryui'] }
  }
});

define("bootstrap", ["jquery", "bootstraplib", "jqueryui"], function () {
  $.widget.bridge('uitooltip', $.ui.tooltip);
  return true;
});