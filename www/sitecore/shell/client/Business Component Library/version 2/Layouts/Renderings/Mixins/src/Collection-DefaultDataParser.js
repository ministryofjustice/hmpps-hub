(function (Speak) {

  define("Collection/DefaultDataParser", [], function () {

    function getParsedData(data) {
      var isJson = typeof data == "string",
        isArray = Array.isArray(data);

      return isJson ? JSON.parse(data) : isArray ? data : [];
    }

    return {
      initialized: function () {
        this.DynamicData = getParsedData(this.DynamicData); // To support Data-binding on DynamicData

        this.on("change:DynamicData", function () {
          this.reset(getParsedData(this.DynamicData));
        }, this);

        this.reset(this.DynamicData);
      }
    }

  });

})(Sitecore.Speak);