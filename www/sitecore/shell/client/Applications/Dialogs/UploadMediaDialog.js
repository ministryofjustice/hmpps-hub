define(["sitecore"], function (Sitecore) {
  var UploadMediaDialog = Sitecore.Definitions.App.extend({
    initialized: function () {

      this.ConfirmButton.on("click", function () {

        var selectedItemsPropertyName = "selectedNode",
          sourceProperty = "itemUri",
          selectedItemData,
          rootItemPath,
          folderItemPath,
          destinationFolderDisplayValue,          
          queryParameters = Sitecore.Helpers.url.getQueryParameters(window.location.href),          
          showFullPath = this.getShowFullPath(queryParameters);

        if (typeof this.TreeView.get(selectedItemsPropertyName) !== 'undefined' && sourceProperty in this.TreeView.get(selectedItemsPropertyName)) {
          selectedItemData = this.TreeView.get(selectedItemsPropertyName);
          folderItemPath = selectedItemData.path;
          rootItemPath = this.TreeView.viewModel.$el.attr("data-sc-rootitempath");
          destinationFolderDisplayValue = this.getDisplayPath(rootItemPath, folderItemPath, showFullPath);
          this.DestinationValueText.set("text", destinationFolderDisplayValue);
        }
      }, this);


      this.Uploader.on("uploadCompleted", function () {

        var selectedItemsPropertyName = "selectedNode",
          sourceProperty = "itemUri",
          selectedItemData,
          selectedItemFolderItemUri,
          folderItemUri,
          queryParameters = Sitecore.Helpers.url.getQueryParameters(window.location.href),
          language = '',
          version = '',
          versioningParameters,
          showFullPath = this.getShowFullPath(queryParameters);

        if (queryParameters["ro"]) {
          versioningParameters = Sitecore.Helpers.url.getQueryParameters(queryParameters["ro"]);
          if (versioningParameters) {
            language = versioningParameters["lang"];
            version = versioningParameters["ver"];
          }
        }

        var backButtonOldUrl = this.BackButton.viewModel.$el.attr('data-sc-click');
        
        if (this.TreeView.get(selectedItemsPropertyName) && sourceProperty in this.TreeView.get(selectedItemsPropertyName)) {
          selectedItemData = this.TreeView.get(selectedItemsPropertyName);
          folderItemUri = "sitecore://" + selectedItemData.itemUri.databaseUri.databaseName + "/" + selectedItemData.itemUri.itemId + "?lang=" + language + "&ver=" + version;          
          selectedItemFolderItemUri = encodeURIComponent(folderItemUri);
          backButtonOldUrl = backButtonOldUrl.replace("&fo=&", "&fo=0&");
          var backButtonNewUrl = _sc.Helpers.url.addQueryParameters(backButtonOldUrl, { fo: selectedItemFolderItemUri });
          this.setBackButtonParamsAndTriggerClick(backButtonNewUrl, showFullPath);
        } else {
          this.setBackButtonParamsAndTriggerClick(backButtonOldUrl, showFullPath);
        }        
        
      }, this);
    },

    getShowFullPath: function(queryParameters) {
      return queryParameters["showFullPath"] === "True";
    },

    setBackButtonParamsAndTriggerClick: function (backButtonUrl, showFullPath) {
      backButtonUrl = _sc.Helpers.url.addQueryParameters(backButtonUrl, { showFullPath: showFullPath });
      backButtonUrl = backButtonUrl.replace("hasUploaded=0", "hasUploaded=1");
      this.BackButton.viewModel.$el.attr('data-sc-click', backButtonUrl);
      this.BackButton.viewModel.$el.trigger('click');
    },

    getDisplayPath: function (root, folder, showFullPath) {
      if (!folder || folder.length === 0) {
        folder = root;
      }
      
      var displayFolder = folder;
      
      var result = displayFolder.replace('\\', '/').replace("/sitecore", '');
      if (!showFullPath) {
        var resultParts = result.split('/');
        return resultParts.length > 0 ? "/" + resultParts[resultParts.length - 1] : '';
      }
      return result;
    }
  });

  return UploadMediaDialog;
});