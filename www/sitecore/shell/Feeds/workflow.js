function submitComment() {
  var textbox = $$(".comment-box")[0];
  
  $("CommentArea").setAttribute("disabled", "disabled");
  textbox.setAttribute("readonly", "readonly");
  $("WorkflowButton").hide();
  $("Loading").show();
  
  var url = location.href.replace("&nc=1", "") + "&comment=" + $F(textbox);
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

Event.observe(window, "load", function() {
  var textbox = $$(".comment-box")[0];
  if (textbox) {
    textbox.focus();
  }
});

Event.observe(window, "load", function() {
  startTimer();
  scForm.postRequest("", "", "", "SheerInit");
});