/// <reference path="../../../../../../assets/vendors/JQuery/jquery-1.8.2.min.js" />
// <reference path="../../../../../../assets/lib/ui/1.1/deps/jquery.timepicker/jquery.timepicker.min.js" />

require.config({
  paths: {
    jqueryTimepicker: "/sitecore/shell/client/Speak/assets/lib/ui/1.1/deps/jquery.timepicker/jquery.timepicker",
  }
});


define(["sitecore", 'jqueryTimepicker'], function (_sc) {
  _sc.Factories.createBaseComponent({
    name: "TimePicker",
    base: "InputBase",
    selector: ".sc-timepicker",
    attributes: [
      { name: "isDefaultCurrentTime", defaultValue: false },
      { name: "isAMPMFormat", defaultValue: false },
      { name: "isAnyTypedTimeAllowed", defaultValue: false },
      { name: "formattedTime", defaultValue: null },
      { name: "timeFormat", defaultValue: null },      
      { name: "timeStep", defaultValue: '30' },
      { name: "minTime", defaultValue: false },
      { name: "maxTime", defaultValue: false },
      { name: "time", defaultValue: null },      
      { name: "isEnabled", defaultValue: true },
      { name: "isReadOnly", defaultValue: false }      
    ],

    events: {
    
    },

    hasJustSelectedTime: false,

    initialize: function () {
      this._super();
      this.model.set("isDefaultCurrentTime", this.$el.data("sc-isdefaultcurrenttime"));
      this.model.set("formattedTime", this.$el.data("sc-formattedtime"));     
      this.model.set("isAmPmFormat", this.$el.data("sc-isampmformat"));
      this.model.set("timeStep", this.$el.data("sc-timestep"));
      this.model.set("minTime", this.$el.data("sc-mintime"));
      this.model.set("maxTime", this.$el.data("sc-maxtime"));
      this.model.set("isEnabled", this.$el.data("sc-isenabled"));
      this.model.set("time", this.$el.data("sc-time"));
      this.model.set("isAnyTypedTimeAllowed", this.$el.data("sc-isanytypedtimeallowed"));
      this.model.set("timeFormat", this.model.get("isAmPmFormat") ? "g:i a" : "G:i");      
      var timeStep = this.model.get("timeStep");      
      this.model.set("isReadOnly", this.$el.data("sc-isreadonly"));      

      this.$el.timepicker({
        'scrollDefault': 'now',
        'forceRoundTime': this.model.get("isAnyTypedTimeAllowed"),
        'step': timeStep,
        'timeFormat': this.model.get("timeFormat")
      });     

      var minTime = this.convertTimeToFormattedTime(this.model.get("minTime"));
      var maxTime = this.convertTimeToFormattedTime(this.model.get("maxTime"));      

      if (minTime || maxTime) {
        this.$el.timepicker('option', { 'minTime': minTime, 'maxTime': maxTime });
      }
                  
      // set timePicker time
      var formattedTime = this.convertTimeToFormattedTime(this.model.get("time"));
      var time = this.model.get("isDefaultCurrentTime") ? new Date() : formattedTime;
      if (time) {
        this.$el.timepicker('setTime', time);
        this.model.set("formattedTime", this.$el.val());
      }

      this.model.on("change:formattedTime", this.updateFormattedTime, this);
      this.model.on("change:time", this.updateTime, this);
      
      var self = this;
      this.$el.on('changeTime', function () {
        self.hasJustSelectedTime = true;
        self.model.set("formattedTime", self.$el.val());
        self.model.set("time", self.convertFormattedTimeToTime(self.$el.timepicker('getTime')));
        self.trigger("timeSelected", self.$el, self.$el.val());
        self.hasJustSelectedTime = false;
      });
    },

    afterRender: function () {
      this.model.set("time", this.convertFormattedTimeToTime(this.$el.timepicker('getTime')));
    },

    convertFormattedTimeToTime: function (formattedTime) {
      if (formattedTime) {
        return "T" + this.leftPad(formattedTime.getHours().toString(), 2, ["0"]) + this.leftPad(formattedTime.getMinutes().toString(), 2, ["0"]) + this.leftPad(formattedTime.getSeconds().toString(), 2, ["0"]);
      }

      return "T000000";
    },

    convertTimeToFormattedTime: function (time) {
      var dateObject = new Date();

      if (time) {

        var timeIndex = time.indexOf("T");
        if (timeIndex > -1) {
          dateObject.setHours(time.substring(timeIndex + 1, timeIndex + 3));
          dateObject.setMinutes(time.substring(timeIndex + 3, timeIndex + 5));
          dateObject.setSeconds(time.substring(timeIndex + 5, timeIndex + 7));
          dateObject.setMilliseconds(0);
          return this.$el.timepicker('int2time', this.$el.timepicker('time2int', dateObject));
        }
      }

      return null;
    },

    leftPad: function (source, lenght, paddingChar) {
      if (!source) {
        source = "";
      }
      return Array(lenght - source.length + 1).join(paddingChar || " ") + source;
    },

    updateFormattedTime: function () {     
      if (!this.hasJustSelectedTime) {
        this.$el.timepicker('setTime', this.model.get("formattedTime"));
        this.convertFormattedTimeToTime(this.$el.timepicker('getTime'));
      }        
    },

    updateTime: function () {
      if (!this.hasJustSelectedTime) {
        this.$el.timepicker('setTime', this.convertTimeToFormattedTime(this.model.get("time")));        
      }
    },
  
  });
});