define([
    "/-/speak/v1/FXM/ExperienceEditorExtension/Legacy/LegacySitecore.js",
    "/-/speak/v1/FXM/ExperienceEditorExtension/Legacy/Fxm.js",
    "/-/speak/v1/FXM/ExperienceEditorExtension/Commands/PageEditorCapabilityToggler.js"
], function (_legacy, _fxm, toggler) {

    var childCapabilities = [
        _legacy.PageModes.Capabilities.design,
        _legacy.PageModes.Capabilities.edit
    ];

    toggler('EnableControlHighlighting', _fxm.ShowControlsRegistryKey, _fxm.ShowControlsCapability, childCapabilities, function(state) {
        _legacy.PageModes.PageEditor.changeShowControls(state);
    });
});