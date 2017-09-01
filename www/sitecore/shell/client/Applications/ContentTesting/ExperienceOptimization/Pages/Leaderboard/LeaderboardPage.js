require.config({
  paths: {
    dataRepeaterBinding: "/-/speak/v1/contenttesting/DataRepeaterBinding"
  }
});

define(["sitecore", "dataRepeaterBinding"], function (_sc, dataRepeaterBinding) {
  var Leaderboard = _sc.Definitions.App.extend({
    initialize: function() {
    },

    initialized: function () {
      var self = this;

      dataRepeaterBinding.init({
        improvementText: this.Texts.get("{0} % improvement from last month"),
        decreaseText: this.Texts.get("{0} % decrease from last month")
      });

      // Bind data repeater data
      dataRepeaterBinding.kpi = Sitecore.Speak.Helpers.url.getQueryParameters(window.location.href).kpi || "all";
      this.PreviousTestOutcomesDataSource.on("change:averageItem", this.setRepeaterAverageData, { app: this, repeater: this.PreviousTestOutcomesAverage, dataSource: this.PreviousTestOutcomesDataSource });
      this.CurrentTestOutcomesDataSource.on("change:averageItem", this.setRepeaterAverageData, { app: this, repeater: this.CurrentTestOutcomesAverage, dataSource: this.CurrentTestOutcomesDataSource });      
      this.PreviousTestOutcomesDataSource.on("change:items", dataRepeaterBinding.setRepeaterData, { app: this, repeater: this.PreviousTestOutcomes, dataSource: this.PreviousTestOutcomesDataSource });
      this.CurrentTestOutcomesDataSource.on("change:items", dataRepeaterBinding.setRepeaterData, { app: this, repeater: this.CurrentTestOutcomes, dataSource: this.CurrentTestOutcomesDataSource });

      // Bind data repeater entries
      this.PreviousTestOutcomesAverage.on("subAppLoaded", dataRepeaterBinding.bindLeaderboardEntryData, this);
      this.CurrentTestOutcomesAverage.on("subAppLoaded", dataRepeaterBinding.bindLeaderboardEntryData, this);
      this.PreviousTestOutcomes.on("subAppLoaded", dataRepeaterBinding.bindLeaderboardEntryData, this);
      this.CurrentTestOutcomes.on("subAppLoaded", dataRepeaterBinding.bindLeaderboardEntryData, this);

      this.on("setview", this.setview, this);

      // #26554 - hiding of the "ProgressIndicators" if their top-position == 0(changing of the top-position for invisibility)
      var idInterval = setInterval(function () {
        var arIndicators = [self.PreviousAverageDataBusyIndicator, self.PreviousAverageBusyIndicator, self.PreviousPeriodDataBusyIndicator, self.PreviousPeriodBusyIndicator,
                            self.CurrentAverageDataBusyIndicator, self.CurrentAverageBusyIndicator, self.CurrentDataBusyIndicator, self.CurrentBusyIndicator];

        for (var i = 0; i < arIndicators.length; i++) {
          var top = parseInt(arIndicators[i].viewModel.$el.css("top"));
          if (top == 0) {
            arIndicators[i].viewModel.$el.css("top", (top - 1000) + "px");
          }
        }        
      }, 50);

    },

    setRepeaterAverageData: function () {
      this.repeater.viewModel.reset();
      this.repeater.viewModel.addData([this.dataSource.get("averageItem")]);
    },

    setview: function (data) {
      this.ReportingDatesDataSource.set(data);
    }
  });

  return Leaderboard;
});