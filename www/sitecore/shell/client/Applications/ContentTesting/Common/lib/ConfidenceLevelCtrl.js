
define([], function () {

  var rbConfidence90 = null;
  var rbConfidence95 = null;
  var rbConfidence99 = null;
  var TestDurationDataSource = null;

  return {

    initElements: function (objOwner) {
      rbConfidence90 = objOwner.rbConfidence90;
      rbConfidence95 = objOwner.rbConfidence95;
      rbConfidence99 = objOwner.rbConfidence99;
      TestDurationDataSource = objOwner.TestDurationDataSource;

      // Expectation
      if(rbConfidence90)
        rbConfidence90.on("change:isChecked", this.confidenceLevelChanged, this);
      if(rbConfidence95)
        rbConfidence95.on("change:isChecked", this.confidenceLevelChanged, this);
      if(rbConfidence99)
        rbConfidence99.on("change:isChecked", this.confidenceLevelChanged, this);
      if(rbConfidence95)
        rbConfidence95.set("isChecked", true);
    },
    setElements: function (objOwner) {
      return this.initElements(objOwner);
    },

    confidenceLevelChanged: function (sender, isChecked) {
      if (TestDurationDataSource) {
        TestDurationDataSource.set("confidence", this.getConfidenceLevel());
      }
    },

    isAvailable: function () {
      if (rbConfidence90 && rbConfidence95 && rbConfidence99)
        return true;
      else
        return false;
    },

    getConfidenceLevel: function () {
      var confidence = 0;
      if (rbConfidence90 && rbConfidence90.get("isChecked"))
        confidence = rbConfidence90.get("value");
      else if (rbConfidence95 && rbConfidence95.get("isChecked"))
        confidence = rbConfidence95.get("value");
      else if (rbConfidence99 && rbConfidence99.get("isChecked"))
        confidence = rbConfidence99.get("value");

      return confidence;
    },

    setConfidenceLevel: function (confidence) {
      if (!confidence)
        return;
      if (rbConfidence90 || rbConfidence95 || rbConfidence99) {
        if (rbConfidence90 && confidence === rbConfidence90.get("value"))
          rbConfidence90.set("isChecked", true);
        else if (rbConfidence95 && confidence === rbConfidence95.get("value"))
          rbConfidence95.set("isChecked", true);
        else if (rbConfidence99 && confidence === rbConfidence99.get("value"))
          rbConfidence99.set("isChecked", true);
      } else {

      }

    },


  };

});