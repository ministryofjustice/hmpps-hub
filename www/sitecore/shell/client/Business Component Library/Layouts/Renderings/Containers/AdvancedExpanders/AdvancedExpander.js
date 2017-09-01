/// <reference path="../../../../../../assets/lib/dist/sitecore.js" />

require.config({
  paths: {
    "userProfile": "/sitecore/shell/client/Speak/Assets/lib/ui/1.1/userProfile"
  }
});

define(["sitecore", "userProfile"], function(_sc, userProfile) {
  var model = _sc.Definitions.Models.ControlModel.extend(
    {
      initialize: function (options)
      {
        this._super();
        this.set("header", "");
        this.set("imageUrl", "");
        this.set("isOpen", true);
        this.set("isCollapsible", true);
        this.set("showAdditional", false);
        this.set("showActionBar", false);
        this.set("enableAdditional", false);
        this.set("contentHeight", "100%");
        this.set("userProfileKey", "");
      }
    });

    var view = _sc.Definitions.Views.ControlView.extend(
    {
      initialize: function(options)
      {
        this._super();
        
        this.hasContentInActionBar = this.$el.find(".sc-advancedExpander-header-actionbar-container").has("*").length != 0;

        this.model.set("imageUrl", this.$el.attr("data-sc-imageurl"));
        this.syncIconWidth();
        this.model.on("change:imageUrl", this.syncIconWidth, this);

        this.model.on("change:showAdditional", function() {
          _sc.trigger((this.model.get("showAdditional") ? "more" : "less") + ":" + this.$el.attr("data-sc-id"));
        }, this);
        
        this.model.on("change:isOpen", function() {
          _sc.trigger((this.model.get("isOpen") ? "opened" : "closed") + ":" + this.$el.attr("data-sc-id"));
          this.updateStateInUserProfile();
          this.model.set("showActionBar", this.hasContentInActionBar && this.model.get("isOpen"));
        }, this);

        var id = this.$el.attr("data-sc-id");

        _sc.on("hidepromotedfields:" + id, this.hidePromotedFields, this);
        _sc.on("showpromotedfields:" + id, this.showPromotedFields, this);
        _sc.on("open:" + id, this.open, this);
        _sc.on("close:" + id, this.close, this);

        this.model.set("header", this.$el.attr("data-sc-header"));
        
        var enableAdditional = this.$el.data("sc-enableadditional");                  
        if (enableAdditional === "True") {
          this.model.set("enableAdditional", true);
        }

        this.model.set("showAdditional", false);
        var showAdditional = this.$el.data("sc-showadditional");
        if (showAdditional === "True") {
          this.model.set("showAdditional", true);
        }
        
        var contentHeight = this.$el.data("sc-contentheight");
        if (contentHeight != "") {
          this.model.set("contentHeight", contentHeight);
        }
        
        var isOpen = this.$el.data("sc-isopen");
        if (isOpen === "False") {
          this.model.set("isOpen", false);
        } else {
          this.model.set("isOpen", true);
        }
        this.model.set("showActionBar", this.hasContentInActionBar && this.model.get("isOpen"));
        
        var isCollapsible = this.$el.data("sc-iscollapsible");
        if (isCollapsible === "False") {
          this.model.set("isCollapsible", false);
        } else {
          this.model.set("isCollapsible", true);
        }

        this.initUserState();

        var selfModel = this.model;
        var selfEl = this.$el;
        var self = this;

        var handlerIn = function (el, model) {
          var isOpen = model.get("isOpen");
          if (self.hasContentInActionBar && !isOpen) {
            $('.sc-advancedExpander-header-actionbar .sc-advancedExpander-header-actionbar-container', el).show();
            $('.sc-advancedExpander-header-actionbar', el).removeClass("sc-actionbar-collapsed");
          }
        };

        var handlerOut = function (el, model) {
          var isOpen = model.get("isOpen");
          if (self.hasContentInActionBar && !isOpen) {
            $('.sc-advancedExpander-header-actionbar .sc-advancedExpander-header-actionbar-container', el).hide();
            $('.sc-advancedExpander-header-actionbar', el).removeClass("sc-actionbar-collapsed").addClass("sc-actionbar-collapsed");
          }
        };
        
        $(".sc-advancedExpander-header", selfEl).hover(function () { handlerIn(selfEl, selfModel); }, function () { handlerOut(selfEl, selfModel); });
        $(".sc-advancedExpander-header-title", selfEl).hover(function () { handlerIn(selfEl, selfModel); }, function () { handlerOut(selfEl, selfModel); });
        $(".sc-advancedExpander-header-actionbar", selfEl).hover(function () { handlerIn(selfEl, selfModel); }, function () { handlerOut(selfEl, selfModel); });
        $(".sc-advancedExpander-header-chevron", selfEl).hover(function () { handlerIn(selfEl, selfModel); }, function () { handlerOut(selfEl, selfModel); });
      },

      close: function() {
        var isCollapsible = this.model.get("isCollapsible");
        if (isCollapsible) {
          this.model.set("isOpen", false);
        }
      },

      open: function ()
      {
        var isCollapsible = this.model.get("isCollapsible");
        if (isCollapsible) {
          this.model.set("isOpen", true);
        }
      },

      toggle: function (viewModel, e) {
        var isTargetLocatedInsideActionBar = $(e.target).parents(".sc-advancedExpander-header-actionbar").length > 0;

        if (!isTargetLocatedInsideActionBar) {
          var isCollapsible = this.model.get("isCollapsible");
          if (isCollapsible) {
            this.model.set("isOpen", !this.model.get("isOpen"));
          }
        }
      },

      toggleAdditional: function()
      {
        this.model.set("showAdditional", !this.model.get("showAdditional"));
      },

      showPromotedFields: function(html)
      {
        this.$el.find(".sc-advancedExpander-header-promotedfields").html(html);
      },

      hidePromotedFields: function()
      {
        this.$el.find(".sc-advancedExpander-header-promotedfields").text("");
      },

      syncIconWidth: function()
      {
        var $imageContainer = this.$el.find(".sc-advancedExpander-header-icon-container");
        if ($imageContainer ) {
          var $image = $imageContainer.find("img");
          if (this.model.get("imageUrl") != "" && $image && $image.width() > 20) {
            $imageContainer.width($image.width());
          } else if (this.model.get("imageUrl") == "") {
            $imageContainer.css("width", "");
          }
        }
      },
      
      initUserState: function () {
        userProfile.init(this);
        userProfile.get(this, function (userState) {
          this.model.set("isOpen", userState.isOpen);
        });
      },
      
      updateStateInUserProfile: function ()
      {
        var state = { isOpen: this.model.get("isOpen") };
        userProfile.update(this, state);
      }
      
    });
  
    _sc.Factories.createComponent("AdvancedExpander", model, view, ".sc-advancedExpander");
});

