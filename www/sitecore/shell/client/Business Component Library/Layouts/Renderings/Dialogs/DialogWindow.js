require.config({
    paths: {
        dialog: "/sitecore/shell/client/Speak/Assets/lib/ui/1.1/dialog"
    },
    shim: {
        'dialog': { deps: ['sitecore'] },
    }
});

define(["sitecore", "dialog"], function (_sc) {
    _sc.Factories.createBaseComponent({
        name: "Dialog",
        base: "ControlBase",
        selector: ".sc-dialogWindow",

        attributes: [
            { name: "keyboard", defaultValue: true },
            { name: "openModal", defaultValue: true },
            { name: "backdrop", defaultValue: true },
            { name: "remote", defaultValue: false },
            { name: "isAnimated", defaultValue: true },
            { name: "focusOn", defaultValue: "" },
            { name: "spinner", defaultValue: "" },
            { name: "maxHeight", defaultValue: "" },
            { name: "consumeTab", defaultValue: true },
            { name: "replace", defaultValue: true },
            { name: "modalOverflow", defaultValue: false },
            { name: "manager", defaultValue: "GlobalModalManager" }
        ],
        extendModel: {
            show: function() {
                this.trigger("show");
            },
            hide: function() {
                this.trigger("hide");
            }
        },
        initialize: function() {
            //data-sc-open
            //data-sc-keyboard
          //data-sc-target
          var initialValues, self = this,
              initialValuesStr = this.$el.data("sc-initial-values");
          if (initialValuesStr) {
            if (_.isObject(initialValuesStr)) {
              initialValues = initialValuesStr;
            } else {
              if (_.isString(initialValuesStr)) {
                initialValues = JSON.parse(initialValuesStr);
              }
            }
          
            _.each(initialValues, function (val, key) {
              if (!_.isUndefined(val)) {
                self.model.set(key, val.toString());
              }
            });
          }

          // Calculations of content height is needed, because Bootstrap "modal" set a height of dialog content element
          //  without taking into account a height of header and footer.
          this.$el.data('height', this.getContentHeight());

          //this.model.on("change", this.updatePlugin, this);
          this.model.on("show", this.show, this);
          this.model.on("hide", this.hide, this);
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
        loading: function () {
            this.$el.modal("loading");
        },
        getContentHeight: function () {
          var header = this.$el.find(".sc-dialogWindow-header"),
            footer = this.$el.find(".sc-dialogWindow-buttons"),
            content = this.$el.find(".sc-dialogWindow-body"),
            headerHeight = header && header.length ?
              (header.is(":visible") ? header.outerHeight() : actualSize(header).outerHeight) : 0,
            footerHeight = footer && footer.length ?
              (footer.is(":visible") ? footer.outerHeight() : actualSize(footer).outerHeight) : 0,
            contentHeight = this.$el.data('height') || (content && content.length ?
              (content.is(":visible") ? content.outerHeight() : actualSize(content).outerHeight) : 0);

          return contentHeight - (headerHeight + footerHeight);
        }
    });
    
    /**
     * Get size of hidden element.
     * @param {object} element - DOM element
     * @returns {object} object which contains height, width, outerHeight, outerWidth fields
     * TODO Need to move this method into SPEAK helpers. 
     * TODO Take into account parent elements and how they can influence on element size.
     */
    function actualSize(element) {
      var clone = element.clone(false),
        size;

      $('body').append(clone.css({position: "absolute", top: -1000, left: 0 }).show());
      size = {
        width: clone.width(),
        height: clone.height(),
        outerWidth: clone.outerWidth(),
        outerHeight: clone.outerHeight()
      }
      clone.remove();

      return size;
    }
});