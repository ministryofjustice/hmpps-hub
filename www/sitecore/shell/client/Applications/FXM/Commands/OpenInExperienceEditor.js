define(["sitecore", "/-/speak/v1/FXM/ParamUtils.js"], function (_sc, _paramUtils) {
    _sc.Commands.OpenInExperienceEditor =
    {
        canExecute: function (context) {
            return _paramUtils.getIdFromContext(context, true).valid;
        },
        execute: function (context) {
            var id = _paramUtils.getIdFromContext(context, true);
            var url = window.location.protocol + '//' + window.location.host + "/?sc_mode=edit&sc_lang=en&sc_itemid=" + id.id;
            window.open(url, "_blank");
        }
    };
});