(function () {
  var dependencies = (typeof window !== "undefined")
    ? ["sitecore", "/-/speak/v1/listmanager/SegmentedListDefinition.js"]
    : ["sitecore", "./SegmentedListDefinition"];
  define(dependencies, function (sitecore, segmentedListDefinition) {
    return sitecore.Definitions.App.extend(segmentedListDefinition);
  });
})();