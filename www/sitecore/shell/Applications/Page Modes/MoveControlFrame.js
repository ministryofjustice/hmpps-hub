Sitecore.PageModes.MoveControlFrame = Sitecore.PageModes.ChromeFrame.extend({
  constructor: function() {
    this.base();
    this.bgVerticalPatternSize = {height: 3, width: 8};
    this.bgHorizontalPatternSize = {height: 8, width: 3};       
  },

  horizontalSideClassName: function() {
    return "scMoveControlSideHorizontal";
  },

  verticalSideClassName: function() {
    return "scMoveControlSideVertical";
  },

  calculateSideLengths: function(dimensions) {
    var horizontal = dimensions.width;
    var vertical = dimensions.height - 2 * this.bgHorizontalPatternSize.height;    
    return { horizontal: horizontal, vertical: vertical};    
  },    

  showSides: function(chrome) {    
    var offset = chrome.position.offset();
    var dimensions = chrome.position.dimensions();
            
    var sideLengths = this.calculateSideLengths(dimensions);
    
    var horizontalSideLengthLeft = Math.ceil(sideLengths.horizontal / 2);
    var horizontalSideLengthRight = Math.floor(sideLengths.horizontal / 2);
            
    var verticalSideLengthTop = Math.ceil(sideLengths.vertical / 2);
    var verticalSideLengthBottom = Math.floor(sideLengths.vertical / 2);
    
    var topHorizontalY = offset.top;
    var bottomHorizontalY = offset.top + dimensions.height - this.bgHorizontalPatternSize.height;

    var leftHorizontalX = offset.left;    
    var rightHorizontalX = leftHorizontalX + horizontalSideLengthLeft;

    var verticalRightX = rightHorizontalX + horizontalSideLengthRight - this.bgVerticalPatternSize.width;
    var verticalLeftX = offset.left;

    var verticalTopY = offset.top + this.bgHorizontalPatternSize.height;   
    var verticalBottomY = verticalTopY + verticalSideLengthTop; 
    
       
    this.setSideStyle(this.topLeftHorizontal, topHorizontalY, leftHorizontalX, horizontalSideLengthLeft);    
    this.setSideStyle(this.topRightHorizontal, topHorizontalY, rightHorizontalX, horizontalSideLengthRight);

    this.setSideStyle(this.rightTopVertical, verticalTopY, verticalRightX, verticalSideLengthTop);    
    this.setSideStyle(this.rightBottomVertical, verticalBottomY, verticalRightX, verticalSideLengthBottom);

    this.setSideStyle(this.bottomLeftHorizontal, bottomHorizontalY, leftHorizontalX, horizontalSideLengthLeft);    
    this.setSideStyle(this.bottomRightHorizontal, bottomHorizontalY, rightHorizontalX, horizontalSideLengthRight);

    this.setSideStyle(this.leftTopVertical, verticalTopY, verticalLeftX, verticalSideLengthTop);    
    this.setSideStyle(this.leftBottomVertical, verticalBottomY, verticalLeftX, verticalSideLengthBottom);

    this.base();
  },

  createSides: function() {
    this.topLeftHorizontal = $sc("<div></div>").addClass(this.horizontalSideClassName() + " scLeftPart scTopSide");    
    this.topRightHorizontal = $sc("<div></div>").addClass(this.horizontalSideClassName() + " scRightPart scTopSide");

    this.rightTopVertical = $sc("<div></div>").addClass(this.verticalSideClassName() + " scTopPart scRightSide");    
    this.rightBottomVertical = $sc("<div></div>").addClass(this.verticalSideClassName() + " scBottomPart scRightSide");
    
    this.bottomLeftHorizontal = $sc("<div></div>").addClass(this.horizontalSideClassName() + " scLeftPart scBottomSide");    
    this.bottomRightHorizontal = $sc("<div></div>").addClass(this.horizontalSideClassName() + " scRightPart scBottomSide");

    this.leftTopVertical = $sc("<div></div>").addClass(this.verticalSideClassName() + " scTopPart scLeftSide");    
    this.leftBottomVertical = $sc("<div></div>").addClass(this.verticalSideClassName() + " scBottomPart scLeftSide");

    sides = new Array();
    this.sides = sides;

    sides.push(this.topLeftHorizontal);    
    sides.push(this.topRightHorizontal);

    sides.push(this.bottomLeftHorizontal);    
    sides.push(this.bottomRightHorizontal);

    sides.push(this.rightTopVertical);    
    sides.push(this.rightBottomVertical);

    sides.push(this.leftTopVertical);    
    sides.push(this.leftBottomVertical);
    
    this.base();
  }
});