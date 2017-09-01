(function (speak) {
 
  var selectors = {
    headerSelector: ".sc-dialogWindow-header",
    contentSelector: ".sc-dialogWindow-body",
    footerSelector: ".sc-dialogWindow-buttons"
  };

  var getContentHeight = function(component) {
    var header = component.$el.find(selectors.headerSelector),
      content = component.$el.find(selectors.contentSelector),
      headerHeight = header && header.length ?
        (header.is(":visible") ? header.outerHeight() : actualSize(header).outerHeight) : 0,
      contentHeight = component.$el.data('height') || (content && content.length ?
        (content.is(":visible") ? content.outerHeight() : actualSize(content).outerHeight) : 0);

    return contentHeight - (headerHeight);
  };
  
  var actualSize = function(element) {
    var clone = element.clone(false), size;

    $('body').append(clone.css({ position: "absolute", top: -1000, left: 0 }).show());
    size = {
      width: clone.width(),
      height: clone.height(),
      outerWidth: clone.outerWidth(),
      outerHeight: clone.outerHeight()
    };
    clone.remove();

    return size;
  };

  var renderMaximized = function (component) {
    if (typeof(component) != "object")
      component = this;
    if (component.IsMaximized) {
      component.$el.data("modal").options.width = null;
      component.$el.css("width", "auto");
    } else {
      component.$el.css("width", component.$el.data("width") + "px");
      component.$el.css("margin-left", -component.$el.data("width") / 2 + "px");
      component.$el.data("modal").options.width = component.$el.data("width");
    }
  };
  
  var raiseEvent = function (eventDescriptor, e, data) {
    if (eventDescriptor.on) {
      this[eventDescriptor.on](e, data);
    }
    this.app.trigger(eventDescriptor.name + ":" + this.id, e, data);
  };
  
  var setupEvents = function (component) {
    component.events.forEach(function (eventDescriptor) {
      var self = this;
      var func = function(e, data) {
        raiseEvent.call(self, eventDescriptor, e, data);
      };
      self.$el.on(eventDescriptor.name, func);
    }, component);
  };

  speak.component(["jquery", "bootstraplib", "bootstrapModalManager", "bootstrapModal"], {
    name: "DialogWindow",
    events:
    [
      { name: "show", on: "onShow" },
      { name: "hide", on: "onHide" }
    ],
    initialize: function () {
      this.defineProperty("Replace", true);
      this.defineProperty("FocusOn", "");
      this.defineProperty("ConsumeTab", true);
      this.defineProperty("ModalOverflow", false);
      this.$el = $(this.el);
      setupEvents(this);
    },
    initialized: function () {
      if(this.$el.data("height"))
      {
        var contentHeight = getContentHeight(this);
        this.$el.data("height", contentHeight);
      }
      this.$el.find(".sc-dialogWindow-maximize").on("click", $.proxy(this.maximize, this));
      this.$el.find(".sc-dialogWindow-restore").on("click", $.proxy(this.restore, this));
      this.on("change:IsMaximized", renderMaximized, this);
    },
    toggle: function () {
      this.$el.modal("toggle");
    },
    show: function () {
      this.$el.modal('show');
    },
    hide: function () {
      this.$el.modal("hide");
    },
    maximize: function () {
      this.IsMaximized = true;
    },
    restore: function () {
      this.IsMaximized = false;
    },
    loading: function () {
      this.$el.modal("loading");
    },
    onShow: function () {
      this.trigger("show");
      renderMaximized(this);
    },
    onHide: function () {
      this.trigger("hide");
    }
  });
})(Sitecore.Speak);