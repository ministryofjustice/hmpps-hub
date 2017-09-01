(function (models) {
    models.dispatcher = function () {
        "use strict";

        function dispatcher(event) {
            return d3.dispatch(event);
        };

        dispatcher.add = function (event) {
            return dispatcher(event);
        }

        return dispatcher;
    }
}(Sitecore.Speak.D3.models));
