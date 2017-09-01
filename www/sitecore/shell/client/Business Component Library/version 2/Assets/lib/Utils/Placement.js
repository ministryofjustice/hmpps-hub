define(["jquery"], function () {

  // Get available space around the element relatively to viewport for each direction (top, bottom, left, right)
  function getSurroundingSpace(element) {
    var $window = $(window),
        $element = $(element),
        windowWidth = $window.outerWidth(),
        windowHeight = $window.outerHeight(),
        elementOffset = $element.offset(),
        elementHeight = $element.outerHeight(),
        elementWidth = $element.outerWidth();

    return {
      top: elementOffset.top - $window.scrollTop(),
      bottom: windowHeight + $window.scrollTop() - (elementOffset.top + elementHeight),
      left: elementOffset.left - $window.scrollLeft(),
      right: windowWidth + $window.scrollLeft() - (elementOffset.left + elementWidth)
    }
  }

  return {
    
    // Calculate placement of popover (Bootstrap placement calculations doesn't work as expected)
    calculatePlacement: function (complexPlacement, tip, element) {
      var preferredPlacement = $.trim(complexPlacement.replace(this.autoToken, '')),
          defaultPlacement = "top",
          $element = $(element),
          // To have possibility to get actual size, tip should be displayed           
          $tip = $(tip).clone().appendTo('body').css({ visibility: 'hidden' }),
          tipWidth = $tip.outerWidth(),
          tipHeight = $tip.outerHeight(),
          availableSpace = getSurroundingSpace($element),
          isEnoughSpaceForPreferredPlacement = (preferredPlacement.length > 0 && availableSpace[preferredPlacement] > 0) ?
            (availableSpace[preferredPlacement] - ((preferredPlacement === 'left' || preferredPlacement === 'right') ? tipWidth : tipHeight)) > 0 :
            false,
          veritcalAutoPlacement,
          horizontalAutoPlacement;

      preferredPlacement = preferredPlacement.length ? preferredPlacement : null;

      // Detach tip from body after getting actual size
      $tip.css({ visibility: 'visible' }).detach();

      if (isEnoughSpaceForPreferredPlacement) {
        return preferredPlacement;
      }

      horizontalAutoPlacement = availableSpace['right'] - tipWidth > 0 ?
        'right' :
        availableSpace['left'] - tipWidth > 0 ?
          'left' :
          null;

      veritcalAutoPlacement = availableSpace['top'] - tipHeight > 0 ?
        'top' :
        availableSpace['bottom'] - tipHeight > 0 ?
          'bottom' :
          null;

      return horizontalAutoPlacement || veritcalAutoPlacement || preferredPlacement || defaultPlacement;
    }
  }
});