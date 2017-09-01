if (typeof(Sitecore.PageModes.Testing) == "undefined") {
  Sitecore.PageModes.Testing = {};
}

if (typeof(Sitecore.PageModes.Testing) == "undefined") {
  Sitecore.PageModes.Testing = {};
}

Sitecore.PageModes.Testing.Panel = Sitecore.PageModes.RichControls.Panel.extend({    
   /**
  * @constructor
  */
  constructor: function(cssClass) {          
    this.base(cssClass);
    this.events.bind("change.bar", function(e, item, chrome) {
      Sitecore.PageModes.ChromeManager.setCommandSender(chrome);
      chrome.handleMessage("chrome:testing:variationchange", {id: item.id});
    });
  },
   
  configureLabel: function(context) {
    var activeVariation = context.activeItem();
    if (!activeVariation) {
      return;
    }

    var idx = $sc.inArray(activeVariation, context.items());
    if (idx < 0) {
      return;
    }
       
    var varLabel = String.fromCharCode(65 + context.items().length - idx -1);
    this.label.text(varLabel);
    this.label.attr("title", $sc.formatString(Sitecore.PageModes.Texts.Analytics.VariationName, varLabel));         
  },

  configureNext: function(context) {   
     if (this.next.hasClass("scDisabled")) {
      this.next.attr("title", "");     
    }
    else {
      this.next.attr("title", Sitecore.PageModes.Texts.Analytics.ActivateNextVariation);
    }    
  },

  configurePrev: function(context) {    
    if (this.prev.hasClass("scDisabled")) {
      this.prev.attr("title", "");     
    }
    else {
      this.prev.attr("title", Sitecore.PageModes.Texts.Analytics.ActivatePreviousVariation);
     }    
  },

  configureTitleArea: function(context) {
    var activeVariation = context.activeItem();
    if (!activeVariation) {
      return;
    }
    
    this.titleArea.attr("title", $sc.formatString(Sitecore.PageModes.Texts.Analytics.VariationActive, activeVariation.name));
  },

  renderBadge: function (context) { 
    var badge = this.base(context);
    badge.addClass("scTestingBadge");
    var activeVariation = context.activeItem();      
    if (!activeVariation) {
      return badge;
    }

    var idx = $sc.inArray(activeVariation, context.items());
    if (idx < 0) {
      return badge;
    }

    badge.text(String.fromCharCode(65 + idx));   
    return badge;
  }
});