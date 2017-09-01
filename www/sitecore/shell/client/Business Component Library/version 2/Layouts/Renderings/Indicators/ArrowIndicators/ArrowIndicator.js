(function(speak) {

  speak.component({
    name: "ArrowIndicator",
 
    initialize: function() {
      this.$el = $(this.el);
      this.defineProperty("IndicatorValue", "");
    },

    initialized: function () {
      this.refreshData(this.OldValue, this.NewValue);      
    },

    refreshData: function (oldValue, newValue) {
      this.OldValue = parseFloat(oldValue);
      this.NewValue = parseFloat(newValue);

      this.IndicatorValue = this.calculateValue(oldValue, newValue, this.ValueFormat, this.Language);

      this.setSvgImage(
        this.$el.find(".sc-ArrowIndicator-Arrow"),
        this.getDirection(newValue, oldValue),
        this.UpArrowColor,
        this.DownArrowColor,
        this.EqualSignColor);

      this.setValueColor(this.ValueColor);
    },

    /* Get the direction string description */
    getDirection: function (newValue, oldValue) {

      return (newValue > oldValue) ? "Up" : (newValue < oldValue) ? "Down" : "Equal";
    },

    /* Set the proper SVG arrow image */
    setSvgImage: function (arrowElement, direction, upColor, downColor, equalColor) {

      var inlineCode = '<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"  xml:space="preserve" ';

      switch (direction) {
        case "Up":
          inlineCode = inlineCode + 'viewBox="0 0 80 100" enable-background="new 0 0 80 100">' +
            '<path ' + this.calculateColorCode(direction, upColor) + ' d="M40,0L0,50h20v50h40V50h20L40,0z"/>';
          break;
        case "Down":
          inlineCode = inlineCode + 'viewBox="0 0 80 100" enable-background="new 0 0 80 100">' +
            '<path ' + this.calculateColorCode(direction, downColor) + ' d="M40,100l40-50H60V0L20,0v50H0L40,100z"/>';
          break;
        case "Equal":
          inlineCode = inlineCode + 'viewBox="0 0 40 40" enable-background="new 0 0 40 40">' +
            '<rect y="14" x="10" ' + this.calculateColorCode(direction, equalColor) + ' width="20" height="4"/>' +
            '<rect y="22" x="10" ' + this.calculateColorCode(direction, equalColor) + ' width="20" height="4"/>';
          break;
      }

      inlineCode = inlineCode + "</svg>";

      arrowElement.html(inlineCode);
    },

    /* Calculate the path color code*/
    calculateColorCode: function (direction, userColor) {
      var colorCode = "class='sc-ArrowIndicator-" + direction + "'";
      if (userColor) {
        colorCode = "fill='" + userColor + "'";
      }

      return colorCode;
    },

    /* Calculate the Value using the OldValue, the NewValue and the format (% or simple number) */
    calculateValue: function (oldValue, newValue, valueFormat, language) {
      var result;
      if (isNaN(oldValue) || isNaN(newValue)) {
        return "";
      }

      if (valueFormat === "Percentage") {
        if (oldValue === 0) {
          // if oldValue == 0 then do not show percentage, just newValue
          result = newValue.toFixed(2);
          valueFormat = "Number";
        } else {
          result = parseFloat(((newValue - oldValue) / Math.abs(oldValue) * 100)).toFixed(2);
        }
      } else {
        result = parseFloat(newValue - oldValue).toFixed(2);
      }

      if (!this.ShowMinusSign) {
        result = Math.abs(result);
      }

      result = result.toLocaleString(language);

      if (isNaN(result)) {
        return "";
      }

      if (result % 1 === 0) {
        result = parseInt(result);
      }

      if (valueFormat === "Percentage") {
        result = result + "%";
      }

      return result;
    },

    /* Set Value label css color*/
    setValueColor: function (valueColor) {
      if (valueColor) {
        var valueElement = this.$el.find(".sc-ArrowIndicator-Value");
        valueElement.css('color', valueColor);
      }
    }
  });
})(Sitecore.Speak);