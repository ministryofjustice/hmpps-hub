(function () {
  // The trick to test in node and in browser.
  var dependencies = (typeof window !== "undefined")
    ? ["/-/speak/v1/listmanager/ContactListDefinition.js", "/-/speak/v1/listmanager/urlParser.js"]
    : ["../ContactList/ContactListDefinition", "../urlParser"];
  define(dependencies, function (contactListDefinition, urlParser) {
    var contactListPagePattern = "/sitecore/client/Applications/List Manager/Taskpages/Contact list?id=";

    var extensionObject = {
      listType: "Segmented list",
      initializeSpecificListActions: function () {
        this.on("taskpage:convert:list", this.onConvertList, this);

        this.on("taskpage:segmentedlist:segmentation:add:new:condition", function () {
          this.onAddNewCondition();
        }, this);
      },
      initializeAdditionalFields: function () {
        $("[data-sc-id='SegmentationAccordion'] > div.sc-advancedExpander-body").css({ "border-left": "0", "border-right": "0" });

        var mode = urlParser.getParameterFromLocationSearchByName("alldatabase");
        if (mode == "1") {
          this.updateUiForSources({ Source: "{ \"AllDatabase\" : true, \"IncludedLists\" : [], \"ExcludedLists\" : []}", PredefinedText: "" });
        }
        if (mode != "") {
          urlParser.removeQueryParameter("alldatabase");
        }

        var current = this;
        current.SegmentBuilder.on("sc.listmanagement.segmentbuilder.rule.changed", function () {
          current.updateSaveButtonUi(current.SegmentBuilder, current.SegmentBuilder.viewModel.getRulesXML(), "Query");
        });
      },
      save: function () {
          this.saveList();
      },
      hasAdditionalLockCondition: function (source) {
        var sourceIsLocked = false;
        var resultLists = Array.prototype.concat.call(source.IncludedLists, source.ExcludedLists);
        Array.prototype.forEach.call(resultLists, function (l) {
          if (l.IsLocked === true) {
            sourceIsLocked = true;
          }
        });
        return sourceIsLocked;
      },
      onConvertList: function (parameters) {
        this.executeAction(parameters, "ConvertList", this.onConvertListFinished, false);
      },
      onConvertListFinished: function (dataSource, current) {
        var newListId = dataSource;
        current.location.href = contactListPagePattern + newListId + "&action=convert";
      },
      saveAdditionalFields: function (model) {
        model.Query = this.SegmentBuilder.viewModel.getRulesXML();
        return model;
      },
      updateUiForAdditionalFields: function (model) {
        // TODO: initialize SegmentBuilder with XML here when it will be possible.
      },
      onAddNewCondition: function () {
        this.SegmentBuilder.viewModel.addNewCondition();
      }
    };

    return contactListDefinition.mergeListPages(contactListDefinition, extensionObject);
  });
})();