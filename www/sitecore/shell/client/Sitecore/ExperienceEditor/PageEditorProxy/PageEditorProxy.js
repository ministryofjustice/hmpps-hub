console.warn("PageEditorProxy.js is obsolete and will be removed in the next product version.");

if (typeof (Sitecore) == "undefined") {
  Sitecore = {};
}

Sitecore.ExperienceEditor = Sitecore.ExperienceEditor || {};

Sitecore.ExperienceEditor.PageEditorProxy = new function () {
  this._instance = null;
  this._pe = function () {
    if (this._instance) {
      return this._instance;
    }

    var win = window.self;
    while (true) {
      if (win.Sitecore && win.Sitecore.PageModes) {
        this._instance = win.Sitecore.PageModes.PageEditor;
        break;
      }

      if (win == window.top) {
        break;
      }

      win = win.parent;
    }

    return this._instance || this._getStub();
  };

  this.changeCapability = function (capability, enabled) {
    this._pe().changeCapability(capability, enabled);
  };
  this.changeShowControls = function (enabled) {
    this._pe().changeShowControls(enabled);
  };

  this.changeShowOptimization = function (enabled) {
    this._pe().changeShowOptimization(enabled);
  };

  this.changeVariations = function (combination, selectChrome) {
    this._pe().changeVariations(combination, selectChrome);
  };

  this.editVariationsComplete = function (controlId, params) {
    this._pe().editVariationsComplete(controlId, params);
  };

  this.deviceId = function () {
    return this._pe().deviceId();
  };

  this.isTestRunning = function () {
    return this._pe().isTestRunning();
  };

  this.itemId = function () {
    return this._pe().itemId();
  };

  this.language = function () {
    return this._pe().language();
  };

  this.layout = function () {
    return this._pe().layout();
  };

  this.getTestingComponents = function () {
    return this._pe().getTestingComponents();
  };

  this.onSaving = function () {
    this._pe().onSaving();
  };

  this.controlBarStateChange = function () {
    this._pe().controlBarStateChange();
  };

  this.refreshRibbon = function () {
    this._pe().refreshRibbon();
  };

  this.save = function (postaction) {
    this._pe().save(postaction);
  };

  this.selectElement = function (id, sender, e) {
    this._pe().selectElement(id);
  };

  this.showNotification = function (notification) {
    this._pe().notificationBar.addNotification(notification);
    this._pe().showNotificationBar();
  };

  this.showRenderingTargets = function () {
    $(window.parent.document).find(".scInsertionHandle").show();
    this._pe().showRenderingTargets();
  };

  this.updateField = function (controlid, value, plainValue, preserveInnerContent) {
    this._pe().updateField(controlid, value, plainValue, preserveInnerContent);
  };

  this._getStub = function () {
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
  };

  this._logNotSupported = function () {
    if (window.top && window.top.console) {
      window.top.console.log("Not supported operation");
    }
  };
};

if (Sitecore.Speak) {
  var experienceEditor = Sitecore.Speak.ExperienceEditor;
  Sitecore.Speak.ExperienceEditor = Sitecore.ExperienceEditor;
  if (experienceEditor) {
    for (var k in experienceEditor) Sitecore.Speak.ExperienceEditor[k] = experienceEditor[k];
  }
}