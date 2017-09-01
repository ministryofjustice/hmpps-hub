define(["sitecore", "/-/speak/v1/experienceprofile/DataProviderHelper.js", "/-/speak/v1/experienceprofile/CintelUtl.js"], function (sc, providerHelper, cintelUtil) {
  var mainApp,
    cidParam = "cid",
    textProperty = "text",
    isVisibleProperty = "isVisible",
    cintelTableNameProperty = "cintelTableName",
    intelPath = "/intel",
    lateststatisticsTable = "latest-statistics";
  
  var app = sc.Definitions.App.extend({
    initialized: function () {
      sc.trigger("overviewPanelApp", this);
      
      sc.on("contactApp", function (application, baseUrl, contactId) {
        mainApp = application;
        this.initInfoPanel(baseUrl, contactId);
      }, this);
    },


    initInfoPanel: function (baseUrl, contactId) {
      this.InfoBorder.set(isVisibleProperty, true);

      providerHelper.initProvider(this.InfoDataProvider, lateststatisticsTable, baseUrl + intelPath + "/" + lateststatisticsTable);

      this.InfoPhotoImage.set("imageUrl", baseUrl + "/image?w=170&h=170");

      this.checkNoContact(contactId);

      providerHelper.getData(
        this.InfoDataProvider,
        $.proxy(function (jsonData) {
          var dataSet = jsonData.data.dataSet[this.InfoDataProvider.get(cintelTableNameProperty)];
          if (!dataSet || dataSet.length < 1) {
            return;
          }

          var data = dataSet[0];
          
          cintelUtil.setText(this.LastVisitValue, data.FormattedTime + " " + data.FormattedDate, false);
          cintelUtil.setTitle(this.LastVisitValue, data.FormattedTime + " " + data.FormattedDate);
          
          cintelUtil.setText(this.RecencyValue, data.Recency, false);
          cintelUtil.setTitle(this.RecencyValue, data.Recency);
          
          cintelUtil.setText(this.CityValue, data.LatestVisitCityDisplayName, false);
          cintelUtil.setTitle(this.CityValue, data.LatestVisitCityDisplayName);
          
          cintelUtil.setText(this.RegionValue, data.LatestVisitRegionDisplayName, false);
          cintelUtil.setTitle(this.RegionValue, data.LatestVisitRegionDisplayName);
          
          cintelUtil.setText(this.CountryValue, data.LatestVisitCountryDisplayName, false);
          cintelUtil.setTitle(this.CountryValue, data.LatestVisitCountryDisplayName);
          
          this.VisitsValue.set(textProperty, data.TotalVisitCount);
          this.ValueValue.set(textProperty, data.ContactValue);
          this.ValuePerVisitValue.set(textProperty, data.AverageValuePerVisit);

          this.PageviewsValue.set(textProperty, data.TotalPageViewCount);

          this.PagesPerVisitValue.set(textProperty, data.AveragePageViewsPerVisit);
          this.AverageVisitValue.set(textProperty, data.AverageVisit);
        }, this)
      );

      providerHelper.initProvider(this.ContactDetailsDataProvider, "", sc.Contact.baseUrl, mainApp.ContactTabMessageBar);
      providerHelper.getData(
        this.ContactDetailsDataProvider,
        $.proxy(function (jsonData) {
		  cintelUtil.setText(this.NameValue, cintelUtil.getFullName(jsonData), false);
          
          cintelUtil.setText(mainApp.ContactHeaderText, cintelUtil.getFullName(jsonData), false);
          
          cintelUtil.setTitle(mainApp.ContactHeaderText, cintelUtil.getFullName(jsonData));
          cintelUtil.setTitle(this.NameValue, cintelUtil.getFullName(jsonData));
          cintelUtil.setTitle(this.PhoneValue, cintelUtil.getFullTelephone(jsonData.preferredPhoneNumber.Value));
          
     	  cintelUtil.setText(this.PhoneValue, cintelUtil.getFullTelephone(jsonData.preferredPhoneNumber.Value), false);

          var infoEmailLink = jsonData.preferredEmailAddress.Key ? jsonData.preferredEmailAddress.Value.SmtpAddress : "";
          if (!infoEmailLink && jsonData.emailAddresses.length > 0) {
            infoEmailLink = jsonData.emailAddresses[0].Value.SmtpAddress;
          }

		  cintelUtil.setText(this.InfoEmailLink, infoEmailLink, false);
          cintelUtil.setTitle(this.InfoEmailLink, infoEmailLink);
          this.InfoEmailLink.viewModel.$el.attr("href", "mailto:" + infoEmailLink);
        }, this)
      );
    },

    checkNoContact: function (contactId) {
      this.ContactDetailsDataProvider.on("error", function (error) {
        if (error.response.status === 404) {
          window.location.replace("ContactNotFound?" + cidParam + "=" + contactId);
        }
      }, this);
    },

    openLatestVisit: function() {
      mainApp.openLatestVisit();
    }
    
  });

  return app;
})