define([
    "sitecore",
    "/-/speak/v1/FXM/Pipelines/Utils/PipelineUtils.js"
], function (_sc, _plUtils) {
    return {
      execute: function (context) {
        console.warn("This file is obsolete and will be removed in the next product version");
            _plUtils.dialogPromiseProcessor(context, "dialogHeight: 600px;dialogWidth: 500px;");
        }
    };
});