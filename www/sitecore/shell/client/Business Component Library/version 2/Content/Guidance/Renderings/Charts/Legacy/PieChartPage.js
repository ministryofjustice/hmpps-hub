(function(speak) {
  speak.pageCode([],function() {
    return {
      
      
      initialized: function() {
        //this.AreaChartSingleSeries.toggleProgressIndicator(true);                

        var data = {
          "localization": {
            "fields": [
              {
                "field": "channel",
                "translations": {
                  "10": "Search Engine Organic",
                  "15": "Search Engine Organic Branded",
                  "20": "Direct",
                  "30": "Referred-Other",
                  "31": "Referred-Blog",
                  "32": "Referred-News",
                  "33": "Referred-Conversations",
                  "34": "Referred-Community",
                  "35": "Referred-Wiki",
                  "36": "Referred-Analyst",
                  "40": "RSS",
                  "50": "Email",
                  "90": "Paid"
                }
              }
            ]
          },
          "dataset": [
            {
              "data": [
                {
                  "date": "01 Jan 2011",
                  "value": "1",
                  "visits": "11",
                  "valuePerVisit": "0.09",
                  "channel": "10"
                },
                {
                  "date": "10 Jan 2011",
                  "value": "2",
                  "visits": "12",
                  "valuePerVisit": "0.16",
                  "channel": "50"
                },
                {
                  "date": "20 Jan 2011",
                  "value": "3",
                  "visits": "13",
                  "valuePerVisit": "0.23",
                  "channel": "20"
                },
                {
                  "date": "30 Jan 2011",
                  "value": "4",
                  "visits": "14",
                  "valuePerVisit": "0.28",
                  "channel": "10"
                }
              ]
            }
          ]
        };      

        this.PieChartFilteredCategories.DynamicData = data;
        this.PieChartAllCategories.DynamicData = data;

      }
    };
  }, "SubAppRenderer");
})(Sitecore.Speak);