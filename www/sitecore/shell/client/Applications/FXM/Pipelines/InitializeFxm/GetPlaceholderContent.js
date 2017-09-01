define([
    "sitecore",
    "/-/speak/v1/FXM/ExperienceEditorExtension/Legacy/LegacySitecore.js",
    "/-/speak/v1/FXM/ExperienceEditorExtension/Legacy/LegacyjQuery.js",
    "/-/speak/v1/FXM/ExperienceEditorExtension/Legacy/Fxm.js",
    "/-/speak/v1/FXM/ExperienceEditorExtension/Utils/ClientBeacon.js",
    "/-/speak/v1/FXM/Pipelines/Utils/PipelineUtils.js",
    "/-/speak/v1/ExperienceEditor/ExperienceEditor.js"
], function (_sc, _scl, $sc, _fxm, _clientBeacon, _plUtils, ExperienceEditor) {

  var requestKey = "ExperienceEditor.FXM.GetElementReplacersData";
  var url = "/-/speak/request/v1/expeditor/" + requestKey;

  return {
    execute: function (context) {
      var placeholderIdList = _clientBeacon.placeholders();

      var isExperienceEditorModified = ExperienceEditor.getContext().isModified;
      var isPageEditorModified = _scl.PageModes.PageEditor.isModified();

      var success = function (resp) {
        if (!_scl.PageModes.ChromeManager.fieldValuesContainer) {
          _scl.PageModes.ChromeManager._createFieldValuesContainer();
        }

        var replaceStack = [];
        _.each(resp.placeholders, function (entry) {

          var editorSelector = _fxm.convertToEditorChromePath(entry.selector);

          entry.data = entry.data.replace(url, window.parent.location.href);
          entry.data = entry.data.replace(requestKey, window.parent.location.href);

          try {
            switch (entry.position) {
            case '{B8F49EBF-2542-4CB0-B3BB-63858918CE8B}': // before
              $sc(editorSelector).before(entry.data);
              break;
            case '{18F0F47F-2214-4F23-B6FA-F2D86A0C9E5A}': // after
              $sc(editorSelector).after(entry.data);
              break;
            default:
              replaceStack.push(entry);
              break;
            }
          } catch (ex) {
            console.warn(ex);
          }
        });

        if (replaceStack.length) {
          _.each(replaceStack, function (replacer) {

            var editorReplacerSelector = _fxm.convertToEditorChromePath(replacer.selector);

            $sc(editorReplacerSelector)
                .hide()
                .replaceWith(replacer.data);
          });
        }

        _scl.LayoutDefinition.setLayoutDefinition(resp.layout);

        _scl.PageModes.PageEditor.setModified(isPageEditorModified);
        ExperienceEditor.getContext().isModified = isExperienceEditorModified;

        // Re-initialize Chrome Manager to pick-up new Chromes.
        _scl.PageModes.ChromeManager.resetChromes();
      }

      _plUtils.serverPromiseProcessor(url, context, { ItemId: context.currentContext.itemId, ids: placeholderIdList, database: context.currentContext.database }, success);
    }
  }
});