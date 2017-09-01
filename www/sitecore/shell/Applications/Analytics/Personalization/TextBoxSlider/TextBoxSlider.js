if (typeof (Sitecore) == "undefined") {
  Sitecore = new Object();
}

Sitecore.SliderTextBox = function (id, ctlId, allowOverflow, addPostfix, min, max) {
  this.updateText = true;
  this.allowOverflowValue = allowOverflow;
  this.postfix = "%";
  this.showPostfix = addPostfix;
  this.maxValue = max;
  this.minValue = min;
  this.controlId = ctlId;
  this.hasChanges = false;
  this.temporaryValue = null;
  this.displayName = ctlId;
  this.onClientChanged = null;
  this.AllowDoubleValue = true;
  this.IsActive = true;
  this.ID = id;
  this.regexValidatorMessage = "Regex: Ivalid data! Please enter a number between {0} and {1}.";
  this.rangeValidatorMessage = "Ivalid data! Please enter a number between {0} and {1}.";
  this.minOutOfRangeWithConfirmMessage = "The value you entered is invalid.\nDo you want to extend the range to include this value?";
  this.minOutOfRangeMessage = "The value you entered is invalid.\nYou must enter a value between {1} and {2}.";
  this.maxOutOfRangeWithConfirmMessage = "The value you entered is invalid.\nDo you want to extend the range to include this value?";
  this.maxOutOfRangeMessage = "The value you entered is invalid.\nYou must enter a value between {1} and {2}.";
  var me = this;

    this.repaintSlider = function (sender, eventArgs) {
        me.repaintSliderEx(sender, eventArgs);
    };

    this.validateSliderData = function () {
        me.validateSliderDataEx();
    }

    this.handleComboValueChanged = function (sender, eventArgs) {
        me.handleComboValueChangedEx(sender, eventArgs);
    }

    this.getValue = function () {
        return me.getValueEx();
    }

    this.setValue = function (value) {
        return me.setValueEx(value);
    }

    this.setMinMaxValue = function (minValue, maxValue) {
        return me.setMinMaxValueEx(minValue, maxValue);
    }

    this.refreshValue = function () {
        me.refreshValueEx();
    }
}

Sitecore.SliderTextBox.prototype.refreshValueEx = function () {
  var combobox = this.getCombobox();
  if (!combobox) {
    return;
  }

  if (this.onClientChanged) {
    this.onClientChanged(this.getComboValue(combobox));
  }
}

Sitecore.SliderTextBox.prototype.repaintSliderEx = function(sender, eventArgs) {
  var slider = this.getSlider();
  slider.repaint();
};


/* functions */
Sitecore.SliderTextBox.prototype.getSlider = function() {
  var combobox = this.getCombobox();
  if (!combobox) {
    return;
  }

  var item = combobox.get_items().getItem(0);
  var r = $(item.get_element()).select(".sitecoretextslider");
  var slider = $find(r[0].id);
  return slider;
};

Sitecore.SliderTextBox.prototype.setComboValue = function(combobox, value) {
  this.hasChanges = true;
  if (combobox) {
    var text = String(value);
    if (this.showPostfix) {
      text = text.replace(this.postfix, "");
      text += this.postfix;
    }

    combobox.set_text(text);

    if (this.onClientChanged) {
      this.onClientChanged(this.getComboValue(combobox));
    }
  }
};

Sitecore.SliderTextBox.prototype.getValueEx = function () {
  var combobox = this.getCombobox();
  if (combobox) {
    return parseFloat(this.getComboValue(combobox));
  }

  return 0.0;
};

Sitecore.SliderTextBox.prototype.setValueEx = function (value) {
  var combobox = this.getCombobox();
  if (combobox) {
    this.setComboValue(combobox, value);
    this.updateSlider();
  }
};

Sitecore.SliderTextBox.prototype.setMinMaxValueEx = function (minValue, maxValue) {
    var combobox = this.getCombobox();
    if (combobox) {
        this.minValue = minValue;
        this.maxValue = maxValue;

        this.updateSlider();
        this.repaintSlider();
    }
};

Sitecore.SliderTextBox.prototype.getComboValue = function (combobox) {
  if (!combobox) {
    return "0";
  }

  var sliderData = combobox.get_text();
  if (sliderData.length == 0) {
    sliderData = "0";
    this.setComboValue(combobox, "0");
  }

  if (this.showPostfix) {
    sliderData = sliderData.replace(this.postfix, "");
  }

  return sliderData;
};

Sitecore.SliderTextBox.prototype.handleComboValueChangedEx = function(sender, eventArgs) {
  if (!this.updateText) {
    this.updateText = true;
    return;
  }

  var combobox = this.getCombobox();
  if (combobox) {
    this.setComboValue(combobox, String(sender.get_value()));
  }
}

Sitecore.SliderTextBox.prototype.getCombobox = function() {
  return $find(this.controlId);
}

