Sitecore.PageModes.ChromeFrame = Base.extend({
  constructor: function() {
    this.sides = new Array();
  },
  
  addSidesToDom: function() {       
    $sc.each(this.sides, function() {
      $sc(this).css("display", "none").appendTo(document.body);      
    });
  },

  applyCssClass:function(className) {
    $sc.each(this.sides, function() {
      this.addClass(className);
    });
  },

  removeCssClass:function(className) {
    $sc.each(this.sides, function() {
      this.removeClass(className);
    });
  },

  activate: function() {
    this.removeCssClass("scInvisible");
  },

  deactivate: function() {
    this.applyCssClass("scInvisible");
  },

  horizontalSideClassName: function() {
    return "";
  },

  verticalSideClassName: function() {
    return "";
  },

  createSides: function() {
    this.addSidesToDom();
  },

  hide: function() {
    if (this.sides) {
      var length = this.sides.length;
      for (var i = 0; i < length; i++) {
        this.sides[i].hide();
    }
    }
  },

  show: function(chrome) {
    if (chrome == null) return;

    if (this.sides == null || this.sides.length == 0) {
      this.createSides();
    }
            
    this.showSides(chrome);
  },
  
  showSides: function() {
     var length = this.sides.length;
     for (var i = 0; i < length; i++) {
       this.sides[i].show();
     }
  },

  setSideStyle: function (side, top, left, length) {
    side.css({top: top + "px", left: left + "px" });
    if (typeof(length) == "undefined") return;
    
    if (side.hasClass(this.horizontalSideClassName())) {
      side.css({ width: length < 0 ? "0" : length  + "px" });
      return;
    }

    if (side.hasClass(this.verticalSideClassName())) {
      side.css({ height: length < 0 ? "0" : length + "px"});
      return;
    }

    console.error("Unknown side type");
  } 
});