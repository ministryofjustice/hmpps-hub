define([
    "sitecore",
    "/-/speak/v1/FXM/Utils/ClassicDialogUtil.js"
], function (_sc, _dialogUtil) {
    _sc.Commands.ConfirmDeletion =
    {
        canExecute: function (context) {
            return true;
        },
        execute: function (context) {
            if (!context.url) {
                context.url = '/sitecore/client/Applications/FXM/dialogs/DeleteConfirmation';
            }

            if (!context.features) {
                context.features = 'dialogHeight:230px;dialogWidth:600px;forceDialogSize:yes';
            }
            
            _dialogUtil.showModalDialog(context.url, '', context.features, null, window, function (returnCode) {
                if (returnCode > 0) {
                    if (context.onConfirm) {
                        context.onConfirm();
                    }
                } else {
                    if (context.onCancel) {
                        context.onCancel();
                    }
                }
            });
        }
    };
});