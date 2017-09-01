(function (speak) {

    speak.component(["bclCollection", "bclSelection", "bclDataClickability", "bclUserProfile"], function (Collection, Selection, DataClickability) {

    var collapseOnBodyClick = function (e) {

      if (this.el.contains(e.target) || this.el === e.target) {
        return;
      }
      this.IsOpen = false;
    },

      setWidth = function () {

        var itemCount = this.getNumOfItems(),
          colCount = 0,
          pixelLengths = _.pluck(this.$el.find('.sc-contextswitcher-item'), "offsetWidth"),
          contextItemLength = Math.min(Math.max.apply(Math, pixelLengths), 152) + 30;

        if (itemCount > 12) {
          colCount = 3;
        } else if (itemCount > 1) {
          colCount = 2;
        } else if (itemCount > 0) {
          colCount = 1;
        }

        this.$el.find(".sc-contextswitcher-panel").width(contextItemLength * colCount);
        this.$el.find(".sc-contextswitcher-panel button").width("85%");
      },

      itemsChanged = function () {
        this.IsOpen = false;
        setWidth.call(this);
      },

      updateStateInUserProfile = function () {
        if (this.UserProfileKey) {
          this.userProfile.saveState(this.UserProfileKey, { ContextSwitcherValue: this.SelectedValue });
        }
      }

    return speak.extend({}, Collection.prototype, Selection.prototype, DataClickability.prototype, {
      initialized: function () {

        this.$el = $(this.el);

        Collection.prototype.initialized.call(this);
        Selection.prototype.initialized.call(this);

        this.userProfile = Sitecore.Speak.module('bclUserProfile');
        var userProfileStatusObject = this.UserProfileState ? this.userProfile.parseState(this.UserProfileState) : {};
        this.ContextSwitcherValue = userProfileStatusObject.ContextSwitcherValue;
        if (this.ContextSwitcherValue) {
          this.SelectedValue = this.ContextSwitcherValue;
        } else {
          updateStateInUserProfile.call(this);
        }

        this.defineProperty("IsOpen", false);
        this.on("itemsChanged", itemsChanged, this);

        if (this.IsClickExecutedOnLoad) {
          this.itemClick(this.SelectedItem);
        }

        document.addEventListener("click", collapseOnBodyClick.bind(this));

        var that = this;
        this.$el.on("click", ".sc-contextswitcher-item-container", function () {
          var clickedItemIndex = $(this).index();
          that.selectAt(clickedItemIndex);
          updateStateInUserProfile.call(that);
          that.itemClickAt(clickedItemIndex);
        });
      },

      toggle: function () {
        if (this.getNumOfItems() <= 1) {
          this.IsOpen = false;
          return;
        }

        if (this.IsEnabled) {
          this.IsOpen = !this.IsOpen;
        }
      },

      afterRender: function () {
        setWidth.call(this);
      }

    });
  }, "ContextSwitcher");

})(Sitecore.Speak);