Sitecore.PageModes.HoverFrame = Sitecore.PageModes.ChromeFrame.extend({
  constructor: function() {
    this.base();
    this.cornerSize = {height: 4, width: 4};
    this.createSides();   
  },

  createSides: function() {
    this.top = $sc("<div></div>").addClass(this.horizontalSideClassName());
    this.topLeftCorner = $sc("<div></div>").addClass(this.verticalSideClassName() + " scTlHoverFrameCorner");

    this.topRightCorner = $sc("<div></div>").addClass(this.horizontalSideClassName() + " scTrHoverFrameCorner");
    this.right = $sc("<div></div>").addClass(this.verticalSideClassName());

    this.bottom = $sc("<div></div>").addClass(this.horizontalSideClassName());
    this.bottomLeftCorner = $sc("<div></div>").addClass(this.verticalSideClassName() + " scBlHoverFrameCorner");

    this.bottomRightCorner = $sc("<div></div>").addClass(this.horizontalSideClassName() + " scBrHoverFrameCorner");
    this.left = $sc("<div></div>").addClass(this.verticalSideClassName());
    
    sides = new Array();
    this.sides = sides;
    
    sides.push(this.top);
    sides.push(this.topLeftCorner);
    sides.push(this.topRightCorner);
    sides.push(this.right);
    sides.push(this.bottom);
    sides.push(this.bottomLeftCorner);
    sides.push(this.bottomRightCorner);
    sides.push(this.left);

    this.base();
  },
  
  horizontalSideClassName: function() {
    return "scHoverFrameSideHorizontal";
  },

  verticalSideClassName: function() {
    return "scHoverFrameSideVertical";
  },
  
  calculateSideLengths: function(dimensions) {
    var horizontal = dimensions.width - 2 * this.cornerSize.width;
    var vertical = dimensions.height - 2 * this.cornerSize.height;
    
    return { horizontal: horizontal > 0 ? horizontal : 0, vertical: vertical > 0 ? vertical : 0};    
  },
      
  showSides: function(chrome) {            
    var offset = chrome.position.offset();
    var dimensions = chrome.position.dimensions();
    
    var sideLengths = this.calculateSideLengths(dimensions);

    var leftCornerX = offset.left;    
    var horizontalX = leftCornerX + this.cornerSize.width;    
    var verticalLeftX = leftCornerX;
    var verticalRightX = offset.left + dimensions.width - 1;
    var rightCornerX = verticalRightX - this.cornerSize.width + 1;

    var topY = offset.top;
    var bottomY = offset.top + dimensions.height - 1;
    var verticalY = topY + this.cornerSize.height;
    var bottomCornerY = offset.top + dimensions.height - this.cornerSize.height;

    this.setSideStyle(this.top, topY, horizontalX, sideLengths.horizontal);
    this.setSideStyle(this.topLeftCorner, topY , leftCornerX);
    
    this.setSideStyle(this.topRightCorner, topY, rightCornerX);
    this.setSideStyle(this.right, verticalY, verticalRightX, sideLengths.vertical);

    this.setSideStyle(this.bottom, bottomY, horizontalX, sideLengths.horizontal);
    this.setSideStyle(this.bottomLeftCorner, bottomCornerY, leftCornerX);
    
    this.setSideStyle(this.bottomRightCorner, bottomCornerY, rightCornerX);
    this.setSideStyle(this.left, verticalY, verticalLeftX, sideLengths.vertical);
      
    this.base(chrome);
  }
});