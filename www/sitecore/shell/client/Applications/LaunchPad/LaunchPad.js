require.config({
  paths: {
    experienceAnalytics: "/sitecore/shell/client/Applications/ExperienceAnalytics/Common/Layouts/Renderings/Shared/ExperienceAnalytics"
  }
});

define(["sitecore", "experienceAnalytics", "jquery", "underscore"], function (Sitecore, ExperienceAnalytics, $, _) {
  var LaunchPadPageCode = Sitecore.Definitions.App.extend({
    initialized: function() {
      var self = this;
      //this.showFallbackMsg();
      Sitecore.on("chart:loaded", this.updateCharts, this);
      Sitecore.on("chartData:loaded", this.checkData, this);

      $("[data-sc-id='ColumnPanelCampaigns']").hide();
      $("[data-sc-id='InteractionsBorder']").hide();
      
      $(document).ajaxError(function () {
        self.checkData();
      });
    },

    chartsLoaded: 0,
    chartsDataLoaded: 0,

    updateCharts: function() {

      this.chartsLoaded++;

      var interApp = this.InteractionChartApp,
        campApp = this.CampaignsChartApp,
        startDate = new Date(),
        endDate = new Date(),
        formattedStartDate,
        formattedEndDate;
      
      if (this.chartsLoaded === 2) {
        if (typeof campApp !== "undefined" && campApp !== null) {
          campApp.TopFiveCampaignsByVisitsProgressIndicator.set("targetControl", "FallbackMessageWrap");
          campApp.TopFiveCampaignsByVisitsDataProvider.on("change:data", function() {
            Sitecore.trigger("chartData:loaded", { chartName: "campaigns", data: campApp.TopFiveCampaignsByVisitsDataProvider.get("data") });
          }, this);
        }

        if (typeof interApp !== "undefined" && interApp !== null) {
          interApp.InteractionsByVisitsAndValuePerVisitsProgressIndicator.set("targetControl", "FallbackMessageWrap");
          interApp.InteractionsByVisitsAndValuePerVisitsDataProvider.on("change:data", function() {
            var data = interApp.InteractionsByVisitsAndValuePerVisitsDataProvider.get("data");
            Sitecore.trigger("chartData:loaded", { chartName: "interactions", data: data });
          });
        }

        startDate.setMonth(startDate.getMonth() - 3);

        formattedStartDate = ExperienceAnalytics.reConvertDateFormat($.datepicker.formatDate("dd-mm-yy", startDate));
        formattedEndDate = ExperienceAnalytics.reConvertDateFormat($.datepicker.formatDate("dd-mm-yy", endDate));

        ExperienceAnalytics.setDateRange(formattedStartDate, formattedEndDate);
        
       
      }

    },
    
    checkData: function (options) {

      if (this.checkChartHasData(options["data"], options["chartName"])) {
        if (options["chartName"] === "campaigns") {
          $("[data-sc-id='ColumnPanelCampaigns']").show();
          //this.CampaignsBorder.set("isVisible", true);
        }
        if (options["chartName"] === "interactions") {
          $("[data-sc-id='ColumnPanelInteractions']").show();
          //this.InteractionsBorder.set("isVisible", true);
        }
      }

     
      this.chartsDataLoaded++;
      
      if (this.chartsDataLoaded === 2) {
        if (!$("[data-sc-id='ColumnPanelInteractions']").is(":visible") && !$("[data-sc-id='ColumnPanelCampaigns']").is(":visible")) {
          this.showFallbackMsg();
        } else {
          this.FallBackMessageBorder.set("isVisible", false);
        }
        
      }
     
    },

    checkChartHasData: function(dataObj, chartName) {
      var result = (dataObj &&
        dataObj["content"] &&
        dataObj["content"].length > 0);

      if (chartName === "interactions" &&
        result) {

        result = (_.reduce(
          dataObj["content"],
          function(memo, num) { return memo + num.visits; }, 0) != 0);
      }

      return result;
    },

    
    showFallbackMsg: function() {
      this.RowPanelTilesWrapper.set("isVisible", false);
      this.FallBackMessageBorder.set("isVisible", true);
    }
  });

  return LaunchPadPageCode;
});