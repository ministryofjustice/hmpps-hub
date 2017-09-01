(function (speak, $) {
  
  speak.component(["bclCollection", "bclSelection", "knockout", "bclUserProfile"], function(Collection, Selection, ko) {
    
    function renderSelectedLazyTab(item) {
      if (item.$layout === "" && item.IsLazyLoaded === "1") {
        loadLazyTab(this);
      }
    }

    function renderTabContent(component, item, callBack) {
      var subAppName = "";
      callBack = callBack || function() {};

      var contentWrap = component.$el.find("[data-sc-content-for='" + item["$itemId"] + "']");
      if (contentWrap.children().length === 0) {
        if (item) {
          if (item.IsSubAppRegistered && item.IsSubAppRegistered === "1") {
            subAppName = item["$itemName"].replace(/\s/g, "") + "App";
            component.app.insertMarkups(
              item.$layout,
              {
                el: contentWrap[0],
                name: subAppName
              },
              function() {
                component.trigger("loaded", component.app[subAppName]);
                component.trigger("loaded:" + item["$itemName"].replace(/\s/g, ""), component.app[subAppName]);
                callBack.call(this);
              }
            );
          } else {
            component.app.insertMarkups(
              item.$layout,
              {
                el: contentWrap[0]
              },
              callBack
            );
          }

        }
      }
    }

    function renderNonLazyTabs(component) {
      var tabsToLoad = _.filter(component.Items, function(item) {
        return item.IsLazyLoaded !== "1";
      });

      renderNextNonLazyTab(component, tabsToLoad);
    }

    function renderNextNonLazyTab(component, tabsToLoad) {
      if (tabsToLoad.length < 1) {
        return;
      }

      renderTabContent(component, tabsToLoad.shift(), function() {
        renderNextNonLazyTab(component, tabsToLoad);
      });
    }

    //this method used to scroll the tabs navigation that the selected tab becomes visible 
    function adjustSelectedTabPosition(component) {
      var $selectedTab = component.$el.find(">.sc-tab-control-nav-wrap .sc-tab-control-tab-item.selected"),
        $scrollContent = component.$el.find(">.sc-tab-control-nav-wrap>.sc-tab-control-nav"),
        tabWidth = $selectedTab.width() + 2,//taking into account 1px border from both sides
        $wrap = component.$el,
        //offset - the selected tab offset
        selectedTabOffset = ($selectedTab.offset()) ? $selectedTab.offset().left - $wrap.offset().left : 0,
        totalNavWidth = calculateTotalNavWidth(component);
      
      //check whether there is a need to scroll the tabs
      if (!$selectedTab.offset() || totalNavWidth <= component.$el.width()) {
        return;
      }

      //check whether selected tab is not visible, than scroll navigation to the left 
      //and the selected tab is not inside visible part of viewport
      if (selectedTabOffset < totalNavWidth && selectedTabOffset + tabWidth > $wrap.width()) {
        $scrollContent.offset({ 'top': $scrollContent.offset().top, 'left': $scrollContent.offset().left - (selectedTabOffset - $wrap.width() + tabWidth) });
        toggleArrows(component);
      }
    };

    function loadLazyTab(component) {
      var $tabContent, dataItem = component.SelectedItem, subAppName = "";

      if (component.IsBusy) return;
      //load content if it's LazyLoaded
      if (dataItem["IsDisabled"] !== "1" && dataItem["IsLazyLoaded"] === "1" && dataItem["$layout"] === "") {
        component.IsBusy = true;
        $tabContent = component.$el.find("[data-sc-content-for='" + dataItem.$itemId + "']").eq(0);
        $tabContent.html("");

        if (dataItem.IsSubAppRegistered && dataItem.IsSubAppRegistered === "1") {
          subAppName = dataItem["$itemName"].replace(/\s/g, "") + "App";
          component.app.insertRendering(
            dataItem.$itemId,
            {
              el: $tabContent[0],
              name: subAppName
            },
            function() {
              dataItem["$layout"] = $tabContent.html();
              component.trigger("loaded", component.app[subAppName]);
              component.trigger("loaded:" + dataItem["$itemName"].replace(/\s/g, ""), component.app[subAppName]);
              component.IsBusy = false;
            });
        } else {
          component.app.insertRendering(
            dataItem.$itemId,
            {
              el: $tabContent[0]
            },
            function() {
              dataItem["$layout"] = $tabContent.html();
              component.IsBusy = false;
            });
        }

      }
    }

    function calculateTotalNavWidth(component) {
      var totalWidth = 0;

      component.$el.find(">.sc-tab-control-nav-wrap .sc-tab-control-tab-item").each(function() {
        totalWidth += $(this).outerWidth();
      });

      return totalWidth;
    }

    function toggleArrows(component) {
      var totalTabsWidth = calculateTotalNavWidth(component),
        $tabWrap = component.$el,
        bordersDeltaError = 3,
        $scrollContent = $tabWrap.find(">.sc-tab-control-nav-wrap>.sc-tab-control-nav");

      //if window.width > tabs.width then hide scroll buttons
      if ($tabWrap.width() >= totalTabsWidth) {
        toggleRightArrow(component);
        toggleLeftArrow(component);
        $scrollContent.offset({ 'left': $tabWrap.offset().left });
      } else {
        //if scrolled all the way to the left then hide left scroll button else show left scroll button
        if ($scrollContent.position().left >= 0) {
          toggleLeftArrow(component);
        } else {
          toggleLeftArrow(component, true);
        }

        //  if scrolled all the way to the right then hide right scroll button else show right scroll button
        if ($tabWrap.width() >= totalTabsWidth + $scrollContent.offset().left - $tabWrap.offset().left) {
          toggleRightArrow(component);
        } else {
          toggleRightArrow(component, true);
        }
        
      }
    }

    function toggleRightArrow(component, show) {
      var $tabWrap = component.$el,
        $tabRightBtn = $tabWrap.find(">.sc-tab-control-nav-wrap>.sc-tab-control-button-right");

      if (show) {
        $tabRightBtn.show();
      } else {
        $tabRightBtn.hide();
      }
    }


    function toggleLeftArrow(component, show) {
      var $tabWrap = component.$el,
        $tabLeftBtn = $tabWrap.find(">.sc-tab-control-nav-wrap>.sc-tab-control-button-left");

      if (show) {
        $tabLeftBtn.show();
      } else {
        $tabLeftBtn.hide();
      }
    }

    function scrollTab(component, direction, forceLeftScroll) {
      var $scrollContent = component.$el.find(">.sc-tab-control-nav-wrap>.sc-tab-control-nav"),
        offsetLeft = component.$el.find(">.sc-tab-control-nav-wrap>.sc-tab-control-nav>.sc-tab-control-tab-item").width(),
        offsetRight = component.$el.find(">.sc-tab-control-nav-wrap>.sc-tab-control-nav>.sc-tab-control-tab-item").width(),
        $tabWrap = component.$el,
        totalWidth = calculateTotalNavWidth(component);

      if (direction === "left") {
        if (!forceLeftScroll) {
          if ((totalWidth + $scrollContent.offset().left - $tabWrap.offset().left) - $tabWrap.width() + 32 < offsetLeft) {
            offsetLeft = (totalWidth + $scrollContent.offset().left - $tabWrap.offset().left) - $tabWrap.width();
          }
        }

        $scrollContent.offset({ 'top': $scrollContent.offset().top, 'left': $scrollContent.offset().left - offsetLeft });
      }

      if (direction === "right") {
        if ($scrollContent.position().left >= 0) {
          return false;
        }

        $scrollContent.offset({
          'top': $scrollContent.offset().top,
          'left': $scrollContent.position().left + offsetRight >= 0 ? $tabWrap.offset().left : $scrollContent.offset().left + offsetRight
        });
      }
      toggleArrows(component);
      return true;
    }

    //used on load to select appropriate tab accordingly to query string
    function syncWithUrl(component) {
      var urlParam = "", tab;

      if (!component.IsSelectedTabInQueryString)
        return;

      if (component && component.id) {
        urlParam = speak.utils.url.parameterByName(component.id);
      }

      if (speak.utils.is.a.guid(urlParam)) {
        component.selectByValue(urlParam);
      } else {
        if (urlParam !== "") {
          tab = component.findWhere({ "QueryParameterValue": urlParam });
          if (tab) {
            component.select(tab);
          } else {
            console.log(component.id + " doesn't contain any tab with 'QueryParameterValue' set to " + urlParam);
          }
        }
      }
    }

    //TODO: move it under speak.utils.url
    // Update the appropriate href query string parameter
    function paramReplace(queryString, name, value) {
      // Find the param with regex
      // Grab the first character in the returned string (should be ? or &)
      // Replace our href string with our new value, passing on the name and delimeter

      var re = new RegExp("[\\?&]" + name + "=([^&#]*)");
      var matches = re.exec(queryString);
      var newString = "";
      
      if (value) {
        if (matches === null && queryString === "") {
          // if there are no params, append the parameter
          newString = queryString + '?' + name + '=' + value;
        } else {
          var delimeter = "&";
          if (matches !== null) {
            delimeter = matches[0].charAt(0);
            newString = queryString.replace(re, delimeter + name + "=" + value);
          } else {
            newString = queryString + delimeter + name + "=" + value;
          }
        }
      } else {
        if (matches === null) {
          newString = queryString;
        } else {
          newString = queryString.replace(re, "");
        }
      }
      
      return newString;
    }

    function updateQueryParameter(component) {
      if (!component.IsSelectedTabInQueryString)
        return;
      var urlQuery = window.location.search;
      urlQuery = paramReplace(urlQuery, component.id, component.SelectedItem["QueryParameterValue"]);
      history.pushState("", "", urlQuery);
    }

    function selectTab(e) {
      var dataItem = ko.dataFor(e.target);

      if (dataItem.IsDisabled === "1" || dataItem.IsHidden === "1") {
        return;
      }

      if (speak.utils.is.a.function(dataItem["$itemId"])) {
        this.selectByValue(dataItem["$itemId"]());
      } else {
        this.select(dataItem);
      }
    }

    function processSelection(isFirstLoad) {
      if (isFirstLoad !== true) {
        updateQueryParameter(this);
      }
      syncWithUrl(this);
      this.setupClasses();
      renderSelectedLazyTab.call(this, this.SelectedItem);
    }

    function leftArrowClick() {
      scrollTab(this, "right");
    }

    function rightArrowClick() {
      scrollTab(this, "left");
    }
    
    function setPropertyAt(component, index, name, value) {
      var item;
      if (!index && index !== 0) {
        return;
      }
      item = component.at(index);
      if (!item) {
        return;
      }
      item[name] = value;
      item = component.at(index);
      item[name] = value;
      component.trigger("itemPropertyChanged", index, name, value);      
    }
    
    function getPropertyAt(component, index, name) {
      var item;
      if (!index && index !== 0) {
        return;
      }
      item = component.at(index);
      if (!item) {
        return;
      }
      return item[name];
    }
    
    function processDisabled() {
      var el = this.$el.find(".sc-tab-control-content-disabled");
      el.removeClass("selected");
      if (this.SelectedItem && this.SelectedItem.IsDisabled === "1") {
        el.addClass("selected");
      }      
    }

    function updateUserProfile() {
      if (!this.IsStateDiscarded) {
        this.userProfile.saveState(this.UserProfileKey, { SelectedValue: this.SelectedValue });
      }
    }

    function initItem(component, item) {
      //sibscribe on IsHidden property changed and check whether the selected item is
      item.on("change:IsHidden", function () {
        if (component.SelectedValue === component.getValue(item)) {
          component.select(component.getDefaultSelection());
        }
        component.setupClasses();
      }, component);
    }

    return speak.extend({}, Collection.prototype, Selection.prototype, {
      
      name: "TabControl",

      Model: Collection.factory.createBaseModel({
        IsLazyLoaded: "1",
        QueryParameterValue: "",
        Tooltip: "",
        $displayName: "",
        $itemId: "",
        IconPadding: "",
        IsDisabled: "",
        IsHidden: "",
        $layout: ""
      }),

      initialize: function () {
        Collection.prototype.initialize.call(this);

        //this property is used to determine when to show the scrolling arrows
        this.defineComputedProperty("TabControlMinWidth", function () {
          if (!this.Items || !this.Items.length || !this.TabMinWidth) {
            return "";
          }
          return this.Items.length * parseInt(this.TabMinWidth) + "px";
        });

        this.$el = $(this.el);
        this.defineProperty("IsBusy", false);
      },

      initialized: function () {
        
        this.userProfile = Sitecore.Speak.module('bclUserProfile');
        if (!this.IsStateDiscarded) {
          var userProfileStatusObject = this.UserProfileState ? this.userProfile.parseState(this.UserProfileState) : {};
          if (userProfileStatusObject.SelectedValue !== undefined) {
            this.SelectedValue = userProfileStatusObject.SelectedValue;
          }
        }

        this.on("change:Items", function (items) {         
          items.forEach(function (item) {
            initItem(this, item);
          }, this);
        }, this);

        this.on("add:Items", function (item) {
          initItem(this, item);
        }, this);

        //unsibscribe all the handlers before the change - appropriate for removed items or when reset() is called
        this.on("beforeReset", function (items) {
          items.forEach(function (item) {
            item.off("change:IsHidden");
          });
        }, this);

        this.on("remove:Items", function (item) {
          item.off("change:IsHidden");
        }, this);

        this.on("itemsChanged", function () {
          this.setupClasses();
        }, this);
        
        // Register hook before super is called on Collection,
        // to also transform data to observable array of bindable objects
        this.on("itemPropertyChanged", processDisabled, this);
        this.on("change:SelectedItem", processDisabled, this);
        //this.on("change:SelectedItem", processHidden, this);
        this.on("change:SelectedValue", updateUserProfile, this);

        Collection.prototype.initialized.call(this);
        Selection.prototype.initialized.call(this);

        //when the user click "back" button in the browser we need to Sync it with tab selection
        $(window).on("popstate", $.proxy(syncWithUrl, this, this));
        this.on("change:SelectedItem", renderSelectedLazyTab, this);
        $(window).on("resize", $.proxy(toggleArrows, this, this));
        $(window).on("resize", $.proxy(adjustSelectedTabPosition, this, this));
        this.$el.on("click", ">.sc-tab-control-nav-wrap .sc-tab-control-tab-item", $.proxy(selectTab, this));
        this.$el.on("click", ">.sc-tab-control-nav-wrap .sc-tab-control-button-left", $.proxy(leftArrowClick, this));
        this.$el.on("click", ">.sc-tab-control-nav-wrap .sc-tab-control-button-right", $.proxy(rightArrowClick, this));
        this.on("change:SelectedItem", processSelection, this);
       
      },

      isSelectable:function(item) {
        return Selection.prototype.isSelectable(item) && item["IsHidden"] !== "1";
      },

      afterRender: function () {
        renderNonLazyTabs(this);
        processSelection.call(this, true);
        toggleArrows(this);
        adjustSelectedTabPosition(this);
      },

      setHeader: function (index, header) {
        if (!index && index !== 0 && !header) {
          return;
        }
        setPropertyAt(this, index, this.DisplayFieldName, header);
      },

      setupClasses: function () {
        var component = this;

        var $tabNavigationItems = component.$el.find(".sc-tab-control-tab-item").not(":hidden");

        component.$el.find(">.sc-tab-control-nav-wrap .sc-tab-control-tab-item")
          .removeClass("before-selected")
          .removeClass("after-selected")
          .removeClass("first-tab")
          .removeClass("last-tab");

        $tabNavigationItems.each(function(index, element) {
          if (index === 0) {
            $(element).addClass("first-tab");
          }
          if (index === $tabNavigationItems.length - 1) {
            $(element).addClass("last-tab");
          }

          if (index <= $tabNavigationItems.length - 2) {
            if ($(element).hasClass('selected')) {
              $($tabNavigationItems[index + 1]).addClass("after-selected");
            }
          }

          if (index > 0) {
            if ($(element).hasClass('selected')) {
              $($tabNavigationItems[index - 1]).addClass("before-selected");
            }
          }

        });

        var $selectedTab = component.$el.find(".sc-tab-control-tab-item.selected");
        if ($selectedTab.length > 0) {
          $selectedTab.prev().not(":hidden").addClass("before-selected");
          $selectedTab.next().not(":hidden").addClass("after-selected");
        }
      },

      toggleEnabledAt: function (index) {
        if (!index && index !== 0) {
          return;
        }
        var value = "1";
        if (getPropertyAt(this, index, "IsDisabled") === "1") value = "";
        setPropertyAt(this, index, "IsDisabled", value);
      }
      
    });
  }, "TabControl");

})(Sitecore.Speak, jQuery);
