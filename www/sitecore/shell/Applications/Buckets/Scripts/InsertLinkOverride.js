function GetDialogArguments() {
    return getRadWindow().ClientParameters;
}

function getRadWindow() {
    if (window.parent.radWindow) {
        return window.parent.radWindow;
    }

    if (window.parent.frameElement && window.parent.frameElement.radWindow) {
        return window.parent.frameElement.radWindow;
    }

    return null;
}

var isRadWindow = true;

var radWindow = getRadWindow();

function scClose(url, text) {
    var returnValue = {
        url: url,
        text: text
    };
    
    if (getRadWindow() != null) {

        getRadWindow().close(returnValue);

    }
    else {
   
        scCloseWebEdit(url);

    }
    
}

function scCloseNoLink() {
    window.parent.close();
}

function scCancel() {
    getRadWindow().close();
}

function scCloseWebEdit(url) {
    window.parent.returnValue = url;
    $j('#InternalLinkTreeview_Selected', parent.document.body).val(url.replace('~/link.aspx?_id=', '').replace('&_z=z', ''));

}

if (window.parent.focus && Prototype.Browser.Gecko) {
    window.parent.focus();
}