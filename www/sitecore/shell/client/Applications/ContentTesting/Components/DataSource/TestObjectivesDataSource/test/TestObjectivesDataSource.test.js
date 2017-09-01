
var arResComponents;
if (window.location.host && window.location.host != '') // launching when address to web-page
  arResComponents = ["sitecore", "TestObjectivesDataSource", "css!TestObjectivesDataSource"];
else // launching of the code-coverage estemating
  arResComponents = ["sitecore"];

define(arResComponents, function (_sc) {

  describe("TestObjectivesDataSource testing|", function () {

    var setupTests = function ($pageElem) {

      var testObjectivesDSModel = new _sc.Definitions.Models.TestObjectivesDataSource();

      var testObjectivesDSProto = _sc.Definitions.Views.TestObjectivesDataSource.prototype;

      $elem = $pageElem.find(".sc-TestObjectivesDataSource");

      testObjectivesDSProto.$el = $elem;
      testObjectivesDSProto.model = testObjectivesDSModel;

      try {
        testObjectivesDSProto.initialize({});
      }
      catch (e) {
      }

      describe("Initialization|", function () {
        it("'$elem' must be defined|", function () {
          expect($elem.length).toBeGreaterThan(0);
        });
      });

      describe("GetData from server", function () {

        function waitDataBackground(done) {
          testObjectivesDSProto.model.refresh();

          var maxIndex = requestTimeWait / requestTimeInterval;
          var curIndex = 0;
          var idInterval = setInterval(function () {
            var items = testObjectivesDSProto.model.get("items");
            if ((items && items.length > 0) || curIndex >= maxIndex) {
              done();
              clearInterval(idInterval);
            }
            curIndex++;
          }, requestTimeInterval);

        };

        beforeEach(function (done) {
          waitDataBackground(done);
        });

        it("'items.length' must be > 0 and item must have defined fields", function () {
          var items = testObjectivesDSProto.model.get("items");
          var isOK = items && items.length > 0 && typeof items[0].guid != 'undefined' && typeof items[0].name != 'undefined';
          expect(isOK).toBe(true);
        });

      });

    };

    if (window.location.host && window.location.host != '') // launching when address to web-page
      window.runTests(setupTests);
    else // launching of the code-coverage estemating
      setupTests($("<div></div>"));

  });
});
