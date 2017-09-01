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