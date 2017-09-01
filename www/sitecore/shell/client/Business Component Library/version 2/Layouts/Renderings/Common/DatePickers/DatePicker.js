(function(speak) {
  speak.component(["jqueryui"], function() {

    $.datepicker.parseDate = function(format, value) {
      return Sitecore.Speak.globalize.parseDate(value, format);
    };

    $.datepicker.formatDate = function(format, date) {
      return Sitecore.Speak.globalize.formatDate(date, format);
    };

    var getDateOptions = function() {
      var dateOptions = {};
      if (this.FormatCustom) {
        dateOptions.raw = this.FormatCustom;
      } else {
        dateOptions.date = this.FormatPreset;
      }
      return dateOptions;
    },

      initializeListeners = function() {
        this.on("change:FormattedDate", formattedDatePropertyUpdated, this);
        this.on("change:Date", datePropertyUpdated, this);
        this.on("change:IsEnabled", onToggleIsEnabled, this);
        this.on("change:Time", timeUpdated, this);
        this.on("change:FirstDay", setFirstDay, this);
        this.on("change:minDate change:maxDate", setRange, this);
      },

      onToggleIsEnabled = function() {
        if (!this.IsEnabled) {
          this.$el.datepicker("hide");
        }
      },

      setCurrentDayOnClickToday = function(e) {
        if (e.target.className.search('ui-datepicker-current') !== -1) {
          this.$el.datepicker('setDate', new Date());
          updateDateProperty.call(this);
        }
      },

      getDateFromISO = function(isoDate) {
        if (!isoDate) {
          return "";
        }

        var year = parseInt(isoDate.substr(0, 4), 10);
        // minus one in order to have the right month
        var month = parseInt(isoDate.substr(4, 2), 10) - 1;
        var day = parseInt(isoDate.substr(6, 2), 10);

        return new Date(year, month, day);
      },

      getISOdate = function() {
        var isoDate = speak.utils.date.toISO(this.getDate());
        return isoDate ? isoDate + (this.Time || "T000000") : "";
      },

      datePropertyUpdated = function() {
        setTimeout(function() {
          var date = getDateFromISO(this.Date);
          this.$el.datepicker('setDate', date);
          updateFormattedDateProperty.call(this);
        }.bind(this), 0);
      },

      formattedDatePropertyUpdated = function() {
        setTimeout(function() {
          this.Date = getISOdate.call(this);
        }.bind(this), 0);
      },

      updateFormattedDateProperty = function() {
        var isoDate = getDateFromISO(this.Date);

        if (!this.el.value || !isoDate) {
          this.FormattedDate = "";
        } else {
          this.FormattedDate = Sitecore.Speak.globalize.formatDate(isoDate, getDateOptions.call(this));
        }
      },

      updateDateProperty = function() {
        this.Date = getISOdate.call(this) || this.Date;
        updateFormattedDateProperty.call(this);
      },

      setFirstDay = function() {
        this.$el.datepicker('option', 'firstDay', this.FirstDay);
      },

      fixTodayButtonClass = function() {
        this.widget.dpDiv.addClass("sc-datepicker-dropdown");
      },

      setRange = function() {
        setTimeout(function() {
          if (this.MinDate) {
            this.$el.datepicker('option', "minDate", getDateFromISO.call(this, this.MinDate));
          }
          if (this.MaxDate) {
            this.$el.datepicker('option', "maxDate", getDateFromISO.call(this, this.MaxDate));
          }
        }.bind(this), 0);
      },

      timeUpdated = function() {
        updateDateProperty.call(this);
      };

    return {
      name: "DatePicker",
      initialize: function() {
        this.$el = $(this.el);
        this.days = {
          "Monday": 1,
          "Tuesday": 2,
          "Wednesday": 3,
          "Thursday": 4,
          "Friday": 5,
          "Saturday": 6,
          "Sunday": 7
        };
      },

      initialized: function() {
        setRange.call(this);

        var propertiesLowerCase = {};
        for (var prop in this.__properties) {
          switch (prop) {
            case "IsPreviousNextMonthVisible":
              propertiesLowerCase["showOtherMonths"] = this.__properties[prop];
              break;
            case "FirstDay":
              propertiesLowerCase["firstDay"] = this.__properties[prop];
              break;
            case "IsTodayButtonVisible":
              propertiesLowerCase["showButtonPanel"] = this.__properties[prop];
              break;
          }
        }

        this.Translation = JSON.parse(this.TranslationJSON);

        var options = {
          onSelect: updateDateProperty.bind(this),
          currentText: this.Translation.Today,
          constrainInput: false,
          dateFormat: getDateOptions.call(this),
          dayNames: this.Translation.DayNames,
          dayNamesMin: this.Translation.DayNamesMin,
          dayNamesShort: this.Translation.DayNamesShort,
          monthNames: this.Translation.MonthNames,
          monthNamesShort: this.Translation.MonthNamesShort,
          nextText: this.Translation.NextText,
          prevText: this.Translation.PrevText,
          yearSuffix: this.Translation.YearSuffix
        };

        this.FirstDay = this.days[this.FirstDay];
        this.DatePicker = this.$el.datepicker(speak.utils.object.extend(propertiesLowerCase, options));
        this.widget = this.$el.data("datepicker");

        setFirstDay.call(this);
        datePropertyUpdated.call(this);
        initializeListeners.call(this);
        updateFormattedDateProperty.call(this);
      },

      getDate: function() {
        return this.$el.datepicker('getDate');
      },

      setDate: function(date) {
        this.$el.datepicker('setDate', date);
        updateDateProperty.call(this);
      },

      afterRender: function() {
        fixTodayButtonClass.call(this);

        if (this.$el.attr("data-date")) {
          this.Date = this.$el.attr("data-date");
        }

        this.widget.dpDiv.off("click").on("click", setCurrentDayOnClickToday.bind(this));
      }
    }
  }, "DatePicker");
})(Sitecore.Speak);