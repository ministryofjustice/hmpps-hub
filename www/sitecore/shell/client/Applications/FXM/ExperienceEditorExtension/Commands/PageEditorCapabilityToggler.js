define([
    "sitecore",
    "/-/speak/v1/FXM/ExperienceEditorExtension/Legacy/LegacySitecore.js",
    "/-/speak/v1/FXM/ExperienceEditorExtension/Legacy/LegacyjQuery.js",
    "/-/speak/v1/FXM/ExperienceEditorExtension/Utils/ControlDisabler.js",
    "/-/speak/v1/ExperienceEditor/ExperienceEditor.js"
], function (_sc, _legacy, $sc, ctrlDisabler, ExperienceEditor) {

  return function (commandName, registryKey, capabilityKey, childCapabilities, callback) {

    var disabler;
    var registryData = { value: registryKey };

    var handler = function (state, app, button) {

      if (!disabler) {
        disabler = new ctrlDisabler(app);
      }

      button.viewModel.isPressed(state);

      _legacy.PageModes.PageEditor.changeCapability(capabilityKey, state);

      _.each(childCapabilities, function (c) {
        _legacy.PageModes.PageEditor.changeCapability(c, state);
      });

      if (callback) {
        callback(state);
      }

      var toggleButton = jQuery('[data-sc-click="trigger:button:toggleshow"]');
      if (toggleButton.length == 1) {
        disabler.enable([button.viewModel.name(), toggleButton.attr('data-sc-id')], !state);
      } else {
        disabler.enable([button.viewModel.name()], !state);
      }
    }

    _sc.Commands[commandName] =
    {
      initialize: function (app, button) {
        var $initCapbilities = $sc('#scCapabilities').val().split('|');
        if (_.contains($initCapbilities, capabilityKey)) {
          handler({ value: true }, app, button);
        }
      },
      canExecute: function (context) {

        if (!ExperienceEditor.isInMode("edit")) {
          return false;
        }

        // Check is enabled allowed through pipeline?
        return true;
      },
      execute: function (context) {

        ExperienceEditor.PipelinesUtil.generateRequestProcessor("ExperienceEditor.FXM.ToggleRegistryKey.Toggle", function (resp) {
          handler(resp.responseValue.value, context.app, context.button);
        }, registryData).execute(context);
      }
    };
  }
});