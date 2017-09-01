; (function ($, window, document, undefined) {


    /**************** PLUGIN OPTIONS AND DATA ************************/

    var pluginName = 'Rules',
        defaults = {
            title: ".conditions-title"
        };

    /**************** COMMON PLUGIN METHODS **********************/

    Plugin.prototype.init = function () {
        var self = this;
        self.InitTooltips();
    };

    Plugin.prototype.InitTooltips = function () {
        var self = this;
        var element = $(self.element);
        var title = element.next(self.options.title).html();
        
        element.attr("title", title);

        element.tooltip({
            placement: 'top'
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