Sitecore.SliderTextBox.prototype.updateSlider = function () {
    var combobox = this.getCombobox();
    if (!combobox) {
        return;
    }

    var slider = this.getSlider();
    if (!slider) {
        return;
    }

    var sliderData = this.getComboValue(combobox);
    if (sliderData.length == 0) {
        sliderData = "0";
    }

    var value = parseFloat(sliderData);
    if (isNaN(value)) {
        return;
    }

    updateText = !((value > this.maxValue) || (value < this.minValue)) || ((parseFloat(slider.get_value()) == this.maxValue) && (parseFloat(sliderData) > this.maxValue)) || ((parseFloat(slider.get_value()) == this.minValue) && (value < this.minValue));
    slider.set_value(value);

    slider.set_maximumValue(this.maxValue);
    slider.set_minimumValue(this.minValue);
}

Sitecore.SliderTextBox.prototype.validateSliderDataEx = function () {
  if (!this.hasChanges) {
    return;
  }

  var combobox = this.getCombobox();
  if (!combobox) {
    return;
  }

  var text = this.getComboValue(combobox);
  if (text.length == 0) {
    text = String(this.minValue);
    this.setComboValue(combobox, text);
  }

  var regex = /^\d+$|^\d+\.\d+$/
  if (!this.AllowDoubleValue) {
    regex = /^\d+$/
  }

  if (!regex.test(text)) {
    
    alert(this.formatMessage(this.regexValidatorMessage, [this.minValue, this.maxValue]));
    this.comboboxSetFocus(combobox);
    return;
  }

  var value = parseFloat(text);
  if (isNaN(value)) {
    alert(this.formatMessage(this.rangeValidatorMessage, [this.minValue, this.maxValue]));
    this.comboboxSetFocus(combobox);
    return;
  }

  if (value < this.minValue) {
    if (this.allowOverflowValue && value >= 0) {
      if (!confirm(this.formatMessage(this.minOutOfRangeWithConfirmMessage, [this.displayName, this.minValue, this.maxValue]))) {
        this.setComboValue(combobox, String(this.minValue));
      }
      else {
        this.hasChanges = false;
      }
      return;
    }

    alert(this.formatMessage(this.minOutOfRangeMessage, [this.displayName, this.minValue, this.maxValue]));
    this.setComboValue(combobox, String(this.minValue));
    return;
  }

  if (value > this.maxValue) {
    if (this.allowOverflowValue) {
      if (!confirm(this.formatMessage(this.maxOutOfRangeWithConfirmMessage, [this.displayName, this.minValue, this.maxValue]))) {
        this.setComboValue(combobox, String(this.maxValue));
      }
      else {
        this.hasChanges = false;
      }
      return;
    }

    alert(this.formatMessage(this.maxOutOfRangeMessage, [this.displayName, this.minValue, this.maxValue]));
    this.setComboValue(combobox, String(this.maxValue));
    return;
  }
}

Sitecore.SliderTextBox.prototype.formatMessage = function (message, parameters) {
  if (!message || !parameters) {
    return message;
  }

  if (!parameters.length || parameters.length == 0) {
    return message;
  }

  var result = message;
  for (var i = 0; i < parameters.length; i++) {
    try {
      if (parameters[i] != null) {
        result = result.replace("{" + i + "}", parameters[i].toString());
      }
    } 
    catch (e)
    { }
  }

  return result;
}

Sitecore.SliderTextBox.prototype.comboboxSetFocus = function(combobox) {
  setTimeout(function() { combobox.get_inputDomElement().focus(); }, 10);
}

Sitecore.SliderTextBox.prototype.comboboxOnKeyDown = function (e) {
  var e = e || window.event;
  var keyCode = e.which || e.keyCode;
  if ((keyCode == 38) || (keyCode == 40)) {
    var combobox = this.getCombobox();
    if (combobox) {
      this.temporaryValue = this.getComboValue(combobox);
    }
  }

  if (!((keyCode == 220) || ((keyCode <= 57) && (keyCode >= 48)) || ((keyCode <= 40) && (keyCode >= 35))
        || ((keyCode <= 46) && (keyCode >= 45)) || (keyCode == 8) || (keyCode == 9) || (keyCode == 38) || (keyCode == 40) || (keyCode == 20) || ((keyCode <= 105) && (keyCode >= 96)) || ((keyCode == 110) && this.AllowDoubleValue))) {
    if (e.preventDefault) {
      e.preventDefault()
    }
    else {
      e.returnValue = false;
    }


    return;
  }

  this.hasChanges = true;
}

Sitecore.SliderTextBox.prototype.comboboxOnKeyUp = function (e) {
  this.updateText = false;
  var combobox = this.getCombobox();
  var e = e || window.event;
  var keyCode = e.which || e.keyCode;
  if (this.temporaryValue) {
    this.setComboValue(combobox, this.temporaryValue);
    this.temporaryValue = null;
  }

  if (((keyCode <= 57) && (keyCode >= 48)) || ((keyCode <= 105) && (keyCode >= 96)) || ((keyCode == 110) && this.AllowDoubleValue) || (keyCode == 46) || (keyCode == 8)) {
    this.setComboValue(combobox, this.getComboValue(combobox));
  }
}
