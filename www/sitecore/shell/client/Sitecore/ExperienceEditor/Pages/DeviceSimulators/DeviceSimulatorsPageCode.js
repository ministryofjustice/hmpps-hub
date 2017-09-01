define(["sitecore"], function (Sitecore) {
  var deviceSimulatorsPageCode = Sitecore.Definitions.App.extend({

    clientContext: null,

    initialized: function () {
      var that = this;
      this.clientContext = window.top.ExperienceEditor;
      if (!this.clientContext) {
        return;
      }

      this.on("devicesimulator:select", function (event) {
        var selectedItem = this.getSelectedItem(event.sender.el);
        var selectedItemId = selectedItem.get("itemId");

        that.clientContext.getContext().instance.executeCommand("SetDeviceSimulator", selectedItemId);
      }, this);

      this.setSelectedItem();
    },

    getSelectedItem: function (eventTarget) {
      var id = this.findId(eventTarget);
      if (id === undefined)
        return undefined;
      return this[id];
    },

    findId: function (target) {
      if (target === undefined || target === null)
        return undefined;
      var id = $(target).data("sc-id");
      if (id === undefined)
        id = this.findId(target.parentNode);
      return id;
    },

    setSelectedItem: function () {
      var selectedSimulatorId = this.getSelectedDeviceSimulator();

      $.each(this, function () {
        if (this.attributes === undefined || this.componentName !== "SelectOptionsItem") {
          return;
        }

        this.set("isPressed", this.get("itemId") === selectedSimulatorId);
      });
    },

    getSelectedDeviceSimulator: function () {
      return this.clientContext.Common.getCookieValue("sc_simulator_id");
    }
  });

  return deviceSimulatorsPageCode;
});