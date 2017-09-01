define([
    "sitecore",
    "/-/speak/v1/FXM/ExperienceEditorExtension/Legacy/LegacySitecore.js",
    "/-/speak/v1/FXM/ExperienceEditorExtension/Legacy/LegacyjQuery.js",
    "/-/speak/v1/FXM/ExperienceEditorExtension/Legacy/Fxm.js",
    "/-/speak/v1/FXM/ExperienceEditorExtension/Utils/ClientBeacon.js",
    "/-/speak/v1/FXM/Pipelines/Utils/PipelineUtils.js"
], function(_sc, _scl, $sc, _fxm, _clientBeacon, _plUtils) {

    var url = "/-/speak/request/v1/expeditor/ExperienceEditor.FXM.GetClientActionsData";

    return {
        execute: function(context) {
            var actionsIdList =  _clientBeacon.clientActions();

            var success = function(resp) {
                _.each(resp, function (entry) {

                    var editorSelector = _fxm.convertToEditorChromePath(entry.Selector);

                    _fxm.updateNodeToClientAction($sc(editorSelector), entry, false);
                });
            }

            _plUtils.serverPromiseProcessor(url, context, { ids: actionsIdList, database: context.currentContext.database }, success);
        }
    }
});