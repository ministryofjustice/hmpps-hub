define(["sitecore"], function (Sitecore) {
  var experienceEditorProxy = {
    instance: null,

    _pe: function () {
      if (this.instance) {
        return this.instance;
      }

      var win = window.self;
      while (true) {
        if (win.Sitecore && win.Sitecore.PageModes) {
          this.instance = win.Sitecore.PageModes.PageEditor;
          break;
        }

        if (win == window.top) {
          break;
        }

        win = win.parent;
      }

      return this.instance || this._getStub();
    },

    changeCapability: function (capability, enabled) {
      this._pe().changeCapability(capability, enabled);
    },

    changeShowControls: function (enabled) {
      this._pe().changeShowControls(enabled);
    },

    changeShowOptimization: function (enabled) {
      this._pe().changeShowOptimization(enabled);
    },

    changeVariations: function (combination, selectChrome) {
      this._pe().changeVariations(combination, selectChrome);
    },

    editVariationsComplete: function (controlId, params) {
      this._pe().editVariationsComplete(controlId, params);
    },

    deviceId: function () {
      return this._pe().deviceId();
    },

    isTestRunning: function () {
      return this._pe().isTestRunning();
    },

    itemId: function () {
      this._pe().itemId();
    },

    language: function () {
      return this._pe().language();
    },

    layout: function () {
      return this._pe().layout();
    },

    getTestingComponents: function () {
      return this._pe().getTestingComponents();
    },

    onSaving: function () {
      this._pe().onSaving();
    },

    controlBarStateChange: function () {
      this._pe().controlBarStateChange();
    },

    refreshRibbon: function () {
      this._pe().refreshRibbon();
    },

    save: function (postaction) {
      this._pe().save(postaction);
    },

    selectElement: function (id, sender, e) {
      this._pe().selectElement(id);
    },

    showNotification: function (notification) {
      this._pe().notificationBar.addNotification(notification);
      this._pe().showNotificationBar();
    },

    showRenderingTargets: function () {
      $(window.parent.document).find(".scInsertionHandle").show();
      this._pe().showRenderingTargets();
    },

    updateField: function (controlid, value, plainValue, preserveInnerContent) {
      this._pe().updateField(controlid, value, plainValue, preserveInnerContent);
    },

    _getStub: function () {
      if (this._stub) {
        return this._stub;
      }

      var stub = {};
      for (var n in this) {
        if (this.hasOwnProperty(n)) {
          stub[n] = this._logNotSupported;
        }
      }

      stub.notificationBar = {};
      stub.notificationBar.addNotification = this._logNotSupported;
      stub.notificationBar.showNotificationBar = this._logNotSupported;
      this._stub = stub;
      return this._stub;
    },

    _logNotSupported: function () {
      if (window.top && window.top.console) {
        window.top.console.log("Not supported operation");
      }
    }
  };

  return experienceEditorProxy;
});