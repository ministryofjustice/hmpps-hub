///#source 1 1 /sitecore modules/web/experienceexplorer/assets/js/experience-explorer-presets.js
; (function ($, window, document, undefined) {


    /**************** PLUGIN OPTIONS AND DATA ************************/

    var pluginName = 'Presets',
        defaults = {
            startPreset: 0,
            buttonNext: '<div class="left carousel-control">&rsaquo;</div>',
            buttonPrev: '<div class="right carousel-control">&lsaquo;</div>'
        };

    /**************** COMMON PLUGIN METHODS **********************/

    Plugin.prototype.init = function () {
        var self = this;
        var element = $(self.element);

        self.findSelected();

        if(element.find(".item").size() > 3) self.initCarousel();
        else self.initList();

    };

    Plugin.prototype.findSelected = function () {
        var self = this;
        var selected = $(self.element).find(".item .selected");

        if (selected.length) self.options.startPreset = selected.parent().index();
    };

    Plugin.prototype.initCarousel = function () {
        var self = this;
        var element = $(self.element);

        if (element.length) $(self.element).jcarousel({
            scroll: 1,
            start: self.options.startPreset,
            wrap: 'circular',
            buttonNextHTML: self.options.buttonNext,
            buttonPrevHTML: self.options.buttonPrev,
            itemVisibleInCallback: {
                onBeforeAnimation: function (carousel, item, idx, state) {
                    var next = $(item).prev().prev().hasClass("active");

                    element.find(".item").removeClass("active");

                    if (next) $(item).prev().addClass("active");
                    else $(item).next().addClass("active");
                }
            }
        });

        element.find('.item').removeClass("active");

        var current = element.find('.item[jcarouselindex=' + (self.options.startPreset + 1) + ']');

        current.addClass("active");
        current.children().addClass("selected");

        $(self.element).find(".item-inner").click(function () {

            var item = $(this).parent();
            var preset = $(this);

            var prev = item.next().hasClass("active");
            var next = item.prev().hasClass("active");

            if (prev) $(".right.carousel-control").click();

            if (next) $(".left.carousel-control").click();

            $(".item-inner").removeClass("selected");

            preset.addClass("selected");
        });
    };

    Plugin.prototype.initList = function () {
        var self = this;
        var element = $(self.element);

        element.addClass("presets-list");
        
        var defaultItem =  element.children().eq(self.options.startPreset);

        defaultItem.addClass("active");
        defaultItem.children().addClass("selected");

        $(self.element).find(".item-inner").click(function () {

            var item = $(this).parent();
            var preset = $(this);
            
            $(".item-inner").removeClass("selected");
            $(".item").removeClass("active");

            item.addClass("active");
            preset.addClass("selected");
        });
    };
    


    /****************** PLUGIN UTILS ***********************/

    function Plugin(element, options) {
        this.element = element;
        this.options = $.extend({}, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.init();
    }

    $.fn[pluginName] = function (options) {
        return this.each(function () {
            if (!$.data(this, 'plugin_' + pluginName)) {
                $.data(this, 'plugin_' + pluginName,
                    new Plugin(this, options));
            }
        });
    };

})(jQuery, window, document);
///#source 1 1 /sitecore modules/web/experienceexplorer/assets/js/experience-explorer-maps.js
; (function ($, window, document, undefined) {

    /**************** PLUGIN OPTIONS AND DATA ***********************/

    var pluginName = 'MapProvider',
        defaults = {
            provider: null,
            key: null,
            latitude: null,
            longitude: null,
            latitudeVal: 8,
            longitudeVal: 8,
            draggable: false
        },
        system = {
            latitudeReg: /^-?(?:90(?:(?:\.0{1,6})?)|(?:[0-9]|[1-8][0-9])(?:(?:\.[0-9]{1,6})?))$/i,
            longitudeReg: /^-?(?:180(?:(?:\.0{1,6})?)|(?:[0-9]|[1-9][0-9]|1[1-7][0-9])(?:(?:\.[0-9]{1,6})?))$/i
        };

    /**************** COMMON PLUGIN METHODS **********************/

    Plugin.prototype.init = function () {
        var self = this;

        self.SetOptions();

        switch (self.options.provider) {
            case "Google": self.RenderGoogleMaps(); break;
            case "Bing": self.RenderBingMaps(); break;
            default: return;
        }
    };

    Plugin.prototype.RenderBingMaps = function () {
        var self = this;

        // init bing map
        var map = new Microsoft.Maps.Map(self.element, {
            credentials: self.options.key,
            enableSearchLogo: false,
            showDashboard: false,
            showScalebar: false,
            center: new Microsoft.Maps.Location(self.options.latitudeVal, self.options.longitudeVal),
            mapTypeId: Microsoft.Maps.MapTypeId.road,
            zoom: 10
        });

        map.entities.clear();

        // init maker
        var markerOptions = { draggable: self.options.draggable };
        var marker = new Microsoft.Maps.Pushpin(map.getCenter(), markerOptions);

        map.entities.push(marker);
        marker.setLocation(new Microsoft.Maps.Location(self.options.latitudeVal, self.options.longitudeVal));

        // dragging
        if (self.options.draggable) {

            // move marker on click
            Microsoft.Maps.Events.addHandler(map, 'mousedown', function (e) {
                window.positionDown = new Microsoft.Maps.Point(e.getX(), e.getY());
            });

            Microsoft.Maps.Events.addHandler(map, 'mouseup', function (e) {
                var positionUp = new Microsoft.Maps.Point(e.getX(), e.getY());

                if (window.positionDown.x == positionUp.x && window.positionDown.y == positionUp.y) {
                    var position = new Microsoft.Maps.Point(e.getX(), e.getY());
                    var location = e.target.tryPixelToLocation(position);
                    marker.setLocation(location);

                    self.options.latitude.val(location.latitude);
                    self.options.longitude.val(location.longitude);
                }
            });

            // move marker on click  
            Microsoft.Maps.Events.addHandler(marker, 'drag', function () {
                var location = marker.getLocation();
                marker.setLocation(location);

                self.options.latitude.val(location.latitude);
                self.options.longitude.val(location.longitude);

            });
        }

        // on keyup event
        self.options.latitude.keyup(function () {

            var latitudeVal = self.options.latitude.val();
            var longitudeVal = self.options.longitude.val();

            if (self.system.latitudeReg.test(latitudeVal)) {
                marker.setLocation(new Microsoft.Maps.Location(latitudeVal, longitudeVal));
                map.setView({ center: new Microsoft.Maps.Location(latitudeVal, longitudeVal) });
            }
        });

        self.options.longitude.keyup(function () {

            var latitudeVal = self.options.latitude.val();
            var longitudeVal = self.options.longitude.val();

            if (self.system.longitudeReg.test(longitudeVal)) {
                marker.setLocation(new Microsoft.Maps.Location(latitudeVal, longitudeVal));
                map.setView({ center: new Microsoft.Maps.Location(latitudeVal, longitudeVal) });
            }
        });

    };

    Plugin.prototype.RenderGoogleMaps = function () {
        var self = this;

        // init google map
        latLng = new window.google.maps.LatLng(self.options.latitudeVal, self.options.longitudeVal);

        var mapOptions = {
            zoom: 10,
            center: latLng,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        
        map = new google.maps.Map(self.element, mapOptions);
        
        // init maker
        marker = new google.maps.Marker({
            position: latLng,
            map: map,
            draggable: self.options.draggable
        });

        // dragging
        if (self.options.draggable) {

            google.maps.event.addListener(map, 'click', function (e) {
                marker.setPosition(e.latLng);

                self.options.latitude.val(e.latLng.lat().toFixed(6));
                self.options.longitude.val(e.latLng.lng().toFixed(6));
            });

            google.maps.event.addListener(window.marker, 'drag', function () {
                self.options.latitude.val(marker.position.lat().toFixed(6));
                self.options.longitude.val(marker.position.lng().toFixed(6));
            });
        }

        // on keyup event
        self.options.latitude.keyup(function () {

            var latitudeVal = self.options.latitude.val();
            var longitudeVal = self.options.longitude.val();

            if (self.system.latitudeReg.test(latitudeVal)) {
                var latLng = new window.google.maps.LatLng(latitudeVal, longitudeVal);
                window.marker.setPosition(latLng);
                map.setCenter(latLng);
            }
        });

        self.options.longitude.keyup(function () {

            var latitudeVal = self.options.latitude.val();
            var longitudeVal = self.options.longitude.val();

            if (self.system.longitudeReg.test(longitudeVal)) {
                var latLng = new window.google.maps.LatLng(latitudeVal, longitudeVal);
                window.marker.setPosition(latLng);
                map.setCenter(latLng);
            }
        });
    };

    Plugin.prototype.SetOptions = function () {
        var self = this;

        self.options.provider = $(self.element).data("name");
        self.options.draggable = $(self.element).data("draggable");
        self.options.key = $(self.element).data("api-key");
        self.options.latitudeVal = self.options.latitude.val();
        self.options.longitudeVal = self.options.longitude.val();
    };

    /****************** PLUGIN UTILS ***********************/

    function Plugin(element, options) {
        this.element = element;
        this.options = $.extend({}, defaults, options);
        this.system = system;
        this._defaults = defaults;
        this._name = pluginName;
        this.init();
    }

    $.fn[pluginName] = function (options) {
        return this.each(function () {
            if (!$.data(this, 'plugin_' + pluginName)) {
                $.data(this, 'plugin_' + pluginName,
                    new Plugin(this, options));
            }
        });
    };

})(jQuery, window, document);
///#source 1 1 /sitecore modules/web/experienceexplorer/assets/js/experience-explorer-geo-ip.js
; (function ($, window, document, undefined) {

    /**************** PLUGIN OPTIONS AND DATA ***********************/

    var pluginName = 'GeoIp',
        defaults = {
            testLink: "#link_testgeo",
            switcherLinks: "a[data-toggle='geo-type']",
            switcherData: ".geo-ip-data"
        };

    /**************** COMMON PLUGIN METHODS **********************/

    Plugin.prototype.init = function () {
        var self = this;

        self.TestIp();
        self.SwitchSubTabs();
    };

    Plugin.prototype.TestIp = function () {
        var self = this;
        var link = $(self.options.testLink);
        var container = $(link.attr("href"));
        var loading = $("<img>")
            .attr("src", "/sitecore modules/web/experienceExplorer/assets/images/loading.gif");

        link.append(
            loading.hide()
            );

        link.click(function () {
            loading.show();

            jQuery.ajax({
                url: "/sitecore modules/web/experienceexplorer/services/service.asmx/GeoIpTest",
                type: "POST",
                contentType: "application/json",
                dataType: "json"
            })
                .done(function (data) {

                    container.empty();

                    var description = "";
                    var message = $("<p>").text(data.d.Message);
                    var icon = $("<img>").prop("src", data.d.IconPath);

                    var tooltip = $('<a href="#">')
                        .attr("title", data.d.QuestionMark)
                        .attr("data-toggle", "tooltip")
                        .attr("data-placement", "left")
                        .addClass("info hide")
                        .text("?");

                    if (data.d.Description != null) var description = $("<div>").html(data.d.Description);

                    message.prepend(icon);

                    container
                        .append(tooltip)
                        .append(message)
                        .append(description);

                    var tooltips = $("[data-toggle=tooltip]");

                    if (tooltips.length) { tooltips.tooltip(); }

                    container.slideDown();

                    loading.hide();
                });

            return false;
        });
    };

    Plugin.prototype.SwitchSubTabs = function () {
        var self = this;
        
        var links = $(self.options.switcherLinks);
        var containers = $(self.options.switcherData);

        var defaultId = self.GetDefaultSubTab();
        var defaultContainer= $(defaultId);
        var defaultLink = $("[data-source=" + defaultId + "]");

        defaultContainer.removeClass("collpase-geo");
        defaultLink.addClass("active");

        links.click(function () {
            var currentLink = $(this);
            var currentContainerId = currentLink.attr("data-source");
            var currentContainer = $(currentContainerId);

            $.cookie("geo-subtab", currentContainerId);

            links.removeClass("active");
            currentLink.addClass("active");

            containers.slideUp("fast");
            containers.addClass("collpase-geo");
            
            currentContainer.slideDown("fast");
            currentContainer.removeClass("collpase-geo");

            return false;
        });
    };

    Plugin.prototype.GetDefaultSubTab = function () {
        var self = this;
        var id = $.cookie("geo-subtab");
        if (id != "" && typeof id != "undefined") return id;
        else return "#" + $(self.options.switcherData).first().attr("id");  
    };

    /****************** PLUGIN UTILS ***********************/

    function Plugin(element, options) {
        this.element = element;
        this.options = $.extend({}, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.init();
    }

    $.fn[pluginName] = function (options) {
        return this.each(function () {
            if (!$.data(this, 'plugin_' + pluginName)) {
                $.data(this, 'plugin_' + pluginName,
                    new Plugin(this, options));
            }
        });
    };

})(jQuery, window, document);
///#source 1 1 /sitecore modules/web/experienceexplorer/assets/js/experience-explorer-rules.js
; (function ($, window, document, undefined) {


    /**************** PLUGIN OPTIONS AND DATA ************************/

    var pluginName = 'Rules',
        defaults = {
            title: ".conditions-title"
        };

    /**************** COMMON PLUGIN METHODS **********************/

    Plugin.prototype.init = function () {
        var self = this;
        self.InitTooltips();
    };

    Plugin.prototype.InitTooltips = function () {
        var self = this;
        var element = $(self.element);
        var title = element.next(self.options.title).html();
        
        element.attr("title", title);

        element.tooltip({
            placement: 'top'
        });
    };

    /****************** PLUGIN UTILS ***********************/

    function Plugin(element, options) {
        this.element = element;
        this.options = $.extend({}, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.init();
    }

    $.fn[pluginName] = function (options) {
        return this.each(function () {
            if (!$.data(this, 'plugin_' + pluginName)) {
                $.data(this, 'plugin_' + pluginName,
                    new Plugin(this, options));
            }
        });
    };

})(jQuery, window, document);
///#source 1 1 /sitecore modules/web/experienceexplorer/assets/js/experience-explorer-app.js
var ExpApp = function () {

  var self = this;
  self.model = {};

  self.getModel = function () {
    jQuery.getJSON("/eeapi/experienceexplorer/get", function (data) {
      self.model = data;
      self.bindModel();
    });
  };

  self.updateModel = function () {

    if (self.model.PresetId == undefined) {
      var presetId = $("#currentPresetId").val();
      self.model.PresetId = presetId;
    }

    var currentItemId = $("#currentItem").val();
    self.model.ItemId = currentItemId;

    jQuery.ajax({
      url: "/sitecore modules/web/experienceexplorer/services/service.asmx/Update",
      type: "POST",
      contentType: "application/json",
      data: '{modelDto:' + JSON.stringify(self.model) + '}',
      dataType: "json"
    })

    .done(function () {
      var href = window.parent.location.href.replace(/(\?)sc_preset=.*?($|&)/i, "?").replace(/\?$/i, "");
      if (href.indexOf("?") > 0) {
        href = href.replace("?", "?" + "sc_preset=" + exp.model.PresetId + "&");
      } else {
        href += "?";
        href += "sc_preset=" + exp.model.PresetId;
      }
      var currentLocation = window.parent.location;

      if (currentLocation != href) window.parent.location = href;
      else window.parent.location.reload();
    })
    .fail(function (data) {
      alert(data.responseJSON.Message);
      var btn = jQuery('#btn_apply');
      btn.removeAttr('disabled');
      btn.html(SettingsPanelTranslations.applyText);
    });
  };
};
///#source 1 1 /sitecore modules/web/experienceexplorer/assets/js/experience-explorer-loading.js
; (function ($, window, document, undefined) {

  $(document).ready(function () {
    $("#accordions-editor").DataPresentation();
    $("#accordions-viewer").DataPresentation();
    $(".trigger").click();
  });

  /**************** PLUGIN OPTIONS AND DATA ************************/

  var pluginName = 'DataPresentation',
      defaults = {
        id: null,
        tabLinks: "a[data-toggle=tab]",
        tabContent: ".tab-content",
        accordionGroup: ".accordion-group",
        accordionLinks: "a[data-toggle=collapse]",
        accordionItem: ".accordion-body"
      };

  /**************** COMMON PLUGIN METHODS **********************/

  Plugin.prototype.init = function () {
    var self = this;

    var tabLinks = $(self.options.tabLinks);
    var accordionLinks = $(self.options.accordionLinks);

    var currentTabId = self.GetCookieId();
    var currentTab = $('[href="' + currentTabId + '"]');
    var currentGroup = currentTab.closest(self.options.accordionGroup);

    accordionLinks.click(function () {
      var currentLink = $(this);
      var currentGroup = currentLink.closest(self.options.accordionGroup);
      var currentContent = currentGroup.find(self.options.accordionItem);

      if (currentContent.css("display") == "none") {
        self.ShowAccordion(currentGroup);
      }
      else {
        currentGroup.parent().find(".sc-advancedExpander-header").removeClass("activeAccordion");
        currentGroup.parent().find(".sc-expander-chevron").removeClass("up");
        currentContent.slideUp("fast");
      }

      return false;
    });

    tabLinks.click(function () {
      var cookieName = $(self.element).attr("id");
      var href = $(this).attr("href");

      self.id = href.replace("#", "");
      $.cookie(cookieName, href);

      if ($(href).html().length == 0) self.GetAjaxData();
      self.ShowTab(href);

      return false;
    });

    self.id = currentTabId;
    self.ShowAccordion(currentGroup, currentTab);

    $(window).resize(function () { self.SetSize(self.id); });

  };

  Plugin.prototype.ShowAccordion = function (currentGroup, currentTabLink) {
    var self = this;
    var blocksList = $(self.options.accordionItem);
    var currentContent = currentGroup.find(self.options.accordionItem);

    if (currentTabLink) currentTabLink.click();
    else currentContent.find(".nav-tabs a:first").click();

    currentGroup.parent().find(".sc-expander-chevron").removeClass("up");
    var upDownControl = currentGroup.find(".sc-expander-chevron");
    upDownControl.addClass(" up");
    
    blocksList.slideUp("fast");
    currentContent.slideDown("fast");

    currentGroup.parent().find(".sc-advancedExpander-header").removeClass("activeAccordion");
    var currentAccordion = currentGroup.find(".sc-advancedExpander-header");
    currentAccordion.addClass("activeAccordion");
  };

  Plugin.prototype.ShowTab = function (href) {
    var self = this;

    var currentListItem = $("[href=" + href + "]").parent();
    var listItems = currentListItem.siblings();
    var currentTabPane = $(href);
    var tabPanes = currentTabPane.siblings();
    var currentTabContent = currentTabPane.parent();
    var tabContents = $(self.options.tabContent);

    listItems.removeClass("active");
    currentListItem.addClass("active");

    tabContents.removeClass("active");
    tabPanes.hide();
    currentTabContent.addClass("active");

    currentTabPane.fadeIn("fast");

    var tabs = currentTabContent.parent().find(".sc-tabcontrol-navigation");
    if (tabs.children().length == 1) {
      tabs.hide();
    }
  };

  Plugin.prototype.GetUrlParameter = function getParameterByName(name, url) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(url);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
  }

  Plugin.prototype.GetAjaxData = function () {
    var self = this;
    var url = "/sitecore modules/web/experienceexplorer/services/ContentService.asmx/GetContent";
    var sitename = $("#sitename").val();
    var itemId = $("#currentItem").val();
    var presetId = $("#currentPresetId").val();
    var deviceId = Plugin.prototype.GetUrlParameter("sc_exp_deviceid", location.search);
    var forcedDevice = Plugin.prototype.GetUrlParameter("sc_device", window.parent.document.location.search);
    if (forcedDevice != '') {
      deviceId = "forced" + deviceId;
    }
    
    $.ajax({
      url: url,
      data: JSON.stringify({ contlrolId: self.id, itemId: itemId, siteName: sitename, presetId: presetId, deviceId: deviceId }),
      type: "POST",
      contentType: "application/json",
      dataType: "json"
    })
        .success(function (data) {
          if (self.id != null) {

            var template = $.templates("#" + self.id + "_view");
            var object = { itemData: data.d };

            template.link("#" + self.id, object);
          }
          self.RunPlugins();
        })
    .done(function () {
      self.SetSize(self.id);
    });
  };

  Plugin.prototype.SetSize = function (id) {
    var self = this;
    var contentHeight = 0;
    var winHeight = $(window).height();
    var containerHeight = $(".footer-panel").outerHeight();

    containerHeight += $("#frame-header").outerHeight();

    $(".accordion-heading").each(function () {
      containerHeight += $(this).height();
    });

    contentHeight = winHeight - containerHeight - 160;

    $("#" + id).closest(".tab-content").css("max-height", contentHeight);

    self.InitTexts();

    $(".tab-title:empty").hide();
    $(".tab-title:empty").parent().find("a.info").css("margin-top", "0");
  };

  Plugin.prototype.InitTexts = function () {
    var litEditorSpan = $("#litEditorSpan");
    var pageEditorHeader = window.top.$("#pageEditorHeader");

    pageEditorHeader.html(litEditorSpan.parent().html());
  };

  Plugin.prototype.GetCookieId = function () {
    var self = this;

    var cookieName = $(self.element).attr("id");
    var currentTabHref = $.cookie(cookieName);
    var tabLinks = $(self.options.tabLinks);

    if (currentTabHref === undefined) currentTabHref = tabLinks.first().attr("href");

    return currentTabHref;
  };

  Plugin.prototype.RunPlugins = function () {
    var self = this;
    var tooltips = $("[data-toggle=tooltip]");
    var rulestooltips = $(".conditions[data-toggle=tooltip]");

    var goalsAutocomplete = $("[data-toggle=goals-autocomplete]");
    var campaignsAutocomplete = $("[data-toggle=campaigns-autocomplete]");
    var eventsAutocomplete = $("[data-toggle=events-autocomplete]");
    var presetCarousel = $("#ExperienceExplorerPresets");

    var mapBlock = $("#Map");
        
    var geoIp = $("#link_testgeo");

    if (rulestooltips.length) rulestooltips.Rules();

    if (tooltips.length) {
      tooltips.hover(function () {
        $("select").blur();
      });

      tooltips.tooltip();
    }

    if (presetCarousel.length) presetCarousel.Presets();
    if (goalsAutocomplete.length) goalsAutocomplete.SearchAutocomplete({ type: "checkbox" });
    if (campaignsAutocomplete.length) campaignsAutocomplete.SearchAutocomplete({ type: "radio" });
    if (eventsAutocomplete.length) eventsAutocomplete.SearchAutocomplete({ type: "checkbox" });
    if (geoIp.length) geoIp.GeoIp();

    self.InitMode();

    setTimeout(function () {
            
      if (mapBlock.length) {
        var mapLatitude = $("#GeoLatitude");
        var mapLongitude = $("#GeoLongitude");

        mapBlock.MapProvider({
          latitude: mapLatitude,
          longitude: mapLongitude,
        });
      }

    }, 200);
  };

  Plugin.prototype.InitMode = function () {
    var titles = $(".mode-title");

    $(".mode .btn").click(function () {
      var current = $(this);
      var buttons = $(this).siblings();

      buttons.removeClass("active");
      current.addClass("active");
      titles.addClass("hidden");

      $("[for = " + $(this).attr("id") + "]").removeClass("hidden");
    });

  };

  /****************** PLUGIN UTILS ***********************/

  function Plugin(element, options) {
    this.element = element;
    this.options = $.extend({}, defaults, options);
    this._defaults = defaults;
    this._name = pluginName;
    this.init();
  }

  $.fn[pluginName] = function (options) {
    return this.each(function () {
      if (!$.data(this, 'plugin_' + pluginName)) {
        $.data(this, 'plugin_' + pluginName,
            new Plugin(this, options));
      }
    });
  };

})(jQuery, window, document);
///#source 1 1 /sitecore modules/web/experienceexplorer/assets/js/experience-explorer-client-model.js
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

///#source 1 1 /sitecore modules/web/experienceexplorer/assets/js/experience-explorer-search.js
; (function ($, window, document, undefined) {

    /**************** PLUGIN OPTIONS AND DATA * **********************/

    var pluginName = 'SearchAutocomplete',
        defaults = {
            list: null,
            type: "checkbox"
        };

    /**************** COMMON PLUGIN METHODS **********************/

    Plugin.prototype.init = function () {
        var self = this;

        var link = $(self.element).attr("data-toggle");
        self.list = $("[data-autocomplete=" + link + "]");

        var scope = self.getAutocompleteData();

        $(self.element).autocomplete({
            minLength: 1,
            source: scope,
            open: function (event, ui) {
                $(this).autocomplete("widget").css({
                    "max-width": 270
                });
            }
        })
            .data('ui-autocomplete')._renderItem = function (ul, item) {

                var input = $('<input>')
                                    .attr('type', self.options.type)
                                    .attr('id', 'autocomplete_' + item.id)
                                    .attr('name', self.options.type + '_group');

                var text = $("<small>").addClass("tiny-text").text(item.name);

                if ($('#' + item.id).find("input").is(':checked')) $(input).attr('checked', true);

                var label = $("<label>")
                    .addClass("control")
                    .append(input);

                if (item.icon) {
                    var image = $("<img>").attr("src", item.icon);
                    label.append(image);
                }

                label.append(text);

                var listitem = $("<li>").append(label);

                $(input).click(function () {
                    var newValue = $(this).is(':checked');
                    $("#" + item.id).find("input").prop("checked", newValue);
                });

                return $(listitem).appendTo(ul);
            };

    };

    Plugin.prototype.getAutocompleteData = function () {
        var self = this;
        var data = [];
        var stack = self.list.find(".control");

        stack.each(function () {
            var item = $(this);
            var id = item.attr("id");
            var name = item.find(".listitem-name").text();
            var selected = item.find("input").is(":checked");
            var obj;

            if (item.find("img").length > 0) {
                var icon = item.find("img").attr("src");

                obj = {
                    value: name,
                    name: name,
                    id: id,
                    icon: icon,
                    selected: selected
                };
            }
            else {

                obj = {
                    value: name,
                    name: name,
                    id: id,
                    selected: selected
                };
            }

            data.push(obj);
        });

        return data;

    };

    /****************** PLUGIN UTILS ***********************/

    function Plugin(element, options) {
        this.element = element;
        this.options = $.extend({}, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.init();
    }

    $.fn[pluginName] = function (options) {
        return this.each(function () {
            if (!$.data(this, 'plugin_' + pluginName)) {
                $.data(this, 'plugin_' + pluginName,
                    new Plugin(this, options));
            }
        });
    };

})(jQuery, window, document);
