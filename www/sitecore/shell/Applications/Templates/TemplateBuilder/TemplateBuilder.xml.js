/* Sitecore.TemplateBuilder */

Sitecore.TemplateBuilder = new function() {
  Sitecore.UI.ModifiedTracking.track(true, Sitecore.App.getParentForm());
  this.uniqueID = 0;
  this.active = null;

  Sitecore.Dhtml.attachEvent(window, "onload", function() { Sitecore.TemplateBuilder.load() });

  this.load = function(sender, evt) {
    this.updateStructure();

    var caption = Sitecore.$("Caption").value;

    if (caption != null) {
      if (window.parent.scWin != null) {
        window.parent.scWin.setCaption(caption);
      }
    }

    var frame = Sitecore.Dhtml.getFrameElement(window);

    if (frame.style.display != "none") {
      scUpdateRibbonProxy("Ribbon", "Ribbon", window.location.href.indexOf("ar=1") >= 0);
    }
  }

  this.loadItem = function(id) {
    window.setTimeout("scForm.getParentForm().invoke('item:load(id=" + id + ")')", 1);
  }

  this.sectionChange = function(sender, evt) {
    if (sender.value == "") {
      return;
    }

    var element = Sitecore.$(sender, "TR");
    if (element != null) {
      element = Sitecore.Dhtml.getNextSibling(element);
    }

    if (element == null || element.className == "scTableSectionRow") {
      this.buildField(sender, element);
    }

    var element = Sitecore.$(sender, "TR");
    var nextSection = this.getNextSection(element);

    if (nextSection == null) {
      var id = this.getUniqueID();

      var table = Sitecore.$(sender, "TABLE");

      var row = table.insertRow(-1);
      row.id = id;
      row.className = "scTableSectionRow";

      var cell = row.insertCell(-1);
      cell.className = "scTableSection";
      cell.colSpan = 5;
      cell.innerHTML = "<input id=\"" + id + "_section_name\" class=\"scTableSectionName\" value=\"" + Sitecore.$("AddNewSectionText").value + "\" style=\"color:#999999\" " +
                   "onchange=\"javascript:return Sitecore.TemplateBuilder.sectionChange(this,event)\" " +
                   "onkeyup=\"javascript:return Sitecore.TemplateBuilder.sectionChange(this,event)\" " +
                   "oncut=\"javascript:return Sitecore.TemplateBuilder.sectionChange(this,event)\" " +
                   "onpaste=\"javascript:return Sitecore.TemplateBuilder.sectionChange(this,event)\" " +
                   "onfocus=\"javascript:return Sitecore.TemplateBuilder.focus(this,event)\" " +
                   "onblur=\"javascript:return Sitecore.TemplateBuilder.blur(this,event,0)\" " +
                   "/><input id=\"" + id + "_section_id\" type=\"hidden\" /><input id=\"" + id + "_section_deleted\" type=\"hidden\"/><input id=\"" + id + "_section_sortorder\" type=\"hidden\" value=\"0\"/>";

      this.updateStructure();
    }

    Sitecore.UI.ModifiedTracking.handleEvent(evt, false);
  }

  this.fieldChange = function(sender, evt) {
    if (sender.value == "") {
      return;
    }

    var element = Sitecore.$(sender, "TR");
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

    var table = Sitecore.$(sender, "TABLE");

    var rowIndex = element != null ? element.rowIndex : -1;

    var row = table.insertRow(rowIndex);
    row.id = id;
    row.className = "scTableFieldRow";

    this.buildFieldInput(row, id, "name", "text", "Name");
    this.buildFieldInput(row, id, "type", "select", "Type", Sitecore.$("FieldTypes").value);
    this.buildFieldInput(row, id, "source", "text", "Source");
    this.buildFieldInput(row, id, "unversioned", "checkbox", "Unversioned");
    this.buildFieldInput(row, id, "shared", "checkbox", "Shared");
  }

  this.buildFieldInput = function(row, id, name, type, className, value) {
    var cell = row.insertCell(row.childNodes.length);
    cell.className = "scTableField" + className;

    if (name == "name") {
      cell.innerHTML = "<input id=\"" + id + "_field_" + name + "\" type=\"" + type + "\" class=\"scTableField" + className + "Input\" value=\"" + Sitecore.$("AddNewFieldText").value + "\" style=\"color:#999999\" " +
                   "onchange=\"javascript:return Sitecore.TemplateBuilder.fieldChange(this,event)\" " +
                   "onkeyup=\"javascript:return Sitecore.TemplateBuilder.fieldChange(this,event)\" " +
                   "oncut=\"javascript:return Sitecore.TemplateBuilder.fieldChange(this,event)\" " +
                   "onpaste=\"javascript:return Sitecore.TemplateBuilder.fieldChange(this,event)\" " +
                   "onfocus=\"javascript:return Sitecore.TemplateBuilder.focus(this,event)\" " +
                   "onblur=\"javascript:return Sitecore.TemplateBuilder.blur(this,event,1)\" " +
                   "/><input id=\"" + id + "_field_id\" type=\"hidden\" /><input id=\"" + id + "_field_deleted\" type=\"hidden\" /><input id=\"" + id + "_field_sortorder\" type=\"hidden\" value=\"0\"/>";
    }
    else if (type == "select") {
      cell.innerHTML = "<select id=\"" + id + "_field_" + name + "\" class=\"scTableField" + className + "Input scCombobox\" onfocus=\"javascript:return Sitecore.TemplateBuilder.focus(this,event)\">" + value + "</select>";
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
    var table = Sitecore.$("Table");

    var rows = table.rows;
    var structure = "";

    for (var n = 1; n < rows.length; n++) {
      var row = rows[n];

      structure += (structure != "" ? "," : "") + row.id;
    }

    Sitecore.$("Structure").value = structure;
  }

  this.deleteRow = function(sender, evt) {
    var active = Sitecore.$(this.active, "TR");

    if (active != null) {
      var id = active.id;

      if (active.className == "scTableSectionRow") {
        ctl = this.getNextSection(active);

        if (ctl != null) {
          var ctl = Sitecore.$(id + "_section_deleted");

          ctl.value = "1";
          active.style.display = "none";
          this.active = null;

          Sitecore.$(id + "_section_name").value = "0";

          ctl = Sitecore.Dhtml.getNextSibling(active);
          while (ctl != null && ctl.className != "scTableSectionRow") {
            Sitecore.$(ctl.id + "_field_deleted").value = "1"

            ctl.style.display = "none";

            var cells = ctl.cells;
            for (var n = 0; n < cells.length; n++) {
              cells[n].style.display = "none";
            }

            ctl = Sitecore.Dhtml.getNextSibling(ctl);
          }

          this.updateStructure();
          this.setModified();
        }
      }
      else {
        ctl = Sitecore.Dhtml.getNextSibling(active);

        if (ctl != null && ctl.className == "scTableFieldRow") {
          ctl = Sitecore.$(id + "_field_deleted");
          ctl.value = "1";
          active.style.display = "none";
          this.active = null;

          Sitecore.$(id + "_field_name").value = "0";

          this.updateStructure();
          this.setModified();
          window.focus();
        }
      }
    }

    Sitecore.Dhtml.clearEvent(evt, true, false);
    return false;
  }

  this.focus = function(sender, evt) {
    if (sender.style.color != "") {
      sender.value = "";
      sender.style.color = "";
    }

    this.focusRow(sender, evt);
  }

  this.focusRow = function(sender, evt) {
    var oldActive = Sitecore.$(this.active, "TR");
    var newActive = Sitecore.$(sender, "TR");

    if (oldActive == newActive) {
      return;
    }

    if (oldActive != null) {
      oldActive.style.background = "";

      var ctl = Sitecore.$(this.active + "_field_name");

      if (ctl != null) {
        if (ctl.value == "" || ctl.value == Sitecore.$("AddNewFieldText").value) {
          this.deleteRow(sender, evt);
        }
      }

      var ctl = Sitecore.$(this.active + "_section_name");

      if (ctl != null) {
        if (ctl.value == "" || ctl.value == Sitecore.$("AddNewSectionText").value) {
          this.deleteRow(sender, evt);
        }
      }
    }

    if (newActive != null) {
      this.active = newActive.id;
      newActive.style.background = "#d5effc";
      Sitecore.$("Active").value = this.active;
    }
    else {
      this.active = null;
    }
  }

  this.blur = function(sender, evt, type) {
    if (sender.value == "") {
      sender.value = Sitecore.$(type == 0 ? "AddNewSectionText" : "AddNewFieldText").value;
      sender.style.color = "#999999";
    }
  }

  this.moveUp = function(sender, evt) {
    Sitecore.Dhtml.clearEvent(evt, true, false);

    var active = Sitecore.$(this.active, "TR");

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
            this.saveRowState(active, target);

            Sitecore.Dhtml.swapNode(active, target);

            this.restoreRowState(active, target);
          }
          else {
            this.saveRowState(active);

            target.parentNode.insertBefore(active, Sitecore.Dhtml.getNextSibling(target));

            this.restoreRowState(active);
          }

          $(active.id + "_field_sortorder").value = "0";
        }
      }

      this.updateStructure();
      this.setModified();
    }
  }

  this.moveDown = function(sender, evt) {
    Sitecore.Dhtml.clearEvent(evt, true, false);

    var active = Sitecore.$(this.active, "TR");

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
            this.saveRowState(active, target);
            Sitecore.Dhtml.swapNode(active, target);
            this.restoreRowState(active, target);
          }
          else {
            this.saveRowState(active);
            target.parentNode.insertBefore(active, target);
            this.restoreRowState(active);
          }

          $(active.id + "_field_sortorder").value = "0";
        }
      }

      this.updateStructure();
      this.setModified();
    }
  }

  this.moveFirst = function(sender, evt) {
    Sitecore.Dhtml.clearEvent(evt, true, false);

    var active = Sitecore.$(this.active, "TR");

    if (active != null && this.isDataRow(active)) {
      if (active.className == "scTableSectionRow") {
        var table = Sitecore.$(active, "TABLE");
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
          this.saveRowState(active);
          target.parentNode.insertBefore(active, target);
          this.restoreRowState(active);
        }

        $(active.id + "_field_sortorder").value = "0";
      }

      this.updateStructure();
      this.setModified();
    }
  }

  this.moveLast = function(sender, evt) {
    Sitecore.Dhtml.clearEvent(evt, true, false);

    var active = Sitecore.$(this.active, "TR");

    if (active != null && this.isDataRow(active)) {
      if (active.className == "scTableSectionRow") {
        var table = Sitecore.$(active, "TABLE");
        this.moveSection(active, table.rows[table.rows.length - 1]);
      }
      else {
        var target = Sitecore.Dhtml.getNextSibling(active);
        while (target != null && this.isDataRow(target)) {
          target = Sitecore.Dhtml.getNextSibling(target);
        }

        if (target != null) {
          this.saveRowState(active);
          target.parentNode.insertBefore(active, target);
          this.restoreRowState(active);
        }

        $(active.id + "_field_sortorder").value = "0";
      }

      this.updateStructure();
      this.setModified();
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

    for (var n = 0; n < fields.length; n++) {
      section.parentNode.insertBefore(fields[n], Sitecore.Dhtml.getNextSibling(target));
      target = fields[n];
    }

    $(section.id + "_section_sortorder").value = "0";
  }

  this.isDataRow = function(element) {
    if (element.className == "scTableSectionRow") {
      var ctl = this.getNextSection(element);
      return ctl != null;
    }

    var ctl = Sitecore.Dhtml.getNextSibling(element);
    return ctl != null && ctl.className == "scTableFieldRow";
  }

  this.setModified = function() {
    Sitecore.UI.ModifiedTracking.setModified(true);
  }

  this.saveRowState = function() {
    $A(arguments).each(function(row) {
      var unversioned = $$("##{id} .scTableFieldUnversionedInput".interpolate(row))[0].checked;
      var shared = $$("##{id} .scTableFieldSharedInput".interpolate(row))[0].checked;

      row.scState = [unversioned, shared];
    });
  }

  this.restoreRowState = function() {
    $A(arguments).each(function(row) {
      var state = row.scState;
      if (state) {
        $$("##{id} .scTableFieldUnversionedInput".interpolate(row))[0].checked = state[0];
        $$("##{id} .scTableFieldSharedInput".interpolate(row))[0].checked = state[1];
      }
      else {
        console.warn("%s row state is missing", row);
      }
    });
  }
}

function scOnShowEditor() {
  scUpdateRibbonProxy("Ribbon", "Ribbon");
}

function scGetFrameValue(value, request) {
  if (request.parameters == "contenteditor:save" || request.parameters == "item:save") {
    Sitecore.App.invoke("item:save(disablesaveanimation=1)");    
  }

  return null;
}
