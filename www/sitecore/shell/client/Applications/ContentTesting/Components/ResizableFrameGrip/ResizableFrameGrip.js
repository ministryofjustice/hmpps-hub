define(["sitecore"], function (Sitecore) {
  var model = Sitecore.Definitions.Models.ControlModel.extend({
    initialize: function (options) {
      this._super();
      this.set("dragging", false);
      this.set("minwidth", 100);
      this.set("height", 0);
    }
  });

  var view = Sitecore.Definitions.Views.ControlView.extend({
    initialize: function (options) {

      this.$el.mousedown(this, this.mouseDown);
      this.$el.mousemove(this, this.mouseMove);
      this.$el.mouseup(this, this.mouseUp);
      var parentWindow = $(window.parent);
      var frame = window.frameElement;

      parentWindow.mouseup(this.mouseupParent);

      $(window).mouseup(this, this.mouseupWindow);

      $(window).mousemove(this, this.mousemoveWindow);
      
      frame = window.frameElement;
      
      this.model.set("height", frame.offsetHeight-4);
    },

    mouseupParent: function () {
      var frame = window.frameElement;
      $(frame).hide();
    },

    mouseupWindow: function (evt) {
      var component = evt.data;
      var dragging = component.model.get("dragging");
      if (dragging) {
        component.mouseUp(evt);
      }
    },
    
    mousemoveWindow: function (evt) {
      var component = evt.data;
      var dragging = component.model.get("dragging");
      if (dragging) {
        component.mouseMove(evt);
      }
    },

    mouseDown: function (evt) {
      var component = evt.data;
      var dragging = component.model.get("dragging");
      if (!dragging) {

        var trackCursor = { x: evt.screenX, y: evt.screenY };
        component.model.set("trackCursor", trackCursor);
        component.model.set("dragging", true);

        component.delta = 0;

        component.clearEvent(evt, true, false);
      }
    },

    mouseMove: function (evt) {
      var component = evt.data;
      var dragging = component.model.get("dragging");
      if (dragging) {
        var trackCursor = component.model.get("trackCursor");
        var minwidth = component.model.get("minwidth");
        var dx = evt.screenX - trackCursor.x;
        var dy = evt.screenY - trackCursor.y;

        var frame = window.frameElement;
        if (typeof frame == 'undefined' || frame == null)
          return;

        if (frame.offsetWidth + dx > minwidth) {
          frame.style.width = (frame.offsetWidth-4 + dx) + "px";
          trackCursor.x = evt.screenX;
        }
        else {
          frame.style.width = "" + minwidth + "px";
        }

        var height;
        if (frame.offsetHeight + dy > 24) {
          height = frame.offsetHeight-4 + dy;
          frame.style.height =  height + "px";
          trackCursor.y = evt.screenY;
          component.model.set("height", height);
        }
        else {
          height = 24;
          frame.style.height = height + "px";
          component.model.set("height", height);
        }

        component.model.set("trackCursor", trackCursor);
        component.clearEvent(evt, true, false);
      }
    },

    mouseUp: function (evt) {
      var component = evt.data;
      var dragging = component.model.get("dragging");
      if (dragging) {
        component.model.set("dragging", false);

        component.clearEvent(evt, true, false);


        /*var frame = scForm.browser.getFrameElement(window);
    
        var scGalleries = window.parent.document.getElementById("scGalleries");
    
        var value = scGalleries.value;
    
        var p = value.toQueryParams();
        p[frame.id] = frame.style.width + "q" + frame.style.height;
        scGalleries.value = Object.toQueryString(p);*/
      }
    },

    clearEvent: function (evt, cancelBubble, returnValue, keyCode) {
      if (evt !== null) {
        if (cancelBubble === true) {
          if (typeof evt.stopPropagation != 'undefined' && evt.stopPropagation !== null) {
            evt.stopPropagation();
          } else {
            evt.cancelBubble = true;
          }
        }
        if (returnValue === false) {
          if (typeof evt.preventDefault != 'undefined' && evt.preventDefault !== null) {
            evt.preventDefault();
          } else {
            evt.returnValue = false;
          }
        }
      }
      // ignore keycode
    }
  });

  Sitecore.Factories.createComponent("ResizableFrameGrip", model, view, ".sc-ResizableFrameGrip");
});
