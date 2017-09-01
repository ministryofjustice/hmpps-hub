define(["sitecore"], function (_sc) {
  _sc.component({
    name: "HyperlinkButtonsGroup",
    initialize: function () {
      this.$el = $(this.el);
      this.defineProperty("SelectedItemName", "");
    },
    initialized: function () {
      !this.IsEnabled ? this.enabledChange() : void 0;

      this.on("change:isEnabled", function () {
        this.enabledChange();
        if (this.IsEnabled) {
          self.isBusy = false;
        }
      }, this);
      var self = this;
      this.$el.find(".sc-hyperlinkbutton").on("click", function (e) {
        if (!self.isBusy) {
          self.select(e);

          var selectedItemId = self.SelectedItemId;
          var selectedItem = self.$el.find("[sc-selected]");
          if (selectedItemId != selectedItem.data("sc-item-id")) {
            self.isBusy = true;
          }
        }
      });
    },
    enabledChange: function () {
      var app = this.app,
          isEnabled = this.IsEnabled;

      this.$el.find('.sc-hyperlinkbutton').each(function () {
        app[$(this).data("sc-id")].set("IsEnabled", isEnabled);

        isEnabled ? $(this).removeAttr("disabled") : void 0;
      });
    },
    preventIfDisable: function (e) {
      if (e && !this.IsEnabled) {
        e.preventDefault();
      }
    },
    selectedItemChange: function (e) {
      var selectedItemId = this.SelectedItemId;
      var selectedItem = this.$el.find("[sc-selected]");
      if (selectedItemId != selectedItem.data("sc-item-id")) {
        var item = this.$el.find("[data-sc-item-id='" + selectedItemId + "']");
        if (item.length > 0) {
          this.SelectedItemName = item.find("a").text();
          selectedItem.removeAttr("sc-selected");
          item.attr("sc-selected", true);
          // we should execute click defined in item properties. 
          if (!this.clicked) {
            var invocation = item.find("a").attr("data-sc-click");
            var i = invocation.indexOf(":");
            if (i <= 0) {
              throw "Invocation is malformed (missing 'handler:')";
            }

            _sc.module("pipelines").get("Invoke").execute({
              control: this,
              app: this.app,
              handler: invocation.substr(0, i),
              target: invocation.substr(i + 1)
            });
          }
        }
        else {
          this.SelectedItemId = selectedItem.data("sc-item-id");
        }
      }
    },
    select: function (e) {
      this._selectItem($(e.currentTarget).closest("li"));
    },
    _selectItem: function (item) {
      this.clicked = true;
      this.SelectedItemId = item.data("sc-item-id");
      this.clicked = false;
    },
    afterRender: function () {
      var selectedItem = this.$el.find("[sc-selected]").find("a");
      var selectedItemName = selectedItem.text();
      this.SelectedItemName = selectedItemName;
      this.on("change:SelectedItemId", this.selectedItemChange, this);
    }
  });
});