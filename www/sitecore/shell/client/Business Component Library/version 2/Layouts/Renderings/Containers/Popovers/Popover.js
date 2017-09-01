(function (speak) {
    speak.component(["bclPlacement", "knockout", "bootstrap"], function(placement) {
      return speak.extend({}, {
        name: "Popover",
        initialize: function() {
          this.$el = $(this.el);
        },
        autoToken: /\s?auto?\s?/i,
        initialized: function() {
          this.$parent = this.$el.parent();
          this.$targetEl = $("[data-sc-id='" + this.TargetControl + "']");
          if (!this.$targetEl) {
            console.log("can't find Target ID " + this.TargetControl);
          }
          var self = this;
          this.$targetEl.popover({
            placement: function(tip, element) {
              var autoPlace = self.autoToken.test(self.Placement);

              if (!autoPlace) {
                return self.Placement;
              } else {
                return placement.calculatePlacement(self.Placement, tip, element);
              }
            },
            html: true,
            trigger: this.Trigger,
            content: this.$el,
            container: 'body',
            template: '<div class="popover"><div class="arrow"></div><div class="popover-inner"><div class="popover-content"></div></div></div>'
          }).on('hidden.bs.popover', function() {
            self.$parent.append(self.$el);
          });

          var adjustPosition = function() {

            if (self.$parent.is(":hidden")) {
              return;
            }

            if (self.$targetEl.is(":hidden") || self.isVisibilityHidden(self.$targetEl)) {
              self.$targetEl.popover("hide");
              return;
            }

            self.$targetEl.popover("show");
          };

          popovers[self.id] = {
            target: self.$targetEl,
            content: self.$el,
            wrapperSelector: ".popover"
          };

          // Debounce will improve performance on resize
          $(window).resize(_.debounce(adjustPosition, 100));
        },

        isVisibilityHidden: function($target) {
          return $.grep($target.parents().andSelf(), function(el) {
            return $(el).css("visibility") == "hidden";
          }).length > 0;
        }
      });
    },"Popover"
    );
})(Sitecore.Speak);

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