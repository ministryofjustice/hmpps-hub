; (function ($, window, document, undefined) {


    /**************** PLUGIN OPTIONS AND DATA ************************/

    var pluginName = 'Presets',
        defaults = {
            startPreset: 0,
            buttonNext: '<div class="left carousel-control">&rsaquo;</div>',
            buttonPrev: '<div class="right carousel-control">&lsaquo;</div>'
        };

    /**************** COMMON PLUGIN METHODS **********************/

    Plugin.prototype.init = function () {
        var self = this;
        var element = $(self.element);

        self.findSelected();

        if(element.find(".item").size() > 3) self.initCarousel();
        else self.initList();

    };

    Plugin.prototype.findSelected = function () {
        var self = this;
        var selected = $(self.element).find(".item .selected");

        if (selected.length) self.options.startPreset = selected.parent().index();
    };

    Plugin.prototype.initCarousel = function () {
        var self = this;
        var element = $(self.element);

        if (element.length) $(self.element).jcarousel({
            scroll: 1,
            start: self.options.startPreset,
            wrap: 'circular',
            buttonNextHTML: self.options.buttonNext,
            buttonPrevHTML: self.options.buttonPrev,
            itemVisibleInCallback: {
                onBeforeAnimation: function (carousel, item, idx, state) {
                    var next = $(item).prev().prev().hasClass("active");

                    element.find(".item").removeClass("active");

                    if (next) $(item).prev().addClass("active");
                    else $(item).next().addClass("active");
                }
            }
        });

        element.find('.item').removeClass("active");

        var current = element.find('.item[jcarouselindex=' + (self.options.startPreset + 1) + ']');

        current.addClass("active");
        current.children().addClass("selected");

        $(self.element).find(".item-inner").click(function () {

            var item = $(this).parent();
            var preset = $(this);

            var prev = item.next().hasClass("active");
            var next = item.prev().hasClass("active");

            if (prev) $(".right.carousel-control").click();

            if (next) $(".left.carousel-control").click();

            $(".item-inner").removeClass("selected");

            preset.addClass("selected");
        });
    };

    Plugin.prototype.initList = function () {
        var self = this;
        var element = $(self.element);

        element.addClass("presets-list");
        
        var defaultItem =  element.children().eq(self.options.startPreset);

        defaultItem.addClass("active");
        defaultItem.children().addClass("selected");

        $(self.element).find(".item-inner").click(function () {

            var item = $(this).parent();
            var preset = $(this);
            
            $(".item-inner").removeClass("selected");
            $(".item").removeClass("active");

            item.addClass("active");
            preset.addClass("selected");
        });
    };
    


    /****************** PLUGIN UTILS ***********************/

    function Plugin(element, options) {
        this.element = element;
        this.options = $.extend({}, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.init();
    }

    $.fn[pluginName] = function (options) {
        return this.each(function () {
            if (!$.data(this, 'plugin_' + pluginName)) {
                $.data(this, 'plugin_' + pluginName,
                    new Plugin(this, options));
            }
        });
    };

})(jQuery, window, document);