define(['sitecore', '/-/speak/v1/campaignmanager/dictionary.js'], function (sitecore, dictionary) {
  "use strict";
  // Constants
  var isoMinDate = '10101T000000',
    isoMinTime = 'T000000',
    isoTimeIndex = 8;

  function nameChanged() {
    sitecore.trigger('cm:campaign:change:name');
  }

  function startDateChanged() {
    sitecore.trigger('cm:campaign:change:start');
  }

  function endDateChanged() {
    sitecore.trigger('cm:campaign:change:end');
  }

  // Utils
  function getDateTime(dateControl, timeControl) {
    var date = dateControl.get('date');
    if (sitecore.Helpers.date.isISO(date)) {
      var time = timeControl.get('time');
      date = date.replace(isoMinTime, time);
      return date;
    }
    return '';
  }

  function setDateTime(dateTime, dateControl, timeControl) {
    var isoDate = dateTime;
    if (!sitecore.Helpers.date.isISO(isoDate)) {
      isoDate = sitecore.Helpers.date.toISO(dateTime);
    }
    if (sitecore.Helpers.date.isISO(isoDate) && isoDate.indexOf(isoMinDate) === -1) {
      var isoTime = isoDate.substr(isoTimeIndex);
      isoDate = isoDate.replace(isoTime, isoMinTime);
      dateControl.set('date', isoDate);
      timeControl.set('time', isoTime);
    }
  }

  var extensionObject = {
    initialized: function () {
      this.GeneralInformationNameValue.on('change:text', nameChanged);
      this.GeneralInformationStartDateValue.on('change:date', startDateChanged);
      this.GeneralInformationStartTimeValue.on('change:time', startDateChanged);
      this.GeneralInformationEndDateValue.on('change:date', endDateChanged);
      this.GeneralInformationEndTimeValue.on('change:time', endDateChanged);

      sitecore.trigger('cm:campaign:initialized');
    },
    getName: function () {
      return this.GeneralInformationNameValue.get('text');
    },
    getStartDate: function () {
      return getDateTime(this.GeneralInformationStartDateValue, this.GeneralInformationStartTimeValue);
    },
    getFormattedStartDate: function() {
      return this.GeneralInformationStartDateValue.get('formattedDate');
    },
    getEndDate: function () {
      return getDateTime(this.GeneralInformationEndDateValue, this.GeneralInformationEndTimeValue);
    },
    getFormattedEndDate: function() {
      return this.GeneralInformationEndDateValue.get('formattedDate');
    },
    setName: function (value) {
      this.GeneralInformationNameValue.set('text', value);
      nameChanged();
    },
    setStartDate: function (value) {
      setDateTime(value, this.GeneralInformationStartDateValue, this.GeneralInformationStartTimeValue);
      startDateChanged();
    },
    setEndDate: function (value) {
      setDateTime(value, this.GeneralInformationEndDateValue, this.GeneralInformationEndTimeValue);
      endDateChanged();
    },
    isValid: function () {
      return this.getValidationErrorMessage() === null;
    },
    getValidationErrorMessage: function() {
      var startDate = this.getStartDate();
      var endDate = this.getEndDate();

      if ((typeof startDate === 'undefined') || (startDate === null) || (startDate === '')) {
        startDate = null;
      } else {
        if (this.GeneralInformationStartDateValue.viewModel.convertDate(startDate, this.GeneralInformationStartDateValue.get('dateFormat').replace(/yy/g, 'y')) != this.GeneralInformationStartDateValue.get('formattedDate')) {
          return dictionary.StartDateHasInvalidFormat;
        }

        startDate = sitecore.Helpers.date.parseISO(startDate);
      }

      if ((typeof endDate === 'undefined') || (endDate === null) || (endDate === '')) {
        endDate = null;
      } else {
        if (this.GeneralInformationEndDateValue.viewModel.convertDate(endDate, this.GeneralInformationEndDateValue.get('dateFormat').replace(/yy/g, 'y')) != this.GeneralInformationEndDateValue.get('formattedDate')) {
          return dictionary.EndDateHasInvalidFormat;
        }

        endDate = sitecore.Helpers.date.parseISO(endDate);
      }

      if ((startDate !== null) && (endDate !== null) && (startDate >= endDate)) {
        return dictionary.StartDateMustBeBeforeEndDate;
      }

      return null;
    }
  };

  return sitecore.Definitions.App.extend(extensionObject);
});