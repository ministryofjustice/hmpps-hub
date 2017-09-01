define(["sitecore"], function (_sc) {
    _sc.Commands.ToggleEditMode =
    {
        canExecute: function (context) {
            return true; 
        },
        execute: function (context) {
            var editMode = false;
            var editQsFlag = _sc.Helpers.url.getQueryParameters(window.location.href).edit;
            if (editQsFlag && editQsFlag === "true")
                editMode = true;

            window.location = _sc.Helpers.url.addQueryParameters(window.location.href, { edit: !editMode });
        }
    };
});