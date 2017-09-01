(function (speak) {
 
  var alreadyClicked = false;
  var onButtonClick = function (ev, ignoreHide) {
    alreadyClicked = true;
    if (!ignoreHide)
      this.$el.modal("hide");
    this.trigger("close", ev[0]);
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
    name: "ConfirmationDialog",
    events:
    [
      { name: "show", on: "onShow" },
      { name: "hide", on: "onHide" }
    ],
    initialize: function () {
      this.$el = $(this.el);
      setupEvents(this);
    },
    initialized: function () {
      this.app.on(this.id + ":ButtonClick", onButtonClick, this);
    },
    show: function () {
      this.$el.modal('show');
    },
    hide: function () {
      this.$el.modal("hide");
    },
    loading: function () {
      this.$el.modal("loading");
    },
    onShow: function () {
      alreadyClicked = false;
      this.trigger("show");
    },
    onHide: function () {
      this.trigger("hide");
      if(!alreadyClicked)
        onButtonClick.call(this, [this.CloseClick], true);
    }
  });
})(Sitecore.Speak);