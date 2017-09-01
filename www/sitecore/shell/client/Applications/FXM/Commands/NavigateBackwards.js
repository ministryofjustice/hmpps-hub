define(["sitecore"], function (_sc) {
    _sc.Commands.NavigateBackwards =
    {
        canExecute: function (context) {
            return true;
        },
        execute: function (context) {
            _sc.Pipelines.NavigateBackwards ?
                    _sc.Pipelines.NavigateBackwards.execute({}) :
                    window.history.back();
        }
    };
});