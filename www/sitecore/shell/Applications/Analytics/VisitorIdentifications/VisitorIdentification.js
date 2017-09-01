function scSetSlider(id, value) {
  var ctl = $("texts_" + id);
  
  $A(ctl.childElements()).each(function(e) {e.hide()});

  ctl = $(id + "_value" + value).show();
}

function RefreshParent() {

    var opener = null;
    
    if (window.dialogArguments) // Internet Explorer supports window.dialogArguments
    {
        opener = window.dialogArguments;
    }
    else // Firefox, Safari, Google Chrome and Opera supports window.opener
    {
        if (window.opener) {
            opener = window.opener;
        }
    }
    
    if (opener) {
        var form = opener.frameElement.ownerDocument.getElementById('form1');
        if (form != null) form.submit();
    }
}

document.observe("dom:loaded", function() {
});

