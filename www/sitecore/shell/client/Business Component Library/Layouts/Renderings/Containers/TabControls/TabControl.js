define(["sitecore"], function (_sc) {
  var model = _sc.Definitions.Models.BlockModel.extend({
    initialize: function () {
      var self = this;
      this._super();
      this.set("staticTabs", []);
      this.set("dynamicTabs", []);
      this.set("selectedTab", "");
      this.set("isProgressive", false);
      this.set("tabs", [], {
        computed: true,
        read: function () {
          var dynamics = $.map(this.dynamicTabs(), function (t) {
            return t.id;
          });
          return this.staticTabs().concat(dynamics);
        }
      });

      this.viewModel.tabs.subscribe(function () {

        var allTabs = self.viewModel.tabs();
        if ($.inArray(self.viewModel.selectedTab(), allTabs) < 0) {
          self.viewModel.selectedTab(allTabs[0]);
        }
      });

      this.set("selectedTabIndex", -1, {
        computed: true,
        read: function () {
          var selectedTab = this.selectedTab();
          if (!selectedTab) {
            return -1;
          }
          return $.inArray(selectedTab, this.tabs());
        },

        write: function (index) {
          if (index < 0 || index >= this.tabs().length) {
            throw "Tab index should be within a valid range";
          }
          this.selectedTab(this.tabs()[index]);
        }
      });
    }
  });

  var view = _sc.Definitions.Views.BlockView.extend({
    initialize: function () {
      var tabIds, i, selectedTabId;
      this._super();

      tabIds = $.map(this.$el.find("> ul li[data-tab-id]"), _.bind(function (tab) {
          var $tab = $(tab);

          $tab.on("click", _.bind(this.onTabClicked, this));
          return $tab.attr("data-tab-id");
      }, this));

      for (i = 0; i < tabIds.length; i += 1) {
          this.model.viewModel.staticTabs.push(tabIds[i]);
      }

      selectedTabId = getDefaultTabId(this.model.get("name"), this.$el, tabIds);
      this.model.set("selectedTab", selectedTabId);
      updatetTabClasses(getVisibleTabElement(this.$el, selectedTabId));

      this.model.on("change:selectedTab", onSelectedTabChanged, this);
    },

    onTabClicked: function (e) {
      e.preventDefault();
      selectTab(this, $(e.currentTarget));
    },

    showTab: function (tabId) {
      var selectRequired = (getVisibleTabElements(this.$el).length === 0);

      this.$el.find("> ul li[data-tab-id='" + tabId + "']").removeClass("hidden");

      if (selectRequired) {
        selectFirstVisibleTab(this);
      } else {
        updatetTabClasses(getVisibleTabElement(this.$el, this.model.get("selectedTab")));
      }
    },

    hideTab: function (tabId) {
      var tab = getVisibleTabElement(this.$el, tabId);
      if (tab.length < 1) {
        return;
      }

      tab.addClass("hidden");

      var selectedTabId = this.model.get("selectedTab");
      if (selectedTabId === tabId) {
        selectFirstVisibleTab(this);
      } else {
        updatetTabClasses(getVisibleTabElement(this.$el, selectedTabId));
      }
    },

    addDynamicTab: function (tab) {
      var tabId = tab.id;

      var $content = this.$el.find("div.tab-content");
      var $ul = this.$el.find("ul.sc-tabcontrol-navigation");
      $("<li data-bind=\"css:{active:selectedTab() === '" + tab.id + "'}\" class=\"sc-tabcontrol-header\" data-tab-id=\"" + tab.id + "\"><a href=\"#\" >" + tab.header + "</a></li>")
        .on("click", _.bind(this.onTabClicked, this))
        .appendTo($ul);
      $("<div data-bind=\"css:{'active':selectedTab() === '" + tab.id + "'}\" class=\"sc-tabcontrol-tab tab-pane\" id=\"" + tab.id + "\" >" + tab.content + "</div>").appendTo($content);

      this.model.viewModel.dynamicTabs.push(tab);
      this.sync();
    }
  });
  
  function getDefaultTabId(controlName, $controlElement, tabIds) {
    var tabParam = getTabParameter(controlName);
    if (tabParam && getVisibleTabElement($controlElement, tabParam).length > 0) {
      return tabParam;
    }

    var selectedTabId = $controlElement.attr("data-selected-tab");
    if (selectedTabId && getVisibleTabElement($controlElement, selectedTabId).length > 0) {
      return selectedTabId;
    }
    
    for (var i = 0; i < tabIds.length; i++) {
      if (getVisibleTabElement($controlElement, tabIds[i]).length > 0) {
        return tabIds[i];
      }
    }

    return null;
  }
  
  function getTabParameter(controlName) {
    if(_.isNull(controlName) || _.isUndefined(controlName)) {
      return null;
    }

    var paramName = controlName.toLowerCase() + "_tab";
    var params = _sc.Helpers.url.getQueryParameters(window.location.href);

    for(var key in params) {
      if(key.toLowerCase() == paramName) {
        return params[key];
      }
    }

    return null;
  }
  
  function getVisibleTabElement($controlElement, tabId) {
    return $controlElement.find("> ul li[data-tab-id='" + tabId + "']:not(.hidden)");
  }

  function getVisibleTabElements($controlElement) {
    return $controlElement.find("> ul li[data-tab-id]:not(.hidden)");
  }

  function selectFirstVisibleTab(controlView) {
    selectTab(controlView, getVisibleTabElements(controlView.$el).first());
  }

  function selectTab(controlView, $tabElement) {
    var tabId = $tabElement.attr("data-tab-id");
    updatetTabClasses($tabElement);

    controlView.model.set("selectedTab", tabId);
  }
  
  function updatetTabClasses($selectedTabElement) {
    $selectedTabElement.parent().children().removeClass("first-visible-nav-tab").removeClass("last-visible-nav-tab").removeClass("active-first-sibling").removeClass("active-prev-sibling");

    var tabs = getVisibleTabElements($selectedTabElement.parents(1));
    tabs.first().addClass("first-visible-nav-tab");
    tabs.last().addClass("last-visible-nav-tab");

    $selectedTabElement.prevUntil('li.sc-tabcontrol-header a').filter(':not(.hidden)').first().addClass("active-prev-sibling");
    $selectedTabElement.nextUntil('li.sc-tabcontrol-header a').filter(':not(.hidden)').first().addClass("active-first-sibling");
  }

  function onSelectedTabChanged() {
    var $tabElement = getVisibleTabElement(this.$el, this.model.get("selectedTab"));
    if ($tabElement.length != 1) {
      selectFirstVisibleTab(this);
      return;
    }

    updatetTabClasses($tabElement);
  }

 _sc.Factories.createComponent("TabControl", model, view, ".sc-tabcontrol");
});