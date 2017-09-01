function scKeyDown(evt) {
  evt = window.event;

  if (evt.keyCode == 27) {
    var ctl = scForm.browser.getControl("CancelButton");
    if (ctl != null) {
      ctl.click();
    }
  }
  
  if (evt.keyCode == 13 && evt.srcElement.tagName != "TEXTAREA") {
    var ctl = scForm.browser.getControl("NextButton");
    
    if (ctl != null && window.event.srcElement != ctl) {
      ctl.click();
    }
  }
}

function scWizardInitialize() {
  scForm.browser.attachEvent(document, "onkeydown", scKeyDown);
  scUpdateWizardControls();
}

scForm.browser.attachEvent(window, "onload", scWizardInitialize);

function scUpdateWizardControls() {   
  if (window.scTreeview && scTreeview.isHidden) {   
    scTreeview.align();
  }

  $$('.ie9 .scWizardFormContentForOldIE').forEach(function (element) {
    var scFormDialogHeader = element.previous('.scFormDialogHeader');
    var scWizardWarning = element.previous('.scWizardWarning') || element.previous('.scMessageBar.scWarning');

    var height = scFormDialogHeader && scFormDialogHeader.getHeight() + (scWizardWarning && scWizardWarning.getHeight());

    height && element.setStyle({ top: height + 'px' });
  });
}   