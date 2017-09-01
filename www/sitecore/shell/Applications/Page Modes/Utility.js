if (typeof(Sitecore) == "undefined") Sitecore = {};
if (typeof(Sitecore.PageModes) == "undefined") Sitecore.PageModes = new Object();

Sitecore.PageModes.Utility = new function() {
  this.isIE = $sc.browser.msie;
  if (!this.isIE)
    this.isIE = !!(navigator.userAgent.match(/Trident\/7\./) || navigator.userAgent.match(/Edge\/\d+/)); //patch for OnTime 420043, TFS 112290

  this.elements = function(object) {
    if (object instanceof $sc) {
      return object;
    }

    if (object.elementsAndMarkers) {
      return object.elementsAndMarkers();
    }

    throw "Unexpected object, can accept only jQuery objects or chromes";
  };
       
  //Defines if browser is IE in non-standards mode (standards mode:IE 8 standards mode and higher)
  this.isNoStandardsIE = function() {
    return this.isIE && (!document.documentMode || document.documentMode < 8);
  };
  
  this.addStyleSheet = function(cssRule) {
    var el= document.createElement("style");
    el.type= "text/css";        
    if(el.styleSheet) { 
      el.styleSheet.cssText= cssRule;
    }
    else { 
      el.appendChild(document.createTextNode(cssRule));
    }

    return document.getElementsByTagName("head")[0].appendChild(el);
  };

  this.areEqualPlaceholders = function(lhsPlaceholderKey, rhsPlaceholderKey) {
    var ignoreCase = true;
    if (lhsPlaceholderKey == null || rhsPlaceholderKey == null) {
      return lhsPlaceholderKey == rhsPlaceholderKey;
    }

    var lhsSlashIndex = lhsPlaceholderKey.lastIndexOf('/');
    var rhsSlashIndex = rhsPlaceholderKey.lastIndexOf('/');
    if (lhsSlashIndex >= 0 && rhsSlashIndex >=0)
    {
      return $sc.areEqualStrings(lhsPlaceholderKey, rhsPlaceholderKey, ignoreCase);
    }

    var lhsShortKey = (lhsSlashIndex >= 0) ? lhsPlaceholderKey.substr(lhsSlashIndex + 1) : lhsPlaceholderKey;
    var rhsShortKey = (rhsSlashIndex >= 0) ? rhsPlaceholderKey.substr(rhsSlashIndex + 1) : rhsPlaceholderKey;
    return $sc.areEqualStrings(lhsShortKey, rhsShortKey, ignoreCase);
  };

  this.copyAttributes = function(source, target) {
    var i;
    if (!target || !target.attributes) {
      return;
    }
          
    for (i = 0; i < target.attributes.length; i++) {        
      if (target.attributes.item(i).specified) {
        target.attributes.removeNamedItem(target.attributes.item(i).name);
      }
    }

    if (!source || !source.attributes) {
      return;
    }
               
    var length = source.attributes.length;
    for (i = 0; i < length; i++) {
      if (source.attributes.item(i).specified && source.attributes.item(i).value ) {
        var attrName = source.attributes.item(i).name;
        var attrValue = source.attributes.item(i).value;
        // OT issue #341614              
        if (attrName.toLowerCase() === "class") {
          target.className = attrValue;
          continue;  
        }
             
        target[attrName] = attrValue;       
      }
    }              
  };

  this.getCookie = function(name) {
    name = name + "=";
    var i = 0;
    while(i < document.cookie.length) {
      var j = i + name.length;
      if(document.cookie.substring(i, j) == name) {
        var n = document.cookie.indexOf(";", j);
        if(n == -1) {
          n = document.cookie.length;
        }

        return unescape(document.cookie.substring(j, n));
      }

      i = document.cookie.indexOf(" ", i) + 1;
      if(i == 0) {
        break;
      }
    }

    return null;
  };

  this.getObjectAlternateHtml = function(element) {
    if (!element) {
      return;
    }
    
    var childObject, wrapper = $sc("<div></div>");
    var $element = element.jquery ? element : $sc(element);
    if ($element.is("embed")) {
      var noembed = $element.children("noembed")[0] || $element.next("noembed")[0];
      if (!noembed) {
        return;
      }
             
      return this.unescapeHtml(noembed.innerHTML);     
    }

    if (!$element.is("object")) {
      return;
    }
        
    if (this.isIE && document.documentMode && document.documentMode < 9) {
      wrapper.html($element[0].altHtml);
      childObject = wrapper.children("object")[0];
      if (childObject) {
        return this.getObjectAlternateHtml(childObject);      
      }

      return wrapper.html();      
    }
       
    childObject = $element.children("object")[0];
    if (childObject) {
      return this.getObjectAlternateHtml(childObject);      
    }

    $element.contents().not("param, embed, noembed").clone().appendTo(wrapper);    
    return wrapper.html();
  };

  this.log = function(message) {
    if (!Sitecore.PageModes.PageEditor.debug()) {
      return;
    }

    console.log(message);
  };

  this.replaceCommandsAttributes = function(elements, attributeName, oldValue, newValue) {
    $sc.each(elements, function () {
      var value = attributeName ? $sc(this).attr(attributeName) : $sc(this).text();
      if (!value || value.indexOf(oldValue) == -1) {
        return;
      }

      if (attributeName) {
        $sc(this).attr(attributeName, newValue);
        return;
      }

      $sc(this).text(newValue);
    });
  };

  this.parseCommandClick = function(commandClick) {
    var msg = commandClick;
    var commandParams = null;
    var idx1 = commandClick.indexOf("(");
    var idx2 = commandClick.lastIndexOf(")");
    if (idx1 >= 0 && idx2 > idx1) {
      msg = commandClick.substring(0, idx1);
      try {
        commandParams = $sc.evalJSON(commandClick.substring(idx1 + 1, idx2));
      }
      catch (e) {
        console.log("Cannot parse command parameters");
      }
    }

    return { message: msg, params : commandParams};
  };

  this.parsePalleteResponse = function(response) {
    if (!response) {
      return null;
    }

    var tmp = document.createElement("div");
    tmp.innerHTML = response;
    var form = $sc(tmp).find("#scPaletteForm");
    if (form.length < 1) {
      delete tmp;
      return null;
    }
    
    var scripts = [];
    form.find("script").each(function() {
      if (this.src) {
        scripts.push(this.src);
      }
      
      $sc(this).filter("[type!='text/sitecore']").remove();      
    });

    var styleSheets = [];
    form.find("link[rel='stylesheet']").each(function() {
      if (this.href) {
        styleSheets.push(this.href);
      }
      
      $sc(this).remove();
    });
       
    var layout = form.find("#scLayoutDefinitionHolder");
    if (layout.length < 1) {
      delete tmp;
      return null;
    }

    var result = {};
    result.scripts = scripts;
    result.styleSheets = styleSheets;
    result.layout = layout.text();
    
    var url = form.find("#scUrlHolder");
    if (url.length > 0) {
      result.url = url.text();
      delete tmp;
      return result;
    }

    var htmlHolder = form.find("#scHTMLHolder");
    if (htmlHolder.length < 1)
    {
      delete tmp;
      return null;
    }

    result.html = htmlHolder.get(0).innerHTML;   

    delete tmp;
    return result;
  };

  this.renderTemplate = function(templateName, template, data, options) {
    if (!$sc.template[templateName]) {
      $sc.template(templateName, template);
    }

    return $sc.tmpl(templateName, data, options);
  };

  this.removeCookie = function(name, path, domain, secure) {
    if (this.getCookie(name)) {
      var expires = new Date();
      expires.setMonth(expires.getMonth() - 1);
      this.setCookie(name, "", expires, path, domain, secure); 
    }
  }; 

  this.setCookie = function(name, value, expires, path, domain, secure) {
    if (expires == null) {
      expires = new Date();
      expires.setMonth(expires.getMonth() + 3);
    }
    
    if (path == null) {
      path = "/";
    }

    document.cookie = name + "=" + escape(value) +
      (expires ? "; expires=" + expires.toGMTString() : "") +
      (path ? "; path=" + path : "") +
      (domain ? "; domain=" + domain : "") +
      (secure ? "; secure" : "");
  };
  
  this.tryAddScripts = function(scriptUrls) {
    if (!scriptUrls) {
      return;
    }

    if (!scriptUrls.length || scriptUrls.length < 1) {
      return;
    }

    var pageScripts = $sc("script");    
    for (var i = 0; i < scriptUrls.length; i++) {
      var url = scriptUrls[i];
      if (!$sc.exists(pageScripts, function () { return this.src == url; })) {
        try {
          var script = document.createElement('script');
          script.type = 'text/javascript';
          script.src = url;
          var head = document.getElementsByTagName("head")[0];
          if (!head) {
            head = document.createElement("head");
            document.appendChild(head);
          }

          head.appendChild(script);
        }
        catch(ex) {
          console.log("Failed to add script " + url);
        }
      }            
    }
  };

  this.tryAddStyleSheets = function(hrefs) {
    if (!hrefs) {
      return;
    }

    if (!hrefs.length || hrefs.length < 1) {
      return;
    }

    var styleSheets = $sc("link[rel='stylesheet']");    
    for (var i = 0; i < hrefs.length; i++) {
      var url = hrefs[i];
      if (!$sc.exists(styleSheets, function () { return this.href == url; })) {
        try {
          if (document.createStyleSheet) {
            document.createStyleSheet(url);
          }
          else {
            var newSS = document.createElement('link');
            newSS.rel = 'stylesheet';
            newSS.href = url;
            document.getElementsByTagName("head")[0].appendChild(newSS);
          }
        }
        catch(ex) {
          console.log("Failed to add styleshhet " + url);
        }
      }            
    }
  }; 

  this.unescapeHtml = function(html) {
    if (!html) {
      return html;
    }

    return html.replace(/&lt;/gi, "<").replace(/&gt;/gi, ">");
};
};
