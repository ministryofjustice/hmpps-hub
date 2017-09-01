(function($){
   $(document).ready(function() {      
      var selfScriptTag, src, query, cssFiles = [];     
      selfScriptTag = $("script[src*=\"RegisterCss.js\"]")[0];
      if (!selfScriptTag) {
        return;
      }
      
      src = selfScriptTag.src;
      if (!src) {
        return;
      }
      
      query = $.parseQuery(src.slice(src.indexOf("?"))); 
      for (var css in query) {
        if (query.hasOwnProperty(css)) {
          cssFiles.push(decodeURIComponent(query[css]).replace(/\+/g, " "));
        }        
      }
      
      Sitecore.PageModes.Utility.tryAddStyleSheets(cssFiles); 
   });
})($sc);