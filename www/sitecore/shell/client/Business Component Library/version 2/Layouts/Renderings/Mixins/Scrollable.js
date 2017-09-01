(function(Speak) {
  define("bclScrollable", [], function () {
    var Scrollable = function () { };
    Scrollable.prototype.constructor = Scrollable;

    var scrollBottom = function() {
      return this.ScrollElement.scrollHeight - this.ScrollElement.clientHeight;
    },

    scrollBuffer = function() {
      return scrollBottom.call(this) * 0.2;
    },

    isTop = function() {
      return this.ScrollElement.scrollTop === 0;
    },

    isNearTop = function() {
      return this.ScrollElement.scrollTop <= scrollBuffer.call(this);
    },

    isBottom = function() {
      return this.ScrollElement.scrollTop >= scrollBottom.call(this);
    },

    isNearBottom = function() {
      return this.ScrollElement.scrollTop >= scrollBottom.call(this) - scrollBuffer.call(this);
    },

    hasScroll = function() {
      return this.ScrollElement.scrollHeight > this.ScrollElement.clientHeight;
    },

    updateScrollFlags = function() {
      if (this.HasScroll) {
        this.IsScrollTop = isTop.call(this);
        this.IsScrollNearTop = isNearTop.call(this);
        this.IsScrollBottom = isBottom.call(this);
        this.IsScrollNearBottom = isNearBottom.call(this);

        if (this.IsScrollNearBottom) {
          this.trigger("passedNearBottom");
        }

        this.ScrollPosition = this.ScrollElement.scrollTop;
      }
    },

    updateScroll = function() {
      // setTimeout is used because we need to wait
      // until ko bindings are done. clientHeight is
      // the "old" value until ko updates height
      setTimeout(function() {
        this.updateScroll();
      }.bind(this), 0);
    },

    addScrollListeners = function() {    
      this.ScrollElement.addEventListener("scroll", updateScrollFlags.bind(this));
      updateScroll.call(this);
    },

    removeScrollListeners = function() {
      this.ScrollElement.removeEventListener("scroll", updateScrollFlags.bind(this));
    },

    animateTo = function(value, options) {
      var update = updateScrollFlags.bind(this),      
      defaults = { duration: 0 },
    
      settings = Speak.extend(defaults, options, {
        complete: function() {
          if (options && options.hasOwnProperty("complete")) {
            options.complete();
          }
          update();
        }
      });

      $(this.ScrollElement).animate({
        scrollTop: value
      }, settings);
    };
    
    Scrollable.prototype.initialize = function () {
      this.defineProperty("ScrollElement", this.el);
      this.defineProperty("ScrollPosition", 0);    
    };

    Scrollable.prototype.initialized = function () {

      this.on("beforeChange:ScrollElement", removeScrollListeners, this);
      this.on("change:ScrollElement", addScrollListeners, this);
      this.on("change:Height", updateScroll, this);

      this.HasScroll = hasScroll.call(this);
      addScrollListeners.call(this);
      updateScrollFlags.call(this);
    };

    Scrollable.prototype.updateScroll = function() {
      this.HasScroll = hasScroll.call(this);
      updateScrollFlags.call(this);
    };
    
    Scrollable.prototype.scrollTo = function (value, options) {
      animateTo.call(this, value, options);
    };

    Scrollable.prototype.scrollToTop = function (options) {
      this.scrollTo(0, options);
    };

    Scrollable.prototype.scrollToBottom = function (options) {
      this.scrollTo(scrollBottom.call(this), options);
    };

    return Scrollable;
  });
})(Sitecore.Speak);