(function(speak) {

  speak.component(["bclUserProfile"], {
    name: "Menu",
 
    initialize: function() {
      this.$el = $(this.el);
    },
    initialized: function() {
      this.userProfile = Sitecore.Speak.module('bclUserProfile');
      var userProfileStatusObject = this.UserProfileState ? this.userProfile.parseState(this.UserProfileState) : {};
      this.MenuStatus = userProfileStatusObject ? (userProfileStatusObject.menuStatus ? userProfileStatusObject.menuStatus : []) : [];
      this.attachEvents();
      this.enabledChange();

      this.on("change:isEnabled", function() {
        this.enabledChange();
      }, this);
    },

    enabledChange: function() {
      if (this.IsEnabled.toString().toLocaleLowerCase() === "true") {
        this.$el.find(".disableMask").hide();
        return;
      }
      this.$el.find(".disableMask").show();
    },

    attachEvents: function() {
      var self = this;
      var app = self.app;

      //needs to be refactored, too generic
      $('.sc-menu a[href="#"]').click(function(e) {
        e.preventDefault();
      });

      var header = this.$el.find(".header");
      header.click(function() {
        var clickedElement = $(this);
        var menuItem = clickedElement.closest(".menuItem");
        var container = clickedElement.next(".toplevelcontainer");

        self.toggleOpenStatus(container, clickedElement, menuItem, true);
      });

      var arrowContainer = this.$el.find(".arrowcontainer");
      arrowContainer.click(function() {
        var clickedElement = $(this);
        var menuItem = clickedElement.closest(".menuItem");
        var container = menuItem.next(".sublevelcontainer");

        self.toggleOpenStatus(container, clickedElement, menuItem, false);
      });

      var clickdLink = this.$el.find(".itemRow .rightcolumn");
      clickdLink.click(function (e) {
        if (!e.ctrlKey) {
          $(".itemRow, .header").removeClass("selected").removeClass("highlighted");

          var itemRow = $(this).parent();
          itemRow.addClass("selected");

          var name = $(this).find(".rcpad").html();
          self.SelectedItemName = name;

          var id = $(this).find("a").attr("data-sc-menuitemid");
          self.SelectedItemId = id;
        }
      });

      var clickdRoot = $(".header.rootItem");
      clickdRoot.click(function (e) {
        if (!e.ctrlKey) {
          $(".itemRow, .header").removeClass("selected").removeClass("highlighted");
          $(this).addClass("selected");
        }        
      });

      this.$el.find("a[data-sc-click]").on("click", function(e) {
        var clickInvocation = $(this).attr("data-sc-click");
        var name = $(this).find(".rcpad").html();
        self.SelectedItemName = name;

        var id = $(this).attr("data-sc-menuitemid");
        self.SelectedItemId = id;

        if (clickInvocation) {
          return speak.Helpers.invocation.execute(clickInvocation, { app: app });
        }
        return null;
      });
    },

    toggleOpenStatus: function(container, clickedElement, menuItem) {
      if (container.is(":hidden")) {
        clickedElement.addClass("open");
        menuItem.attr("isOpen", "true");
        this.updateMenuStatus(container.attr('sc-guid'), "open");
      } else {
        clickedElement.removeClass("open");
        menuItem.removeAttr("isOpen");
        this.updateMenuStatus(container.attr('sc-guid'), "closed");
      }
      this.highlightTopClosedParent(menuItem);
      container.slideToggle(100);
    },

    updateMenuStatus: function(itemId, status) {
      var foundItem = speak.utils.array.find(this.MenuStatus, function(obj) { return obj.id == itemId; });

      if (foundItem && status === "closed") {
        this.MenuStatus.splice($.inArray(foundItem, this.MenuStatus), 1);
      }
      if (!foundItem && status === "open") {
        this.MenuStatus.push({ id: itemId });
      }

      this.setStatusInUserProfile();
    },

    setStatusInUserProfile: function() {
      this.userProfile.saveState(this.UserProfileKey, {menuStatus: this.MenuStatus});
    },

    highlightTopClosedParent: function(container) {

      if (!container.attr("isOpen")) {
        var selected = container.next(".itemsContainer").find(".selected");
        if (selected.length > 0) {
          container.addClass("highlighted");
        }
      } else {
        container.removeClass("highlighted");
      }
    }
  });
})(Sitecore.Speak);