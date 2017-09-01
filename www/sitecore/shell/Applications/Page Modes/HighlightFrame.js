Sitecore.PageModes.HighlightFrame = Sitecore.PageModes.HoverFrame.extend({      
  horizontalSideClassName: function() {
    return this.base() + " scHilghlightedChrome";
  },

  verticalSideClassName: function() {
    return this.base() + " scHilghlightedChrome";
  },
   
  dispose: function() {
    if (this.sides) {
      $sc.each(this.sides, function() {
        this.remove();
      });
    }

    this.sides = null;
  }  
});