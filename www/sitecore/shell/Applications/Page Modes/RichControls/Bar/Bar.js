if (typeof(Sitecore.PageModes.RichControls) == "undefined") {
  Sitecore.PageModes.RichControls = {};
}

Sitecore.PageModes.RichControls.Bar = Base.extend({
  /**
  * @constructor
  */
  constructor: function(panel, dropdown) {
    this.panel = panel;
    this.dropdown = dropdown;
    this.panel.events.bind("click.bar", $sc.proxy(function(e, nativeEvent) {
      this.showDropDown(nativeEvent); 
      this.panel.titleArea.addClass("scDdExpanded"); 
    }, this));
      
    this.positioningManager = new Sitecore.PageModes.PositioningManager();      
  },

  render : function(context) {    
    this._update(context);
    var panel = this.panel.render(context);
    return panel;
  },
  
  renderHidden: function(context, title, icon) {
    this._update(context);
    var tag = $sc("<a class='scChromeCommand' href='#' ></a>").attr("title", (title ? title : context.command.tooltip));
    $sc("<img />").attr({ src: (icon ? icon : context.command.icon)}).appendTo(tag);
    $sc("<img class='scDdArrow' src='/sitecore/shell/Themes/Standard/Images/menudropdown_black9x8.png' />").appendTo(tag);
    tag.append(this.panel.renderBadge(context));
    tag.click($sc.proxy(function(e) {this.showDropDown(e);this.button.addClass("scDdExpanded");}, this));
    this.button = tag;
    return tag;    
  },
  
  showDropDown: function(e) {    
    e.stop();
    var sender = $sc(e.currentTarget);            
    var offset = sender.offset();
    var height = sender.outerHeight();
    var fixedPosition = this.positioningManager.getFixedElementPosition(offset.top + height, offset.left, this.dropdown.dropDown); 
    this.dropdown.show({top: fixedPosition.top, left: fixedPosition.left});            
    
    if (this.chromeControls) {
      this.chromeControls.hideDsCommands();
      this.chromeControls.hideMoreCommands();
      this.chromeControls.hideAncestors();
    }
   },
   
   hideDropDown: function() {   
    if (this.button) {
      this.button.removeClass("scDdExpanded");
    }      
    
    if (this.panel.titleArea) {
      this.panel.titleArea.removeClass("scDdExpanded");
    }

    this.dropdown.hide();
  },
  
  _update: function(context) {
     if (!this.handlersAttached) {
      this.handler = $sc.proxy(this.hideDropDown, this);
      context.chromeControls.observe("hide", this.handler);
      context.chromeControls.observe("show", this.handler);      
      context.chromeControls.observe("dropdownshown",this.handler);
      context.chromeControls.observe("click", this.handler);
      context.chromeControls.observe("scroll",this.handler);
      this.handlersAttached = true;
    }

    this.chromeControls = context.chromeControls;
    this.dropdown.update(context);
  }            
});