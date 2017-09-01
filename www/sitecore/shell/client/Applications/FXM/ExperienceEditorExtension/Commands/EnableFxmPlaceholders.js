define([
    "/-/speak/v1/FXM/ExperienceEditorExtension/Legacy/LegacySitecore.js",
    "/-/speak/v1/FXM/ExperienceEditorExtension/Legacy/Fxm.js",
    "/-/speak/v1/FXM/ExperienceEditorExtension/Commands/PageEditorCapabilityToggler.js"
], function (_legacy, _fxm, toggler) {

    var childCapabilities = [
        _legacy.PageModes.Capabilities.design,
    ];

    toggler('EnableFxmPlaceholders', _fxm.PlaceholderRegistryKey, _fxm.PlaceholderCapability, childCapabilities);
});