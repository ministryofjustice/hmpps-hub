/// <reference path="../../../../../../assets/lib/dist/sitecore.js" />

define(["sitecore"], function (sc) {
    sc.Factories.createBaseComponent({
        name: "RadioButton",
        base: "InputBase",
        selector: ".sc-radiobutton",
        attributes: [
            { name: "groupName", defaultValue: "" },
            { name: "value", defaultValue: "" },
            { name: "text", defaultValue: "" },
            { name: "isChecked", defaultValue: false}
        ],
        extendModel: {
            check: function () {
                this.set("isChecked", true);
            },
            uncheck: function () {
                this.set("isChecked", false);
            }
        },
        events: {
            "click": "onClick"
        },
        initialize: function () {
            this._super();

            this.input = this.$el.find(".sc-radiobutton-input");
            this.label = this.$el.find(".sc-radiobutton-label");

            this.model.set("groupName", this.input.prop("name"));
            this.model.set("value", this.input.val());
            this.model.set("text", this.label.text());          
            this.model.set("isChecked", this.input.prop("checked"));

            this.onCheckChange();
            this.model.on("change:isChecked", this.onCheckChange, this);
        },

        onClick: function() {
          if (this.model.get("isEnabled") && this.model.get("isChecked") !== true) {
            this.model.set("isChecked", true);
          }
        },

        onCheckChange: function() {
          var isChecked = this.model.get("isChecked");

          if (isChecked) {
            var groupName = this.model.get("groupName");
            var name = this.model.get("name");

            var radioButtons = $.grep(this.app.Controls, function(control) {
              return control.model.componentName === "RadioButton"
                && control.model.get("groupName") === groupName
                && control.model.get("name") !== name;
            });

            $.each(radioButtons, function(i, button) {
              button.model.set("isChecked", false);
            });
          }

          this.input.prop("checked", isChecked);

          var globalValue = (isChecked === true) ? this.model.get("value") : null;
          this.app.set(this.model.get("groupName"), globalValue);
        }
    });
});