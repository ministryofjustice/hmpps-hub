define(["sitecore", "/-/speak/v1/FXM/WebUtil.js"], function (_sc, webUtil) {
  _sc.Factories.createBaseComponent({

    name: "EditElementReplacerControl",
    base: "BlockBase",
    selector: ".sc-EditElementReplacerControl",

    attributes: [
        { name: "item", defaultValue: {}, value: "$el.data:sc-item" },
        { name: "nameControlId", defaultValue: "", value: "$el.data:sc-Namecontrolid" },
        { name: "selectorControlId", defaultValue: "", value: "$el.data:sc-Selectorcontrolid" },
        { name: "hasChanges", defaultValue: false },
        { name: "isEnabled", defaultValue: true }
    ],

    extendModel: {
      show: function () {
        this.trigger("show");
      },
      hide: function () {
        this.trigger("hide");
      },
      saveItem: function () {
        this.trigger("saveItem");
      }
    },

    nameControl: function () {
      return this.app[this.model.get("nameControlId")];
    },

    selectorControl: function () {
      return this.app[this.model.get("selectorControlId")];
    },

    initialize: function () {
      this._super();

      this.model.on("show", this.show, this);
      this.model.on("hide", this.hide, this);

      this.model.on("change:item", this.itemChanged, this);

      this.model.on("saveItem", this.saveItem, this);

      this.model.on('change:isEnabled', this.toggleEnabled, this);

      // listen to change events on sub controls
      var subEventListeners = {
        'change:text': [this.nameControl(), this.selectorControl()]
      }

      var self = this;
      _.each(_.keys(subEventListeners), function (key) {
        _.each(subEventListeners[key], function (entry) {
          if (!!entry) {
            entry.on(key, self.setChanges, self);
            if (key == "change:text") {
              webUtil.triggerEventOnFieldChange(self, entry, key);
            }
          }
        });
      });
    },

    show: function () {
      this.$el.show();
    },

    hide: function () {
      this.$el.hide();
    },

    itemChanged: function () {
      this.refresh();
    },

    setChanges: function () {
      var populating = this.model.get('populating');
      if (!populating) {
        this.model.set('hasChanges', true);
      }
    },

    toggleEnabled: function () {
      var controls = [
          this.selectorControl(),
          this.nameControl()
      ];

      var state = this.model.get('isEnabled');
      _.each(controls, function (ctrl) {
        if (ctrl) {
          ctrl.set('isEnabled', state);
        }
      });
    },

    refresh: function () {
      this.model.set('populating', true);

      var nameControl = this.nameControl();
      var selectorControl = this.selectorControl();

      var item = this.model.get("item");

      if (nameControl !== undefined && item !== undefined) {
        nameControl.set("text", item.DisplayName);
      }

      if (selectorControl !== undefined && item !== undefined) {
        selectorControl.set("text", item.Selector);
      }

      this.model.set('hasChanges', false);
      this.model.set('populating', false);
    },

    saveItem: function () {
      var nameControl = this.nameControl();
      var selectorControl = this.selectorControl();

      var item = this.model.get("item");

      if (nameControl !== undefined && item !== undefined) {
        item.Name = nameControl.get("text");
      }

      if (selectorControl !== undefined && item !== undefined) {
        item.Selector = selectorControl.get("text");
      }

      var self = this;
      item.save()
          .then(function () {
            self.model.set('hasChanges', false);
            self.model.trigger("saved", self);
          }).fail(function (err) {
            self.model.trigger("saveerror", self);
          });
    }
  });
});