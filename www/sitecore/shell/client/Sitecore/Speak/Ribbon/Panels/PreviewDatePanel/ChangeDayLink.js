define(["sitecore", "/-/speak/v1/ribbon/ChangeDay.js"], function(Sitecore) {
    Sitecore.Factories.createBaseComponent({
        name: "ChangeDayLink",
        base: "ButtonBase",
        selector: ".sc-chunk-datepanel-changedate",
        attributes: [
            { name: "command", value: "$el.data:sc-command" },
            { name: "addDays", value: "$el.data:sc-adddays" }
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