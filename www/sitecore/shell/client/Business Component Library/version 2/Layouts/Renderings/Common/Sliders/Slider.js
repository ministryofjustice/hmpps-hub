(function(speak) {

speak.component(["bclCollection", "bclSelection", "bclRangeSelection", "bootstrapSlider", "jquery"], function (Collection, Selection, RangeSelection) {

  /**
  * Parses a string to check if it is a Number.
  * 
  * @param {string} value - The value to be parsed.      
  */
  function parseNumber(value) {
    return isNaN(Number(value)) ? value : Number(value);
  };

  /**
  * Handles changes on DynamicData.  
  */
  function dynamicDataChangeHandler() {
    initializeSlider.call(this, false);
  };

  /**
  * Handles changes on SelectedValue.
  */
  function selectedValueChangedHandler() {
    var valueCalculationOptions = {
      minimum: this.Minimum,
      maximum: this.Maximum,
      selectedValue: this.SelectedValue,
      selectedValueStart: this.SelectedValueStart,
      selectedValueEnd: this.SelectedValueEnd,
      type: this.Type
    };    
    selectedValueChanged.call(this, calculateSliderValue.call(this, valueCalculationOptions));
  };


  /**
  *Get slider index from item's value..
  * 
  * @param {string} value - The item's value.      
  * @param {string} defaultValue - The default value in case the item with teh given valueis not found.      
  */
  function getValueIndex(value, defaultValue) {

    if (this.hasData() && value) {

      var item = this.getByValue(value);

      if (!item) {
        return defaultValue;
      }

      return this.indexOf(item);
    }

    if (isNaN(value) || value === "") {
      return defaultValue;
    }

    return value;
  };

  /**
  * Calculates the slider value.
  * 
  * @param {string} minimum - The minimum value.      
  * @param {string} maximum -The maximum value .      
  * @param {string} selectedValue - The selected value (single).      
  * @param {string} selectedValueStart - The selected value start (range).      
  * @param {string} selectedValueEnd - The selected value end (range).      
  * @param {string} type - The slider type (Single|Range).      
  * 
  * @return - The calculated value
  */
  function calculateSliderValue(options) {
    var selectedValueIndex = getValueIndex.call(this, options.selectedValue, this.Items.length - 1);
    var selectedValueStartIndex = getValueIndex.call(this, options.selectedValueStart, 0);
    var selectedValueEndIndex = getValueIndex.call(this, options.selectedValueEnd, this.Items.length - 1);

    if (options.type === "Range") {
      return selectedValueStartIndex + ";" + selectedValueEndIndex;
    }

    return selectedValueIndex;
  };  

  /**
  * Initializes the slider control.  
  */
  function initializeSlider (forceGeneratingNumericData) {
    var inputControl,
      sliderValue,
      sliderParent,
      valueCalculationOptions;  

    generateNumericItems.call(this, forceGeneratingNumericData);
    valueCalculationOptions = {
      minimum: this.Minimum,
      maximum: this.Maximum,
      selectedValue: this.SelectedValue,
      selectedValueStart: this.SelectedValueStart,
      selectedValueEnd: this.SelectedValueEnd,
      type: this.Type
    };

    sliderValue = calculateSliderValue.call(this, valueCalculationOptions);
    var that = this;
    var options = {
      formater: function (index) {
        var displayValue = index;
        if (index < that.getNumOfItems()) {
          displayValue = that.getDisplayName(that.at(index));
        }

        if (!displayValue) {
          displayValue = (Math.round(index * 10) / 10);
        }

        return that.ValuePrefix + displayValue + that.ValueSuffix;
      },

      getImageUrl: function (value) {
        return that.hasData() ? that.Items[value].ImageUrl : null;
      },

      isTitleBar: this.IsLabelVisible,
      hideTooltip: this.IsTooltipHidden,
      min: 0,
      max: this.getNumOfItems() - 1,
      step: 1,
      titleValuesStep: this.LabelsStep,
      sliderValue: sliderValue
    };

    inputControl = $(this.el).find(".sliderControl");

    // If it's already a slider control, then this will "reset"
    sliderParent = inputControl.parents(".slider");
    if (sliderParent.length > 0) {
      sliderParent.before(inputControl);
      sliderParent.remove();
    }

    var slider = inputControl.sliderCustom(options);
    this.sliderComponent = slider.data("slider");

    this.sliderControl = slider[0];
    this.toggleEnable();

    slider.on("slide", function (ev) {
      that.sliderValueChanged = true;
      if (Array.isArray(ev.value)) {    
        that.selectRange([that.at(ev.value[0]), that.at(ev.value[1])]);
      } else {
        that.selectAt(ev.value);
      }
    });
  };

  /**
  * Handles changes on SelectedValue setting the relative Item as SelectedItem.
  * 
  * @param {string} value - The new value.      
  */
  function selectedValueChanged(value) {    
    if (this.sliderComponent && !this.sliderValueChanged) {
      this.sliderComponent.setValue(value);
    }
    this.sliderValueChanged = false;
  };
  
  /**
  * Generate numeric items if Mimimum and Maximum values are defined and DynamiData is empty.     
  */
  function generateNumericItems(forceGeneratingNumericData) {
    if (!this.hasData() || forceGeneratingNumericData) {
      var numericItems = [];
      var index;
      for (var i = this.Minimum; i <= this.Maximum; i = i + this.Step) {
        index = i;
        numericItems.push({ itemName: index, itemId: index, value: index });
      }
      this.DisplayFieldName = "itemName";
      this.ValueFieldName = "value";
      if (this.SelectedValue.length === 0) {
        this.set("SelectedValue", this.Maximum, false);        
      }
      this.reset(numericItems);
    }
  }

  return speak.extend({}, Collection.prototype, Selection.prototype, RangeSelection.prototype, {
    sliderComponent: null,
    sliderControl: null,
    sliderValueChanged: false,

    initialize: function() {
      Collection.prototype.initialize.call(this);
    },

    initialized: function() {
      this.DynamicData = this.DynamicData ? JSON.parse(this.DynamicData) : [];
      this.SelectedValue = parseNumber(this.SelectedValue);
      this.SelectedValueStart = parseNumber(this.SelectedValueStart);
      this.SelectedValueEnd = parseNumber(this.SelectedValueEnd);

      Collection.prototype.initialized.call(this);
      Selection.prototype.initialized.call(this);      
      RangeSelection.prototype.initialized.call(this);

      this.Minimum = parseNumber(this.Minimum);
      this.Maximum = parseNumber(this.Maximum);
      this.Step = parseNumber(this.Step);
      this.Step = isNaN(this.Step) ? 1 : this.Step;
      this.LabelsStep = parseNumber(this.LabelsStep);
      this.LabelsStep = isNaN(this.LabelsStep) ? 0 : this.LabelsStep;

      this.on("change:IsEnabled", this.toggleEnable, this);
      this.on("itemsChanged", dynamicDataChangeHandler, this);
           
      initializeSlider.call(this, false);

      this.on("change:SelectedValue", selectedValueChangedHandler, this);
      this.on("change:SelectedValueStart", selectedValueChangedHandler, this);
      this.on("change:SelectedValueEnd", selectedValueChangedHandler, this);

    },

    selectByValue: function (value) {
      Selection.prototype.selectByValue.call(this, value);
    },

    /**
    * Toggle component Enabled property
    */
    toggleEnable: function() {
      $(this.el).toggleClass("disabled", !this.IsEnabled);
      this.sliderControl.disabled = !this.IsEnabled;
    },

    /**
    * Sets new Minimum, Maximum, Step values
    */
    setMinMaxStep: function(min, max, step) {
      var newMin = parseNumber(min),
      newMax = parseNumber(max),
      newStep = parseNumber(step);

      if (!isNaN(newMin) && !isNaN(newMax) && !isNaN(newStep)) {
        this.Minimum = parseNumber(min);
        this.Maximum = parseNumber(max);
        this.Step = parseNumber(step);
        initializeSlider.call(this, true);
      }      
    }
  });
}, "Slider");
})(Sitecore.Speak);