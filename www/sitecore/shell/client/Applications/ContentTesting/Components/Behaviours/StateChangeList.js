define(["sitecore", "knockout"], function (_sc, ko) {

  _sc.Factories.createBehavior("StateChangeList", {

    events: {
      "click .stateimg": "check"
    },

    beforeRender: function () {
      this.model.set("disabledItems", []);
    },

    afterRender: function () {
      this.enabledIconpath = this.getBehaviorAttributeValue("data-sc-enablediconpath");
      this.disabledIconpath = this.getBehaviorAttributeValue("data-sc-disablediconpath");
      this.enabledTooltip = this.getBehaviorAttributeValue("data-sc-enabledtooltip");
      this.notAllowDisableTooltip = this.getBehaviorAttributeValue("data-sc-notallowdisabletooltip");
      this.notAllowDisableIconpath = this.getBehaviorAttributeValue("data-sc-notallowdisableiconpath");
      this.disabledTooltip = this.getBehaviorAttributeValue("data-sc-disabledtooltip");
      this.header = this.getBehaviorAttributeValue("data-sc-header");
      this.validationEnabled = true;

      // Insert header title for the column with state change icons
      _.each(this.$el.find("thead tr"), this.insertHeader, this);

      // Insert icons for displaying state of the current row
      _.each(this.$el.find(".sc-table tbody tr"), this.insertStateIcon, this);

      // Handle add row event to add row with state icon
      this.on("addrow", this.addrow);
      this.model.on("change:items", this.resetDisabled, this);
    },
    resetDisabled: function () {
      var skipReset = this.model.get("skipReset");
      if (!skipReset) {
        this.model.set("disabledItems", []);
        skipReset = false;
      }

    },

    populateDisabled: function (disabled) {
      var self = this;
      this.model.set("skipReset", true);
      this.model.set("disabledItems", disabled);
      this.$el.find("tr").each(function () {
        var el = this;
        var kocontext = ko.contextFor(this);
        if (kocontext !== undefined) {
          _.each(disabled, function(value, key) {
            if (kocontext.$data.UId !== undefined) {
              if (value.UId.Guid === kocontext.$data.UId().Guid) {
                self.setDisabledState($(el).find(".stateimg")[0]);
              }
            }
          });
        }
      });
    },


    addrow: function () {
      this.insertStateIcon(this.$el.find(".sc-table tbody tr").last());
    },

    insertHeader: function (el) {
      var $el = $(el);
      var headerEl = "<th class = 'sc-text-align-center'><div> " + this.header + " </div></th>";
      $el.append(headerEl);
    },

    insertStateIcon: function (el) {
      var $el = $(el);
      var stateImage = "<td></td>";
      if (!$el.hasClass("empty")) {
        var allowDisable = true;

        var kocontext = ko.contextFor(el);
        if (kocontext && kocontext.$data.AllowDisable) {
          allowDisable = kocontext.$data.AllowDisable();
        }

        if (allowDisable) {
          stateImage = "<td class='ventilate sc-text-align-center'><img class ='stateimg' src='" +
              this.enabledIconpath + "' title='" +
              this.enabledTooltip + "'/></td>";
        }
        else {
          stateImage = "<td class='ventilate sc-text-align-center'><img src='" +
              this.notAllowDisableIconpath + "' title='" +
              this.notAllowDisableTooltip + "'/></td>";
        }
      }

      $el.append(stateImage);
    },

    check: function (evt) {
      var $current = $(evt.currentTarget),
          $row = $current.closest("tr"),
          rowItem,
          disabledItemsResult,
          rowItemCalc = {};

      // getting the ko context item
      rowItem = ko.contextFor($row[0]).$data;

      // translate ko-observable properties into regular values for easy-to-use
      _.each(rowItem, function (value, key) {

        if (_.isFunction(value) && (ko.isObservable(value) || ko.isComputed(value))) {
          rowItemCalc[key] = value();
        }
      });
      rowItem = rowItemCalc;

      // If current image is in enabled state...
      var disItems;
      // clone array so change events fire properly (array identity is different)
      disItems = _.clone(this.model.get("disabledItems"));
      
      if (this.isEnabled($current[0])) {
        
        var allItems = this.model.get("items");

        var requireAllowed = this.el.attributes["data-sc-requiredenabledrowcount"].value;

        // Check whether validation is enabled and add validation for identify last disabled item
        if (this.validationEnabled && (allItems.length - disItems.length <= requireAllowed)) {
          // Trigger validation event to handle try to disable the last item in the list
          this.model.trigger("validation:disableLastItem", this.model);
          return;
        }

        // If 'disabledItems' model element doesn't contain selected row, we should push it into model and trigger change events
        if (!_.contains(disItems, rowItem)) {
          disItems.push(rowItem);
          // update model and trigger change model event
          this.model.set("disabledItems", disItems);
          this.model.trigger("change:disabledItems", this.model, disItems);
        }
      } else {
        // Filter list of items, exclude disabled rows from the list 
        disabledItemsResult = _.filter(disItems, function (item) {
          return item.UId.Guid !== rowItem.UId.Guid;
        });
        // update model and trigger change model event
        this.model.set("disabledItems", disabledItemsResult);
        this.model.trigger("change:disabledItems", this.model, disabledItemsResult);
      }

      // Swap enable/disable icons
      this.swapStates($current[0]);
    },

    isEnabled: function (element) {
      if (element.attributes.src.value === this.enabledIconpath) {
        return true;
      }

      return false;
    },

    swapStates: function (element) {
      if (this.isEnabled(element)) {
        this.setDisabledState(element);
      } else {
        this.setEnabledState(element);
      }
    },

    setEnabledState: function (element) {
      element.attributes.src.value = this.enabledIconpath;
      element.attributes.title.value = this.enabledTooltip;
    },

    setDisabledState: function (element) {
      element.attributes.src.value = this.disabledIconpath;
      element.attributes.title.value = this.disabledTooltip;
    },

    getBehaviorAttributeValue: function (attrName) {
      var behaviorElement = $("script[data-sc-behavior-name='StateChangeList']");

      if (behaviorElement === 'undefined') {
        return null;
      }

      return $("script[data-sc-behavior-name='StateChangeList']").attr(attrName);
    }
  });
});