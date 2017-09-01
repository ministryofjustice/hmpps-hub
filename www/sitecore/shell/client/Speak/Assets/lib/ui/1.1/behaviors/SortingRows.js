define(["sitecore"], function (_sc) {

    _sc.Factories.createBehavior("sort", {
        events: {
            "click .sort": "sort"
        },
        afterRender: function () {
            var $sortEL = this.$el.find("[data-sc-sort]");

            var template = "<i class='sort asc'></span>";
            $sortEL.each(function () {
                $(this).append(template);
            });
        },
        sort: function (evt) {
        }
    });
});