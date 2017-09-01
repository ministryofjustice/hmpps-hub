define(["sitecore", "/-/speak/v1/ExperienceEditor/ExperienceEditor.js"], function (Sitecore, ExperienceEditor) {
  var contentUsagePageCode = Sitecore.Definitions.App.extend({
    initialized: function () {
      this.setOkButtonClick();
      this.setSearchButtonClick();
      this.loadControlData();

      this.ReferenceContentListControl.set("originalItems", this.ReferenceContentListControl.get("items"));
      this.ReferenceContentListControl.trigger("change:items");
      this.AssosiatedContentListControl.trigger("change:items");

      this.ReferenceContentButtonTextBox.viewModel.$el.find("input").attr("placeholder", this.ReferenceContentButtonTextBox.get("watermark"));

      jQuery("#dialogContent").css('visibility', 'visible');
    },
    setOkButtonClick: function () {
      this.on("button:ok", function () {
        this.closeDialog(null);
      }, this);
    },
    setSearchButtonClick: function () {
      this.on("button:search", function () {
        var searchText = this.ReferenceContentButtonTextBox.get("text");
        var items = this.ReferenceContentListControl.get("originalItems");
        var filteredItems = [];
        var that = this;
        $.each(items, function () {
          if (that.isTextMatch(this.page, searchText)
            || that.isTextMatch(this.path, searchText)) {
            filteredItems.push(this);
          }
        });
        this.ReferenceContentListControl.set("items", filteredItems);
        this.ReferenceContentListControl.trigger("change:items");
      }, this);
    },
    isTextMatch: function(text, textToSearch) {
      return text.toLowerCase().indexOf(textToSearch.toLowerCase()) > -1;
    },
    loadControlData: function () {
      var context = ExperienceEditor.generateDefaultContext();
      context.currentContext.itemId = ExperienceEditor.Web.getUrlQueryStringValue("itemId");
      context.currentContext.database = ExperienceEditor.Web.getUrlQueryStringValue("db");
      context.currentContext.version = ExperienceEditor.Web.getUrlQueryStringValue("version");
      context.currentContext.value = "";
      var sitecore = ExperienceEditor.getPageEditingWindow().parent.Sitecore;
      if (sitecore) {
        context.currentContext.value = sitecore.PageModes.ChromeControls.prototype.usagesPathPatterns.join("|");
      }
      var that = this;
      var datasourceUsages;
      ExperienceEditor.PipelinesUtil.generateRequestProcessor("ExperienceEditor.Datasources.GetDatasourceUsagesDialog", function (response) {
        datasourceUsages = response.responseValue.value;
        if (!datasourceUsages) {
          return;
        }

        that.loadReferenceContentList(datasourceUsages, that.ReferenceContentListControl);
        that.loadAssociatedContentList(datasourceUsages, that);
      }).execute(context);
    },
    addAssociatedContentListItem: function (that, property, value) {
      that.AssosiatedContentListControl.attributes.items.push(
        {
          property: property,
          value: value
        });
    },
    loadAssociatedContentList: function (datasourceUsages, that) {
      if (!datasourceUsages || datasourceUsages.length === 0) {
        return;
      }

      var datasourceUsage = datasourceUsages[0];
      if (!datasourceUsage) {
        return;
      }

      that.addAssociatedContentListItem(that, that.TextsItemPath.get("text"), datasourceUsage.path);
      that.addAssociatedContentListItem(that, that.TextsVersion.get("text"), datasourceUsage.version);
      that.addAssociatedContentListItem(that, that.TextsWorkflow.get("text"), datasourceUsage.workflowName);
      that.addAssociatedContentListItem(that, that.TextsWorkflowState.get("text"), datasourceUsage.workflowStateName);
      that.addAssociatedContentListItem(that, that.TextsLock.get("text"), datasourceUsage.lockedBy);
      that.addAssociatedContentListItem(that, that.TextsLastModified.get("text"), datasourceUsage.lastModified);
    },
    loadReferenceContentList: function (datasourceUsages, referenceContentList) {
      $.each(datasourceUsages, function () {
        referenceContentList.attributes.items.push(
          {
            itemId: "{" + this.ItemId.toUpperCase() + "}",
            page: this.name,
            path: this.path,
            lastModified: this.lastModified
          });
      });
    }

  });
  return contentUsagePageCode;
});