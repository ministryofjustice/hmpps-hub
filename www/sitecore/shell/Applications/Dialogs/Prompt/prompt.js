(function () {
  var dialogArguments = scForm.getDialogArguments();

  document.observe('dom:loaded', function () {
    $("Header").innerHTML = dialogArguments.message;
    $("Value").value = dialogArguments.defaultValue;
    $("Value").select();
    if (dialogArguments.header) {
      document.querySelector('.DialogHeader').innerHTML = dialogArguments.header;
    }

    $('OK').setAttribute('onclick', 'false');
    $('OK').setAttribute('onkeydown', 'false');

    Event.observe($('OK'), 'click', ok_click);

    Event.observe(document.body, 'keydown', function (event) {
      event = event || window.event;
      if (event.keyCode == 13) ok_click(event);
    });

  });

  function ok_click(evt) {
    evt && Event.stop(evt);

    var maxlength = (dialogArguments.maxLength != null ? parseInt(dialogArguments.maxLength, 10) : 0);

    if (dialogArguments.validation != null) {
      var re = new RegExp(dialogArguments.validation);
    }

    var result = $("Value").value;

    if (result != null && re && !re.test(result)) {
      $("scMessageBarText").innerHTML = dialogArguments.validationText.replace(/\$Input/gi, result);
      $("scMessageBar").removeClassName('scHidden');
      scForm.autoIncreaseModalDialogHeight();
      return;
    }

    if (maxlength != 0 && result != null && result.length > maxlength) {
      $("scMessageBarText").innerHTML = dialogArguments.maxLengthValidatationText;
      $("scMessageBar").removeClassName('scHidden');
      scForm.autoIncreaseModalDialogHeight();
      return;
    }

    top.returnValue = result;
    top.dialogClose();
  }
})();