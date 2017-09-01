define(["sitecore", "/-/speak/v1/experienceprofile/DataProviderHelper.js"], function (sc, providerHelper)
{
  var textProperty = "text";
  var isOpenProperty = "isOpen";
  var dataProperty = "data";
  var selectedProfileIdProperty = "selectedProfileId";
  
  return sc.Definitions.App.extend({
    initialized: function ()
    {
    },

    setupSmartPanel: function ()
    {
      var analyticsUrl = "/sitecore/api/ao/v1/analytics/",
        app = this.get("app"),
        profileId = this.get("profileId");

      if (app.get(selectedProfileIdProperty) == profileId) {
        app.SmartPanelProfiling.set(isOpenProperty, false);
        app.set(selectedProfileIdProperty, null);
        return;
      }

      app.SmartPanelProfiling.set(isOpenProperty, true);

      app.SmartPanelDataRepeater.viewModel.reset();

      app.SmartPanelHeaderText.set(textProperty, this.get("profileName"));
      app.set(selectedProfileIdProperty, profileId);

      providerHelper.initProvider(app.SmartPanelDataProvider, "", analyticsUrl + "profiles/" + profileId);
      providerHelper.getData(
        app.SmartPanelDataProvider,
        $.proxy(function(jsonData)
        {
          app.SmartPanelDataRepeater.viewModel.addData(jsonData.patternCards);
          app.SmartPanelDataProvider.set(dataProperty, jsonData);
        }, this)
      );

      app.SmartPanelDataRepeater.on("subAppLoaded", function(args)
      {
        var data = args.data;
        if (!data)
        {
          return;
        }
        
        args.app.PatternCardHeader.set(textProperty, data.name);
        args.app.PatternCardImage.set("imageUrl", analyticsUrl + "patterncards/" + data.id + "/image");
        args.app.DescriptionBorder.viewModel.$el.html(data.description);
      }, this);
    }
  });
});