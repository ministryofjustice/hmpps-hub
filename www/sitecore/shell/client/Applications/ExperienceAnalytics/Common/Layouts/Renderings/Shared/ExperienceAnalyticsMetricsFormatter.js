define(function () {
  return {
    getFormattedString: function (value, numberScale, numberScaleUnits, numberScaleValues) {
      if (numberScale == "Number") {
        return this.getNumberFormattedString(value, numberScaleUnits, numberScaleValues);
      } else if (numberScale == "Percentage") {
        return this.getPercentFormattedString(value, numberScaleUnits, numberScaleValues);
      } else if (numberScale == "Time") {
        return this.getTimeFormattedString(value, numberScaleUnits, numberScaleValues);
      }
      else if (numberScale == "Date") {
          return this.getformattedDateForTimeResolution(value, numberScaleUnits, numberScaleValues);
        }

      return value;
    },

    getNumberFormattedString: function (value, numberScaleUnits, numberScaleValues) {
      var listOfUnits = numberScaleUnits.split(","),
          listOfValues = numberScaleValues.split(","),
          numOfValues = listOfValues.length,
          currentValue = value;

      var i;

      for (i = 0; i < numOfValues; i++) {
        var remainingVal = currentValue / listOfValues[i];
        if (remainingVal < 1) {
          break;
        }

        currentValue = remainingVal;
      }

      var unit = '';
      if (i > 0) {
        unit = listOfUnits[i - 1].replace('"', '');
      }
      return ((Math.round(currentValue * 100) / 100) + unit);
    },

    getPercentFormattedString: function (value, numberScaleUnits, numberScaleValues) {
      var listOfUnits = numberScaleUnits.split(","),
          currentValue = value / numberScaleValues,
          unit = listOfUnits[0].replace('"', '');

      return ((Math.round(currentValue * 100) / 100) + unit);
    },

    getTimeFormattedString: function (value, numberScaleUnits, numberScaleValues) {
      var listOfUnits = numberScaleUnits.split(","),
          listOfValues = numberScaleValues.split(","),
          numOfValues = listOfValues.length,
          outputArray = [],
          remainingValue = value;

      if (this.doNumberScaleValueHasOnlyLeastUnits(listOfValues, value)) {
        outputArray.push(Math.round(value) + listOfUnits[0]);
        return outputArray.join(" ");
      }

      for (var i = numOfValues - 1; i >= 0; i--) {
        var totalValue = _.reduce(listOfValues, function (memo, num) { return memo * num; }),
            currentUnitValue = Math.floor(remainingValue / totalValue);

        if (currentUnitValue >= 1 || value == 0) {
          remainingValue = remainingValue - (currentUnitValue * totalValue);
          outputArray.push(Math.floor(currentUnitValue) + listOfUnits[i].replace('"', ''));

          if (value == 0)
            break;
        }

        listOfValues.pop();
      }

      return outputArray.join(" ");

    },

    getformattedDateForTimeResolution: function (date, numberScaleUnits, numberScaleValues) {
        var timeResolution = numberScaleUnits.split(",")[0],
            culture = numberScaleValues.split(",")[0];

      if (culture) {
        $.datepicker.setDefaults($.datepicker.regional[culture]);
      }

      switch (timeResolution) {
        case "d":
          return $.datepicker.formatDate("d M ''y", date).replace(".", "");

        case "w":
          return $.datepicker.formatDate("d M ''y", this.getStartOfWeek(date)).replace(".", "");

        case "m":
          return $.datepicker.formatDate("M ''y", date).replace(".", "");

        default:
          return $.datepicker.formatDate("d M ''y", date).replace(".", "");
      }
    },

    getStartOfWeek: function (date) {
      var startOfWeek = $.datepicker._defaults.firstDay;
      var diff = date.getDay() - startOfWeek;
      if (diff < 0)
      {
        diff += 7;
      }

      date.setDate(date.getDate() - diff);
      return date;
    },

    doNumberScaleValueHasOnlyLeastUnits: function (listOfValues, value) {
      if (typeof listOfValues === "undefined" || typeof value === "undefined") return false;

      var hasOnlyLeastUnits = false;

      if (listOfValues.length > 1) {
        hasOnlyLeastUnits = (value < (listOfValues[0] * listOfValues[1]));
      } else {
        hasOnlyLeastUnits = (value < (listOfValues[0]));
      }

      return hasOnlyLeastUnits;
    }
  };
});