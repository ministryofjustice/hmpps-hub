/// <reference path="../../../../../../assets/lib/dist/sitecore.js" />

define(["sitecore"], function (_sc) {
  _sc.Factories.createBaseComponent({
    name: "DropDownButton",
    base: "ButtonBase",
    selector: ".sc-dropdownbutton",
    attributes: [
    { name: "text", value: "$el.text" },
    { name: "imageUrl",  defaultValue:"" },
    { name: "backgroundPosition", defaultValue: "center" },
    { name: "isOpen", defaultValue: false }
    ],
    extendModel: {
        toggle: function () {
            if (this.get("isEnabled")) {
                this.set("isOpen", !this.get("isOpen"));
                this.viewModel.click();
            }
        }
    },
    listen: _.extend({}, _sc.Definitions.Views.BlockView.prototype.listen, {
        "open:$this": "open",
        "close:$this": "close",
        "toggle:$this": "toogle"
    }),
    initialize: function () {
      this._super();         
      this.model.set("text", this.$el.find(".sc-dropdownbutton-text").text());
      this.model.set("imageUrl", this.$el.find(".sc-icon").attr("data-sc-imageUrl"));
      this.model.set("backgroundPosition", this.$el.find(".sc-icon").attr("data-sc-backgroundPosition"));
      this.model.on("change:isOpen", this._changeStatus, this);
      this.model.on("change:isEnabled", this.toggleEnable, this);
      this.model.set("isOpen", false);

      this.$el.find(".sc-dropdownbutton-contentpanel").on("click", function (e) {
        e.stopPropagation();
      });
    },
    toggleEnable: function () {
        if (!this.model.get("isEnabled")) {
            this.$el.find(".btn").attr("disabled", "disabled");
        } else {
            this.$el.find(".btn").removeAttr("disabled");
        }
    },
    toogle: function () {
        if (this.model.get("isEnabled")) {
            this.model.set("isOpen", !this.model.get("isOpen"));
        }
    },
    open: function () {
        if (this.model.get("isEnabled")) {
            this.model.set("isOpen", true);
        }
    },
    close: function (e) {        
         if (e && e.target) {
             e.preventDefault();
         }
        if (this.model.get("isEnabled")) {
            this.model.set("isOpen", false);
        }
    },    
     _changeStatus: function () {
        if (this.model.get("isOpen")) {
            this.expand();
        } else {
            this.collapse();
        }         
     },
     expand: function () {
       this.$el.find(".sc-dropdownbutton-contentpanel").slideDown(50);     
       $(document).off("click").on("click", $.proxy(collapseOnBodyClick, this));
     },
     collapse: function () {
       this.$el.find(".sc-dropdownbutton-contentpanel").slideUp(50);
       $(document).off("click");
     }
    
  });
  
 function collapseOnBodyClick(e) {
    e.stopPropagation();
    if ($(e.target).closest('.sc-dropdownbutton').size() == 0) {
      this.model.set("isOpen", false);
    }
  }
  
});
