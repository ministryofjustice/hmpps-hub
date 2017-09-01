scTestingComponentsGrid = function(domElement, options) {
  this.grid = $(domElement);
  this.options = options;
  if (!this.options) {
    this.options = {};
  }

  if (!this.options.data) {
    this.options.data = {};
  }

  this.onVariationChanged = this.options.onVariationChange;
  this.load();
}

scTestingComponentsGrid.prototype.load = function() {
  if (this.options.isTestRunning) {        
    this.grid.addClassName("test-run");
  }
  else {
    this.grid.addClassName("test-not-run");
  }

  var isIE = scForm.browser.isIE;  
  this.grid.select("td.variation").each(function(variation) {
    if (isIE) {
        variation.on("mouseenter", this.onVariationMouseEnter);
        variation.on("mouseleave", this.onVariationMouseLeave);
    }
  
    var variationId = variation.readAttribute("data-variation-id");
    var componentId = variation.readAttribute("data-component-id");
    var variationData = this.getVariationData(componentId, variationId);
    if (variationData && variationData.isActive) {
      variation.addClassName("selected");    
    }
    
    variation.on("click", this.onVariationClick.bindAsEventListener(this));        
    if (this.options.isTestRunning) {      
      var variationValueCell = variation.next("td.variation-value");
      variationValueCell.down(".value-text-inner").innerHTML = Math.round(variationData.value * 100) / 100
      var max = this.getMaxEngagementValue(componentId);
      if (max <= 0) {
        max = 1;
      }

      var barWidth = Math.floor((variationData.value * 100)/max) + "%";
      var barChart = variationValueCell.down(".bar-chart-inner");
      if (barChart) {
        barChart.setStyle({ width: barWidth});
        if (variationData.value === 0) {
          barChart.addClassName("zero-value");
        }
      }
    }                      
  }, this);      
}

scTestingComponentsGrid.prototype.getVariationData = function(componentId, variationId) {
  var componentData = this.options.data[componentId];
  if (!componentData) {
    return null;
  }

  for (var i = 0; i < componentData.length; i++) {
    if (componentData[i].id === variationId) {
      return componentData[i];
    }
  }

  return null; 
}

scTestingComponentsGrid.prototype.getMaxEngagementValue = function(componentId) {
  var componentData = this.options.data[componentId];
  if (!componentData) {
    return -1;
  }
  
  var maxValue = -1;
  for (var i = 0; i < componentData.length; i++) {
    if (componentData[i].value > maxValue) {
      maxValue = componentData[i].value;
    }
  }
    
  return maxValue;
}

scTestingComponentsGrid.prototype.getSelectedCombination = function() {
  var result = {};
  this.grid.select(".variation.selected").each(function(v) {
    var componentID = v.readAttribute("data-component-id");
    if (!componentID) {
      return;
    }

    var variationID = v.readAttribute("data-variation-id");   
    if (!variationID) {
      return;
    }

    result[componentID] = variationID;      
  });
  
  return result;
}

scTestingComponentsGrid.prototype.setSelectedCombination = function(combination) {
  for (var n in combination) {
    if (!combination.hasOwnProperty(n)) {
      continue;
    }

    var componentId = n;
    var variationId = combination[n];
    var componentRow = $(componentId);
    if (!componentRow) {
      return;
    }
    
    componentRow.select(".variation").each(function(v) {
      if (v.readAttribute("data-variation-id") == variationId) {
        v.addClassName("selected");
      }
      else {
        v.removeClassName("selected");
      }
    }); 
  }
}

scTestingComponentsGrid.prototype.onVariationClick = function(e) {
  var elem = Event.findElement(e, "TD");
  if (!elem.hasClassName("selected")) {
    elem.up("table").select("td.selected").each(function(cell) { 
      cell.removeClassName("selected");
    });

    elem.addClassName("selected");
    if (this.onVariationChanged) {
      this.onVariationChanged.call(elem, e, elem.readAttribute("data-variation-id"), elem.readAttribute("data-component-id")); 
    }    
  }
}

scTestingComponentsGrid.prototype.onVariationMouseEnter = function(e) {  
  var elem = Event.element(e);
  elem.addClassName("hover");
}

scTestingComponentsGrid.prototype.onVariationMouseLeave = function(e) {  
  var elem = Event.element(e);
  elem.removeClassName("hover");
}