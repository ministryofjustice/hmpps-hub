require.config({
  paths: {
    "userProfile": "/sitecore/shell/client/Speak/Assets/lib/ui/1.1/userProfile"
  }
});

/*
* Local Storage
* Styling
* Close when clicking outside
* BDD tests
*/
define(["sitecore", "userProfile", "knockout", "underscore", "bootstrap"], function (Sitecore, userProfile, ko, _) {  
  var ActionModel = function () {
    this.id = new ko.observable("");
    this.text = new ko.observable("");
    this.tooltip = new ko.observable("");
    this.isIcon = new ko.observable(false);
    this.iconSrc = new ko.observable("");
    this.iconBackgroundPosition = new ko.observable("");
    this.isFavorite = new ko.observable(false);
    this.isDefaultAction = new ko.observable(false);
    this.click = new ko.observable("");
    this.isEnabled = new ko.observable(true);
    this.disable = function () {
      this.isEnabled(false);
    };
    this.enable = function () {
      this.isEnabled(true);
    };
  };

  ActionModel.prototype.invoke = function (control) {
    var click = this.click();
    if (click) {
      Sitecore.Helpers.invocation.execute(click, { control: control, app: control.app });
    }
  };

  var model = Sitecore.Definitions.Models.InputModel.extend({
    initialize: function (options) {
      this._super();      
      this.set("text", "");
      this.set("isOpen", false);
      this.set("actions", []);
      this.set("favorites", []);
      this.set("userProfileKey", "");
      this.set("actionsStatus", []);
      this.set("data", "");
      this.set("iconFavorites", [], {
        computed: true,
        read: function () {
          var filteredItems = _.filter(this.favorites(), function (item) {
            return item.isIcon();
          });
          return filteredItems;
        }
      });
      this.set("buttonFavorites", [], {
        computed: true,
        read: function () {
          var filteredItems = _.filter(this.favorites(), function (item) {
            return !item.isIcon();
          });
          return filteredItems;
        }
      });
      this.isBeingOpened = false;
    }
  });

  var hideOnBodyClick = function (e) {
    e.stopPropagation();

    if (this.el.contains(e.target) || this.el === e.target) {
      return;
    }

    if (!this.isBeingOpened) {
      var isOpen = this.model.get("isOpen");
      if (isOpen) this.toggleIsOpen();
    }
  };

  var view = Sitecore.Definitions.Views.InputView.extend(
  {
    initialize: function (options) {
      this._super();
      userProfile.init(this);
      userProfile.get(this, function (state) {
        this.model.set("actionsStatus", state);
      }, { stateDataAttributeName: "sc-actionsstatus" });
      this.model.set("data", this.$el.data("sc-data"));
      this.model.set("text", this.$el.find(".dropdown-text").text());

      this.$el.removeAttr("disabled");

      var actions = this.$el.find("[data-sc-actionid]").map(function () {
        var action = new ActionModel(),
        url = $(this).find(".sc-icon").css('background-image'),
        backgroundPosition = $(this).find(".sc-icon").css('background-position');

        action.id($(this).attr("data-sc-actionid"));
        action.text($.trim($(this).text()));
        action.iconSrc(url);
        action.iconBackgroundPosition(backgroundPosition);
        action.isIcon(url ? true : false);

        action.isFavorite($(this).attr("data-sc-favorite") === "true");
        action.tooltip($(this).attr("data-sc-tooltip"));
        action.isDefaultAction($(this).attr("data-sc-favorite") === "true");
        action.click($(this).attr("data-sc-click"));
        action.isEnabled($(this).attr("data-sc-isdisabled") === "false");        

        return action;
      });

      this.model.set("actions", actions);

      this.model.on("change:isVisible", function () {
        this.model.get("isVisible") ? this.$el.show() : this.$el.hide();
      }, this);
      
      $(document).on("click", $.proxy(hideOnBodyClick, this));      
    },

    afterRender: function () {      
      this.updateFavorites();
    },

    toggleDropdown: function (obj, e) {
      if (!this.model.get("isOpen")) {
        this.isBeingOpened = true;
        $(document).trigger('click');
      }      
      this.toggleIsOpen(obj, e);
      this.isBeingOpened = false;
    },

    toggleIsOpen: function (obj, e) {
      if (e) {
        e.stopPropagation();
      }
      var isOpen = this.model.get("isOpen");
      if (this.model.get("isEnabled") || isOpen) {
        this.model.set("isOpen", !isOpen);
      }      
    },

    toggleFavorite: function (data, event) {
      var action = this.getAction(event.target);

      if (!isActionFavoriteIconEnabled(action, this.model)) {
        return;
      }

      // User should be able to promote each type of actions to favorites even disabled actions, according to Bug 18371
      $(event.target).toggleClass("selected");
      if (action != null) {
        action.isFavorite(!action.isFavorite());
        this.updateActionsStatus(action);
        this.updateFavorites();
      }
    },

    invokeAction: function (data, event) {
      var action = this.getAction(event.target);

      if (!action) {
        this.model.set("isOpen", false);
      }
      else if (action.isEnabled()) {
        this.model.set("isOpen", false);
        action.invoke(this);
      }
    },

    invokeFavorite: function (action) {
      if (this.model.get("isEnabled") && action.isEnabled()) {
        action.invoke(this);
      }
    },

    isFavoriteAction: function (target) {            
      var action = this.getAction(target);
      if (!action) {
        return false;
      }
      return action.isFavorite();
    },

    isEnabledAction: function (target) {
      var action = this.getAction(target);
      if (!action) {
        return false;
      }
      return action.isEnabled();
    },

    getAction: function (target) {
      var source = $(target);
      if (!source.attr("data-sc-actionid")) {
        source = source.parents("[data-sc-actionid]");
      }

      if (source == null) {
        return null;
      }

      var id = $(source).attr("data-sc-actionid");
      if (!id) {
        return null;
      }

      return _.find(this.model.get("actions"), function (e) {
        return e.id() === id;
      });
    },

    updateFavorites: function () {
      var favorites = _.select(this.model.get("actions"), function (e) {
        return e.isFavorite();
      });

      this.model.set("favorites", favorites);
    },

    updateActionsStatus: function (action) {
      var foundAction = _.find(this.model.get("actionsStatus"), function (obj) { return obj.id === action.id(); });
      if (foundAction) {
        foundAction.isFavorite = action.isFavorite();
      } else {
        this.model.get("actionsStatus").push(
          {
            id: action.id(),
            isFavorite: action.isFavorite()
          });
      }

      this.setFavoritesInUserProfile();
    },

    setFavoritesInUserProfile: function () {
      userProfile.update(this, this.model.get("actionsStatus"));
    },

    isFavoriteIconEnabled: function (target) {
      var action = this.getAction(target);
      if (!action) {
        return false;
      }

      return isActionFavoriteIconEnabled(action, this.model);
    },   
  });

  function isActionFavoriteIconEnabled(action, controlModel) {
    if (action.isIcon() || action.isFavorite()) {
      return true;
    }

    var favoritButtonsLimit = 6;
    var count = 0;
    _.each(controlModel.get("actions"), function (a) {
      count += a.isFavorite() && !a.isIcon() ? 1 : 0;
    });

    return count < favoritButtonsLimit;
  }

  Sitecore.Factories.createComponent("ActionControl", model, view, ".sc-actioncontrol");
});