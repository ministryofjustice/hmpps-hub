require.config({
  paths: {    
    valueLabelcss: "/sitecore/shell/client/Business Component Library/Layouts/Renderings/Indicators/ValueLabel",
    fusionChartsAdapter: "/sitecore/shell/client/Business Component Library/Layouts/Renderings/Charts/Shared/FusionChartsAdapter"
  }
});

define(["sitecore", "fusionChartsAdapter", "css!valueLabelcss"], function (_sc, chartAdapter) {

  _sc.Factories.createBaseComponent({
    name: "ValueLabel",
    base: "ComponentBase",
    selector: ".sc-ValueLabel",
    attributes: [
      { name: "data", defaultValue: null },      
      { name: "value", value: "$el.data:sc-value" },
      { name: "label", value: "$el.data:sc-label" },
      { name: "valueColor", value: "$el.data:sc-valuecolor" },
      { name: "labelColor", value: "$el.data:sc-labelcolor" },
      { name: "dataFunction", value: "$el.data:sc-datafunction" },
      { name: "dataField", value: "$el.data:sc-datafield" },
      { name: "isVisible", defaultValue: true }
    ],
    initialize: function () {
      this.model.on("change:data", this.setData, this);      
    },
    
    setData: function () {    
      var data = this.model.get("data");

      if (data) {
        var dataField = this.model.get("dataField");
        if (dataField) {
          var dataFunction = this.model.get("dataFunction");
          if (dataFunction) {
            var result = null;
            try {
              result = chartAdapter.calculateFunction(data, dataField, dataFunction);
            }
            catch(errorObject)
            {              
              this.handleError(errorObject);
            }
            finally
            {
              this.model.set("value", result);
            }
          }
        }        
      }
    },
    
    setValue: function (value) {
      var parsedValue = parseFloat(value);

      if (isNaN(parsedValue)) {
        parsedValue = "";
      } else {
        parsedValue = parsedValue.toFixed(2);
        if (parsedValue % 1 === 0) {
          parsedValue = parseInt(parsedValue);
        }
      }
    
      this.model.set("value", parsedValue);
    },
    
    setColors: function (valueColor, labelColor) {
      this.model.set("valueColor", valueColor);
      this.model.set("labelColor", labelColor);
      this.$el.find(".sc-ValueLabel-Value").css('color', valueColor);
      this.$el.find(".sc-ValueLabel-Label").css('color', labelColor);
    },
    
    handleError: function (errorObject) {
      this.model.trigger("error", errorObject);
    },
  });
});