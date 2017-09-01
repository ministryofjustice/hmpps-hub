(function(speak) {

  /* Private functions (shared between all instances of the control) */
  var convertFormattedTimeToTime = function(formattedTime) {
    if (!formattedTime) {
      return "T000000";
    }

    return "T" + leftPad(formattedTime.getHours().toString(), 2, ["0"]) + leftPad(formattedTime.getMinutes().toString(), 2, ["0"]) + leftPad(formattedTime.getSeconds().toString(), 2, ["0"]);
  };

  var convertTimeToFormattedTime = function(control, time) {
    if (!time) {
      return null;
    }

    var timeIndex = time.indexOf("T");
    if (timeIndex < 0) {
      return null;
    }

    var dateObject = new Date();
    dateObject.setHours(time.substring(timeIndex + 1, timeIndex + 3));
    dateObject.setMinutes(time.substring(timeIndex + 3, timeIndex + 5));
    dateObject.setSeconds(time.substring(timeIndex + 5, timeIndex + 7));
    dateObject.setMilliseconds(0);

    return control.$el.timepicker('int2time', control.$el.timepicker('time2int', dateObject));
  };

  var leftPad = function(source, lenght, paddingChar) {
    if (!source) {
      source = "";
    }

    return Array(lenght - source.length + 1).join(paddingChar || " ") + source;
  };

  speak.component(["jqueryTimepicker"], function() {
    /* Private variables */
    var hasJustSelectedTime = false;

    /* Private functions (created per instance of the control) */

    // This function is called in context of the control.
    var updateFormattedTime = function() {
      if (!hasJustSelectedTime) {
        this.$el.timepicker('setTime', this.FormattedTime);
      }
    };

    // This function is called in context of the control.
    var updateTime = function() {
      if (!hasJustSelectedTime) {
        this.$el.timepicker('setTime', convertTimeToFormattedTime(this, this.Time));
      }
    };

    /* Control */
    return {
      name: "TimePicker",

      initialize: function() {
        this.$el = $(this.el);

        this.defineProperty("FormattedTime", "");
      },

      initialized: function() {
        this.$el.timepicker({
          'scrollDefault': 'now',
          'forceRoundTime': !this.IsAnyValueAccepted,
          'step': this.TimeStep,
          'timeFormat': this.IsAMPMFormat ? "g:i a" : "G:i"
        });

        var minTime = convertTimeToFormattedTime(this, this.MinTime);
        var maxTime = convertTimeToFormattedTime(this, this.MaxTime);

        if (minTime || maxTime) {
          this.$el.timepicker('option', { 'minTime': minTime, 'maxTime': maxTime });
        }

        // set timePicker time
        var formattedTime = convertTimeToFormattedTime(this, this.Time);
        var time = this.IsDefaultCurrentTime ? new Date() : formattedTime;
        if (time) {
          this.$el.timepicker('setTime', time);
          this.FormattedTime = this.$el.val();
        }

        this.on("change:FormattedTime", updateFormattedTime, this);
        this.on("change:Time", updateTime, this);

        var self = this;
        this.$el.on('changeTime', function() {
          hasJustSelectedTime = true;
          self.FormattedTime = self.$el.val();
          self.Time = convertFormattedTimeToTime(self.$el.timepicker('getTime'));
          self.trigger("timeSelected", self.$el, self.$el.val());
          hasJustSelectedTime = false;
        });
      },

      afterRender: function() {
        this.Time = convertFormattedTimeToTime(this.$el.timepicker('getTime'));
      }
    };
  }, "TimePicker");
})(Sitecore.Speak);