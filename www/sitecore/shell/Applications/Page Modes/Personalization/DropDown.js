if (typeof(Sitecore.PageModes.Personalization) == "undefined") {
  Sitecore.PageModes.Personalization = {};
}

 /**
 * @class The personalization DropDown.
 */
Sitecore.PageModes.Personalization.DropDown = Base.extend({
  /**
  * @constructor
  */
  constructor: function () {
    var cssClass = Sitecore.PageModes.PageEditor.languageCssClass() + (Sitecore.PageModes.Utility.isIE ? " ie" : "");
    var template = [
    "<div class='scChromeDropDown scPersonalization " + cssClass + "'>",
    "  <div class='scHeader'>${texts.Analytics.SelectedCondition}</div>",
    "  <div class='scSubHeader'></div>",
    "  <div class='scConditions'></div>",
    "  <div class='scHeader'>${texts.Analytics.AvailableConditions}</div>",
    "  <div class='scItemsList'></div>",
    "  <a class='scEditButton'>",
    "    <div><img src='/sitecore/shell/~/icon/Office/16x16/users_family.png' /></div>",
    "    ${texts.Analytics.EditConditions}",
    "  </a>",
    "</div>",
    ].join("\n");

    this.dropDown = $sc.util().renderTemplate("sc-personalizationDropdown", template, { texts: Sitecore.PageModes.Texts });

    this.dropDown.hide().click(function(e) {
      if (e.target.className == "scEditButton") {
        return;
      }
        
      e.stop();
    });

    this._conditionHeader = this.dropDown.find(".scSubHeader");
    this._conditions = this.dropDown.find(".scConditions");
    this._conditionsList = this.dropDown.find(".scItemsList");
    this._editButton = this.dropDown.find(".scEditButton");

    this.dropDown.prependTo(document.body);
  },

  /**
  * @description Resets inner controls
  */
  clear: function() {   
    this._conditionsList.html("");
    this._editButton.unbind("click");
    this._editButton.removeClass("scDisabled");  
  },

  /**
  * @description Hides the dropdown
  */
  hide:function() {
    this.dropDown.hide();
  },

  /**
  * @description Shows the dropdown in specific position
  * @param {Object} position. The coordinates of the topleft corner of the dropdown. 
  */
  show: function(position) {
    if (this.currentCondition) {
      this.currentCondition.renderCondition(this._conditions);
    }

    this.dropDown.css({top: position.top + "px", left: position.left + "px"});
    this.dropDown.show();   
    
    var activeCondition = this._conditionsList.children(".scActiveListItem:eq(0)");
    if (activeCondition) {
      var top = activeCondition.position().top;
      var height = activeCondition.outerHeight();
      var listHeight = this._conditionsList.height();
      if (top + height > listHeight) {
        var scrollPosition = this._conditionsList.scrollTop() + top;
        this._conditionsList.scrollTop(scrollPosition);
      }
    }
  },

  /**
  * @description Renders condition for conditions list
  * @param {Sitecore.PageModes.Chrome} chrome The context chrome. @see Sitecore.PageModes.Chrome
  * @param {Sitccore.PageModes.Personalization.Condition} condition The condition. @see Sitccore.PageModes.Personalization.Condition
  * @returns {Node} The node presenting the condition in a list
  */
  renderCondition: function(chrome, condition, idx) {
    var prefix = (idx + 1) + ".&nbsp;"
    var maxLength = 30;
    var tag = $sc("<a href='#'></a>").addClass(condition.isActive ? "scActiveListItem" : "scListItem").html(            
      $sc.truncate(prefix + condition.name, maxLength + prefix.length));

    tag.attr("title", condition.name);
    var c = chrome;
    if (condition.isActive) {      
      tag.click(function(e) {e.stop();});
    }
    else {
      tag.click(function(e) {
        Sitecore.PageModes.ChromeManager.setCommandSender(c);
        c.handleMessage("chrome:personalization:conditionchange", {id: condition.id});        
      });
    }

    return tag;
  },

  /**
  * @description Updates inner controls
  * @param {Sitecore.Page.Modes.Presonalization.ControlsContext} context The controls context.
  *        @see Sitecore.Page.Modes.Presonalization.ControlsContext
  */
  update: function(context) {
    this.clear();    
    
    var activeCondition = context.getActiveCondition();   
    var command = context.command;
    var chrome = context.chrome;
    
    if (!Sitecore.PageModes.PageEditor.isPersonalizationAccessible()) {
      this._editButton.click(function(e) { e.stop();});
      this._editButton.addClass("scDisabled");         
    }
    else if (command.click.indexOf("chrome:") == 0) {      
      var click = Sitecore.PageModes.Utility.parseCommandClick(command.click);      
      this._editButton.click(function(e) {       
          Sitecore.PageModes.ChromeManager.setCommandSender(chrome);
          chrome.handleMessage(click.message, click.params);
        });
    }
    
    this.currentCondition = activeCondition.condition;
    if (this.currentCondition) {
      this._conditionHeader.html(activeCondition.position + ".&nbsp;" + activeCondition.condition.name);
    }

    for (var i = 0; i < context.conditions.length; i++) {
      this._conditionsList.append(this.renderCondition(context.chrome, context.conditions[i], i)); 
    }        
  }
});