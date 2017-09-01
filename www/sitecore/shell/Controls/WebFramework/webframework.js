if (typeof (Sitecore) == "undefined") Sitecore = new Object;
if (typeof (Sitecore.UI) == "undefined") Sitecore.UI = new Object;

Sitecore.UI.WebFramework = function() {
  var controls = new Object();
  var controlPrototypes = new Object();
  
  var createObject = function(prototype) {
    var F = function() {};
    F.prototype = prototype;
    return new F();
  };

  var injectLayoutElements = function() {
    jQuery(".wf-container").prepend("<div id='wf-dropshadow-left'></div><div id='wf-dropshadow-right'></div>");
    jQuery(".wf-configsection h2").wrapInner(document.createElement("span"));
  };
  
  var initializeControls = function() {
    for(var name in controlPrototypes) {
      var p = controlPrototypes[name];
      
      if (!p.name || !p.prototype) {
        continue;
      }
      
      jQuery(p.name).each(function() {
        var instance = createObject(p.prototype);
        controls[this] = instance;
        instance.init(this);
      });      
    }
  };
  
  var initializeCompatibilityEvents = function() {
    // fixing button's :active state in IE
    
    if (jQuery.browser.msie) {
      jQuery(".wf-actionbutton").mousedown(function() { jQuery(this).addClass("wf-csscompat-active"); })
                         .mouseup(function() { jQuery(this).removeClass("wf-csscompat-active"); })
                         .mouseleave(function() { jQuery(this).removeClass("wf-csscompat-active"); });
    }
    
  };
  
  var initializeWatermarks = function() {
    var watermarks = jQuery(".wf-watermarked");
    if (watermarks.length == 0) {
      return;
    }
   
    if (!$.updnWatermark) {
      alert("Sitecore web framework watermark script is missing. You have to include /sitecore/shell/controls/lib/jQuery/jquery.watermark.js to use watermarks");
      return;
    }
    
    watermarks.updnWatermark({ cssClass: "wf-watermark" });
  };
  
  var setCompatibilityClasses = function() {
    if (jQuery.browser.msie && jQuery.browser.version[0] == '6')
    {
      jQuery("input[type='submit'], input[type='button']").addClass("wf-csscompat-button");
    }
  };

  return {
    initialize: function() {
      injectLayoutElements();
      setCompatibilityClasses();
      initializeWatermarks();
      initializeCompatibilityEvents();
      initializeControls();      
    },
    
    control: function(node) {
      if (typeof(node) == "string") {
        node = document.getElementById(node);
      }
    
      return controls[node];
    },
    
    registerControl: function(name, prototype) {
      controlPrototypes[name] = {name: name, prototype: prototype};
    }
  }
} ();

if (typeof(Sitecore) == "undefined") { Sitecore = new Object(); }
Sitecore.control = Sitecore.UI.WebFramework.control;

jQuery(document).ready(function() {
  Sitecore.UI.WebFramework.initialize();
});

Sitecore.UI.WebFramework.registerControl(".wf-collapsiblesection", {
  init: function(element) {
    this.element = jQuery(element);
    var control = this;
    
    this.element.find("h2 a").click(function(e) {
      control.toggle();
      return false;
    });
    
    this.content = jQuery(this.element).find(".wf-sectioncontent");
  },

  expand: function() {
    jQuery(this.content).slideDown("fast");
    jQuery(this.element).removeClass("wf-collapsiblesection-collapsed");
  },
    
  collapse: function() {
    jQuery(this.content).slideUp("fast");
    jQuery(this.element).addClass("wf-collapsiblesection-collapsed");
  },
  
  isCollapsed: function() {
    return this.element.hasClass("wf-collapsiblesection-collapsed");
  },
  
  toggle: function() {
    this.isCollapsed() ? this.expand() : this.collapse();
  }
});

Sitecore.UI.WebFramework.registerControl(".wf-progress-bar", {
  init: function(element) {
    this.element = jQuery(element);
    
    this.background = this.element.find(".wf-progress-background");
    this.filler = this.element.find(".wf-progress-filler");
    this.text = this.element.find("p");
    
    this.animatedFillerWidth = 65;
    this.animationInterval = 25;
    this.animationStep = 3;    
  },
  
  animateIndefinite: function() {
    this.element.addClass("wf-progress-box-playing");
    this.filler.css({ width: this.animatedFillerWidth + 'px' });    
    this.animationLoop();
  },
  
  animationLoop: function() {
    if (!this.isPlaying()) {
      return;
    }
  
    var width = this.background.width();
    var left = this.filler.css("left").replace("px", "");
    
    left = parseInt(left);
    left += this.animationStep;
    
    if (left >= width - this.animationStep) {
      left = 1;
    }
    
    if (left >= width - this.animatedFillerWidth) {
      this.filler.css({ width: width - left });
    }
    else {
      this.filler.css({ width: this.animatedFillerWidth + 'px' });
    }
    
    this.filler.css({ left: left + "px" });
    
    var control = this;    
    setTimeout(function() { control.animationLoop(); }, this.animationInterval);
  },
  
  isPlaying: function() {
    return this.element.hasClass("wf-progress-box-playing");
  },
  
  fail: function() {
    this.element.addClass("wf-state-error");
  },
  
  setProgress: function(percentage){
    if (this.isPlaying()) {
      this.element.removeClass("wf-progress-box-playing");
      this.filler.css({ left: "1px" });
      this.filler.css({ width: percentage });
    }
    else {
      this.filler.animate({ width: percentage });
    }
  },
  
  setText: function(text) {
    this.text.html(text);
  }
});