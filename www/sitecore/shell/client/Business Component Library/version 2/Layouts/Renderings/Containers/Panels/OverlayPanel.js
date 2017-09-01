(function(speak) {
  // This function is called in contenxt of the component.
  var changeOffsetTop = function() {
    this.$el.css({ 'top': this.OffsetTop });
  };

  // This function is called in contenxt of the component.
  var changeOffsetBottom = function() {
    this.$el.css({ 'bottom': this.OffsetBottom });
  };

  // This function is called in contenxt of the component.
  var changeStatus = function() {
    var isOpen = this.IsOpen;

    var panelOptions = {
      visible: isOpen ? 'show' : 'hide'
    };

    panelOptions[this.Position] = isOpen ? 0 : -(this.$el.width());

    this.IsVisible = isOpen;
    this.$el.animate(panelOptions, 100);
  };

  speak.component({
    name: "OverlayPanel",

    initialize: function() {
      this.$el = $(this.el);
    },

    initialized: function() {
      //hide the panel and set position class for display
      this.$el.hide().addClass('panel-' + this.Position);

      //set a default top value for left and right positions
      //and set the starting position based on element width
      var cssOptions = {};
      cssOptions['border-' + this.Position] = 0;

      if (this.Position === 'left' || this.Position === 'right') {
        if (isNaN(this.OffsetBottom)) {
          this.OffsetBottom = 0;
        }
        if (isNaN(this.OffsetTop)) {
          this.OffsetTop = 0;
        }

        cssOptions['top'] = this.OffsetTop;
        cssOptions['bottom'] = this.OffsetBottom;
        cssOptions[this.Position] = -this.$el.width();

        if (this.OffsetTop === 0) {
          cssOptions['border-top'] = 0;
        }

        if (this.OffsetBottom === 0) {
          cssOptions['border-bottom'] = 0;
        }

        this.$el.css(cssOptions);
      }

      //set a default left value for top and bottom positions
      //and set the starting position based on element height
      if (this.Position === 'top' || this.Position === 'bottom') {
        cssOptions['left'] = 0;
        cssOptions[this.Position] = -this.$el.height();
        cssOptions['border-left'] = 0;
        cssOptions['border-right'] = 0;
        this.$el.css(cssOptions);
      }

      this.on("change:IsOpen", changeStatus, this);
      this.on("change:OffsetTop", changeOffsetTop, this);
      this.on("change:OffsetBottom", changeOffsetBottom, this);

      changeStatus.apply(this);
    },

    open: function() {
      this.IsOpen = true;
    },

    toggle: function() {
      this.IsOpen = !this.IsOpen;
    },

    close: function(e) {
      if (e && e.target) {
        e.preventDefault();
      }
      this.IsOpen = false;
    }
  });
})(Sitecore.Speak);