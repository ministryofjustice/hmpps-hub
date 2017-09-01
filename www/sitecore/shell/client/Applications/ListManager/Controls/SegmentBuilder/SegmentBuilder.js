define(["sitecore", "backbone"], function (sitecore, backbone) {

  var Condition = backbone.LayoutManager.extend({
    template: "segmentbuilder-condition",
    editRulesButtonSelector: ".sc-listmanagement-edit-rules",
    removeConditionsSelector: ".sc-listmanagement-remove-condition",
    conditionsSelector: ".sc-conditions",
    initialize: function (options) {
      this.parent = options.parent;
      var self = this;
      self.model.on("change:isOpen", function () { self.trigger((self.model.get("isOpen") ? "open" : "close") + ":" + self.cid); }, self);
      self.on("open:" + self.cid, function () { self.openAccordion(); }, self);
      self.on("close:" + self.cid, function () { self.closeAccordion(); }, self);
    },
    afterRender: function () {
      var self = this;
      this.sync();
      var accordionChevronLink = self.$el.find('.sc-accordion-chevron-link');
      if (accordionChevronLink) {
        accordionChevronLink.on("click", function () {
          self.toggleAccordion();
        });
      }
      var removeButtonSelector = self.$el.find(this.removeConditionsSelector);
      if (removeButtonSelector) {
        removeButtonSelector.on("click", function () {
          self.deleteItem();
        });
      }
      var editbuttonSelector = self.$el.find(this.editRulesButtonSelector);
      if (editbuttonSelector != null) {
        editbuttonSelector.on("click", function () {
          self.editRules();
        });
      }
      var ruleId = self.model.get("conditionId");
      var triggerChange = self.model.get("triggerChange");
      Array.prototype.filter.call(self.parent.segmentBuilderFrameContainer.jQuery.find("#" + ruleId + "_body"), function (ruleBodyElement) {
        self.ruleChanged(ruleId, triggerChange);
        $(ruleBodyElement).on('DOMNodeInserted DOMNodeRemoved DOMSubtreeModified', function (event) {
          self.ruleChanged(ruleId, true);
        });
      });
    },
    closeAccordion: function () {
      this.model.set("isOpen", false);
      this.$el.find('.sc-accordion-chevron-link').find('span').removeClass("sc-accordion2-header-chevron-glyph-open");
      this.$el.find('.sc-accordion-body').toggle(false);
    },

    openAccordion: function () {
      this.model.set("isOpen", true);
      this.$el.find('.sc-accordion-chevron-link').find('span').addClass("sc-accordion2-header-chevron-glyph-open");
      this.$el.find('.sc-accordion-body').toggle(true);
    },
    toggleAccordion: function () {
      this.model.set("isOpen", !this.model.get("isOpen"));
    },
    deleteItem: function () {
      var self = this;
      self.$el.remove();
      self.stopListening();
      var theEvent = new Object();
      self.parent.segmentBuilderFrameContainer.scForm.postEvent(null, theEvent, 'javascript:Sitecore.CollapsiblePanel.remove(this, event, \"' + self.model.get("conditionId") + '\")');
      var ruleId = self.model.get("conditionId");
      self.ruleChanged(ruleId, true);
      return self;
    },
    editRules: function () {
      var self = this;
      var theEvent = new Object();
      self.parent.segmentBuilderFrameContainer.scForm.postEvent(null, theEvent, 'EditFilterConditionClick(\"' + self.model.get("conditionId") + '\")');
    },
    ruleChanged: function (ruleId, fireChangeTrigger) {

      var self = this;
      var conditionsContainer = self.$el.find(".sc-conditions");
      if (conditionsContainer) {
        Array.prototype.filter.call(self.parent.segmentBuilderFrameContainer.jQuery.find("#" + ruleId + "_rule"), function (ruleElement) {
          if (ruleElement) {
            conditionsContainer.html($(ruleElement).html());
          }
        });
      }
      var conditionsmatchContainer = self.$el.find(".sc-conditionsmatch");
      if (conditionsmatchContainer) {
        Array.prototype.filter.call(self.parent.segmentBuilderFrameContainer.jQuery.find("#" + ruleId + "_body"), function (ruleBodyElement) {
          Array.prototype.filter.call($(ruleBodyElement).find(".right-column"), function (matchElement) {
            if (matchElement) {
              conditionsmatchContainer.html($(matchElement).html());
            }
          });
        });
      }
      if (fireChangeTrigger) {
        self.parent.model.trigger("sc.listmanagement.segmentbuilder.rule.changed");
      }
    }
  });

  sitecore.Factories.createBaseComponent({
    name: "SegmentBuilder",
    base: "ControlBase",
    selector: ".sc-segmentBuilder",
    conditionContainer: ".sc-segmentbuilderbody",
    segmentBuilderFrame: ".sc-segmentBuilderFrame",
    rulesContainerSelector: "#RulesContainer",
    ruleContainerSelector: ".rule-container",
    segmentBuilderFrameContainer: null,
    attributes: [
    { name: "segmentBuilderUrl", value: "$el.data:sc-segmentbuilderurl" }
    ],
    initialize: function () {
      this._super();
      var self = this;
      /* Fix for supporting old JQuery version before JQuery 1.10.2*/
      var isIe11 = !!(navigator.userAgent.match(/Trident/) && !navigator.userAgent.match(/MSIE/)); if (isIe11) {
        if (typeof window.attachEvent == "undefined" && !window.attachEvent) {
          window.attachEvent = window.addEventListener;
        }
      }

      self.segmentBuilderUrl = self.$el.data("sc-segmentbuilderurl") ? self.$el.data("sc-segmentbuilderurl") : null;
      var iFrame = $("#SegmentBuilderFrame");
      if (iFrame) {
        iFrame[0].src = self.segmentBuilderUrl;
        iFrame.load(function () {
          self.segmentBuilderFrameContainer = $("#SegmentBuilderFrame")[0].contentWindow;

          if (self.segmentBuilderFrameContainer) {
            /* Fix for supporting old JQuery version before JQuery 1.10.2*/
            if (isIe11) {
              if (typeof self.segmentBuilderFrameContainer.attachEvent == "undefined" && !self.segmentBuilderFrameContainer.attachEvent) {
                self.segmentBuilderFrameContainer.attachEvent = self.segmentBuilderFrameContainer.addEventListener;
              }
            }
            if (typeof self.segmentBuilderFrameContainer.jQuery !== "undefined" && self.segmentBuilderFrameContainer.jQuery !== null) {
              Array.prototype.filter.call(self.segmentBuilderFrameContainer.jQuery.find(self.ruleContainerSelector), function(existingCondition) {
                self.insertCondition(existingCondition, false);
              });
            }
          }
        });
      }

    },
    addNewCondition: function () {
      var self = this;
      if (self.segmentBuilderFrameContainer) {
        var theEvent = new Object();
        self.segmentBuilderFrameContainer.scForm.postEvent(null, theEvent, 'NewFilterClick');
        var addedCondition = self.segmentBuilderFrameContainer.jQuery.find(self.ruleContainerSelector).last();
        if (addedCondition) {
          self.insertCondition(addedCondition, true);
        }
      }
    },
    insertCondition: function (addedCondition, triggerChange) {
      var self = this;
      if (self.segmentBuilderFrameContainer) {
        var ruleId = null;
        if (addedCondition) {
          ruleId = addedCondition.id;
        }
        var fieldModel = backbone.Model.extend({
          defaults: {
            position: '',
            isOpen: true,
            conditionId: null,
            triggerChange: true
          }
        });
        var field = new fieldModel({ position: 0, isOpen: true, conditionId: ruleId, triggerChange: triggerChange });
        var condition = new Condition({ model: field, parent: self, app: self.app, serialize: field.toJSON() });
        var baseContainer = self.$el.find(self.conditionContainer);
        baseContainer.append(condition.el);
        condition.render();
      }
    },
    getRulesXML: function () {
      var self = this;
      var returnValue = null;
      if (self.segmentBuilderFrameContainer) {
        Array.prototype.filter.call(self.segmentBuilderFrameContainer.jQuery.find("#RulesXml"), function (rulesXmlElement) {
          if (rulesXmlElement) {
            returnValue = rulesXmlElement.value;
          }
        });
      }
      return returnValue;
    }
  });
});