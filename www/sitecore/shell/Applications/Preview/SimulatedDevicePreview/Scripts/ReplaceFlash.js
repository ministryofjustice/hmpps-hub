(function ($) {
  var replacementHtml = Sitecore.SimulatedDevicePreview.Parameters["no flash support trait_replacement html"];
  var useAlternateContent = Sitecore.SimulatedDevicePreview.Parameters["no flash support trait_use alternate content"] == "1"; 

  function isFlash(elem) {              
    var attrName, attrValue;
    // Getting attribute via element.getAttribute fails to retrieve
    // some specific (e.g TYPE for EMBED tag) attributes in old (<8) IE version.
    // Iterating over attributes collection to avoid this.
    for (i = 0; i < elem.attributes.length; i++) {
      if (elem.attributes.item(i).specified && elem.attributes.item(i).value ) {
        attrName = elem.attributes.item(i).name.toLowerCase();
        attrValue = elem.attributes.item(i).value.toLowerCase();              
        if (attrName === "type" && attrValue === "application/x-shockwave-flash") {
          return true;
        }

        if (attrName === "classid" && attrValue === "clsid:d27cdb6e-ae6d-11cf-96b8-444553540000") {
          return true;
        }  
      }
    }

    return false;
  };
  
  $(document).ready(function() {        
    // Use isFlash function instead of attribute selector because of problem with case sensivity in IE
    $("object, embed").each(function(idx, element) {        
        if (!isFlash(element)) return;
        var $element = $(element);        
        var $elementToReplace = $($element.parents("object, embed")[0] || element);
        try {
          var html = replacementHtml || "", altHtml, $replacementElement;
          if (useAlternateContent) {
            altHtml = Sitecore.PageModes.Utility.getObjectAlternateHtml($elementToReplace);
            if (altHtml) {
              html = $.trim(altHtml);  
            }
          }
          else {            
            html = $.isHtml(html) ? html : "<span>" + html + "</span>";
            $replacementElement = $(html).css({
              height: $elementToReplace.height() + "px",
              width: $elementToReplace.width() + "px" 
            });                                                     
          }
                   
          $elementToReplace.replaceWith($replacementElement || html || "");
        }
        catch(e) {
         window.parent.console.error("Failed to replace flash object: ", e);
        }
      });       
    try {
      $("noembed").remove();
    }
    catch(e) {
      window.parent.console.error("Failed to remove NOEMBED element:", e)
    }       
  }); 
})($sc);