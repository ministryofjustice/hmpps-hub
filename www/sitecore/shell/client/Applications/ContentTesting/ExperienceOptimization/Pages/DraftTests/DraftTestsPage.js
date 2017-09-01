require.config({
  baseUrl: '/sitecore/shell/client/Applications/ContentTesting/Common/lib',
  paths: {
    loadingImage: "/sitecore/shell/client/Sitecore/ContentTesting/LoadingImage"
  }
});

define(["sitecore", "BindingUtil", "EditUtil", "loadingImage"], function (_sc, bindingUtil, editUtil, loadingImage) {
  var DraftTests = _sc.Definitions.App.extend({
    initialized: function () {
      this.TestsList.on("change:selectedItemId", this.selectionChanged, this);

      this.TestsDataSource.set("currentPage", this);

      $(document).ready(function () {
        loadingImage.hideElement();
      });
    },

    selectionChanged: function () {
      var selected = this.TestsList.get("selectedItem");

      var hostUri = selected.get("HostPageUri");
      if (!hostUri) {
        return;
      }

      editUtil.openPageTestPage(hostUri, false, true);
    }
  });

  loadingImage.showElement();
  return DraftTests;
});