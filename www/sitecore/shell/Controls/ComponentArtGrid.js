var ComponentArtGrid = Class.create({
  deleteSelected: function() {
    this.grid.deleteSelected();
    this.update();
  },
  
  gridId: function() {
    var id = this.grid.Id;
    if (id.indexOf("_") > 0) {
      id = id.substring(id.lastIndexOf("_") + 1);
    }
    
    return id;
  },

  initialize: function(grid) {
    this.grid = $(grid);
    if (!this.grid) {
      alert("grid handler: grid not found");
      return;
    }
    
    this.grid.scHandler = this;
    
    this.footer = $(this.grid.element).select(".scGridFooter")[0];
    if (!this.footer) {
      alert("grid handler: grid footer not found");
      return;
    }
    
    this.initializeEvents();
    this.insertSelectedValueInput();
    
    this.update();
    
    if (typeof(scOnGridLoad) != "undefined") {
      scOnGridLoad(this);
    }
    
    if (typeof(OnResize) != "undefined") {
      OnResize();
    }
  },
  
  insertSelectedValueInput: function() {
    var form = $$("form")[0];
    if (!form) {
      alert("grid handler: form not found");
    }
    
    var inputId = this.gridId() + "_scSelectedValue";
    this.selectedValue = new Element("input", {id: inputId, type: "hidden" });
    form.insert({ bottom: this.selectedValue });
  },
  
  initializeEvents: function() {
    this.grid.add_callbackComplete(this.callbackComplete.bind(this));     
    this.grid.add_itemSelect(this.itemSelect.bind(this));
    this.grid.add_itemUnSelect(this.itemUnSelect.bind(this));
    this.grid.add_groupingChange(this.groupingChange.bind(this));
    $(this.grid.element).observe("click", this.update.bind(this));
  },
  
  refresh: function() {
    this.grid.CallbackPrefix = this.grid.CallbackPrefix +"&requireRebind=true"
    this.grid.callback();
    this.grid.CallbackPrefix = this.grid.CallbackPrefix.replace("&requireRebind=true", "");
  },
  
  update: function() {
    this.updateSelection();
    this.updateItems();    
  },
  
  updateItems: function() {
    var pageCount = this.grid.get_pageCount();

    if (pageCount == 0) {
      this.footer.removeClassName("single-page");
      this.footer.addClassName("no-pages");      
    }
    else if (pageCount == 1) {
      this.footer.removeClassName("no-pages");
      this.footer.addClassName("single-page");
    }
  },
  
  updateSelection: function() {
    var selected = this.grid.getSelectedItems();
    var value = "";
    
    for(var n = 0; n < selected.length; n++) {
      if (n > 0) {
        value += "|";
      }
      
      value += selected[n].Id;
    }
    
    this.selectedValue.value = value;
  },  
  
  /* grid event handlers */
  callbackComplete: function() {
    this.update();
  },
  
  groupingChange: function() {
    if (typeof(OnResize) != "undefined") {
      OnResize();
    }
  },
  
  itemDelete: function() {
    document.fire("grid:itemDelete");
    this.update();
  },
  
  itemSelect: function() {
    document.fire("grid:itemSelect");
    this.updateSelection();
  },

  itemUnSelect: function() {
    document.fire("grid:itemUnSelect");
    this.updateSelection();
  },

  //ComponentArt Grid supports only one handler per event. With following we extend some events.
  add_itemSelect: function(eventHandler){
    document.observe("grid:itemSelect", eventHandler.bind(this));
  },
    
  add_itemUnSelect: function(eventHandler){
    document.observe("grid:itemUnSelect", eventHandler.bind(this));
  },
    
  add_itemDelete: function(eventHandler){
    document.observe("grid:itemDelete", eventHandler.bind(this));
  }
});

String.prototype.decodeId = function () {
  return this.replace(/\!/gi, " ").replace(/\-scexclmn\-/gi, "!").replace(/\-scsemicolon\-/gi, ";").replace(/\-scsinglequote\-/gi, "'").replace(/\-scamp\-/gi, "&").replace(/\-sclt\-/gi, "<").replace(/\-scgt\-/gi, ">");
}