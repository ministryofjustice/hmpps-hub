define(["/-/speak/v1/client/entityservice.js"], function () {
    return function(path) {
        return new EntityService({
            url: "/sitecore/api/ssc/" + path,
            headers: {
                "X-RequestVerificationToken": jQuery('[name=__RequestVerificationToken]').val(),
                "X-Requested-With": "XMLHttpRequest"
            }
        });
    }
}); 