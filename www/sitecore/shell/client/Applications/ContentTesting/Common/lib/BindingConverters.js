define(["sitecore"], function (Sitecore) {
    Sitecore.Factories.createBindingConverter({
        name: "HasMoreThanOne",
        convert: function (array) {
            if (array && array[0]) {
                if (_.isArray(array[0])) {
                    return array[0].length > 1;
                }

                return array[0] > 1;
            }
            return false;
        }
    });

    Sitecore.Factories.createBindingConverter({
        name: "HasOne",
        convert: function (array) {
            if (array && array[0]) {
                if (_.isArray(array[0])) {
                    return array[0].length === 1;
                }

                return array[0] === 1;
            }
            return false;
        }
    });
});