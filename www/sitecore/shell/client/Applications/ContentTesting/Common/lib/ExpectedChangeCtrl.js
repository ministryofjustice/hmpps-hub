
define([], function () {
  
  var rbNegative = null;
  var rbNoChanges = null;
  var rbPositive = null;
  var expectationLabel = null;

  return {

    initElements: function (objOwner) {
      rbNegative = objOwner.rbNegative;
      rbNoChanges = objOwner.rbNoChanges;
      rbPositive = objOwner.rbPositive;
      expectationLabel = objOwner.ExpectationLabel;

      // Expectation
      if(rbNegative)
        rbNegative.on("change:isChecked", this.expectationRadioButtonChanged, this);
      if(rbNoChanges)
        rbNoChanges.on("change:isChecked", this.expectationRadioButtonChanged, this);
      if(rbPositive)
        rbPositive.on("change:isChecked", this.expectationRadioButtonChanged, this);
      if(rbNoChanges)
        rbNoChanges.set("isChecked", true);      
    },
    setElements: function (objOwner) {
      return this.initElements(objOwner);
    },

    expectationRadioButtonChanged: function (sender, isChecked) {
      if (expectationLabel && isChecked) {
        expectationLabel.set("text", sender.viewModel.$el.attr("title"));
      }
    },

    getExpectation: function () {
      var expectation = 0;
      if (rbNegative.get("isChecked"))
        expectation = parseInt(rbNegative.get("value"));
      else if (rbNoChanges.get("isChecked"))
        expectation = parseInt(rbNoChanges.get("value"));
      else if (rbPositive.get("isChecked"))
        expectation = parseInt(rbPositive.get("value"));

      return expectation;
    },

    setExpectation: function (expectation) {
      if (expectation < 0)
        rbNegative.set("isChecked", true);
      else if (expectation === 0)
        rbNoChanges.set("isChecked", true);
      else if (expectation > 0)
        rbPositive.set("isChecked", true);
    },

  };

});