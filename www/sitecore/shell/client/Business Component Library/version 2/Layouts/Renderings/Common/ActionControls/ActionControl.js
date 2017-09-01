(function (Speak) {

  // TODO: Replace with placement.js utils once available
  define("ActionControl/Placement", ["jquery"], function () {

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

  define(["bclCollection", "bclDataClickability", "ActionControl/Placement", "bclUserProfile"], function (Collection, DataClickability, placementUtil) {

    var collapseOnBodyClick = function (e) {
      if (!this.IsOpen) {
        return;
      }

      e.stopPropagation();
      if ($(e.target).closest('.sc-dropdownbutton').size() === 0 && !this.isBeingOpened) {
        this.IsOpen = false;
      }
    };

    function saveToUserProfile() {
      var userProfile = Speak.module('bclUserProfile');
      var state = {};

      state.favorites = this.Favorites.map(function (fav) {
        return {
          id: fav.Id
        };
      });

      userProfile.saveState(this.UserProfileKey, state);
    }

    var ActionModel = Collection.factory.createBaseModel({
      Id: "",
      Text: "",
      Click: "",
      Icon: "",
      Tooltip: "",
      BackgroundPosition: "",
      IsFavorite: false,
      IsDisabled: false,
      IsFavoriteIconDisabled: false,
      Name: ""
    });

    var GroupModel = Collection.factory.createCollectionModel("ActionLinks", {
      Model: ActionModel,
      Text: "",
      DisplayFieldName: "Text",
      ValueFieldName: "Id",
    });

    var ColumnModel = Collection.factory.createCollectionModel("ActionGroups", {
      Model: GroupModel,
      Text: ""
    });

    function getParsedData(data) {
      var isJson = typeof data == "string",
        isArray = Array.isArray(data);

      return isJson ? JSON.parse(data) : isArray ? data : [];
    }

    function updateDataWithUserProfileState() {
      if (this.IsStateDiscarded || !this.UserProfileState) {
        return;
      }
      var userProfile = Speak.module('bclUserProfile');
      var userProfileState = this.UserProfileState ? userProfile.parseState(this.UserProfileState) : { favorites: [] };

      this.ActionDefinitionsRoot.forEach(function (column) {
        column.ActionGroups.forEach(function (group) {
          group.ActionLinks.forEach(function (action) {
            if (_.findWhere(userProfileState.favorites, { id: action.Id })) {
              action.IsFavorite = true;
            } else {
              action.IsFavorite = false;
            }
          });
        });
      });
    }

    Speak.component(Speak.extend({}, Collection.prototype, DataClickability.prototype, {
      name: "ActionControl",
      Model: ColumnModel,

      initialize: function () {
        Collection.prototype.initialize.call(this);

        var that = this;
        this.isBeingOpened = false;
        this.defineComputedProperty("Favorites", function () {
          return that.Items.reduce(function (groups, column) {
            return groups.concat(column.viewModel.Items().reduce(function (actions, group) {
              return actions.concat(group.viewModel.Items().reduce(function (favs, action) {
                if (that.NumOfActions <= 3 || action.viewModel.IsFavorite()) {
                  favs.push(action);
                }
                return favs;
              }, []));
            }, []));
          }, []);
        });

        this.defineComputedProperty("IconFavorites", function () {
          return _.filter(that.Favorites, function (item) {
            return !!item.viewModel.Icon();
          });
        });

        this.defineComputedProperty("ButtonFavorites", function () {
          return _.filter(that.Favorites, function (item) {
            return !item.viewModel.Icon();
          });
        });

        this.defineComputedProperty("NumOfActions", function () {
          return that.Items.reduce(function (actions, column) {
            return actions + column.viewModel.Items().reduce(function (prevGroupActions, group) {
              return prevGroupActions + group.viewModel.Items().length;
            }, 0);
          }, 0);
        });

      },

      initialized: function () {
        Collection.prototype.initialized.call(this);

        this.ActionDefinitionsRoot = getParsedData(this.ActionDefinitionsRoot); // To support Data-binding on Menu/ActionDefinitionsRoot

        this.on("change:ActionDefinitionsRoot", function () {
          updateDataWithUserProfileState.call(this);
          this.reset(getParsedData(this.ActionDefinitionsRoot));
        }, this);

        updateDataWithUserProfileState.call(this);
        this.reset(this.ActionDefinitionsRoot);

        $(document).on("click", collapseOnBodyClick.bind(this));

        this.on("change:IsOpen", function () {
          var dropdownEl = this.el.querySelector('.dropdown-menu'),
            placement = placementUtil.calculatePlacement("bottom", dropdownEl, this.el);

          dropdownEl.classList.remove("sc-placement-top");
          if (placement !== "bottom") {
            dropdownEl.classList.add("sc-placement-top");
          }
        }, this);
      },

      toggleFavorite: function (item) {
        item = item[0] || item;

        if (item.IsFavoriteIconDisabled) {
          return;
        }

        if (this.Favorites.length >= 6 && !item.IsFavorite) {
          return;
        }

        item.IsFavorite = !item.IsFavorite;
        saveToUserProfile.call(this);
      },

      toggle: function () {
        this.isBeingOpened = !this.IsOpen;
        this.IsOpen = !this.IsOpen;
        if (this.isBeingOpened) {
          $(document).trigger("click");
        }
        this.isBeingOpened = false;
      },

      getAction: function (name) {
        var foundAction;
        this.Items.some(function (column) {
          column.Items.some(function (group) {
            group.Items.some(function (action) {
              if (action.Name === name) {
                foundAction = action;
                return true;
              } else {
                return false;
              }
            });
          });
        });
        return foundAction;
      }

    }));
  });
})(Sitecore.Speak);