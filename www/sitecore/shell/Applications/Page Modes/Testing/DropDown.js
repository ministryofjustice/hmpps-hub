if (typeof(Sitecore.PageModes.Testing) == "undefined") {
  Sitecore.PageModes.Testing = {};
}

 /**
 * @class The personalization DropDown.
 */
Sitecore.PageModes.Testing.DropDown = Base.extend({
  /**
  * @constructor
  */
  constructor: function() {
    var cssClass = Sitecore.PageModes.PageEditor.languageCssClass() + (Sitecore.PageModes.Utility.isIE ? " ie" : "");
    var template = [
      "<div class='scChromeDropDown scTesting " + cssClass + "'>",
      "  <div class='scHeader'>${texts.Analytics.SelectedVariation}</div>",
      "  <div class='scSubHeader'></div>",
      "  <div class='scHeader'>",
      "  {{if (displayValue == true)}}",
      "  <span class='scValueLabel'>${texts.Analytics.Value}</span>",
      "  {{/if}}",
      "  ${texts.Analytics.AvailableVariations}",
      "  </div>",
      "  <div class='scItemsList'>",
      // Inner container is needed to fix the problem with scroll bar and table width=100% in IE 7
      "    <div style='zoom:1'>",
      "      <table cellspacing='0' cellpadding='0' class='scVariations'></table>",
      "    </div>",
      "  </div>",
      "  <a class='scEditButton ${editButtonClass}'>",
      "    <div><img src='/sitecore/shell/~/icon/SoftwareV2/16x16/breakpoints.png' /></div>",
      "    ${texts.Analytics.EditVariations}",
      "  </a>",
      "</div>"
    ].join("\n");

    this.dropDown = $sc.util().renderTemplate("sc-testingDropdown", template, { 
      texts: Sitecore.PageModes.Texts,
      editButtonClass: Sitecore.PageModes.PageEditor.isTestRunning() ? "scDisabled" : "",
      displayValue: Sitecore.PageModes.PageEditor.isTestRunning()
    }).hide();

    this._variationHeader = this.dropDown.find(".scSubHeader");
    this._variationsList = this.dropDown.find(".scItemsList");
    this._variations = this._variationsList.find("table").click($sc.proxy(this._clickHandler, this));
    this._editButton = this.dropDown.find(".scEditButton");

    this.dropDown.click(function(e) {                
      if (e.target.className == "scEditButton") {
        return;
      }
       
      e.stop();
    });

    if (Sitecore.PageModes.PageEditor.isTestingAccessible()) {
      this._editButton.click($sc.proxy(this._editButtonClick, this));
    }
    else {
      this._editButton.click(function(e) {e.stop();});
      this._editButton.addClass("scDisabled");
    }

    this.dropDown.prependTo(document.body);
  },
  
  hide:function() {
    this.dropDown.hide();
  },
 
  show:function(position) {   
    this.dropDown.css({top: position.top + "px", left: position.left + "px"});
    this.dropDown.show();
    var activeVariation = this._variations.find(".scActiveListItem:eq(0)");
    if (activeVariation) {
      var top = activeVariation.position().top;
      var height = activeVariation.outerHeight();
      var listHeight = this._variationsList.height();
      if (top + height > listHeight) {
        var scrollPosition = this._variationsList.scrollTop() + top;
        this._variationsList.scrollTop(scrollPosition);
      }
    }       
  },
  
  update: function(context) {   
    var activeVariation = context.activeItem();
    if (!activeVariation) {
      return;
    }

    var idx = $sc.inArray(activeVariation, context.items());
    if (idx < 0) {
      return;
    }
                   
    this._chrome = context.chrome;
    this._command = context.command;
    this._variationHeader.html(String.fromCharCode(65 + context.items().length - idx -1) + ".&nbsp;" + activeVariation.name);
    var html = this._getVariationsHTML(context.items());
    this._variations.html(html);           
  },

  _clickHandler: function(evt) {
    var variation = $sc(evt.target).closest(".scListItem");
    variationId = null;
    if (variation.length > 0) {
      variationId = variation.attr("data-variation-id");
    }

    if (variationId && this._chrome) {
      Sitecore.PageModes.ChromeManager.setCommandSender(this._chrome);
      this._chrome.handleMessage("chrome:testing:variationchange", {id: variationId}); 
    }
  },

  _editButtonClick: function(evt) {
    var sender = $sc(evt.currentTarget);
    if (sender.hasClass("scDisabled")) {
      evt.stop();
      return;
    }

    if (this._chrome && this._command) {
      if (this._command.click.indexOf("chrome:") !== 0) {
        return;
      }

      var click = Sitecore.PageModes.Utility.parseCommandClick(this._command.click); 
      Sitecore.PageModes.ChromeManager.setCommandSender(this._chrome);
      this._chrome.handleMessage(click.message, click.params);
    }
  },
  
  _getVariationsHTML: function(variations) {
    var maxLength = 28;
    var renderBars = Sitecore.PageModes.PageEditor.isTestRunning();
    var result = "";
    var max = -1, width = 0, barCssClass = "scValueBarInner",l;
    
    $sc.each(variations, function() {
      if (this.value != null && this.value > max) max = this.value;
    });

    if (max <= 0) {
      max = 1;
    }

    l = variations.length;
    for (var i = 0; i < l; i++) {
      result += "<tr>";
      var cssClass = "scListItem";
      if (variations[i].isActive) {
        cssClass = "scActiveListItem";
      } 
      result += "<td class='" + cssClass + "' data-variation-id='" + variations[i].id +"'>";
      result += String.fromCharCode(65 + l - i - 1) + ".&nbsp;" +  $sc.truncate(variations[i].name, 28);
      result += "</td>";      
      
      if (renderBars) {
        result += "<td class='scVariationValue'>";
        result += "<div class='scValueBar'>";
        result += "<span style='position:absolute;left:50%'><span style='position:absolute;left:-50%'>";
        result += Math.round(variations[i].value * 100) / 100;
        result += "</span></span>";
        width = Math.floor((variations[i].value * 100) / max);
        if (variations[i].value === 0) {
          barCssClass += " scZeroValue";
        } 

        result += "<div class='" + barCssClass + "' style='width:" + width +"%'>";
        result += "</div>";
        result += "</div>";
        result += "</td>";
      }
      result += "</tr>";
    }
    
    return result;   
  }
});