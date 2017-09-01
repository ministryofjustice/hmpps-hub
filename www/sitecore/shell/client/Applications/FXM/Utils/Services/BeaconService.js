define([], function () {
    var baseAddress = "/sitecore/api/ssc/beacon/service/Beacon/";

    var doGet = function(path, data) {
        return $.ajax({
            url: baseAddress + path,
            data: data
        });
    }

    return {
        checkScript: function(address) {
            return doGet("Ping", { address: address });
        },
        getScript: function() {
            return doGet("BundleAddress");
        }
    }
});