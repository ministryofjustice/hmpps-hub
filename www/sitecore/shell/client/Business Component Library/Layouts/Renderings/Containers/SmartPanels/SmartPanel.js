define(["sitecore"], function (_sc) {
  _sc.Factories.createBaseComponent({
    name: "SmartPanel",
    base: "BlockBase",
    selector: ".sc-smartpanel",
    attributes: [
      { name: "isOpen", defaultValue: false, value: "$el.data:sc-isopen" },
      { name: "dimensions", defaultValue: "normal", value: "$el.data:sc-dimensions" },
      { name: "position", defaultValue: "right", value: "$el.data:sc-position" },
      { name: "offsetTop", defaultValue: 0, value: "$el.data:sc-offsettop" },
      { name: "offsetBottom", defaultValue: 0, value: "$el.data:sc-offsetbottom" }
    ],
    events: {
      "click .sc-smartpanel-close": "close"
    },
    
    listen: _.extend({}, _sc.Definitions.Views.BlockView.prototype.listen, {
        "open:$this": "open",
        "close:$this": "close"
    }),
    
    initialize: function (options) {
      this._super();

      this.model.on("change:isOpen", this._changeStatus, this);
      this.model.on("change:offsetTop", this._changeOffsetTop, this);

      this.$body = $('body');
      this.$body_position = this.$body.css('position');

      var position = this.model.get("position");
      var dimensions = this.model.get("dimensions");

      //hide the panel and set position class for display
      this.$el.hide().addClass('panel-' + position);
      //reset any defined a positions
      this.$el.css('left', '').css('right', '').css('top', '').css('bottom', '');

      //set a default top value for left and right positions
      //and set the starting position based on element width
      var cssOptions = {};
      cssOptions['border-' + position] = 0;

      if (position === 'left' || position === 'right') {
        var offsetBottom = this.model.get("offsetBottom");
        var offsetTop = this.model.get("offsetTop");
        if (isNaN(offsetBottom)) {
          offsetBottom = 0;
        }
        if (isNaN(offsetTop)) {
          offsetTop = 0;
        }
        cssOptions['top'] = offsetTop;
        cssOptions['bottom'] = offsetBottom;
        cssOptions[position] = -this.$el.width();
        if (this.model.get("offsetTop") == 0) {
          cssOptions['border-top'] = 0;
        }
        if (this.model.get("offsetBottom") == 0) {
          cssOptions['border-bottom'] = 0;
        }
        this.$el.css(cssOptions);
      }

      //set a default left value for top and bottom positions
      //and set the starting position based on element height
      if (position === 'top' || position === 'bottom') {
        cssOptions['left'] = 0;
        cssOptions[position] = -this.$el.height();
        cssOptions['border-left'] = 0;
        cssOptions['border-right'] = 0;
        this.$el.css(cssOptions);
      }
      this.model.set("isOpen", false);
      this.model.set("isOpen", this.$el.data("sc-isopen"));
    },

    _changeOffsetTop: function () {
      var offsetTop = this.model.get("offsetTop");
      this.$el.css({ 'top': this.model.get("offsetTop") });
    },
    
    _changeStatus: function () {
        if (this.model.get("isOpen")) {
            this.expand();
        } else {
            this.collapse();
        }
    },
    
    open: function () {
        this.model.set("isOpen", true);
    },

    close: function (e) {
        if (e && e.target) {
            e.preventDefault();
        }
        this.model.set("isOpen", false);
    },

    toggle: function () {
      this.model.set("isOpen", !this.model.get("isOpen"));
    },

    expand: function () {
      var panelOptions = {};
      var bodyOptions = {};
      panelOptions.visible = 'show';
      this.model.set("isVisible", true);
      var position = this.model.get("position");
      panelOptions[position] = 0;
      bodyOptions[position] = (position === 'top' || position === 'bottom') ? this.$el.height() : this.$el.width();
      this.$el.animate(panelOptions, 100);
    },

    collapse: function () {
      var panelOptions = {};
      var bodyOptions = {};
      panelOptions.visible = 'hide';
      this.model.set("isVisible", false);
      var position = this.model.get("position");
      panelOptions[position] = -(this.$el.width());
      bodyOptions[position] = 0;
      this.$el.animate(panelOptions, 100);
    }
  });
});
