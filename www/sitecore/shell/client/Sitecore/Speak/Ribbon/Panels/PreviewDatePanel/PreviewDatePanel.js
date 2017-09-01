define(["sitecore"], function(Sitecore) {
    Sitecore.Factories.createBaseComponent({
        name: "PreviewDatePanel",
        base: "ControlBase",
        selector: ".sc-chunk-datepanel",
        attributes: [
            { name: "isEnabled", defaultValue: true },
            { name: "isVisible", defaultValue: true }
        ],
        initialize: function() {
            this._super();
            this.model.on("change:isEnabled", this.toggleEnable, this);
            this.model.on("change:isVisible", this.toggleVisible, this);
        },
        toggleEnable: function() {
            if (!this.model.get("isEnabled")) {
                this.$el.addClass("disabled");
            } else {
                this.$el.removeClass("disabled");
            }
        },
        toggleVisible: function() {
            if (!this.model.get("isVisible")) {
                this.$el.hide();
            } else {
                this.$el.show();
            }
        }
    });
});