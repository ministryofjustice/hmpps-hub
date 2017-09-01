define(["sitecore", "jqueryui"], function(Sitecore)
{
  var model = Sitecore.Definitions.Models.ControlModel.extend({
    initialize: function () {
      this._super();
      this.set("targetControl", "");
      this.set("isBusy", false);
      this.set("isFullscreen", false);
      this.set("delay", 200);
      this.set("width", 0);
      this.set("height", 0);
      this.set("left", 0);
      this.set("position", 0);
      this.set("top", 0);
    },
    setBusy: function () {
      this.set("isBusy", true);
    },
    show: function (time) {
      if (!time) {
        time = 20000;
      }

      this.set("isBusy", true);
      var self = this;

      setTimeout(function () {
        self.set("isBusy", false);
      }, time * 1000);
    }
  });

  var view = Sitecore.Definitions.Views.ControlView.extend({
    listen: _.extend({}, Sitecore.Definitions.Views.ControlView.prototype.listen, {
      "start:$this": "setBusy",
      "hide:$this": "changeBusy"
    }),
    initialize: function () {
      this._super();
      this.model.set("height", this._getHeight());
      this.model.set("width", this._getWidth());
      this.model.set("targetControl", this.$el.data("sc-target-control"));
      this.model.set("isFullscreen", this.$el.data("sc-fullscreen"));
      this.model.set("delay", this.$el.data("sc-delay"));
      this.model.set("autoShow", this.$el.data("sc-auto-show"));
      this.model.set("autoShowTimeout", parseInt(this.$el.data("sc-auto-show-timeout")));

      this.model.on("change:isBusy", this.changeBusy, this);

      this._setZIndex();

      if (this.model.get("autoShow") && this.model.get("autoShowTimeout") >= 0) {
        this._setAutoShowMode();
      }

      this.$el.click(function () {
        return false;
      });

      $(window).resize($.proxy(this._resizeHandler, this));
      this.$el.detach();

      $("body").append(this.$el);

      this.panelWidth = 200;
      this.panelHeight = 64;
      this._timer = null;
    },
    setBusy: function () {
      this.model.isBusy(true);
    },
    _setZIndex: function () {
      var ctrlId = '[data-sc-id="' + this.model.get("targetControl") + '"]';
      if ($(ctrlId).parents(".sc-smartpanel").length > 0 || $(ctrlId).parents(".sc-dialogWindow").length > 0) {
        this.$el.zIndex($(ctrlId).zIndex() + 15); // Note: Why 15? Because dialogWindows are inserted with an increment of +10. See bootstrap-modalmanager getzIndex for more info.
      }
    },
    _setAutoShowMode: function () {
      var $doc = $(document);
      var self = this;

      $doc.ajaxStart(function () {
        self._timer = setTimeout(function () {
          self.model.set("isBusy", true);
        }, self.model.get("autoShowTimeout"));
      });

      $doc.ajaxStop(function () {
        self._stopTimer();
        self.model.set("isBusy", false);
      });
    },
    _getHeight: function () {
      if (this.model.get("isFullscreen")) {
        return "100%";
      }

      var $element = this._getTargetDomElement();
      if (!$element) {
        return this.panelHeight + "px";
      }

      if (!$element.length) {
        return "0";
      }

      return $element.outerHeight() + "px";
    },
    _getLeft: function () {
      var $element = this._getTargetDomElement();
      if (!$element) {
        return this.model.get("isFullscreen") ? "0" : Math.round(($('body').width() - this.panelWidth) / 2) + "px";
      }

      if (!$element.length) {
        return "0";
      }

      return $element.offset().left + "px";
    },
    _getTop: function () {
      var $element = this._getTargetDomElement();
      if (!$element) {
        return this.model.get("isFullscreen") ? "0" : Math.round(($('body').height() - this.panelHeight) / 2) + "px";
      }

      if (!$element.length) {
        return "0";
      }

      return $element.offset().top + "px";
    },
    _getWidth: function () {
      var $element = this._getTargetDomElement();
      if (!$element) {
        return this.model.get("isFullscreen") ? "100%" : this.panelWidth + "px";
      }

      if (!$element.length) {
        return "0";
      }

      return $element.outerWidth() + "px";
    },
    _getPosition: function () {
      return this._getTargetDomElement() == null ? "fixed" : "absolute";
    },
    changeBusy: function () {
      this._stopTimer();

      var isBusy = this.model.get("isBusy");
      var delay = this.model.get("delay");

      if (!isBusy || !delay) {
        this._updateModel();
      } else {
        var self = this;
        this._timer = setTimeout(function () {
          self._stopTimer();
          self._updateModel();
        }, delay);
      }
    },
    _updateModel: function () {
      this.model.set("isVisible", this.model.get("isBusy"));
      this.model.set("position", this._getPosition());
      this.model.set("height", this._getHeight());
      this.model.set("width", this._getWidth());
      this.model.set("top", this._getTop());
      this.model.set("left", this._getLeft());
    },
    _stopTimer: function () {
      if (this._timer) {
        clearTimeout(this._timer);
        this._timer = null;
      }
    },
    _resizeHandler: function () {
      if (!this.model.get("targetControl")) {
        return;
      }

      this._updateModel();
    },
    _getTargetDomElement: function () {
      var domPrefix = "DOM:", $element;
      var ctrl = this.model.get("targetControl");

      if (!ctrl) {
        return $('body');
      }
      if (ctrl.indexOf(domPrefix) === 0) {
        ctrl = ctrl.replace(domPrefix, "");
        $element = $(ctrl);
      } else {
        $element = $("[data-sc-id='" + ctrl + "']");
      }

      $element = $element.length ? $element : $(ctrl);

      return $element;
    }
  });

  Sitecore.Factories.createComponent("ProgressIndicator", model, view, ".sc-progressindicator");
});