(function () {
  var dependencies = (typeof window !== "undefined")
    ? ["sitecore", "/-/speak/v1/listmanager/SelectFolderDialog.js"]
    : ["sitecore", "./Dialogs/SelectFolderDialog/SelectFolderDialog"];
  define(dependencies, function (sitecore) {
    return {
      init: function (app) {
        this.App = app;
        app.insertRendering("{64D170BF-507C-4D53-BB4F-8FC76F5F2BBC}", { $el: $("body") }, function (showSelectFolderDialog) {
          this["showSelectFolderDialog"] = showSelectFolderDialog;
        });
      },
      SelectFolder: function (callback, rootId, selectedItemId, skipItemId) {
        var completed = function (itemId, item) {
          if (callback) {
            callback(itemId, item);
          }
        };
        sitecore.trigger("select:folder:dialog:show", completed, rootId, selectedItemId, skipItemId);
      }
    };
  });
})();