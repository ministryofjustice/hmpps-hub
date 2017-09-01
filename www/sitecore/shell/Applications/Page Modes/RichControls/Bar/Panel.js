if (typeof(Sitecore.PageModes.RichControls) == "undefined") {
  Sitecore.PageModes.RichControls = {};
}

/**
* @class Base class for bar panel
*/
Sitecore.PageModes.RichControls.Panel = Base.extend({  
  constructor: function(cssClass) {          
    this.cssClass = cssClass;
    this.maxTitleLength = 30;
    this.events = $sc({});
  },
 
  createDom: function() {
    var template = [
    "<div class='scBar {{if cssClass}} ${cssClass} {{/if}}'>",
    "  <div class='scBarLeftSection'>",
    "    <div class='scLabel'></div>",
    "    <div class='scPrevNextContainer'>",
    "      <img class='scPrev' src='/sitecore/shell/themes/standard/images/pageeditor/prev.png' />",
    "      <img class='scNext' src='/sitecore/shell/themes/standard/images/pageeditor/next.png' />",
    "    </div>",
    "  </div>",
    "  <a href='#' class='scTitleArea'>",
    "    <div class='scTitleContainer'>",
    "      <div class='scTitleAnimationContainer'>",
    "        <span class='scTitle'></span>",
    "      </div>",
    "    </div>",
    "  </a>",
    "  <div class='scClearBoth'></div>",
    "</div>"
    ].join("\n");

    this.panel = $sc.util().renderTemplate("sc-richControls.Panel", template, this);

    this.label = this.panel.find(".scLabel");
    this.prev = this.panel.find(".scPrev").click($sc.proxy(this.prevClick, this));
    this.next = this.panel.find(".scNext").click($sc.proxy(this.nextClick, this));

    this.titleArea = this.panel.find(".scTitleArea").click($sc.proxy(function(e) { 
      this.events.triggerHandler("click.bar", [e]);
    }, this));
    
    this.title = this.panel.find(".scTitle");
  },
       
  changeItem: function(item, direction) {
    var shift = 20;
    if (direction) {
      shift = direction * shift;
    }
       
    this.currentName = $sc.truncate(item.name, this.maxTitleLength);
    this.title.animate({"top" : shift + "px"}, 100)
      .animate({"left": "-500px"}, 0, $sc.proxy(function() {          
          this.title.html(this.currentName);                    
      }, this))
      .animate({"left": "0px", "top" : (- shift) + "px"}, 0)
      .animate({ top: "0px" }, 100);
  },
 
  nextClick: function(e) {
    e.stop();
    
    if (!this.nextItem) {     
      return;
    }
    
    this.changeItem(this.nextItem, -1); 
    this.events.triggerHandler("change.bar", [this.nextItem, this.chrome]);    
  },
   
  prevClick: function(e) {
    e.stop();
    if (!this.prevItem) {      
      return false;
    }
       
    this.changeItem(this.prevItem, 1);
    this.events.triggerHandler("change.bar", [this.prevItem, this.chrome]);
  },
 
  render: function(context) {
    var ribbonBody = Sitecore.PageModes.PageEditor.ribbonBody();
    if (ribbonBody) {
      ribbonBody.trigger("onChromeUpdated");
    }	  
    var activeItem = context.activeItem();
    if (!activeItem) {
      return;
    }

    var items = context.items();
    if (!items) {
      return;
    }

    var idx = $sc.inArray(activeItem, items);
    if (idx < 0) {
      return;
    }
    
    this.chrome = context.chrome;
       
    this.createDom();              
    this.configureLabel(context);
    this.configureTitleArea(context);   
    
    this.prevItem = items[idx - 1];
    this.nextItem = items[idx + 1];
    if (!this.prevItem) {
      this.prev.addClass("scDisabled");
    }

    this.configurePrev(context);   
    if (!this.nextItem) {
      this.next.addClass("scDisabled");
    }

    this.configureNext(context);            
    var name = $sc.truncate(activeItem.name, this.maxTitleLength)
    this.currentName = name
    this.title.stop(true).html(name);                   
    return this.panel;        
  },

  renderBadge: function (context) {    
    var badge = $sc("<span class='scChromeBadge'></span>");        
    return badge;
  },

  configureLabel: function(context) {   
  },

  configureNext: function(context) {
  },

  configurePrev: function(context) {
  },

  configureTitleArea: function(context) {    
  } 
});