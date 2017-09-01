define([
    "sitecore",
    "/-/speak/v1/FXM/Pipelines/Utils/PipelineUtils.js"
], function (_sc, _plUtils) {
    return {
        execute: function (context) {
            _plUtils.dialogPromiseProcessor(context, "dialogHeight: 600px;dialogWidth: 500px;");
        }
    };
});