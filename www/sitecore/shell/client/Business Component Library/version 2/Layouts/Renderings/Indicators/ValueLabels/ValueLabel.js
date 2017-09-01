(function (speak) {
  speak.component({
    name: "ValueLabel",    

    initialize: function () {
      this.$el = $(this.el);
      this.on("change:DynamicData", this.setData, this);
    },

    setData: function () {
      var data = this.DynamicData;

      if (data) {
        var dataField = this.DataFieldName;
        if (dataField) {
          var dataFunction = this.DataFunction;
          if (dataFunction) {
            var result = null;
            try {
              result = this.calculateFunction(data, dataField, dataFunction);
            } catch (errorObject) {
              this.handleError(errorObject);
            } finally {
              this.Value = result;
            }
          } else {
            this.Value = "-";
            var errorObject = { name: "Error", message: this.DataFunctionNotDefined };
            this.handleError(errorObject);
          }
        }
      }
    },

    setValue: function (value) {
      var parsedValue = parseFloat(value);

      if (isNaN(parsedValue)) {
        parsedValue = "";
      } else {
        parsedValue = parsedValue.toFixed(2);
        if (parsedValue % 1 === 0) {
          parsedValue = parseInt(parsedValue);
        }
      }

      this.Value = parsedValue;
    },

    setColors: function (valueColor, labelColor) {
      this.ValueColor = valueColor;
      this.LabelColor = labelColor;
      this.$el.find(".sc-ValueLabel-Value").css('color', valueColor);
      this.$el.find(".sc-ValueLabel-Label").css('color', labelColor);
    },

    handleError: function (errorObject) {
      console.log(errorObject);
      this.trigger("error", errorObject);
    },

    calculateFunction: function (data, dataField, dataFunction) {
      if (data) {

        var result = 0;

        if (!data.dataset[0].data[0][dataField]) {
          throw { name: "Error", message: this.DisplayFieldNotDefined};
        }

        switch (dataFunction) {
          case "Sum":
            result = 0;
            _.each(data.dataset[0].data, function (obj) {
              result += parseFloat(obj[dataField]);
            }, this);
            break;

          case "Average":
            if (data.dataset[0].data.length == 0) {
              return 0;
            }

            result = 0;
            _.each(data.dataset[0].data, function (obj) {
              result += parseFloat(obj[dataField]);
            }, this);

            result = result / data.dataset[0].data.length;
            break;

          case "Max":
            result = Number.MIN_VALUE;
            _.each(data.dataset[0].data, function (obj) {
              var currentValue = parseFloat(obj[dataField]);
              if (currentValue > result) {
                result = currentValue;
              }
            }, this);
            break;

          case "Min":
            result = Number.MAX_VALUE;
            _.each(data.dataset[0].data, function (obj) {
              var currentValue = parseFloat(obj[dataField]);
              if (currentValue < result) {
                result = currentValue;
              }
            }, this);
            break;

          case "Last":
            result = parseFloat(data.dataset[0].data[data.dataset[0].data.length - 1][dataField]);
            break;

          case "First":
            result = parseFloat(data.dataset[0].data[0][dataField]);
            break;
        }

        if (isNaN(result)) {
          return "";
        }

        result = result.toFixed(2);
        if (result % 1 === 0) {
          result = parseInt(result);
        }
        return result;
      }

      return "";
    }
  });
})(Sitecore.Speak);