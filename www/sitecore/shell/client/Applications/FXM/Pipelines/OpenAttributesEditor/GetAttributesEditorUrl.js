define([
    "sitecore",
    "/-/speak/v1/FXM/Pipelines/Utils/PipelineUtils.js"
], function (_sc, _plUtils) {
  var url = "/-/speak/request/v1/expeditor/ExperienceEditor.FXM.GetAttributesEditorUrl";
  return {
    execute: function (context) {
      console.warn("This file is obsolete and will be removed in the next product version");
      _plUtils.serverPromiseProcessor(url, context, context.data);
    }
  };
});