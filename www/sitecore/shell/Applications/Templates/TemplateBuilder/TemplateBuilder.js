/* Sitecore.TemplateBuilder */

Sitecore.TemplateBuilder = new function() {
  Sitecore.UI.ModifiedTracking.track(true);
  this.uniqueID = 0;
  this.active = null;
  
  Sitecore.Dhtml.attachEvent(window, "onload", function() { Sitecore.TemplateBuilder.load() } );

  this.load = function(sender, evt) {
     this.updateStructure();
   }

  this.sectionChange = function(sender, evt) {
    if (sender.value == "") {
      return;
    }
  
    var element = $(sender, "TR");
    if (element != null) {
      element = Sitecore.Dhtml.getNextSibling(element);
    }
    
    if (element == null || element.className == "scTableSectionRow") {
      this.buildField(sender, element);
    }
    
    var element = $(sender, "TR");
    var nextSection = this.getNextSection(element);
    
    if (nextSection == null) {
      var id = this.getUniqueID();
      
      var table = $(sender, "TABLE");

      var row = table.insertRow();
      row.id = id;
      row.className = "scTableSectionRow";
      
      var cell = row.insertCell();
      cell.className = "scTableSection";
      cell.colSpan = 5;
      cell.innerHTML = "<input id=\"" + id + "_section_name\" class=\"scTableSectionName\" value=\"" + $("AddNewSectionText").value + "\" style=\"color:#999999\" " +
                   "onchange=\"javascript:return Sitecore.TemplateBuilder.sectionChange(this,event)\" " +
                   "onkeyup=\"javascript:return Sitecore.TemplateBuilder.sectionChange(this,event)\" " +
                   "oncut=\"javascript:return Sitecore.TemplateBuilder.sectionChange(this,event)\" " +
                   "onpaste=\"javascript:return Sitecore.TemplateBuilder.sectionChange(this,event)\" " +
                   "onfocus=\"javascript:return Sitecore.TemplateBuilder.focus(this,event)\" " +
                   "onblur=\"javascript:return Sitecore.TemplateBuilder.blur(this,event,0)\" " +
                   "/><input id=\"" + id + "_section_id\" type=\"hidden\" /><input id=\"" + id + "_section_deleted\" type=\"hidden\"/>";
      
      this.updateStructure();
    }

    Sitecore.UI.ModifiedTracking.handleEvent(evt, false);
  }
  
  this.fieldChange = function(sender, evt) {
    if (sender.value == "") {
      return;
    }
  
    var element = $(sender, "TR");
    if (element != null) {
      element = Sitecore.Dhtml.getNextSibling(element);
    }
    
    if (element == null || element.className == "scTableSectionRow") {
      this.buildField(sender, element);
      
      this.updateStructure();
    }
    
    Sitecore.UI.ModifiedTracking.handleEvent(evt, false);
  }
  
  this.buildField = function(sender, element) {
    var id = this.getUniqueID();
    
    var table = $(sender, "TABLE");
    
    var rowIndex = element != null ? element.rowIndex : -1;

    var row = table.insertRow(rowIndex);
    row.id = id;
    row.className = "scTableFieldRow";
    
    this.buildFieldInput(row, id, "name", "text", "Name");
    this.buildFieldInput(row, id, "type", "select", "Type", $("FieldTypes").value);
    this.buildFieldInput(row, id, "source", "text", "Source");
    this.buildFieldInput(row, id, "unversioned", "checkbox", "Unversioned");
    this.buildFieldInput(row, id, "shared", "checkbox", "Shared");
  }
  
  this.buildFieldInput = function(row, id, name, type, className, value) {
    var cell = row.insertCell();
    cell.className = "scTableField" + className;
    
    if (name == "name") {
      cell.innerHTML = "<input id=\"" + id + "_field_" + name + "\" type=\"" + type + "\" class=\"scTableField" + className + "Input\" value=\"" + $("AddNewFieldText").value + "\" style=\"color:#999999\" " +
                   "onchange=\"javascript:return Sitecore.TemplateBuilder.fieldChange(this,event)\" " +
                   "onkeyup=\"javascript:return Sitecore.TemplateBuilder.fieldChange(this,event)\" " +
                   "oncut=\"javascript:return Sitecore.TemplateBuilder.fieldChange(this,event)\" " +
                   "onpaste=\"javascript:return Sitecore.TemplateBuilder.fieldChange(this,event)\" " +
                   "onfocus=\"javascript:return Sitecore.TemplateBuilder.focus(this,event)\" " +
                   "onblur=\"javascript:return Sitecore.TemplateBuilder.blur(this,event,1)\" " +
                   "/><input id=\"" + id + "_field_id\" type=\"hidden\" /><input id=\"" + id + "_field_deleted\" type=\"hidden\" />";
    }
    else if (type == "select") {
      cell.innerHTML = "<select id=\"" + id + "_field_" + name + "\" class=\"scTableField" + className + "Input\" onfocus=\"javascript:return Sitecore.TemplateBuilder.focus(this,event)\">" + value + "</select>";
    }
    else {
      cell.innerHTML = "<input id=\"" + id + "_field_" + name + "\" type=\"" + type + "\" class=\"scTableField" + className + "Input\" onfocus=\"javascript:return Sitecore.TemplateBuilder.focus(this,event)\"/>";
    }
  }
  
  this.getNextSection = function(element) {
    if (element != null) {
      element = Sitecore.Dhtml.getNextSibling(element);
    }
    
    while (element != null) {
      if (element.className == "scTableSectionRow") {
        return element;
      }
      
      element = Sitecore.Dhtml.getNextSibling(element);
    }
    
    return null;
  }
  
  this.getUniqueID = function() {
    this.uniqueID++;
    
    return "i" + this.uniqueID;
  }
  
  this.updateStructure = function() {
    var table = $("Table");
    
    var rows = table.rows;
    var structure = "";
    
    for(var n = 1; n < rows.length; n++) {
      var row = rows[n];
      
      structure += (structure != "" ? "," : "") + row.id;
    }
    
    $("Structure").value = structure;
  }
  
  this.deleteRow = function(sender, evt) {
    var active = $(this.active, "TR");
    
    if (active != null) {
      var id = active.id;
    
      if (active.className == "scTableSectionRow") {
        ctl = this.getNextSection(active);
        
        if (ctl != null) {
          var ctl = $(id + "_section_deleted");
          
          ctl.value = "1";
          active.style.display = "none";
          this.active = null;
          
          ctl = Sitecore.Dhtml.getNextSibling(active);
          while (ctl != null && ctl.className != "scTableSectionRow") {
            $(ctl.id + "_field_deleted").value = "1"
          
            ctl.style.display = "none";
            
            var cells = ctl.cells;
            for(var n = 0; n < cells.length; n++) {
              cells[n].style.display = "none";
            }
            
            ctl = Sitecore.Dhtml.getNextSibling(ctl);
          }
          
          this.updateStructure();
          Sitecore.UI.ModifiedTracking.setModified(true);
        }
      }
      else {
        ctl = Sitecore.Dhtml.getNextSibling(active);
        
        if (ctl != null && ctl.className == "scTableFieldRow") {
          ctl = $(id + "_field_deleted");
          ctl.value = "1";
          active.style.display = "none";
          this.active = null;

          this.updateStructure();
          Sitecore.UI.ModifiedTracking.setModified(true);
        }
      }
    }
  }
  
  this.focus = function(sender, evt) {
    if (sender.style.color != "") {
      sender.value = "";
      sender.style.color = "";
    }
    
    this.focusRow(sender, evt);
  }
  
  this.focusRow = function(sender, evt) {
    var active = $(this.active, "TR");
    if (active != null) {
     active.style.background = "";
    }
  
    active = $(sender, "TR");
    
    if (active != null) {
      this.active = $(sender, "TR").id;
      active.style.background = "#f0f0ff"; 
    }
    else {
      this.active = null;
    }
  }

  this.blur = function(sender, evt, type) {
    if (sender.value == "") {
      sender.value = $(type == 0 ? "AddNewSectionText" : "AddNewFieldText").value;
      sender.style.color = "#999999";
    }
  }
  
  this.moveUp = function() {
    var active = $(this.active, "TR");
    
    if (active != null && this.isDataRow(active)) {
      if (active.className == "scTableSectionRow") {
        var target = Sitecore.Dhtml.getPreviousSibling(active);
        while (target != null && (target.className != "scTableSectionRow" || !this.isDataRow(target))) {
          target = Sitecore.Dhtml.getPreviousSibling(target);
        }
        
        if (target != null) {
          this.moveSection(active, target);
        }
      }
      else {
        var swap = true;
        
        var target = Sitecore.Dhtml.getPreviousSibling(active);
        while (target != null && (target.className != "scTableFieldRow" || !this.isDataRow(target))) {
          if (target.className != "scTableSectionRow") {
            swap = false;
          }
          target = Sitecore.Dhtml.getPreviousSibling(target);
        }
        
        if (target != null && this.isDataRow(target)) {
          if (swap) {
            Sitecore.Dhtml.swapNode(active, target);
          }
          else {
            target.parentNode.insertBefore(active, Sitecore.Dhtml.getNextSibling(target));
          }
        }
      }
      
      this.updateStructure();
      Sitecore.UI.ModifiedTracking.setModified(true);
    }
  }

  this.moveDown = function() {
    var active = $(this.active, "TR");
    
    if (active != null && this.isDataRow(active)) {
      if (active.className == "scTableSectionRow") {
        var target = Sitecore.Dhtml.getNextSibling(active);
        while (target != null && target.className != "scTableSectionRow") {
          target = Sitecore.Dhtml.getNextSibling(target);
        }
        
        if (target != null) {
          var target = Sitecore.Dhtml.getNextSibling(target);
          while (target != null && target.className != "scTableSectionRow") {
            target = Sitecore.Dhtml.getNextSibling(target);
          }
        }
        
        if (target != null) {
          this.moveSection(active, target);
        }
      }
      else {
        var swap = true;
        
        var target = Sitecore.Dhtml.getNextSibling(active);
        while (target != null && (target.className != "scTableFieldRow" || !this.isDataRow(target))) {
          if (target.className != "scTableSectionRow") {
            swap = false;
          }
          target = Sitecore.Dhtml.getNextSibling(target);
        }
        
        if (target != null && this.isDataRow(target)) {
          if (swap) {
            Sitecore.Dhtml.swapNode(active, target);
          }
          else {
            target.parentNode.insertBefore(active, target);
          }
        }
      }
      
      this.updateStructure();
      Sitecore.UI.ModifiedTracking.setModified(true);
    }
  }
  
  this.moveFirst = function() {
    var active = $(this.active, "TR");
    
    if (active != null && this.isDataRow(active)) {
      if (active.className == "scTableSectionRow") {
        var table = $(active, "TABLE");
        this.moveSection(active, table.rows[1]);
      }
      else {
        var target = Sitecore.Dhtml.getPreviousSibling(active);
        while (target != null && target.className == "scTableFieldRow") {
          target = Sitecore.Dhtml.getPreviousSibling(target);
        }
        
        if (target != null) {
          target = Sitecore.Dhtml.getNextSibling(target);
        }
        
        if (target != null && this.isDataRow(target)) {
          target.parentNode.insertBefore(active, target);
        }
      }
      
      this.updateStructure();
      Sitecore.UI.ModifiedTracking.setModified(true);
    }
  }
  
  this.moveLast = function() {
    var active = $(this.active, "TR");
    
    if (active != null && this.isDataRow(active)) {
      if (active.className == "scTableSectionRow") {
        var table = $(active, "TABLE");
        this.moveSection(active, table.rows[table.rows.length - 1]);
      }
      else {
        var target = Sitecore.Dhtml.getNextSibling(active);
        while (target != null && this.isDataRow(target)) {
          target = Sitecore.Dhtml.getNextSibling(target);
        }
        
        if (target != null) {
          target.parentNode.insertBefore(active, target);
        }
      }
      
      this.updateStructure();
      Sitecore.UI.ModifiedTracking.setModified(true);
    }
  }
  
  this.moveSection = function(section, target) {
    var fields = new Array();
    
    var field = Sitecore.Dhtml.getNextSibling(section);
    while (field != null && field.className == "scTableFieldRow") {
      fields.push(field);
      field = Sitecore.Dhtml.getNextSibling(field);
    }
    
    section.parentNode.insertBefore(section, target);
    
    target = section;
    
    for(var n = 0; n < fields.length; n++) {
      section.parentNode.insertBefore(fields[n], Sitecore.Dhtml.getNextSibling(target));
      target = fields[n];
    }
  }
  
  this.isDataRow = function(element) {
    if (element.className == "scTableSectionRow") {
      var ctl = this.getNextSection(element);
      return ctl != null;
    }
    
    var ctl = Sitecore.Dhtml.getNextSibling(element);
    return ctl != null && ctl.className == "scTableFieldRow";
  }
}
