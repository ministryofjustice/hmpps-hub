/// <reference path="../../../../../../assets/vendors/JQuery/jquery-1.8.2.min.js" />
/// <reference path="../../../../../../assets/vendors/JQuery/jquery-ui-1.8.23.custom.min.js" />
/// <reference path="../../../../../../assets/vendors/Base/Base.js" />
/// <reference path="../../../../../../assets/lib/dist/sitecore.js" />
/// <reference path="../../../Page/Sitecore.Page.js" />
/// <reference path="../../../../../../assets/lib/Models/Sitecore.Types.Models.js" />
/// <reference path="../../../../../../assets/lib/Models/Sitecore.Types.Views.js" />

/*jslint nomen: true, indent: 2 */
/*global define: false, $: false, _: false */


define(['sitecore', 'jqueryui'], function (_sc) {
  "use strict";

  var control = {
    componentName: "DatePicker",
    selector: ".sc-datepicker",
    control: "datepicker",
    namespace: "ui-",

    attributes: [
      { name: "formattedDate", defaultValue: null },
      { name: "viewMode", defaultValue: null },
      { name: "date", defaultValue: null },
      { name: "dateFormat", defaultValue: null, manualSync: true },
      { name: "firstDay", defaultValue: 1 },
      { name: "showOtherMonths", defaultValue: false },
      { name: "showButtonPanel", defaultValue: false },
      { name: "isReadOnly", defaultValue: false, added: true },
      { name: "isEnabled", defaultValue: true, added: true },
      { name: "minDate", defaultValue: null, manualSync: true },
      { name: "maxDate", defaultValue: null, manualSync: true },
      { name: "time", defaultValue: null },
      { name: "disabled", defaultValue: null },

      // Localization attributes
      { name: "prevText", defaultValue: null },
      { name: "nextText", defaultValue: null },
      { name: "monthNames", defaultValue: null },
      { name: "monthNamesShort", defaultValue: null },
      { name: "dayNames", defaultValue: null },
      { name: "dayNamesMin", defaultValue: null },
      { name: "dayNamesShort", defaultValue: null },
      { name: "yearSuffix", defaultValue: null }
    ],
    events: [
      { name: "onChangeMonthYear" },  // Called when the datepicker moves to a new month and/or year.
      { name: "onClose" },            // Called when the datepicker is closed, whether or not a date is selected.
      { name: "onSelect", on: "onSelect" },           // Called when the datepicker is selected.
      { name: "beforeShow", on:"beforeShowHandler" }          // A function that takes an input field and current datepicker instance and returns an options object to update the datepicker with. It is called just before the datepicker is displayed.
    ],
    functions: [
      { name: "dialog" },             // Opens the datepicker in a dialog box.
      { name: "getDate" },            // Returns the current date for the datepicker or null if no date has been selected.
      { name: "hide" },               // Close a previously opened date picker.
      { name: "isDisabled" },         // Determine whether a date picker has been disabled.
      { name: "refresh" },            // Redraw the date picker, after having made some external modifications.
      { name: "setDate" },            // Sets the date for the datepicker.
      { name: "show" }                // Open the date picker. If the datepicker is attached to an input, the input must be visible for the datepicker to be shown.
    ],

    view: {
      initialized: function () {
        var days = {
          "Monday": 1,
          "Tuesday": 2,
          "Wednesday": 3,
          "Thursday": 4,
          "Friday": 5,
          "Saturday": 6,
          "Sunday": 7
        };

        this.model.on("change:date", this.setFormattedDateAttribute, this);
        
        this.model.on("change:formattedDate", this.setDateAttribute, this);

        this.model.set("firstDay", days[this.$el.attr("data-firstday")]);
        this.model.set("showOtherMonths", this.$el.attr("data-showothermonths") === "true");
        this.model.set("showButtonPanel", this.$el.attr("data-showtoday") === "true");
        this.model.set("viewMode", this.$el.data("viewmode"));

        this.model.set("isEnabled", this.model.get("viewMode") != "calendar" ?
          !this.$el.is(":disabled") : this.$el.attr("data-isenabled") === "true");

        if (this.$el.attr("readonly")) {
          this.model.set("isReadOnly", this.$el.attr("readonly"));
        } else {
          $.noop();
        }
        
        this.model.set("disabled", !this.model.get("isEnabled"));

        this.model.on("change:dateFormat", this.changeDateFormat, this);
        this.model.on("change:isEnabled", $.proxy(changeDisabled, this));

        this.model.set("dateFormat", this.$el.attr("data-dateformat"));

        this.model.set("time", this.$el.attr("data-time"));
        this.model.on("change:time", this.timeUpdated, this);
        
        this.model.on("change:minDate change:maxDate", this.changeRange, this);
        this.model.set("minDate", this.$el.attr("data-mindate"));
        this.model.set("maxDate", this.$el.attr("data-maxdate"));
        
        if (this.$el.attr("data-localization")) {
          this.setLocalization();
        }

        this.overWriteSetDateMethod(this.setDate);    
      },

      afterRender: function () {
        this._widget = this.$el.data("datepicker");
        this._widget.dpDiv.addClass("sc-datepicker-dropdown");

        if (this.$el.attr("data-date")) {
          this.model.set("date", this.$el.attr("data-date"));
        }

        this._widget.dpDiv.off("click").on("click", $.proxy(setCurrentDayOnClickToday, this));
        
      },

      onSelect: function () {
        this.model.set("formattedDate", this.$el.val());
        
        // This is done to prevent IE from opening the DatePicker when the dates change.
        this.$el.datepicker("option", "disabled", true);
        setTimeout(function () {
          this.$el.datepicker("option", "disabled", false);
        }.bind(this), 0);
      },

      beforeShowHandler: function (inp, data) {

      },

      timeUpdated: function () {
        this.setDateAttribute();
      },

      // Sets the formattedDate on the model
      setFormattedDateAttribute: function () {

        if (!this.model.get("date")) {
          return;
        }

        var date = this.removeTicks(this.model.get("date")),
          dateObject,
          databaseUri,
          database;
        
        if (!date) {
          this.model.set("date", date);
          return;
        }
        
        if (_sc.Helpers.date.isISO(date)) {
          dateObject = new Date(this.convertDate(date, "yy/mm/dd"));

          this.setDate(dateObject);

          if (this.model.get("formattedDate") !== this.$el.val()) {
            this.model.set("formattedDate", this.$el.val());
          }
        } else {
          databaseUri = new _sc.Definitions.Data.DatabaseUri("core");
          database = new _sc.Definitions.Data.Database(databaseUri);

          database.getItem("{77F6084F-68AE-4243-A223-C2517EDE7189}", function (item) {
            throw item.Text;
          });

          this.model.set("date", this.convertToISODate(this.getDate()));
        }
      },

      // Changing attributes for the date range
      changeRange: function () {
        
        // set dates
        var minDate = this.model.get("minDate"),
          maxDate = this.model.get("maxDate"),
          format = this.widgetModel.get("dateFormat"),
          self = this;

        minDate = minDate == "" ? null : minDate;
        maxDate = maxDate == "" ? null : maxDate;

        // workaround for linked models
        if (_sc.Helpers.date.isISO(minDate) || _sc.Helpers.date.isISO(maxDate) || minDate == null || maxDate == null) {
          setTimeout(function () {
            self.widgetModel.set("minDate", self.convertDate(minDate, format));
            self.widgetModel.set("maxDate", self.convertDate(maxDate, format));
          }, 0);
        }
      },

      // Sets the date on the model
      setDateAttribute: function () {
        var isoDate = this.convertToISODate(this.getDate());

        if (this.model.get("date") !== isoDate) {
          this.model.set("date", isoDate);
        }
      },

      // Removes the ticks from a DateTime string
      removeTicks: function (date) {
        if (date.indexOf(":") > -1 && date.indexOf(":") === 15) {
          date = date.substring(0, date.indexOf(":"));
        }

        return date;
      },

      // Convert the ISO date into the format given
      convertDate: function (dateString, format) {
        var utcDate = _sc.Helpers.date.parseISO(dateString);
        // workaround for timezone because $.datepicker.formatDate doesn't respect timezone
        if (utcDate) {
          var date = new Date(utcDate * 1 + utcDate.getTimezoneOffset() * 60000);
          return $.datepicker.formatDate(format, date);
        }
        return null;
      },

      // Convert the date object into Sitecore ISO format
      convertToISODate: function (date) {
        if (!date) {
          return "";
        }

        var y = _sc.Helpers.date.ensureTwoDigits(date.getFullYear()),
          m = _sc.Helpers.date.ensureTwoDigits(date.getMonth() + 1),
          d = _sc.Helpers.date.ensureTwoDigits(date.getDate());

        return y + m + d + this.getTime();
      },

      getTime: function()
      {
        if (this.model.get("time")) {
          return this.model.get("time");
        }

        return "T000000";
      },
      
      changeDateFormat: function () {
        var format = this.model.get("dateFormat");
        this.setDateFormat(format);
      },

      // Changes the format, so it matches jQuery UI date format
      setDateFormat: function (format) {
        if (this.model.get("dateFormat") != format)
          this.model.set("dateFormat", format);
        if (format) {
          if (format.indexOf("yyyy") !== -1) {
            format = format.replace("yyyy", "yy");
          } else if (format.indexOf("yy") !== -1) {
            format = format.replace("yy", "y");
          }
        } else {
          format = "dd/mm/yy";
        }

        this.widgetModel.set("dateFormat", format);

        if (this.model.get("date")) {
          this.setFormattedDateAttribute();
        }
        this.changeRange();
      },

      // Sets localized texts
      setLocalization: function () {
        var localization = JSON.parse(this.$el.attr("data-localization"));

        // Loop through each property of the localization object, and set each property on the model
        _.each(localization, function (val, key) {
          var camelCaseKey = key.charAt(0).toLowerCase() + key.slice(1);

          this.model.set(camelCaseKey, val);
        }, this);
      },

      // jQuery UI DatePicker does not trigger an event (like change, input and so on) when setDate method 
      // is used, so we overwrite the default method, and set the date on the model with the value of $el,
      // and then execute the original setDate method
      overWriteSetDateMethod: function (func) {
        this.setDate = function () {
          var passedFunction = func.apply(this, arguments);

          this.model.set("formattedDate", this.$el.val());

          return passedFunction;
        };
      }

    }
  };
  
  // Set the date on the model which is equaled to the current date
  function setCurrentDayOnClickToday(e) {
    if (e.target.className.search('ui-datepicker-current') != -1) {
      var date = new Date();
      this.model.set("date", this.convertToISODate(date));
    }

    e.stopImmediatePropagation();
  }

  function changeDisabled() {
    this.model.set("disabled", !this.model.get("isEnabled"));
  }

  _sc.Factories.createJQueryUIComponent(_sc.Definitions.Models, _sc.Definitions.Views, control, true);
});