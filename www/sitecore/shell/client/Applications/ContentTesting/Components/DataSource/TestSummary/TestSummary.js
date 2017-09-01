define([
    "sitecore",
    "/-/speak/v1/contenttesting/RequestUtil.js"],
  function (Sitecore, requestUtil) {
      var actionUrl = "/sitecore/shell/api/ct/TestSummary/Get";

      Sitecore.Factories.createBaseComponent({
          name: "TestSummary",
          base: "ControlBase",
          selector: "script[type='x-sitecore-testsummarydatasource']",
          attributes: [
            { name: "isBusy", defaultValue: false },
            { name: "invalidated", defaultValue: false },
            { name: "testId", value: "$el.data:sc-testid" },
            { name: "winnerName", defaultValue: "" },
            { name: "valueChange", defaultValue: 0 },
            { name: "valueIncrease", defaultValue: true },
            { name: "confidence", defaultValue: 0 },
            { name: "testScore", defaultValue: 0 },
            { name: "testOutcome", defaultValue: 0 },
            { name: "guessedTestOutcome", defaultValue: 0 },
            { name: "correctlyGuessedOutcome", defaultValue: false },
            { name: "hasSuggestions", defaultValue: false },
            { name: "suggestions", defaultValue: [] },
            { name: "hasPredictions", defaultValue: false },
            { name: "predictions", defaultValue: [] },
            { name: "hasSegments", defaultValue: false },
            { name: "segments", defaultValue: [] },
            { name: "maximumSuggestions", value: "$el.data:sc-maximum-suggestions" }
          ],

          initialize: function () {


              var testId = Sitecore.Helpers.url.getQueryParameters(window.location.search).testId;
              if (testId != null) {
                  this.model.set("testId", testId);
              } else {
                  this.model.on("change:testId change:maximumSuggestions", this.model.refresh, this.model);
              }
              this.model.refresh();

          },

          extendModel: {
              refresh: function () {
                  var testId = this.get("testId");

                  if (!testId) {
                      return;
                  }

                  var url = Sitecore.Helpers.url.addQueryParameters(actionUrl, {
                      testId: testId,
                      maximumSuggestions: this.get("maximumSuggestions")
                  });

                  if (this.prevUrl === url) {
                      return;
                  }

                  if (this.get("isBusy")) {
                      this.set("invalidated", true);
                      return;
                  }

                  this.prevUrl = url;

                  this.set({
                      isBusy: true,
                      invalidated: false
                  });

                  var ajaxOptions = {
                      cache: false,
                      url: url,
                      context: this,
                      success: function (data) {
                          this.set("isBusy", false);
                          if (this.get("invalidated")) {
                              this.refresh();
                          } else {
                              if (data) {
                                  this.set({
                                      winnerName: data.WinnerName,
                                      valueChange: data.ValueChange,
                                      valueIncrease: data.ValueChange > 0,
                                      confidence: data.Confidence,
                                      testScore: data.TestScore,
                                      testOutcome: data.TestOutcome,
                                      guessedTestOutcome: data.GuessedTestOutcome,
                                      correctlyGuessedOutcome: data.TestOutcome === data.GuessedTestOutcome,
                                      hasSuggestions: data.Suggestions && data.Suggestions.length > 0,
                                      suggestions: data.Suggestions,
                                      hasPredictions: data.Predictions && data.Predictions.length > 0,
                                      predictions: data.Predictions,
                                      hasSegments: data.Segments && data.Segments.length > 0,
                                      Segments: data.Segments
                                  });
                              }
                          }
                      },
                      error: function (req, status, error) {
                          console.log("Ajax call failed");
                          console.log(status);
                          console.log(error);
                          console.log(req);
                      }
                  };

                  requestUtil.performRequest(ajaxOptions);
              }
          }
      });
  });