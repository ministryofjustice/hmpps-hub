require.config({
  paths: {
    experienceAnalytics: "/sitecore/shell/client/Applications/ExperienceAnalytics/Common/Layouts/Renderings/Shared/ExperienceAnalytics",
    experienceAnalyticsBase: "/sitecore/shell/client/Applications/ExperienceAnalytics/Common/Layouts/Renderings/Shared/experienceAnalyticsBase"
  }
});

define(["sitecore", "experienceAnalytics", "experienceAnalyticsBase"], function (Sitecore, ExperienceAnalytics) {

  Sitecore.Factories.createBaseComponent({
    name: "DateRangeFilter",
    base: "ExperienceAnalyticsBase",
    selector: ".sc-DateRangeFilter",

    attributes: Sitecore.Definitions.Views.ExperienceAnalyticsBase.prototype._scAttrs.concat([
      { name: "fromDate", value: "" },
      { name: "toDate", value: "" },
      { name: "errorTexts", value: "$el.data:sc-errortexts" }
    ]),

    events: {
      "click .sc-radiobutton-input": "selectPreset",
      "click .sc-button[data-sc-id*='SubmitButton']": "setGlobalDateRange",
      "click .sc-button[data-sc-id*='ResetButton']": "onResetClick"
    },

    initialize: function () {
      this._super();

      this.model.set("fromDate", "");
      this.model.set("toDate", "");

      $(window).off("hashchange." + this.model.get("name"));
      $(window).on("hashchange." + this.model.get("name"), _.bind(this.onHashChange, this));
    },

    afterRender: function() {
      this.createPresets();

      this.model.on("change:fromDate", this.updateFromDatePicker, this);
      this.model.on("change:toDate", this.updateToDatePicker, this);
      this.getFromDatePicker().on("change:formattedDate", this.updateFromDateAndToDatePickerLimit, this);
      this.getToDatePicker().on("change:formattedDate", this.updateToDateAndFromDatePickerLimit, this);

      this.setGlobalDatapickerDefaults();
      this.setupDefaultDates();
    },

    setGlobalDatapickerDefaults: function() {
      var $getFromDatePicker = this.getFromDatePicker().viewModel.$el,
        monthNames = $getFromDatePicker.datepicker("option", "monthNames"),
        monthNamesShort = $getFromDatePicker.datepicker("option", "monthNamesShort"),
        dayNames = $getFromDatePicker.datepicker("option", "dayNames"),
        dayNamesMin = $getFromDatePicker.datepicker("option", "dayNamesMin"),
        dayNamesShort = $getFromDatePicker.datepicker("option", "dayNamesShort"),
        globalDatepickerDefaults = $.datepicker._defaults,
        globalIsDifferent = _.difference(monthNames, globalDatepickerDefaults.monthNames).length !== 0 ||
          _.difference(monthNamesShort, globalDatepickerDefaults.monthNamesShort).length !== 0 ||
          _.difference(dayNames, globalDatepickerDefaults.dayNames).length !== 0 ||
          _.difference(dayNamesMin, globalDatepickerDefaults.dayNamesMin).length !== 0 ||
          _.difference(dayNamesShort, globalDatepickerDefaults.dayNamesShort).length !== 0;

      if (globalIsDifferent) {
        $.datepicker.setDefaults({
          monthNames: monthNames,
          monthNamesShort: monthNamesShort,
          dayNames: dayNames,
          dayNamesMin: dayNamesMin,
          dayNamesShort: dayNamesShort
        });
      }
    },

    setupDefaultDates: function () {
      var dateRange = ExperienceAnalytics.getDateRange();
      
      if (!dateRange) {
        if (dateRange === undefined) {
          this.showMessage("notification", this.model.get("errorTexts").InvalidDate);
        }

        dateRange = {
          dateFrom: this.dates.presets.defaultFromDate,
          dateTo: this.dates.presets.defaultToDate
        };
      }

      this.resetDates(dateRange.dateFrom, dateRange.dateTo);
    },

    createPresets: function() {
      var fromPicker = this.getFromDatePicker(),
        presets = this.dates.presets;

      var serverDateString = this.$el.attr("data-sc-serverdate").split("-");
      var serverDate = new Date(serverDateString[2], serverDateString[1] - 1, serverDateString[0]);
      serverDate.setHours(0, 0, 0, 0);
      var localDate = new Date();
      localDate.setHours(0, 0, 0, 0);

      var deltaServerDate = (serverDate - localDate) / 86400000;
      var deltaYesterday = (deltaServerDate - 1);

      presets.today = serverDate;

      // We use Jquery Datepicker to calculate relative presets because it has some additional logic
      // like subtracting 1 month from 30th of June will output 31st of May.
      fromPicker.viewModel.setDate(deltaYesterday + "d");
      presets.yesterday = fromPicker.viewModel.getDate();

      fromPicker.viewModel.setDate(deltaServerDate + "d-1w");
      presets.lastWeek = fromPicker.viewModel.getDate();

      fromPicker.viewModel.setDate("-1m" + deltaServerDate + "d");
      presets.lastMonth = fromPicker.viewModel.getDate();

      fromPicker.viewModel.setDate(deltaServerDate + "d-3m");
      presets.lastQuarter = fromPicker.viewModel.getDate();

      fromPicker.viewModel.setDate(deltaServerDate + "d-6m");
      presets.lastTwoQuarter = fromPicker.viewModel.getDate();

      fromPicker.viewModel.setDate(deltaServerDate + "d-1y");
      presets.lastYear = fromPicker.viewModel.getDate();

      var fromOffset = this.$el.attr("data-sc-defaultdaterangeoffset-from");
      var toOffset = this.$el.attr("data-sc-defaultdaterangeoffset-to");

      if (!fromOffset) fromOffset = "-90";
      if (!toOffset) toOffset = "-1";
      
      fromPicker.viewModel.setDate(deltaServerDate + "d" + fromOffset + "d");
      presets.defaultFromDate = fromPicker.viewModel.getDate();

      fromPicker.viewModel.setDate(deltaServerDate + "d" + toOffset + "d");
      presets.defaultToDate = fromPicker.viewModel.getDate();
      
      // Reset the date to an invalid date on after render to be sure a change event is fired. See bug #10040.
      fromPicker.viewModel.setDate(new Date());
    },

    dates: {
      convert: function (date) {
        return (
          date.constructor === Date ? date :
            date.constructor === Array ? new Date(date[0], date[1], date[2]) :
              date.constructor === Number ? new Date(date) :
                date.constructor === String ? new Date(date) :
                  typeof date === "object" ? new Date(date.year, date.month, date.date) : NaN
        );
      },

      compare: function (a, b) {
        return (
          isFinite(a = this.convert(a).valueOf()) &&
          isFinite(b = this.convert(b).valueOf()) ?
          (a > b) - (a < b) :
          NaN
        );
      },

      presets: {
        today: null,
        yesterday: null,
        lastWeek: null,
        lastMonth: null,
        lastQuarter: null,
        lastTwoQuarter: null,
        lastYear: null
      }
    },

    getPresets: function() {
      return this.dates.presets;
    },

    onResetClick: function(event) {
      this.resetDates();
      this.closeToggleButtons();
    },

    selectPreset: function (event) {
      var scId = $(event.currentTarget).parent(".sc-radiobutton").attr("data-sc-id"),
        radiobutton = this.app[scId];

      this.setDateRangePreset(radiobutton.get("value"));
    },

    setDateRangePreset: function (value) {
      var presets = this.dates.presets;
      this.setToDatePickerDate(presets.today);

      switch (value) {
        case "day":
            this.setFromDatePickerDate(presets.yesterday);
          break;
        case "week":
          this.setFromDatePickerDate(presets.lastWeek);
          break;
        case "month":
          this.setFromDatePickerDate(presets.lastMonth);
          break;
        case "quarter":
          this.setFromDatePickerDate(presets.lastQuarter);
          break;
        case "twoquarter":
          this.setFromDatePickerDate(presets.lastTwoQuarter);
          break;
        case "year":
          this.setFromDatePickerDate(presets.lastYear);
          break;
        default:
          throw new "Preset: '" + value + "' not recognized.";
      }
    },

    setFromDatePickerDate: function (date) {
      this.getFromDatePicker().viewModel.setDate(date);
    },

    setToDatePickerDate: function (date) {
      this.getToDatePicker().viewModel.setDate(date);
    },

    updateFromDatePicker: function (model, value) {
      this.setFromDatePickerDate(value);
    },

    updateToDatePicker: function (model, value) {
      this.setToDatePickerDate(value);
    },

    updateFromDateAndToDatePickerLimit: function (model, value) {
      this.getToDatePicker().viewModel.$el.datepicker("option", "minDate", value);
      this.updateRadioButtons();
      this.model.set("fromDate", value ? value : this.dates.presets.lastMonth);
    },

    updateToDateAndFromDatePickerLimit: function (model, value) {
      this.getFromDatePicker().viewModel.$el.datepicker("option", "maxDate", value);
      this.updateRadioButtons();
      this.model.set("toDate", value ? value : this.dates.presets.today);
    },

    updateRadioButtons: function () {
      var toDate = this.getToDatePicker().viewModel.getDate(),
        fromDate = this.getFromDatePicker().viewModel.getDate();

      if (toDate === null || fromDate === null) {
        return;
      }

      var isToToday = this.dates.compare(this.dates.presets.today, toDate) === 0,
        isFromYesterday = this.dates.compare(this.dates.presets.yesterday, fromDate) === 0,
        isLastWeek = this.dates.compare(this.dates.presets.lastWeek, fromDate) === 0,
        isLastMonth = this.dates.compare(this.dates.presets.lastMonth, fromDate) === 0,
        isLastQuarter = this.dates.compare(this.dates.presets.lastQuarter, fromDate) === 0,
        isLastTwoQuarter = this.dates.compare(this.dates.presets.lastTwoQuarter, fromDate) === 0,
        isLastYear = this.dates.compare(this.dates.presets.lastYear, fromDate) === 0;

      this.$el.find(".sc-radiobutton-input:checked").prop("checked", false);

      if (isToToday) {
        var inputValue = "";

        if (isFromYesterday) {
          inputValue = "day";
        } else if (isLastWeek) {
          inputValue = "week";
        } else if (isLastMonth) {
          inputValue = "month";
        } else if (isLastQuarter) {
          inputValue = "quarter";
        } else if (isLastTwoQuarter) {
          inputValue = "twoquarter";
        } else if (isLastYear) {
          inputValue = "year";
        }

        this.$el.find(".sc-radiobutton-input[value='" + inputValue + "']").prop("checked", true);
      }
    },

    setGlobalDateRange: function () {
      var fromDate = this.model.get("fromDate"),
        toDate = this.model.get("toDate");

      ExperienceAnalytics.setDateRange(fromDate, toDate, true);
      this.closeToggleButtons();
    },

    resetDates: function (from, to) {
      this.setToDatePickerDate(to || this.dates.presets.defaultToDate);
      this.setFromDatePickerDate(from || this.dates.presets.defaultFromDate);
      this.setGlobalDateRange();
    },

    getFromDatePicker: function () {
      return this.app[this.model.get('name') + "FromDatePicker"];
    },

    getToDatePicker: function () {
      return this.app[this.model.get('name') + "ToDatePicker"];
    },

    onHashChange: function() {
      var dateRangeFromUrl = ExperienceAnalytics.getDateRangeFromUrl(),
        dateRangeFromCookies = {
          dateFrom: ExperienceAnalytics.getSessionValue("FromDate"),
          dateTo: ExperienceAnalytics.getSessionValue("ToDate")
        },
        dateRange = dateRangeFromUrl.dateFrom &&
          dateRangeFromUrl.dateFrom !== "" &&
          dateRangeFromUrl.dateTo &&
          dateRangeFromUrl.dateTo !== "" ?
            dateRangeFromUrl:
            dateRangeFromCookies;

      try {
        dateRange.dateFrom = ExperienceAnalytics.reConvertDateFormat(dateRange.dateFrom);
        dateRange.dateTo = ExperienceAnalytics.reConvertDateFormat(dateRange.dateTo);
      } catch (e) {
        this.showMessage("notification", this.model.get("errorTexts").InvalidDate);
        this.resetDates();
        return;
      }
      
      if (this.model.get("fromDate") && this.model.get("toDate")) {

        if (dateRange.dateFrom !== this.model.get("fromDate") ||
          dateRange.dateTo !== this.model.get("toDate") ||
          ((!dateRangeFromUrl.dateFrom || dateRangeFromUrl.dateFrom === "") ||
          (!dateRangeFromUrl.dateTo || dateRangeFromUrl.dateTo === ""))) {
            this.resetDates(dateRange.dateFrom, dateRange.dateTo);
        }
      }
    },

    closeToggleButtons: function () {
      var filtersModel = this.app[this.model.get("name").replace(this.model.componentName, "")];

      if (filtersModel) {
        filtersModel.viewModel.closeToggleButtons();
      }
    }
  });
});