(function (speak) {

  speak.component(["bclUserProfile"], function () {
    var elements = {};
    return {
      initialize: function () {
        this.$el = $(this.el);
      },
      initialized: function () {
        elements = {
          $actionBarContainer: $('.sc-expander-header-actionbar .sc-expander-header-actionbar-container', this.$el),
          $actionBar: $('.sc-expander-header-actionbar', this.$el),
          $promotedFields: this.$el.find('.sc-expander-header-promotedfields'),
          $header: $(".sc-expander-header", this.$el),
          $headerTitle: $(".sc-expander-header-title", this.$el),
          $headerChevron: $(".sc-expander-header-chevron", this.$el),
          $imageContainer: this.$el.find(".sc-expander-header-icon-container")
        };

        this.userProfile = Sitecore.Speak.module('bclUserProfile');
        if (!this.IsStateDiscarded) {
          var userProfileStatusObject = this.UserProfileState ? this.userProfile.parseState(this.UserProfileState) : {};
          if (userProfileStatusObject.IsOpen !== undefined) {
            this.IsOpen = userProfileStatusObject.IsOpen;
          }
        }

        this.syncIconWidth();
        this.on("change:HeaderIcon", this.changeIcon, this);

        this.on("change:IsExtraFieldsShown", function () {
          speak.trigger((this.IsExtraFieldsShown ? "more" : "less") + ":" + this.Id);
        }, this);

        this.on("change:IsOpen", function () {
          speak.trigger((this.IsOpen ? "opened" : "closed") + ":" + this.Id);
          this.ShowActionBar = this.HasContentInActionBar && this.IsOpen;
          this.updateStateInUserProfile();
        }, this);

        speak.on("hidepromotedfields:" + this.Id, this.hidePromotedFields, this);
        speak.on("showpromotedfields:" + this.Id, this.showPromotedFields, this);
        speak.on("open:" + this.Id, this.open, this);
        speak.on("close:" + this.Id, this.close, this);


        var self = this;
        var handlerIn = function () {
          if (self.HasContentInActionBar && !self.IsOpen) {
            elements.$actionBarContainer.show();
            elements.$actionBar.removeClass("sc-actionbar-collapsed");
          }
        };

        var handlerOut = function () {
          if (self.HasContentInActionBar && !self.IsOpen) {
            elements.$actionBarContainer.hide();
            elements.$actionBar.removeClass("sc-actionbar-collapsed").addClass("sc-actionbar-collapsed");
          }
        };

        elements.$header.hover(handlerIn, handlerOut);
        elements.$headerTitle.hover(handlerIn, handlerOut);
        elements.$actionBar.hover(handlerIn, handlerOut);
        elements.$headerChevron.hover(handlerIn, handlerOut);

        this.defineProperty("HasContentInActionBar", elements.$actionBarContainer.has("*").length != 0);
        this.defineProperty("ShowActionBar", this.HasContentInActionBar && this.IsOpen);
      },
      close: function () {
        if (this.IsCollapsible) {
          this.IsOpen = false;
        }
      },
      open: function () {
        if (this.IsCollapsible) {
          this.IsOpen = true;
        }
      },

      toggle: function (argsObject, e) {
        var isTargetLocatedInsideActionBar = false;

        if (argsObject && argsObject.length > 0) {
          isTargetLocatedInsideActionBar = $(argsObject[1].target).parents(".sc-expander-header-actionbar").length > 0;
        }

        if (e && e.target) {
          isTargetLocatedInsideActionBar = $(e.target).parents(".sc-expander-header-actionbar").length > 0;
        }

        if (!isTargetLocatedInsideActionBar) {
          if (this.IsCollapsible) {
            this.IsOpen = !this.IsOpen;
          }
        }
      },

      toggleExtraFields: function () {
        this.IsExtraFieldsShown = !this.IsExtraFieldsShown;
      },
      showPromotedFields: function (html) {
        elements.$promotedFields.html(html);
      },
      hidePromotedFields: function () {
        elements.$promotedFields.text("");
      },
      syncIconWidth: function () {
        if (elements.$imageContainer) {
          var $image = elements.$imageContainer.find("img");
          if (this.HeaderIcon && $image && $image.width() > 20) {
            elements.$imageContainer.width($image.width());
          } else if (!this.HeaderIcon) {
            elements.$imageContainer.css("width", "");
          }
        }
      },

      changeIcon: function () {
        if (elements.$imageContainer) {
          var $image = elements.$imageContainer.find("img");
          $image.attr("src", this.HeaderIcon);
          this.syncIconWidth();
        }
      },

      updateStateInUserProfile: function () {
        if (!this.IsStateDiscarded) {
          this.userProfile.saveState(this.UserProfileKey, { IsOpen: this.IsOpen });
        }
      }
    }
  }, "Expander");
})(Sitecore.Speak);
