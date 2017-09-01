define(["sitecore"], function (_sc) {
  _sc.Factories.createBaseComponent({
    name: "ProgressBar",
    base: "ControlBase",
    selector: ".sc-progressbar",
    attributes: [
      { name: "maxValue", value: "$el.data:sc-maxvalue" },
      { name: "updateInterval", value: "$el.data:sc-updateinterval" },
      { name: "value", value: "$el.data:sc-value" },
      { name: "showLabel", value: "$el.data:sc-showlabel" }
    ],
    initialize: function () {
      this._super();      
      this.parseValueAndMaxValue();
      this.model.on("change:maxValue", this.updateLabel, this);
      this.model.on("change:value", this.updateLabel, this);
      this.model.on("change:updateInterval", this.setupTimer, this);
      this.calculatePercentage();
      this.setupTimer();
    },

    updateLabel: function () {
      this.parseValueAndMaxValue();
      this.calculatePercentage();
    },

    calculatePercentage: function () {
      if (this.model.get("maxValue") > 0) {
        this.model.set("percentage", Math.round(100 * (this.model.get("value") / this.model.get("maxValue"))));
      } else {
        this.model.set("percentage", 0);
      }
    },

    setupTimer: function () {
      var updateInterval = this.model.get("updateInterval");
      clearInterval(this.timer);
      if (updateInterval <= 0) {
        return;
      }
      var id = this.$el.attr("data-sc-id");
      this.timer = setInterval(function () {
        _sc.trigger("intervalCompleted:" + id);
      }, updateInterval);
    },

    parseValueAndMaxValue: function () {
      this.model.set("maxValue", parseInt(this.model.get("maxValue")) || 100);
      this.model.set("value", parseInt(this.model.get("value")) || 0);

      if (this.model.get("value") > this.model.get("maxValue")) {
        this.model.set("value", this.model.get("maxValue"));
      }
      if (this.model.get("value") < 0) {
        this.model.set("value", 0);
      }
    }
  });
});