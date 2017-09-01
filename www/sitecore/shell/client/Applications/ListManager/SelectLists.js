(function () {
  var dependencies = (typeof window !== "undefined")
    ? ["sitecore", "/-/speak/v1/listmanager/SelectContactListDialog.js"]
    : ["sitecore", "./Dialogs/SelectContactListDialog/SelectContactListDialog"];
  define(dependencies, function (sitecore) {
    var contactListsFilter = "getContactLists";
    return {
      init: function (app) {
        app.insertRendering("{43D7456E-C098-4F42-8805-7D905BA283D9}", { $el: $("body") }, function (showSelectContactListDialog) {
          this["showSelectContactListDialog"] = showSelectContactListDialog;
        });
      },
      SelectContactListByExistingListId: function (callback, excludelists, existingListId) {
        var completed = function (selectedItemId, selectedItem) {
          if (callback) {
            callback(selectedItemId, selectedItem);
          }
        };
        sitecore.trigger("select:contactlists:dialog:show", completed, excludelists, existingListId, contactListsFilter);
      },
      SelectContactListForNewList: function (callback, excludelists) {
        var completed = function (selectedItemId, selectedItem) {
          if (callback) {
            callback(selectedItemId, selectedItem);
          }
        };
        sitecore.trigger("select:contactlists:dialog:show", completed, excludelists, "", contactListsFilter);
      },
      SelectList: function (callback, excludelists) {
        var completed = function (selectedItemId, selectedItem) {
          if (callback) {
            callback(selectedItemId, selectedItem);
          }
        };
        sitecore.trigger("select:contactlists:dialog:show", completed, excludelists);
      }
    };
  });
})();