(function ($) {
    $.fn.slideOut = function (direction) {
        var trigger = $(this);
        var panel = trigger.parent();

        //Set init state
        var state = $.cookie(direction);
        if (state == "false")
            SlideOut(panel, direction);
        else
            SlideIn(panel, direction);

        //bind to click event
        trigger.bind('click', function () {
            if (!$(panel).hasClass('out'))
                SlideOut(panel, direction);
            else
                SlideIn(panel, direction);
            return false;
        });
    };
    
    this.SlideOut = function (panel, direction) {
        var options = {};
        options[direction] = '0px';
        $(panel).animate(options);
        $(panel).addClass('out');
        $.cookie(direction, "false", 365);
    };

    this.SlideIn = function (panel, direction) {
        var options = {};
        options[direction] = $(panel).hasClass('viewer') ? '-352px' : '-350px';
        $(panel).animate(options);
        $(panel).removeClass('out');
        $.cookie(direction, "true", 365);
    };
})(jQuery);



