; (function ($, window, document, undefined) {

    /**************** PLUGIN OPTIONS AND DATA ***********************/

    var pluginName = 'GeoIp',
        defaults = {
            testLink: "#link_testgeo",
            switcherLinks: "a[data-toggle='geo-type']",
            switcherData: ".geo-ip-data"
        };

    /**************** COMMON PLUGIN METHODS **********************/

    Plugin.prototype.init = function () {
        var self = this;

        self.TestIp();
        self.SwitchSubTabs();
    };

    Plugin.prototype.TestIp = function () {
        var self = this;
        var link = $(self.options.testLink);
        var container = $(link.attr("href"));
        var loading = $("<img>")
            .attr("src", "/sitecore modules/web/experienceExplorer/assets/images/loading.gif");

        link.append(
            loading.hide()
            );

        link.click(function () {
            loading.show();

            jQuery.ajax({
                url: "/sitecore modules/web/experienceexplorer/services/service.asmx/GeoIpTest",
                type: "POST",
                contentType: "application/json",
                dataType: "json"
            })
                .done(function (data) {

                    container.empty();

                    var description = "";
                    var message = $("<p>").text(data.d.Message);
                    var icon = $("<img>").prop("src", data.d.IconPath);

                    var tooltip = $('<a href="#">')
                        .attr("title", data.d.QuestionMark)
                        .attr("data-toggle", "tooltip")
                        .attr("data-placement", "left")
                        .addClass("info hide")
                        .text("?");

                    if (data.d.Description != null) var description = $("<div>").html(data.d.Description);

                    message.prepend(icon);

                    container
                        .append(tooltip)
                        .append(message)
                        .append(description);

                    var tooltips = $("[data-toggle=tooltip]");

                    if (tooltips.length) { tooltips.tooltip(); }

                    container.slideDown();

                    loading.hide();
                });

            return false;
        });
    };

    Plugin.prototype.SwitchSubTabs = function () {
        var self = this;
        
        var links = $(self.options.switcherLinks);
        var containers = $(self.options.switcherData);

        var defaultId = self.GetDefaultSubTab();
        var defaultContainer= $(defaultId);
        var defaultLink = $("[data-source=" + defaultId + "]");

        defaultContainer.removeClass("collpase-geo");
        defaultLink.addClass("active");

        links.click(function () {
            var currentLink = $(this);
            var currentContainerId = currentLink.attr("data-source");
            var currentContainer = $(currentContainerId);

            $.cookie("geo-subtab", currentContainerId);

            links.removeClass("active");
            currentLink.addClass("active");

            containers.slideUp("fast");
            containers.addClass("collpase-geo");
            
            currentContainer.slideDown("fast");
            currentContainer.removeClass("collpase-geo");

            return false;
        });
    };

    Plugin.prototype.GetDefaultSubTab = function () {
        var self = this;
        var id = $.cookie("geo-subtab");
        if (id != "" && typeof id != "undefined") return id;
        else return "#" + $(self.options.switcherData).first().attr("id");  
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