function testUrl() {  
  var navigateUrl = scForm.browser.getControl("Url").value;
  if (!navigateUrl) {
    return false;
  }

  if (navigateUrl.indexOf("/") != 0 && navigateUrl.indexOf("://") < 0) {
    navigateUrl = "http://" + navigateUrl;
  }

  try {
    window.open(navigateUrl, "_blank");   
  }
  catch(err) {
    alert(Texts.ErrorOcurred + " " + err.description);
  }

  return false;
}

function testMail() {
   var mailTo = scForm.browser.getControl("MailToLink").value;
   if (!mailTo) {
    return false;
   }

   var mailLink = document.createElement("A");
   mailLink.href = "mailto:" + mailTo.replace("mailto:", "");
   mailLink.style.display = "none";
   mailLink = document.body.appendChild(mailLink);   
   try {
    if (mailLink.click) {
      mailLink.click();
    }
    else if (document.createEvent) {
      var evt = document.createEvent("HTMLEvents");
      evt.initEvent("click", true, true );
      mailLink.dispatchEvent(evt);
    }    
   }
   catch(err) {
    alert(Texts.ErrorOcurred + " " + err.description);
   }

   document.body.removeChild(mailLink);
   return false;
}