(function(speak) {
  speak.component([], function() {

    var updateLabel = function() {
          parseValueAndMaxValue.call(this);
          calculatePercentage.call(this);
        },

      calculatePercentage = function() {
        this.Percentage = this.MaxValue ? Math.round(100 * (this.Value / this.MaxValue)) : 0;
      },

      setupTimer = function() {
        clearInterval(this.timer);
        if (this.UpdateInterval <= 0) {
          return;
        }
        var that = this;
        that.timer = setInterval(function() {
          speak.trigger("intervalCompleted:" + that.id);
        }, that.UpdateInterval);
      },

      parseValueAndMaxValue = function() {
        this.MaxValue = parseInt(this.MaxValue) || 100;
        this.Value = Math.min(parseInt(this.Value) || 0, this.MaxValue);
        this.Value = Math.max(this.Value, 0);
      }

    return {
      initialize: function() {
        this.defineProperty("Percentage", 0);
      },

      initialized: function() {
        parseValueAndMaxValue.call(this);
        this.on("change:MaxValue", updateLabel, this);
        this.on("change:Value", updateLabel, this);
        this.on("change:UpdateInterval", setupTimer, this);
        calculatePercentage.call(this);
        setupTimer.call(this);
      }
    }
  }, "ProgressBar");
})(Sitecore.Speak);