(function ($) {
  var replacementHtml = Sitecore.SimulatedDevicePreview.Parameters["no silverlight support trait_replacement html"];
  var useAlternateContent = Sitecore.SimulatedDevicePreview.Parameters["no silverlight support trait_use alternate content"] == "1"; 
   
  $(document).ready(function() {            
      $("object[type^=\"application/x-silverlight-\"]").each(function(idx, element) {
         try {
          var $element = $(element);
          var html = replacementHtml || "", altHtml, $replacementElement;
          if (useAlternateContent) {
            altHtml = Sitecore.PageModes.Utility.getObjectAlternateHtml($element);
            if (altHtml) {
              html = $.trim(altHtml);  
            }
          }
          else {            
            html = $.isHtml(html) ? html : "<span>" + html + "</span>";
            $replacementElement = $(html).css({
              height: $element.height() + "px",
              width: $element.width() + "px" 
            });                                                     
          }
          
          $element.replaceWith($replacementElement || html || "");
        }
        catch(e) {
          window.parent.console.error("Failed to replace Silverlight object: ", e);
        }
      });          
  }); 
})($sc);