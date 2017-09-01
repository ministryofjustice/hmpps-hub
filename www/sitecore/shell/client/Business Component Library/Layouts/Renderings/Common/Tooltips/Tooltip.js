define(["sitecore", "jquery", "underscore", "bootstrap"], function(sc, $, _) {
  var mappers = {
    delay: function(val) { return { delay: val }; },
    placement: function(val) { return { placement: val }; },
    trigger: function(val) { return { trigger: val }; },
    html: function(val) { return { html: val }; },
    simple: function() { return {}; },

    content: function(val, isSimple) {
      var contentValue = getContentValue(val);
      return isSimple ? { title: contentValue } : { content: contentValue };
    },

    title: function(val, isSimple) {
      return isSimple ? {} : { title: getContentValue(val) };
    }
  };

  var getContentValue = function(val) {
    if (val.indexOf("javascript:") === 0) {
      var tempVal = val;
      val = function() {
        return eval("(" + tempVal.replace("javascript:", "") + ")()");
      };
    }

    return val;
  };

  var getTargetElement = function(targetData) {
    //target control can be passed as a selector or as an id of existing SPEAK control
    var domPrefix = "DOM:";
    if (targetData && targetData.indexOf(domPrefix) !== -1) {
      return targetData.replace(domPrefix, "");
    }

    return $("[data-sc-id='" + targetData + "']");
  };

  var getTooltipType = function(view) {
    return view.model.get("simple") ? "tooltip" : "popover";
  };

  var containsTooltipChanges = function(changedAttrs) {
    return _.some(changedAttrs, function(val, key) { return mappers[key]; });
  };

  var destroyTooltip = function(target) {
    _.each(["tooltip", "popover"], function(type) {
      var innerControl = target.data("bs." + type);
      if (innerControl) {
        innerControl.destroy();
        target.data("bs." + type, "");
      }
    });
  };

  var renderTooltip = function(options, view) {
    var innerType = getTooltipType(view);
    var target = $(view.target);

    destroyTooltip(target);

    target[innerType](options);
    target.on("hide.bs." + innerType, function() { setIsVisible(view, false); });
    target.on("show.bs." + innerType, function() { setIsVisible(view, true); });
  };

  var setIsVisible = function(view, value) {
    if (view.model.get("isVisible") !== value) {
      view.model.set("isVisible", value);
    }
  };

  var updateOptions = function(srcProps, currentOptions, isSimple) {
    var res = _.extend(currentOptions, {});

    _.map(srcProps, function(val, key) {
      var mapper = mappers[key];
      if (mapper) {
        _.extend(res, mapper(val, isSimple));
      }
    });

    return res;
  };

  var initializeProperty = function(name, initialData, view) {
    if (initialData[name] !== undefined) {
      view.model.set(name, initialData[name]);
    }
  };

  var getInitialData = function(view) {
    var inpSrc = $(view.el).is(":input") ? $(view.el) : [];
    return inpSrc.length > 0 ? JSON.parse(inpSrc.val()) : {};
  };

  sc.Factories.createBaseComponent({
    name: "Tooltip",
    base: "ControlBase",
    selector: ".sc-tooltip",

    attributes: [
      { name: "content", defaultValue: "" },
      { name: "delay", defaultValue: 0 },
      { name: "html", defaultValue: false },
      { name: "placement", defaultValue: "bottom" },
      { name: "simple", defaultValue: true },
      { name: "title", defaultValue: "" },
      { name: "trigger", defaultValue: "hover" },
      { name: "isVisible", defaultValue: false }
    ],

    initialize: function() {
      this._super();

      var initialData = getInitialData(this);

      this.target = getTargetElement(initialData["target"]);

      _.each(["content", "title", "delay", "html", "placement", "trigger"], function(name) {
        initializeProperty(name, initialData, this);
      }, this);

      var isSimple = initialData["simple"] ? true : false;
      this.model.set("simple", isSimple);

      this.model.on("change:isVisible", onIsVisibleChanged, this);
      this.model.on("change", this.updateView, this);

      this.tipOptions = updateOptions(initialData, {}, isSimple);
      renderTooltip(this.tipOptions, this);
    },

    updateView: function() {
      var changedAttrs = this.model.changedAttributes();
      if (changedAttrs) {
        if (!containsTooltipChanges(changedAttrs)) {
          return;
        }

        this.tipOptions = updateOptions(changedAttrs, this.tipOptions, this.model.get("simple"));
      }

      renderTooltip(this.tipOptions, this);
    }
  });

  // The function is called in view context (this == view).
  function onIsVisibleChanged() {
    var innerControl = $(this.target).data("bs." + getTooltipType(this));
    if (this.model.get("isVisible")) {
      innerControl.show();
    } else {
      innerControl.hide();
    }
  }
});