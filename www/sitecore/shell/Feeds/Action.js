function submitComment() {
  var textbox = $$(".comment-box")[0];
  
  $("CommentArea").setAttribute("disabled", "disabled");
  textbox.setAttribute("readonly", "readonly");
  $("WorkflowButton").hide();
  $("Loading").show();
  
  var url = location.href.replace("&nc=1", "") + "&comment=" + encodeURI($F(textbox));
  location.href = url;
  
  return false;
}

var scTimerStopped = false;

function startTimer() {
  setTimeout(function() {
    if (!scTimerStopped) {
      $("Loading").show();
    }
  }, 500);
}

function stopTimer() {
  scTimerStopped = true;
}

function startInit() {
  var initFn = function () {
    scForm.postRequest("", "", "", "SheerInit");
  };

  // Wait for the modal dialog host to complete loading
  var jqueryModalDialogsFrame = top.document.getElementById("jqueryModalDialogsFrame");
  if (jqueryModalDialogsFrame && jqueryModalDialogsFrame.contentWindow && !jqueryModalDialogsFrame.contentWindow.showModalDialog) {
    scForm.browser.attachEvent(jqueryModalDialogsFrame.contentWindow, "onload", function () {
      initFn();
    });
  } else {
    initFn();
  }
}

Event.observe(window, "load", function() {
  startTimer();
  startInit();
});