var exp;
var page;
var debugging = false; // or true 
var validationSucceeded = true;
var validationErrorMessage = "";

//init
jQuery(document).ready(function () {
    exp = new ExpApp();
    page = new PageModel();
    page.initialize();
});

var PageModel = function () {
  var self = this;

    self.initialize = function () {
        self.setupUi();
        self.bindModel();
    };

    self.getPreset = function () {
        var presetId = jQuery("#ExperienceExplorerPresets .item-inner.selected").attr("data-id");
        exp.model.PresetId = presetId;
    };

    self.getCurrentSelectedMode = function () {
      return jQuery('#ExperienceJourneyMode > .active').attr("data-val");
    };

    var selectedMode = self.getCurrentSelectedMode();

    self.setupUi = function () {
        // Setup buttons
        jQuery(".experience-explorer-iframe-editor .btn")
            .button()
            .click(function (event) {
                event.preventDefault();
            });

        jQuery('#btn_apply').children(":first").html('Wait...');

        jQuery('#btn_apply').click(function () {

            var btn = jQuery(this);
            btn.attr('disabled', 'disabled');
            btn.html(SettingsPanelTranslations.waitText );
            jQuery(document).trigger('eeEditClick');

            exp.updateModel();
        });

        jQuery('#btn_reset').click(function () {
            self.getPreset();
            exp.model.JourneyMode = selectedMode;
            exp.model.ResetPreset = true;
            exp.updateModel();
        });

    };

    self.bindModel = function () {
      jQuery(document).bind('eeEditClick', function () {
          exp.model.ModeChanged = false;
          var currentSelectedMode = self.getCurrentSelectedMode();
          if (currentSelectedMode != selectedMode) {
            exp.model.ModeChanged = true;
          }
      });

        //Presets
      jQuery(document).bind('eeEditClick', function () {
            self.getPreset();
        });

        //Mode
      jQuery(document).bind('eeEditClick', function () {
            var selected = jQuery('#ExperienceJourneyMode > .active').attr("data-val");
            exp.model.JourneyMode = selected;
        });

        //Profiles
      jQuery(document).bind('eeEditClick', function () {
          if (exp.model.ModeChanged && self.getCurrentSelectedMode() == "Fixed") {
            exp.model.profileJsonDtos = null;
            return;
          }

          var profilesDtos = [];

          var jqProfiles = jQuery('.profile-block');

          if (jqProfiles.length > 0) {

            jQuery.each(jqProfiles, function (jqProfileIndex, jqProfileItem) {
              var profileKeyDtos = [];

              var name = jQuery(jqProfileItem).attr("data-name");

              var jqProfilesValues = jQuery(jqProfileItem).find("input");

              jQuery.each(jqProfilesValues, function (jqProfileValueIndex, jqProfileValueItem) {

                var profileKey = jQuery(jqProfileValueItem).attr("data-name");
                var profileValue = jQuery(jqProfileValueItem).val();

                if (!isNaN(profileValue)) {
                  if (profileValue.length == 0) {
                    profileValue = "0";
                  }

                  profileKeyDtos.push({
                    key: profileKey,
                    value: profileValue
                  });
                }
              });

              profilesDtos.push(
                  {
                    name: name,
                    patternCardMatchDto: null,
                    profileKeyDtos: profileKeyDtos
                  });
            });

            exp.model.profileJsonDtos = profilesDtos;
          }
        });

        //Goals
        jQuery(document).bind('eeEditClick', function () {
            if (debugging && typeof console !== "undefined")
                console.log("experience explorer: goals - apply");

            var goals = [];
            var selectedGoals = jQuery('[data-autocomplete="goals-autocomplete"] input:checked');

            if (selectedGoals.length > 0) {
                jQuery(selectedGoals).each(function () {
                    goals.push(
                        {
                            itemId: this.value,
                            selected: true
                        });
                });

                exp.model.goalJsonDtos = goals;
                if (debugging && typeof console !== "undefined")
                    console.log('experience explorer: goals - completed');

            } else {
                if (debugging && typeof console !== "undefined")
                    console.log('experience explorer: goals - no elements found');
            }
        });

        //Events
        jQuery(document).bind('eeEditClick', function () {
            var events = [];
            var selectedEvents = jQuery('[data-autocomplete="events-autocomplete"] input:checked');

            if (selectedEvents.length > 0) {
                jQuery(selectedEvents).each(function () {
                    events.push(
                        {
                            itemId: this.value,
                            selected: true
                        });
                });

                exp.model.eventJsonDtos = events;
            }
        });

        //Device
        jQuery(document).bind('eeEditClick', function () {
            if (debugging && typeof console !== "undefined")
                console.log("experience explorer: device - apply");

            var selected = jQuery("#ExperinceExplorerDevices option:selected");
            if (selected.lenght != 0) {
                var devices = [];
                devices.push(
                    {
                        ItemId: selected.val(),
                        Name: selected.text(),
                        selected: true
                    });
                exp.model.DeviceJsonDtos = devices;
                if (debugging && typeof console !== "undefined")
                    console.log("experience explorer: device - completed");
            }
            else {
                if (debugging && typeof console !== "undefined")
                    console.log('experience explorer: device - no elements found');
            }
        });

        //GeoIP
        jQuery(document).bind('eeEditClick', function () {
            var selectedType = jQuery('.active[data-toggle=geo-type]').attr("data-source");

            switch (selectedType) {
                case "#MapArea": geoIpMap(); break;
                case "#CountryArea": geoIpCountry(); break;
                case "#IpArea": geoIpIp(); break;
                default: setIpOnApply(); break;
            }

            function geoIpMap() {

                var geoIpMap = jQuery();
                var geoLatitude = jQuery('#GeoLatitude');
                var geoLongitude = jQuery('#GeoLongitude');

              if (geoLatitude.length > 0 && geoLatitude.val() != "") {
                var latitude = geoLatitude.val();
                if (!isNaN(latitude)) {
                  geoIpMap.latitude = latitude.replace(",", ".");
                }
              }

              if (geoLongitude.length > 0 && geoLongitude.val() != "") {
                var longitude = geoLongitude.val();
                if (!isNaN(longitude)) {
                  geoIpMap.longitude = longitude.replace(",", ".");
                }
              }

              exp.model.geoIpMapJsonDto = geoIpMap;
            }

            function geoIpCountry() {

                var geoIpCountry = jQuery();
                var geoCountry = jQuery('#GeoCountryName option:selected');

                if (geoCountry.length > 0 && geoCountry.val() != "")
                    geoIpCountry.country = geoCountry.val();

                exp.model.geoIpCountryJsonDto = geoIpCountry;
            }

            function geoIpIp() {
                var geoIpIp = jQuery();
                var geoIpCode = jQuery('#GeoIp');
                var geoAreaCode = jQuery('#GeoAreaCode');
                var geoCity = jQuery('#GeoCity');
                var geoPostalCode = jQuery('#GeoPostalCode');
                var geoBusinessname = jQuery('#GeoBusinessname');
                var geoMetroCode = jQuery('#GeoMetroCode');
                var geoIspName = jQuery('#GeoIspName');

                if (geoIpCode.length > 0 && geoIpCode.val() != "")
                    geoIpIp.ip = geoIpCode.val();

                if (geoAreaCode.length > 0 && geoAreaCode.val() != "")
                    geoIpIp.areaCode = geoAreaCode.val();

                if (geoCity.length > 0 && geoCity.val() != "")
                    geoIpIp.city = geoCity.val();

                if (geoPostalCode.length > 0 && geoPostalCode.val() != "")
                    geoIpIp.postalCode = geoPostalCode.val();

                if (geoBusinessname.length > 0 && geoBusinessname.val() != "")
                    geoIpIp.businessName = geoBusinessname.val();

                if (geoMetroCode.length > 0 && geoMetroCode.val() != "")
                    geoIpIp.metroCode = geoMetroCode.val();

                if (geoIspName.length > 0 && geoIspName.val() != "")
                    geoIpIp.ispName = geoIspName.val();

                exp.model.geoIpIpJsonDto = geoIpIp;
            }

            function getParameterByName(name, url) {
              name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
              var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
                  results = regex.exec(url);
              return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
            }

            function SetCurrentPresetIp() {
                var self = this;
                var url = "/sitecore modules/web/experienceexplorer/services/ContentService.asmx/GetContent";
                var sitename = $("#sitename").val();
                var itemId = $("#currentItem").val();
                var presetId = $("#currentPresetId").val();
                var deviceId = getParameterByName("sc_exp_deviceid", location.search);
                var forcedDevice = getParameterByName("sc_device", window.parent.document.location.search);
                if (forcedDevice != '') {
                  deviceId = "forced" + deviceId;
                }

                $.ajax({
                    url: url,
                    data: JSON.stringify({ contlrolId: "A504C987889C431394E218B21A5588A8", itemId: itemId, siteName: sitename, presetId: presetId, deviceId: deviceId }),
                    type: "POST",
                    contentType: "application/json",
                    dataType: "json"
                })
				.success(function (data) {
					if (self.id != null) {

					    var template = $.templates("#" + "A504C987889C431394E218B21A5588A8" + "_view");
					    var object = { itemData: data.d };

					    template.link("#" + "A504C987889C431394E218B21A5588A8", object);

					    var geoIpIp = jQuery();
					    geoIpIp.ip = data.d.Ip;
					    exp.model.geoIpIpJsonDto = geoIpIp;

					    var geoIpMap = jQuery();
					    geoIpMap.latitude = data.d.Latitude;
					    geoIpMap.longitude = data.d.Longitude;
					    exp.model.geoIpMapJsonDto = geoIpMap;
                    }
				});
            };

            function setIpOnApply() {
                SetCurrentPresetIp();
            }
        });

        //Campaigns 
        jQuery(document).bind('eeEditClick', function (e) {
            if (debugging && typeof console !== "undefined")
                console.log("experience explorer: campaigns - apply");

            var campaigns = [];

            var selectedCampaigns = jQuery('[data-autocomplete="campaigns-autocomplete"] input:checked');
            if (selectedCampaigns.lenght != 0) {
                jQuery(selectedCampaigns).each(function () {

                    campaigns.push(
                        {
                            itemId: this.value,
                            selected: true
                        });
                });

                exp.model.CampaignJsonDtos = campaigns;
                if (debugging && typeof console !== "undefined")
                    console.log('experience explorer: campaigns - completed');
            }
            else {
                if (debugging && typeof console !== "undefined")
                    console.log('experience explorer: campaigns - no elements found');
            }

        });

        //Referral
        jQuery(document).bind('eeEditClick', function (e) {
            if (debugging && typeof console !== "undefined")
                console.log("experience explorer: referrals - apply");

            var referral = jQuery();
            var tbReferrer = jQuery('#Referral');

            if (tbReferrer.length > 0) {

                if (tbReferrer.val() != "") {
                    referral.referrer = tbReferrer.val();
                    exp.model.ReferralJsonDto = referral;
                }
                if (debugging && typeof console !== "undefined")
                    console.log('experience explorer: referrals - completed');

            } else {
                if (debugging && typeof console !== "undefined")
                    console.log('experience explorer: referrals - no elements found');
            }
        });

        //Message
        jQuery(document).bind('eeEditClick', function (e) {
            if (debugging && typeof console !== "undefined")
                console.log("experience explorer: apply");
            var message = jQuery("input[type=text]#message").val() || exp.model.message;
            exp.model.Message = message;
        });

        //Tags
        jQuery(document).bind('eeEditClick', function (e) {
            if (debugging && typeof console !== "undefined")
                console.log("experience explorer: tags - apply");

            var gridElement = jQuery("#grid_crud");
            if (jQuery(gridElement).length != 0) {

                var grid = jQuery(gridElement).pqGrid("option", "dataModel");

                if (grid.length != 0) {
                    var data = jQuery(grid).data;
                    var tags = [];

                    for (var i = 0; i < data.length; i++) {
                        var tagName = data[i][0];
                        var tagValue = data[i][1];


                        if (tagName != null && tagName != "") {
                            tags.push({
                                tagName: tagName,
                                tagValue: tagValue
                            });
                        }
                    }

                    exp.model.TagJsonDtos = tags;
                }
                if (debugging && typeof console !== "undefined")
                    console.log('experience explorer: tags - completed');
            }
            else {
                if (debugging && typeof console !== "undefined")
                    console.log('experience explorer: tags - no elements found');
            }
        });
    };

};
