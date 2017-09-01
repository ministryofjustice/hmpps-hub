define(["/-/speak/v1/FXM/Utils/Switcher.js"], function (Switcher) {
    return {
        showModalDialog: function (url, args, features, request, openerWindow, closeCallback) {
            var el = window.top.document.getElementById('jqueryModalDialogsFrame');
            if (!request) {
                request = {
                    dialogResult: "",
                    resume: function() {}
                };
            }

            // switcher to handle legacy issues around closing dialogs
            var switcher = new Switcher(window.top, 'dialogClose', el.contentWindow.dialogClose);

            el.contentWindow.showModalDialog(url, args, features, request, null, openerWindow, function (data) {
                switcher.revert();
                if (closeCallback) {
                    closeCallback(data);
                }
            });
        }
    }
});