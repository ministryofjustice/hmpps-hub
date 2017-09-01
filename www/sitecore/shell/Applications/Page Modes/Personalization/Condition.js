if (typeof(Sitecore.PageModes.Personalization) == "undefined") {
  Sitecore.PageModes.Personalization = {};
}

/**
* @class Represents personalization condition
*/
Sitecore.PageModes.Personalization.Condition = Base.extend({
  /**
  * @constructor
  * @param {String} [id] The unique id of the condition (id attribute of the rule in rendering definition)
  *                 This parameter should be omitted for the default condition.
  * @param {String} [name="Default"] The name of the condition
  * @param {Boolean} [isActive="false"] The name of the condition
  */
  constructor:function(id, name, isActive) {
    this.id = id ? id : Sitecore.PageModes.Personalization.Condition.defaultId;    
    this.name = name ? name : "Default condition";
    this.isActive = !!isActive; 
  },

  /**
  * @description Defines if the condition is a default one
  * @retruns {Boolean} The value indicating if the condition is a default one
  */
  isDefault:function() {
    return this.id == Sitecore.PageModes.Personalization.Condition.defaultId;
  },

  /**
  * @description Renders the condition presentation into the specified destination
  * @param destination The node which will be a prent for condition presentation
  */
  renderCondition: function(destination) {    
    if (this.isDefault()) {      
      destination.html(Sitecore.PageModes.Texts.Analytics.DefaultConditionDescription);
      return;
    }

    if (typeof(this._cachedDescription) != "undefined") {      
      destination.html(this._cachedDescription);
      return;
    }

    var conditionDefinition = Sitecore.LayoutDefinition.GetConditionById(this.id);
    if (!conditionDefinition) {
      destination.html("");
      return;
    }

    destination.addClass("scConditionDescriptionUpdating");
    destination.html("");
    $sc.ajax({
      type: "POST",
      dataType: "html",
      url: "/sitecore/shell/Applications/Page%20Modes/Personalization/GetConditionDescription.ashx",
      context: this,
      data: { condition: JSON.stringify(conditionDefinition) },
      global: false,
      success: function (data) {
        var span = document.createElement("span");
        span.innerHTML = data;
        var innerText = $sc.browser.msie ? span.innerText : span.textContent;
        delete span;
        this._cachedDescription = $sc.truncate(innerText, 60);       
        destination.html(this._cachedDescription);
        destination.removeClass("scConditionDescriptionUpdating");
      },

      error:function(xhr, textStatus, errorThrown) {
        destination.html("");
        destination.removeClass("scConditionDescriptionUpdating");
        console.error(textStatus);
        alert(Sitecore.PageModes.Texts.ErrorOcurred);
      }
    });    
  }
},
{
  /**
  * @description The short id of the default condition
  */
  defaultId: "{00000000-0000-0000-0000-000000000000}"
}
);