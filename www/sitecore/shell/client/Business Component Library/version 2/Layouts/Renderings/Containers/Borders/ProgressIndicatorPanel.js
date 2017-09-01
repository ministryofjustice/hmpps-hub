(function(speak) {
  speak.component(["jqueryui"], function() {

    var delayTimeout,

      toggleIndicator = function(state) {
        this.$el.toggleClass("sc-isbusy", state);
      },

      scheduleDisplayIndicator = function(delay) {
        delayTimeout = window.setTimeout(function(self) {
          toggleIndicator.call(self, true);
        }, delay, this);
      },

      clearSchedule = function() {
        clearTimeout(delayTimeout);
      },

      onChangeIsBusy = function() {
        clearSchedule();
        this.IsBusy ? scheduleDisplayIndicator.call(this, this.Delay || 400) : toggleIndicator.call(this, false);
      };

    return {
      name: "ProgressIndicatorPanel",

      initialized: function () {
        this.$el = $(this.el);
        this.on("change:IsBusy", onChangeIsBusy, this);
        if (this.AutoShow && this.AutoShowTimeout) {
          $(document).ajaxStart(function() {
              scheduleDisplayIndicator.call(this, this.AutoShowTimeout);
            }.bind(this))
            .ajaxStop(function() {
              clearSchedule();
              toggleIndicator.call(this, false);
            }.bind(this));
        }
      },
    }
  }, "ProgressIndicatorPanel");
})(Sitecore.Speak);
