Sitecore.PageModes.SelectionFrame = Sitecore.PageModes.ChromeFrame.extend({
 constructor: function() {
    this.base();
    this.createSides();                
    this.controls = new Sitecore.PageModes.ChromeControls();    
    this._chromeResizeHandler = $sc.proxy(this.onChromeResize, this);
  },

  activate: function() {
    this.controls.activate();
    this.base();
  },

  deactivate: function() {
    this.controls.deactivate();
    this.base();
  },

  horizontalSideClassName: function() {
    return "scFrameSideHorizontal";
  },

  verticalSideClassName: function() {
    return "scFrameSideVertical";
  },
   
  calculateSideLengths: function(dimensions) {
    var horizontal = dimensions.width;
    var vertical = dimensions.height;
    
    return { horizontal: horizontal, vertical: vertical};    
  },

  createSides: function() {
    this.top = $sc("<div></div>").addClass(this.horizontalSideClassName());            
    this.right = $sc("<div></div>").addClass(this.verticalSideClassName());  
    this.bottom = $sc("<div></div>").addClass(this.horizontalSideClassName());
    this.left = $sc("<div></div>").addClass(this.verticalSideClassName());
           
    sides = new Array();
    this.sides = sides;
    
    sides.push(this.top);
    sides.push(this.right);
    sides.push(this.left);
    sides.push(this.bottom);
    
    this.base();  
  },
  
  hide: function() {
    this.base();
    this.controls.hide();
    
    this.visible = false;
    
    this.chrome.position.updated.stopObserving(this._chromeResizeHandler);
  },
  
  onChromeResize: function() {        
    this.show(this.chrome);
  },
  
  show: function(chrome) {
    if (this.chrome) {
      this.chrome.position.updated.stopObserving(this._chromeResizeHandler);
    }

    this.chrome = chrome;    
    this.base(chrome);
  },

  showSides: function(chrome) {              
    var offset = chrome.position.offset();
    var dimensions = chrome.position.dimensions();
       
    var sideLengths = this.calculateSideLengths(dimensions);       
    var duration = 200;    
    if (this.visible) {
      var previousOffset = this.top.offset();
      var distance = Math.sqrt(Math.pow(offset.left - previousOffset.left, 2) + Math.pow(offset.top - previousOffset.top, 2));
      
      duration = distance / 1.5;
      if (duration < 200) duration = 200;
      if (duration > 1000) duration = 1000;
    }
        
    this.controls.show(chrome, this.visible ? duration : false);

    var horizontalTopY = offset.top;
    var horizontalX =  offset.left;
    var horizontalBottomY = offset.top + sideLengths.vertical - 1;

    var verticalLeftX = offset.left;
    var verticalY = offset.top;
    var verticalRightX =  offset.left + sideLengths.horizontal - 1;

    //make selection frame wider for content editable elements in order to make caret visible in the first and last position
    if (chrome.type.key() == "field" && chrome.type.contentEditable()) {
      // Decrease left border coordinates to make cursor visible when it is placed in the first position 
      verticalLeftX--;
      // increase right border coordinates to avoid the lagging right border overlap the text when typing.
      // This also resolves the problem with the first space inserted at the last position doesn't increase the border width(sc:332300)
      var rightShift = chrome.type.fontSize ? chrome.type.fontSize : 1;
      verticalRightX += rightShift;
      
      sideLengths.horizontal += rightShift;
    }
     
    if (!this.visible) {
      this.setSideStyle(this.top, horizontalTopY, horizontalX, sideLengths.horizontal);                 
      this.setSideStyle(this.right, verticalY, verticalRightX, sideLengths.vertical);      
      this.setSideStyle(this.left, verticalY, verticalLeftX , sideLengths.vertical);      
      this.setSideStyle(this.bottom, horizontalBottomY , horizontalX, sideLengths.horizontal);
                  
      this.visible = true;
      this.base(dimensions, offset);
    }
    else {
      this.top.stop(true).animate({ width: sideLengths.horizontal + "px", top: horizontalTopY + "px", left: horizontalX + "px"}, duration);            
      this.right.stop(true).animate({ height: sideLengths.vertical + "px", top: verticalY + "px", left: verticalRightX + "px"}, duration);      
      this.left.stop(true).animate({ height: sideLengths.vertical + "px", top: verticalY + "px", left: verticalLeftX + "px"}, duration);      
      this.bottom.stop(true).animate({ width: sideLengths.horizontal + "px", top: horizontalBottomY + "px", left: horizontalX + "px"}, duration);      
    }
    
    chrome.position.updated.observe(this._chromeResizeHandler);       
  }
});