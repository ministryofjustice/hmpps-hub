var arTestComponents = ["sitecore", "KPISpot", "css!KPISpot"];
var arCoverageComponents = ["sitecore"];
var arResComponents;
if (window.location.host && window.location.host != '') // launching when address to web-page
  arResComponents = arTestComponents;
else // launching of the code-coverage estemating
  arResComponents = arCoverageComponents;

define(arResComponents, function (_sc) {


  describe("KPISpot testing|", function () {

    var setupTests = function ($pageElem) {      

      var KPISpotModel = new _sc.Definitions.Models.KPISpot();
      var KPISpotProto = _sc.Definitions.Views.KPISpot.prototype;

      $elem = $pageElem.find(".sc-KPISpot");

      KPISpotProto.setTestingOptions({
        $el: $elem,
        model: KPISpotModel,
      });

      try {
        KPISpotProto.initialize();
      }
      catch (e) {
      }
      

      var $KPISpotTextElem = KPISpotProto.$el.find(".sc-KPISpot-text");
      var $KPISpotValueElem = KPISpotProto.$el.find(".sc-KPISpot-value");

      describe("Initialization|", function () {

        it("'$KPISpotTextElem' must be defined|", function () {
          expect($KPISpotTextElem.length).toBeGreaterThan(0);
        });

        it("'$KPISpotValueElem' must be defined|", function () {
          expect($KPISpotValueElem.length).toBeGreaterThan(0);
        });

      });

      describe("'IndicateChanges' checking|", function () {

        KPISpotProto.model.set("indicatechanges", true);
        it("value > 0|", function () {

          KPISpotProto.model.set("value", 1);

          var isValueIncreaseClassExisted = $KPISpotValueElem.parent()[0].className.indexOf("value-increase") >= 0;
          expect(isValueIncreaseClassExisted).toEqual(true);
        });

        it("value < 0|", function () {

          KPISpotProto.model.set("value", -1);

          var isValueDecreaseClassExisted = $KPISpotValueElem.parent()[0].className.indexOf("value-decrease") >= 0;
          expect(isValueDecreaseClassExisted).toEqual(true);
        });

        it("value == 0|", function () {

          KPISpotProto.model.set("value", 0);

          var isValueNoChangeClassExisted = $KPISpotValueElem.parent()[0].className.indexOf("value-nochange") >= 0;
          expect(isValueNoChangeClassExisted).toEqual(true);
        });

      });

    };

    if (window.location.host && window.location.host != '') // launching when address to web-page
      window.runTests(setupTests);
    else // launching of the code-coverage estemating
      setupTests($("<div></div>"));

  });

});
