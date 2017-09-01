define(["sitecore", "/-/speak/v1/ribbon/SetDateAndTime.js"], function(Sitecore) {
    Sitecore.Factories.createBaseComponent({
        name: "DateAndTime",
        base: "ButtonBase",
        selector: ".sc-chunk-datepanel-datetime",
        attributes: [
            { name: "command", value: "$el.data:sc-command" },
            { name: "dateTime", value: "$el.data:sc-datetime" }
        ],
        initialize: function() {
            this._super();
            this.model.on("change:isEnabled", this.toggleEnable, this);
            this.model.on("change:isVisible", this.toggleVisible, this);
            this.model.on("change:dateTime", this.setDate, this);
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
        },
        setDate: function() {
            console.log("Update date.");
        }
    });
});