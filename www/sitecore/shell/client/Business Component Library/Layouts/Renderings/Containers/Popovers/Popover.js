/// <reference path="../../../../../../assets/lib/dist/sitecore.js" />

define(["sitecore", "bootstrap", "jquery"], function(_sc) {
  _sc.Factories.createBaseComponent({
    name: "Popover",
    base: "ComponentBase",
    selector: ".sc-popover",
    attributes: [
      { name: "targetControl", value: "$el.data:sc-targetcontrol" },
      { name: "trigger", defaultValue: "click", value: "$el.data:sc-trigger" },
      { name: "placement", defaultValue: "auto", value: "$el.data:sc-placement" }
    ],

    autoToken: /\s?auto?\s?/i,

    initialize: function() {
      this._super();
      var targetId = this.model.get("targetControl");
      var trigger = this.model.get("trigger");
      var placement = this.model.get("placement");
      var content = $("[data-sc-id='" + this.$el.attr("data-sc-id") + "']");
      var parent = content.parent();
      var target = $("[data-sc-id='" + targetId + "']");

      target.popover({
        placement: _.bind(function (tip, element) {
          var autoPlace = this.autoToken.test(placement);

          if (!autoPlace) {
            return placement;
          } else {
            return this.calculatePlacement(placement, tip, element);
          }
        }, this),
        html: true,
        trigger: trigger,
        content: content,
        container: 'body',
        template: '<div class="popover"><div class="arrow"></div><div class="popover-inner"><div class="popover-content"></div></div></div>'
      }).on('hidden.bs.popover', function() {
        parent.append(content);
      });

      var adjustPosition = function() {
        if (content.is(":hidden")) {
          return;
        }

        if (target.is(":hidden") || isVisibilityHidden(target)) {
          target.popover("hide");
          return;
        }

        target.popover("show");
      };

      popovers[this.model.get("name")] = {
        target: target,
        content: content,
        wrapperSelector: ".popover"
      };

      // Debounce will improve performance on resize
      $(window).resize(_.debounce(adjustPosition, 100));
    },

    // Calculate placement of popover (Bootstrap placement calculations doesn't work as expected)
    calculatePlacement: function (complexPlacement, tip, element) {
      var preferredPlacement = $.trim(complexPlacement.replace(this.autoToken, '')),
          defaultPlacement = "top",
          $element = $(element),
          // To have possibility to get actual size, tip should be displayed
          // TODO: when "actualSize" method will be moved to helpers, then it should be used here
          $tip = $(tip).appendTo('body').css({ visibility: 'hidden' }),
          tipWidth = $tip.outerWidth(),
          tipHeight = $tip.outerHeight(),
          availableSpace = getSurroundingSpace($element),
          isEnoughSpaceForPreferredPlacement = preferredPlacement.length && availableSpace[preferredPlacement] ?
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
  });

  function isVisibilityHidden(target) {
    return $.grep(target.parents().andSelf(), function(el) {
      return $(el).css("visibility") == "hidden";
    }).length > 0;
  }
  
  // Get available space around the element relatively to viewport for each direction (top, bottom, left, right)
  // TODO: Move method to SPEAK helpers
  function getSurroundingSpace(element) {
    var windowWidth = $(window).outerWidth(),
        windowHeight = $(window).outerHeight(),
        elementOffset = $(element).offset(),
        elementHeight = $(element).outerHeight(),
        elementWidth = $(element).outerWidth();

    return {
      top: elementOffset.top,
      bottom: windowHeight - (elementOffset.top + elementHeight),
      left: elementOffset.left,
      right: windowWidth - (elementOffset.left + elementWidth)
    }
  }

  var popovers = {};

  $(document).on("click", function (e) {
    _.each(popovers, function (popover) {
      if (popover.content.is(":visible") &&
        !$(e.target).is(popover.target) &&
        !$(e.target).is(popover.wrapperSelector)) {

        if (!$(e.target).closest(popover.target).length && !$(e.target).closest(popover.wrapperSelector).length) {
          popover.target.popover("hide");
        }
      }
    });
  });

});



