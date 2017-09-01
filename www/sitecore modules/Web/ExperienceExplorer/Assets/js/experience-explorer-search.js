; (function ($, window, document, undefined) {

    /**************** PLUGIN OPTIONS AND DATA * **********************/

    var pluginName = 'SearchAutocomplete',
        defaults = {
            list: null,
            type: "checkbox"
        };

    /**************** COMMON PLUGIN METHODS **********************/

    Plugin.prototype.init = function () {
        var self = this;

        var link = $(self.element).attr("data-toggle");
        self.list = $("[data-autocomplete=" + link + "]");

        var scope = self.getAutocompleteData();

        $(self.element).autocomplete({
            minLength: 1,
            source: scope,
            open: function (event, ui) {
                $(this).autocomplete("widget").css({
                    "max-width": 270
                });
            }
        })
            .data('ui-autocomplete')._renderItem = function (ul, item) {

                var input = $('<input>')
                                    .attr('type', self.options.type)
                                    .attr('id', 'autocomplete_' + item.id)
                                    .attr('name', self.options.type + '_group');

                var text = $("<small>").addClass("tiny-text").text(item.name);

                if ($('#' + item.id).find("input").is(':checked')) $(input).attr('checked', true);

                var label = $("<label>")
                    .addClass("control")
                    .append(input);

                if (item.icon) {
                    var image = $("<img>").attr("src", item.icon);
                    label.append(image);
                }

                label.append(text);

                var listitem = $("<li>").append(label);

                $(input).click(function () {
                    var newValue = $(this).is(':checked');
                    $("#" + item.id).find("input").prop("checked", newValue);
                });

                return $(listitem).appendTo(ul);
            };

    };

    Plugin.prototype.getAutocompleteData = function () {
        var self = this;
        var data = [];
        var stack = self.list.find(".control");

        stack.each(function () {
            var item = $(this);
            var id = item.attr("id");
            var name = item.find(".listitem-name").text();
            var selected = item.find("input").is(":checked");
            var obj;

            if (item.find("img").length > 0) {
                var icon = item.find("img").attr("src");

                obj = {
                    value: name,
                    name: name,
                    id: id,
                    icon: icon,
                    selected: selected
                };
            }
            else {

                obj = {
                    value: name,
                    name: name,
                    id: id,
                    selected: selected
                };
            }

            data.push(obj);
        });

        return data;

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