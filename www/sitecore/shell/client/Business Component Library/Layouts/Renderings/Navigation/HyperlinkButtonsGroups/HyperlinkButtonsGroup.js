

define(["sitecore"], function (_sc) {
    _sc.Factories.createBaseComponent({
        name: "HyperlinkButtonsGroup",
        base: "ControlBase",
        selector: ".sc-hyperlinkbuttonsgroup",
        clicked: false,
        isBusy: false,
        attributes: [
            { name: "selectedItemName", value: "" },
            { name: "selectedItemId", value: "$el.data:sc-selected-itemid" },
            { name: "isEnabled", value: "$el.data:sc-enabled", added: true },
            { name: "isBusy", value: "$el.data:sc-isbusy" }
        ],

        preventIfDisable: function (e) {
            if (e && !this.model.get("isEnabled")) {
                e.preventDefault();
            }
        },

        select: function (e) {                    
            this._selectItem($(e.currentTarget).closest("li"));          
        },
        
        selectedItemChange: function (e) {
          var selectedItemId = this.model.get("selectedItemId");
          var selectedItem = this.$el.find("[sc-selected]");
          if (selectedItemId != selectedItem.data("sc-item-id")) {
            var item = this.$el.find("[data-sc-item-id='" + selectedItemId + "']");
            if (item.length > 0) {
              this.model.set("selectedItemName", item.find("a").text());
              selectedItem.removeAttr("sc-selected");
              item.attr("sc-selected", true);
              // we should execute click defined in item properties. 
              if (!this.clicked) {
                var invocation = item.find("a").attr("data-sc-click");
                if (invocation) {
                  _sc.Helpers.invocation.execute(invocation, { control: this, app: this.app });
                }
              }
            }
            else {              
              this.model.set("selectedItemId", selectedItem.data("sc-item-id"));
            }
          }
        },

        _selectItem: function (item) {
          this.clicked = true;
          this.model.set("selectedItemId", item.data("sc-item-id"));
          this.clicked = false;
        },

        initialize: function (options) {
          var self = this;
          this._super();
          !this.model.get("isEnabled") ? this.enabledChange() : $.noop();
          
          this.model.on("change:isEnabled", function () {
            this.enabledChange();
            if (this.model.get("isEnabled")) {
              self.isBusy = false;
            }
          }, this);

          this.$el.find(".sc-hyperlinkbutton").on("click", function (e) {
            if (!self.isBusy) {
              self.select(e);
              
              var selectedItemId = self.model.get("selectedItemId");
              var selectedItem = self.$el.find("[sc-selected]");
              if (selectedItemId != selectedItem.data("sc-item-id")) {
                self.isBusy = true;
              }              
            }
          });
        },
        
        afterRender: function () {
          var selectedItem = this.$el.find("[sc-selected]").find("a");
          var selectedItemName = selectedItem.text();
          this.model.set("selectedItemName", selectedItemName);         
          this.model.on("change:selectedItemId", this.selectedItemChange, this);
        },
         
        enabledChange: function () {
          var app = this.app,
              isEnabled = this.model.get("isEnabled");
          _.each(this.$el.find('.sc-hyperlinkbutton'), function (item) {
            app[$(item).data("sc-id")].set("isEnabled", isEnabled);
            isEnabled ? $(item).removeAttr("disabled") : $.noop();
          });
        }


    });
});