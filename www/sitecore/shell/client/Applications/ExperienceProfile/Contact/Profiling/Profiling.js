define(["sitecore", "/-/speak/v1/experienceprofile/DataProviderHelper.js"], function(sc, providerHelper)
{
  var isVisibleProperty = "isVisible";
  var textProperty = "text";
  var barsProperty = "bars";

  var pageAddedEvent = "pageAdded";

  var visitIdParam = "visitId";

  function initOthePatternBars(subapp, data, intelBaseUrl)
  {
    var profileId = data.ProfileId;
    var visitId = data.LatestVisitId;
    var bestPatternId = data.BestMatchedPatternId;

    var tableName = "profile-pattern-matches";
    providerHelper.initProvider(subapp.BarsDataProvider, tableName, intelBaseUrl + tableName + "/" + profileId + "/");
    providerHelper.addQueryParameter(subapp.BarsDataProvider, visitIdParam, visitId);
    providerHelper.addQueryParameter(subapp.BarsDataProvider, "sort", "PatternGravityShare%20desc");
    subapp.BarsDataProvider.on(pageAddedEvent, function(newData)
    {
      var data = [];
      data = data.concat(subapp.BarsBorder.get(barsProperty));
      for(var i = 0; i < newData.length; i++)
      {
        if(newData[i].PatternId != bestPatternId)
        {
          data.push({ "name": newData[i].PatternDisplayName, "percent": (newData[i].PatternGravityShare * 100).toFixed(2) });
        }
      }
      data ?
        subapp.BarsBorder.set(barsProperty, data) :
        this.NoPatternsMachedBorder.set(isVisibleProperty, true);
    });
    providerHelper.getListData(subapp.BarsDataProvider);
    subapp.set("profileId", profileId);
  }

  function initRadarChart(subapp, data, intelBaseUrl)
  {
    var profileId = data.ProfileId;
    var visitId = data.LatestVisitId;

    var tableName = "profiling-profile-key-values";
    providerHelper.initProvider(subapp.RadarDataProvider, tableName, intelBaseUrl + tableName + "/" + profileId + "/");
    providerHelper.addQueryParameter(subapp.RadarDataProvider, visitIdParam, visitId);
    subapp.RadarDataProvider.on(pageAddedEvent, function(newData)
    {
      var data = {
        "dataset": [{ "data": [] }]
      };
      var legend = [];
      for(var i = 0; i < newData.length; i++)
      {
        var categoryName = newData[i].ProfileKeyDisplayName;
        if(categoryName.length > 9)
        {
          categoryName = categoryName.substring(0, 7) + "...";
        }
        data.dataset[0].data.push({ "category": categoryName, "value": newData[i].ProfileKeyValue, "channel": "SOME TEXT FOR THE LEGEND" });
        legend.push({ "categoryName": newData[i].ProfileKeyDisplayName, "categoryValue": newData[i].ProfileKeyValue });
      }
      subapp.RadarChart.set("data", data);
      subapp.RadarLegendBorder.set("categories", legend);
      subapp.RadarLegendBorder.set(isVisibleProperty, true);
    });
    providerHelper.getListData(subapp.RadarDataProvider);
  }

  sc.Definitions.App = sc.Definitions.App.extend({
    initialized: function()
    {
      var intelPath = "/intel";
      var profilingProfilesTable = "profile-info";
      var intelBaseUrl = sc.Contact.baseUrl + intelPath + "/";

      providerHelper.setupHeaders([
        { urlKey: intelPath + "/" + profilingProfilesTable + "?", headerValue: profilingProfilesTable }
      ]);

      providerHelper.initProvider(this.ProfilingDataProvider, profilingProfilesTable, intelBaseUrl + profilingProfilesTable, this.ProfilingTabMessageBar);
      providerHelper.setupDataRepeater(this.ProfilingDataProvider, this.ProfilingDataRepeater);

      this.ProfilingDataRepeater.on("subAppLoaded", function(args)
      {
        var data = args.data;
        var subapp = args.app;

        if(!data)
        {
          this.ProfilingDataRepeater.set(isVisibleProperty, false);
          this.ProfilingTabMessageBar.addMessage("notification", this.NoProfilesFound.get(textProperty));
          return;
        }

        subapp.ProfilingRowAccordion.set("header", data.ProfileDisplayName);
        subapp.BestPatternImage.set("imageUrl", "/sitecore/api/ao/v1/analytics/patterncards/" + data.BestMatchedPatternId + "/image?w=128&h=128");
        subapp.RecencyVisitLabel.set(textProperty, data.LatestVisitIndex);
        subapp.RecencyLabel.set(textProperty, data.Recency);
        subapp.RadarChartLabel.set(textProperty, data.ProfileCalculationType);

        subapp.BarsBorder.set(barsProperty, []);
        subapp.BarsBorder.set("patternName", data.BestMatchedPatternDisplayName);
        subapp.BarsBorder.set("otherPatternMatches", subapp.OtherPatternMatchesLabel.get(textProperty));
        subapp.BarsBorder.set("patternPercentage", (data.BestMatchedPatternGravityShare * 100).toFixed(2));
        subapp.BarsBorder.set(isVisibleProperty, true);

        initRadarChart(subapp, data, intelBaseUrl);
        initOthePatternBars(subapp, data, intelBaseUrl);

        subapp.set("app", this);
        subapp.set("profileId", data.ProfileId);
        subapp.set("profileName", data.ProfileDisplayName);
      }, this);

      providerHelper.getListData(this.ProfilingDataProvider);
    }

  });

  return sc.Definitions.App;
});