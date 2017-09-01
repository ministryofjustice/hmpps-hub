define([
    "/-/speak/v1/FXM/ExperienceEditorExtension/Legacy/LegacySitecore.js",
    "/-/speak/v1/FXM/ExperienceEditorExtension/Legacy/Fxm.js",
    "/-/speak/v1/FXM/ExperienceEditorExtension/Commands/PageEditorCapabilityToggler.js",
    "/-/speak/v1/FXM/ExperienceEditorExtension/Commands/CreateClientAction.js" // used through legacy selector
], function (_legacy, _fxm, toggler) {

    var childCapabilities = [
        _legacy.PageModes.Capabilities.design
    ];

    toggler('EnableFxmClientActions', _fxm.ClientActionRegistryKey, _fxm.ClientActionCapability, childCapabilities);
});