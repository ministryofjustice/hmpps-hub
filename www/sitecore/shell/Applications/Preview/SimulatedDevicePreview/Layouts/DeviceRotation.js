DeviceRotation = function(buttonContainer, device ,$, options) {
  var $button, $buttonContainer, $device, deviceStates = [], $animationObject = $({});
  var onRotationStart, onRotationEnd;

  var isRotated = function() {
    return $buttonContainer.is(".rotated");
  }

  var getScreenContainer = function() {
     return $(document.getElementById("screenContainer"));
  }
  
  var rotate = function(evt) {
     if ($animationObject.is(":animated")) {
      return;
     }

     if (isRotated()) {
        doRotate(1);
     }
     else {
        doRotate(-1);
     }     
  }

  var doRotate = function(direction) {    
    if (onRotationStart) {
      onRotationStart();
    }

    var newState = deviceStates[direction < 0 ? 0 : direction];    
    var angleToRotate = 90;    
    var animationDuration = !Modernizr.csstransforms ? 0 : 500;    
    var currentHeight = parseInt($device.css("height"));
    var newHeight = parseInt(newState.size.height);
    var shift = Math.round(newHeight/2 - currentHeight/2);
    $animationObject = $({rotationAngle: 0, top: 0});
    $animationObject.animate(
      { rotationAngle: direction  * angleToRotate, top: shift },
      {
        duration: animationDuration,       
        step: function(v, fx) {          
          if (fx.prop === "top") {
            $device.css("top", Math.round(v) + "px");            
          }         
          else {
            var value = "rotate(" + Math.round(v) + "deg)";            
            device.style.MozTransform = value;
            device.style.webkitTransform = value;
            device.style.msTransform = value;
            device.style.transform = value;           
          }
        },

        complete:function() {          
          if (direction > 0) {
            $buttonContainer.removeClass("rotated");
          }
          else {
            $buttonContainer.addClass("rotated");
          }

          updateDeviceState(newState);         
          $device.css({         
          "top": "0"          
          });

          device.style.MozTransform = "none";
          device.style.webkitTransform = "none";
          device.style.msTransform = "none";
          device.style.transform = "none"; 
          if (onRotationEnd) {
            onRotationEnd();                       
          } 
        }
      }
      );    
  }

  var setDeviceStates = function() {
    var $screenContainer = getScreenContainer();
    var initialState = {      
      size: { height: $device.css("height"), width: $device.css("width")  },
      backgroundImage: $device.css("background-image"),
      screenSize: { height: $screenContainer.css("height"), width: $screenContainer.css("width") },
      screenOffset: {top: $screenContainer.css("top"), left: $screenContainer.css("left") }
    }

    var alternateState = {
      size: { height: $device.attr("data-onrotation-height"), width: $device.attr("data-onrotation-width") },
      backgroundImage: $device.attr("data-onrotation-background"),
      screenSize: { height: $screenContainer.attr("data-onrotation-height"), width: $screenContainer.attr("data-onrotation-width") },
      screenOffset: {top: $screenContainer.attr("data-onrotation-top"), left: $screenContainer.attr("data-onrotation-left") }
    }

    if (isRotated()) {
      deviceStates[0] = initialState;
      deviceStates[1] = alternateState;
    }
    else {
      deviceStates[0] = alternateState;
      deviceStates[1] = initialState;      
    }   
  }

  var updateDeviceState = function(state) {                         
    $device.css({
      backgroundImage: state.backgroundImage,
      height: state.size.height,
      width: state.size.width,
      left: "-" + parseInt(state.size.width) /2  + "px"
    });
    
    var $screenContainer = getScreenContainer(); 
    $screenContainer.css({
      top: state.screenOffset.top,
      left: state.screenOffset.left,
      height: state.screenSize.height,
      width: state.screenSize.width
    });       
  }

  var setRotationStartHandler = function(handler) {
     onRotationStart = handler;
  }

  var setRotationEndHandler = function(handler) {
     onRotationEnd = handler;
  }

  $buttonContainer = $(buttonContainer);
  $button = $buttonContainer.children(".rotate").click(rotate);
  $device = $(device); 
  setDeviceStates();
     
  return {
    rotate: doRotate,
    isRotated: isRotated,
    setRotationStartHandler: setRotationStartHandler,
    setRotationEndHandler: setRotationEndHandler
  };
};