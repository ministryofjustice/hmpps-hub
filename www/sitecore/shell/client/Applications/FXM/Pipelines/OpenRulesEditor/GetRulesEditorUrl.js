define([
    "sitecore",
    "/-/speak/v1/FXM/Pipelines/Utils/PipelineUtils.js"
], function (_sc, _plUtils) {

    var url = "/-/speak/request/v1/expeditor/ExperienceEditor.FXM.GetRulesEditorUrl";

    return {
        execute: function (context) {
            _plUtils.serverPromiseProcessor(url, context, context.data);
        }
    };
});