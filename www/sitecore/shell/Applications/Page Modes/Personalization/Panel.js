if (typeof(Sitecore.PageModes.Personalization) == "undefined") {
  Sitecore.PageModes.Personalization = {};
}

/**
* @class Reperesents personalization bar
*/
Sitecore.PageModes.Personalization.Panel = Sitecore.PageModes.RichControls.Panel.extend({    
   /**
  * @constructor
  */
  constructor: function(cssClass) {          
    this.base(cssClass);
    this.events.bind("change.bar", function(e, condition, chrome) {
      Sitecore.PageModes.ChromeManager.setCommandSender(chrome);
      chrome.handleMessage("chrome:personalization:conditionchange", {id: condition.id});
    });
  },
   
  configureLabel: function(context) {
    var activeCondition = context.getActiveCondition();
    var condition = activeCondition.condition;
    var position = activeCondition.position;
    this.label.text(position + "/" + context.conditions.length);
    if (condition.isDefault()) {      
      this.label.attr("title", $sc.formatString(Sitecore.PageModes.Texts.Analytics.DefaultConditionActive));      
    }
    else {
      this.label.addClass("scActive");
      this.label.attr("title", $sc.formatString(Sitecore.PageModes.Texts.Analytics.CurrentActiveConditions, position));      
    }
  },

  configureNext: function(context) {
    if (this.next.hasClass("scDisabled")) {
      this.next.attr("title", "");     
    }
    else {
      this.next.attr("title", Sitecore.PageModes.Texts.Analytics.ActivateNextCondition);
    }
  },

  configurePrev: function(context) {
    if (this.prev.hasClass("scDisabled")) {
      this.prev.attr("title", "");     
    }
    else {
      this.prev.attr("title", Sitecore.PageModes.Texts.Analytics.ActivatePreviousCondition);
    }
  },

  configureTitleArea: function(context) {
    var activeCondition = context.getActiveCondition();
    var condition = activeCondition.condition;
    if (condition.isDefault()) {            
      this.titleArea.attr("title", Sitecore.PageModes.Texts.Analytics.DefaultPersonalizationConditionActive);
    }
    else {      
      this.titleArea.attr("title", $sc.formatString(Sitecore.PageModes.Texts.Analytics.PersonalizationConditionActive, condition.name));
    }    
  },

  renderBadge: function (context) { 
    var badge = this.base(context);
    var activeCondition = context.getActiveCondition();      
    if (!activeCondition.condition) {
      return badge;
    }

    badge.text(activeCondition.position + "/" + context.conditions.length);
    if (!activeCondition.condition.isDefault()) {
       badge.addClass("scActive");
    }
    return badge;
  }
});