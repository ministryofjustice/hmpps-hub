define(["sitecore",
        "/-/speak/v1/contenttesting/DataUtil.js"],
 function (_sc, dataUtil) {
  var Rules = _sc.Definitions.App.extend({
    initialized: function () {

      var arrowIndicators = [{component:this.NotPersonalizedArIndicator, treatNull:false}, {component:this.TrailingValueArIndicator, treatNull:false}, {component:this.ExperienceEffectIndicator,treatNull:false}];
      dataUtil.arrowIndicatorEventAssign(arrowIndicators);

      this.RulesDataSource.on("change:items", this.notifyChangeRules, this);
      this.RulePerformanceIndicator.on("change:selectedItem", this.updateWithSelectedValue, this);
      this.listenToOnce(this.RulePerformanceIndicator, "change:items", this.updateWithDefaultValue);

      this.TestsDataSource1.on("change:items", this.updateEditButtonState, this);
      this.TestsDataSource1.set({ hostItemId: this.ItemFromQueryString1.get("itemId") });

      this.PersonalizationRuleDataSource.on("change:isInCurrentTest", this.updatePersonalizationRuleDS, this);
      this.PersonalizationRuleDataSource.on("change:conditions", this.updateRules, this);

      this.set("detailsTitleText", this.DetailPanelTitle.get("text"));
    },
    
    updatePersonalizationRuleDS: function () {
      var isInCurrentTest = this.PersonalizationRuleDataSource.get("isInCurrentTest");
      if (isInCurrentTest === null)
        return;
    
      this.ReachHeaderInTheTest.set("isVisible", isInCurrentTest);
      this.ReachHeaderOutTheTest.set("isVisible", !isInCurrentTest);
    },

    updateEditButtonState: function () {
      var items = this.TestsDataSource1.get("items");
      
      if (items.length > 0) {
        this.EditPersonalization.viewModel.hide();
      } else {
        this.EditPersonalization.viewModel.show();
      }
    },
    
    updateWithDefaultValue: function()
    {
      var items = this.RulePerformanceIndicator.get("items");

      if (items && items.length > 0 && items[0].items && items[0].items.length > 1) {
        this.RulePerformanceIndicator.set("selectedItem", items[0].items[0]);
      }

      this.ThumbnailImage.set("isBusy", false);
      this.ThumbnailImage.refresh();
    },
    
    updateWithSelectedValue: function()
    {
      var app = this;
      var selectedItem = app.RulePerformanceIndicator.get("selectedItem");
      app.set("ruleId", selectedItem.guid);
      app.set("ruleSetId", selectedItem.GroupId);
      app.set("ruleName", selectedItem.title);
      app.updateDetails();
    },
    
    notifyChangeRules: function()
    {
      var rulescount = this.RulesDataSource.get("RulesCount");
      var componentscount = this.RulesDataSource.get("ComponentCount");
      var template = _.template(this.StringDictionary.get("<%= ruleCount %> personalization rules in <%= componentCount %> components on this page"));

      this.DescriptionText.set("text", template({
        ruleCount: rulescount,
        componentCount: componentscount
      }));
    },

    updateDetails: function ()
    {
      var app = this;
      var ruleId = app.get("ruleId");
      if (ruleId !== "")
      {
        app.RulePerformanceDataSource.set("isSilent", true);
        app.RulePerformanceDataSource.set("ruleId", "");
        app.RulePerformanceDataSource.set("ruleSetId", "");
        app.RulePerformanceDataSource.set("ruleId", ruleId);
        app.RulePerformanceDataSource.set("isSilent", false);
        app.RulePerformanceDataSource.set("ruleSetId", app.get("ruleSetId"));

        
        

        app.ReachDataSource.set("valueId", ruleId);

        app.PersonalizationRuleDataSource.set("isSilent", true);
        app.PersonalizationRuleDataSource.set("ruleId", "");
        app.PersonalizationRuleDataSource.set("ruleSetId", "");
        app.PersonalizationRuleDataSource.set("ruleId", ruleId);
        app.PersonalizationRuleDataSource.set("isInCurrentTest", null);
        app.PersonalizationRuleDataSource.set("isSilent", false);
        app.PersonalizationRuleDataSource.set("ruleSetId", app.get("ruleSetId"));
        
        app.RuleNameText.set("text", app.get("ruleName"));
        app.ThumbnailImage.set("testvalueid", ruleId);

        var detailText = app.get("detailsTitleText") + " - " + app.get("ruleName");
        app.DetailPanelTitle.set("text", detailText);
      }
    },

    updateRules: function () {
      // conditions contains markup so cannot bind it through text
      this.RuleContainer.viewModel.$el.html(this.PersonalizationRuleDataSource.get("conditions"));
    },
    
    editPersonalization: function()
    {
      var message = "webedit:personalize";
      var selectedItem = this.RulePerformanceIndicator.get("selectedItem"); 
      if (selectedItem)
      {
        var renderingId = this.formatGuid(selectedItem.GroupId);
        var topwindow = window.parent.parent;
        
        var chromeManager = topwindow.Sitecore.PageModes.ChromeManager;
        var renderingChrome = $.grep(chromeManager.chromes(), function(item) {
          return item.controlId() === 'r_' + renderingId;
        })[0]; 
        chromeManager.select(renderingChrome);
        topwindow.Sitecore.PageModes.PageEditor.postRequest(message + "(uniqueId=" + renderingId + ")");
        this.close();
      }
    },
    
    formatGuid: function(guid)
    {
      var str = guid.replace("-", "").replace("-", "").replace("-", "").replace("-", "");
      str = str.toUpperCase();
      return str;
    },
    
    close: function() {
      window.top.dialogClose();
    }
  });

  return Rules;
});