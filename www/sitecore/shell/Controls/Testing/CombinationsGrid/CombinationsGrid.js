if (typeof(Sitecore) == "undefined") {
  Sitecore = {};
}

Sitecore.CombinationsGrid = function(domElement, options) {
  if (!options) {
    options = {};
  }
  
  this.parseOptions(options);      
  this.table = new Element("table", {"id": this.id, "class": "combinations-grid", "cellspacing": 0, cellpadding: "4px"});
  $(domElement).insert(this.table);      
  var thead = new Element("thead");
  var row = new Element("tr", {"class":"header-row"});
  var counter = 0;
  var l = this.headers.length;
  var showValue = this.showValue;
  this.headers.each(function(header) {
    var className = "";
    if (counter == 0) {
      className = "class='counter-cell'";
    }

    if (counter == l-1 && showValue) {
      className = "class='value-cell'";
    }

    row.insert("<th "+ className +"><span>" + header + "</span></th>");
    counter++;    
  });

  thead.insert(row);
  this.table.insert(thead);  
  this.populateCombinations();
};

Sitecore.CombinationsGrid.prototype.populateCombinations = function() {
  var tbody = new Element("tbody");
  for (var i = 0; i < this.combinations.length; i++) {
    var row = new Element("tr", {"class": (i % 2 != 0 ? "even" : "odd" )});
    if (scForm.browser.isIE) {
      row.on("mouseenter", function() {this.addClassName("hover"); });
      row.on("mouseleave", function() {this.removeClassName("hover"); });  
    }

    row.store("variations", this.combinations[i].variations);
    var firstCell = new Element("td", { "class" : "counter-cell"});
    firstCell.innerHTML = i + 1;
    
    row.insert(firstCell);
    var combinationCells = "";
    this.combinations[i].variations.each(function(v) {
      combinationCells += "<td title=\"" + v.name + "\">" + v.name.truncate(20) + "</td>";
    });
   
    row.insert(combinationCells);

    if (this.showValue) {
      var valueCell = new Element("td", { "class" : "value-cell"});
      valueCell.innerHTML = Math.round(this.combinations[i].value * 100) / 100;
      row.insert(valueCell);
    }

    tbody.insert(row);        
    tbody.on("click", this.rowClickHandler.bindAsEventListener(this));    
  }

  this.table.insert(tbody);
};

Sitecore.CombinationsGrid.prototype.rowClickHandler = function(e) { 
  var row = Event.findElement(e, "TR");
  if (!row) {
    return
  }

  e.stop();
  if (row.hasClassName("selected")) {
    return;
  }

  this.table.select("tr.selected").each(function(r) { r.removeClassName("selected"); });
  row.addClassName("selected");  
  var variations = row.retrieve("variations");
  if (!variations) {
    return;
  }

  var eventData = {};
  for (var i = 0; i < this.components.length;i++) {
    eventData[this.components[i].id] = variations[i].id;
  }

  this.onCombinationChange(e, eventData);
};

Sitecore.CombinationsGrid.prototype.getSelectedCombination = function() {
  var result = {};
  var selectedRow = this.table.select("tr.selected")[0];
  if (!selectedRow) {
    return result;
  }
  
  var variations = selectedRow.retrieve("variations");
  if (!variations) {
    return result;
  }

  for (var i = 0; i < this.components.length;i++) {
    result[this.components[i].id] = variations[i].id;
  }

  return result;
};

Sitecore.CombinationsGrid.prototype.setSelectedCombination = function(combination) {
   var mappedCombinations = [];
   for (var n in combination) {
    if (!combination.hasOwnProperty(n)) {
      continue;
    }

    var idx = -1;
    for (var i = 0; i < this.components.length; i++) {
      if (this.components[i].id == n) {
        idx = i;
        break;
      }
    }

    if (idx >= 0) {    
      mappedCombinations[idx] = combination[n];
    }
   }
       
   var rowToSelect = this.table.select("tbody tr").find(function(tr) {
    var variations = tr.retrieve("variations");
    if (variations) {
      for (var j = 0;j < variations.length; j++) {
        if (variations[j].id != mappedCombinations[j]) {
          return false;
        }
      }

      return true;
    }
    
    return false;    
   });

   if (rowToSelect) {
     this.table.select("tr.selected").each(function(r) { r.removeClassName("selected"); });
     rowToSelect.addClassName("selected");
   }
};

Sitecore.CombinationsGrid.prototype.parseOptions = function(options) {  
  this.id = "combinationsGrid";
  if (options.id) {
    this.id = options.id;
  }

  this.showValue = false;
  if (options.showValue != null) {
    this.showValue = options.showValue;
  }

  this.headers = [];
  if (options.headers) {
    this.headers = options.headers;
  }
  
  this.components = [];
  if (options.components) {
    this.components = options.components;
  }
  
  this.combinations = [];
  if (options.combinations) {
    this.combinations = options.combinations;
  }
  
  this.onCombinationChange = function() {};
  if (options.onCombinationChange) {
    this.onCombinationChange = options.onCombinationChange;
  }
};