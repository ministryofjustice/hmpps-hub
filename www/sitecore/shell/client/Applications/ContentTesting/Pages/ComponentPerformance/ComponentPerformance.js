define(["sitecore", "/-/speak/v1/contenttesting/DataUtil.js"], function (_sc, dataUtil) {
  var TestResults = _sc.Definitions.App.extend({
    initialized: function () {
      this.resolveVariableId();

      var arrowIndicators = [{ component: this.TrailingValueArrowIndicator, treatNull: false }, { component: this.ExperienceEffectArrowIndicator, treatNull: false }, ];
      dataUtil.arrowIndicatorEventAssign(arrowIndicators);

      this.VariablesDataSource.set("variableId", this.get("variableId"));
      this.ComponentPerformanceIndicator.on("change:selectedItem", this.updateWithSelectedValue, this);
      this.VariablesDataSource.on("change:items", this.variationsPopulated, this);
      this.listenToOnce(this.VariablesDataSource, "change:items", this.updateWithDefaultValue);
    },
    
    variationsPopulated: function()
    {
      var values = this.VariablesDataSource.get("items");
      this.TestNameText.set("text", values[0].name);
      
      var component = this.ComponentPerformanceIndicator;      
      var items = component.get("items");
        if (items !== undefined && items.length > 0)
        {   component.set("selectedItem", null);
            component.set("selectedItem", items[0].items[0]);
        }
    },
    updateWithDefaultValue : function()
    {
      var app = this;
      var valueId = app.VariablesDataSource.get("items")[0].items[0].ValueId;
      this.set("valueId", valueId);
      this.updateDetails();
    },
    
    updateWithSelectedValue: function()
    {
      var app = this;
      var selectedItem = app.ComponentPerformanceIndicator.get("selectedItem");
      if (selectedItem !== "" && selectedItem !== null && selectedItem !== undefined)
      {
          var valueId = selectedItem.ValueId;
          this.set("valueId", valueId);
          this.updateDetails();
      }
    },
    
    updateDetails : function()
    {
      var app = this;
      var valueId = app.get("valueId");
      if (valueId !== "")
      {
        app.ExperienceKPIDataSource.set("variationId", valueId);
        app.TopGoalsDataSource.set("valueId",  valueId);
        app.TopGoalsDataSource1.set("valueId",  valueId);
        app.TopClicksToPagesDataSource.set("valueId",  valueId);
        app.SiteUsageDataSource.set("valueId", valueId);
        app.ReachDataSource.set("valueId", valueId);
      }
    },
    
    resolveVariableId : function()
    {
      var params = Sitecore.Speak.Helpers.url.getQueryParameters(window.location.href);
      this.set("variableId", params.variableid);
    }
  });

  return TestResults;
});