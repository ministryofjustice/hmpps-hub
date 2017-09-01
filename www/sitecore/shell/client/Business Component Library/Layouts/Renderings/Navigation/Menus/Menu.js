require.config({
  paths: {
    "userProfile": "/sitecore/shell/client/Speak/Assets/lib/ui/1.1/userProfile"
  }
});

define(["sitecore", "userProfile"], function (_sc, userProfile) {

  _sc.Factories.createBaseComponent({
    name: "Menu",
    base: "ControlBase",
    selector: ".sc-menu",
    attributes: [
      { name: "userProfileKey", defaultValue: null },
      { name: "isEnabled", defaultValue: true, added: true },
      { name: "selectedItemName", defaultValue: null },
      { name: "selectedItemId", defaultValue: null }
    ],

    initialize: function () {
      this._super();
      this.attachEvents();

      userProfile.init(this);
      userProfile.get(this, function (state) {
        this.model.set("menuStatus", state);
      }, { stateDataAttributeName: "sc-menustatus" });

      this.model.set("userProfileKey", this.$el.data("sc-userprofilekey"));
      this.model.set("isEnabled", this.$el.data("sc-isenabled"));
      this.model.set("selectedItemName", this.$el.data("sc-selecteditemname"));
      this.model.set("selectedItemId", this.$el.data("sc-selecteditemid"));

      this.enabledChange();

      this.model.on("change:isEnabled", function () {
        this.enabledChange();
      }, this);
    },

    enabledChange: function () {
      if (this.model.get("isEnabled").toString().toLocaleLowerCase() === "true") {
        this.$el.find(".disableMask").hide();
        return;
      }
      this.$el.find(".disableMask").show();
    },

    highlightTopClosedParent: function (container) {
      if (!container.attr("isOpen")) {
        var selected = container.next(".itemsContainer").find(".selected");
        if (selected.length > 0) {
          container.addClass("highlighted");
        }
      } else {
        container.removeClass("highlighted");
      }
    },

    toggleOpenStatus: function (container, clickedElement, menuItem) {
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

    attachEvents: function () {
      var self = this;
      var app = self.app;
      var header = $(".header");

      $('.sc-menu a[href="#"]').click(function (e) {
        e.preventDefault();
      });

      header.click(function () {
        var clickedElement = $(this);
        var menuItem = clickedElement.closest(".menuItem");
        var container = clickedElement.next(".toplevelcontainer");

        self.toggleOpenStatus(container, clickedElement, menuItem, true);
      });

      var arrowContainer = $(".arrowcontainer");
      arrowContainer.click(function () {
        var clickedElement = $(this);
        var menuItem = clickedElement.closest(".menuItem");
        var container = menuItem.next(".sublevelcontainer");

        self.toggleOpenStatus(container, clickedElement, menuItem, false);
      });

      var clickdLink = $(".itemRow .rightcolumn");
      clickdLink.click(function (e) {
        if (!e.ctrlKey) {
          $(".itemRow, .header").removeClass("selected").removeClass("highlighted");
          var itemRow = $(this).parent();
          itemRow.addClass("selected");
        }
      });

      var clickdRoot = $(".header.rootItem");
      clickdRoot.click(function (e) {
        if (!e.ctrlKey) {
          $(".itemRow, .header").removeClass("selected").removeClass("highlighted");
          $(this).addClass("selected");
        }
      });

      this.$el.find("a[data-sc-click]").on("click", function (e) {
        var clickInvocation = $(this).attr("data-sc-click");
        var name = $(this).find(".rcpad").html();
        self.model.set("selectedItemName", name);
        var id = $(this).attr("data-sc-menuItemid");
        self.model.set("selectedItemId", id);

        if (clickInvocation) {
          return _sc.Helpers.invocation.execute(clickInvocation, { app: app });
        }
        return null;
      });
    },

    setStatusInUserProfile: function () {
      userProfile.update(this, this.model.get("menuStatus"));
    },

    updateMenuStatus: function (itemId, status) {
      var foundItem = _.find(this.model.get("menuStatus"), function (obj) { return obj.id == itemId; });

      if (foundItem && status === "closed") {
        this.model.get("menuStatus").splice($.inArray(foundItem, this.model.get("menuStatus")), 1);
      }
      if (!foundItem && status === "open") {
        this.model.get("menuStatus").push(
        {
          id: itemId
        });
      }

      this.setStatusInUserProfile();
    }
  });
});

