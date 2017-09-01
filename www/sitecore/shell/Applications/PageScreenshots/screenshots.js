window.$ = window.$sc;

$.extend({
  convertUTCDateToLocal: function(utcDate) {
    var localDate = new Date();
    localDate.setUTCFullYear(utcDate.getUTCFullYear());
    localDate.setUTCMonth(utcDate.getUTCMonth());
    localDate.setUTCDate(utcDate.getUTCDate());
    localDate.setUTCHours(utcDate.getUTCHours());
    localDate.setUTCMinutes(utcDate.getUTCMinutes());
    localDate.setUTCSeconds(utcDate.getUTCSeconds());
    return localDate;
  }
});

$.ajaxSetup({
  dataType: "json",
  error: function(xhr, status, error) {
    handleAjaxError(xhr);
  },

  timeOut: 99999
});

function handleAjaxError(xhr) {
  var errorMessage = ErrorTexts['genericerror'];
  if (xhr.responseText) {
    var msg = $.trim(xhr.responseText.toLowerCase());
    if (msg.indexOf("wrong web resource address") >=0 ) {
      errorMessage = ErrorTexts["wrong web resource address"];
    }    
  }
  
  var html = "<div class='error-message'><span class='close'>X</span>"  + errorMessage + "</div>";
  $("#notifications").html(html).show();              
};


$(document).ready(function() {   
  new Screenshots().init();
});

var Screenshots = function () {
  var previewDisplayName, prev, next;
  var currentPreviewIdx;
  var currentPreviews;
  var screenshotsButton;
  var selectedDevicesCookieName = "sc_preview_clients";
  var cookiePath = "/sitecore/shell/applications/pagescreenshots";  
  function init() {
    screenshotsButton = $("#takeScreenshotsButton");
    populateDevicesList();
    populateSessions();   
    previewDisplayName = $("#previewDisplayName");
    prev = $("#prev").click(function () {
      if (prev.is(".disabled")) {
        return;
      }

      currentPreviewIdx--;
      showFullPreview();
    });

    next = $("#next").click(function () {
      if (next.is(".disabled")) {
        return;
      }

      currentPreviewIdx++;
      showFullPreview();
    })


    screenshotsButton.click(onTakeScreenshotsClick);
    $("#backButton").click(function () {
      toggleModes();
    });

    currentPreviewIdx = 0;
    $(".Complete .tile", document.getElementById("RecentSessions")).live("click", function () {
      var that = this;
      var session = $(that).closest(".session");
      var previews = session
          .find(".tile")
          .map(function (idx) {
            if (this === that) {
              currentPreviewIdx = idx;
            }

            var $this = $(this);
            return {
              name: $this.children(".text").text(),
              url: $this.attr("data-full-image"),
              isCompleted: $this.is(".Complete .tile")
            };
          })

      if (!previews.length) {
        return;
      }


      currentPreviews = previews;
      showFullPreview();
      toggleModes();
    }
    );

     $("#notifications .close").live("click", function() {
        $("#notifications").hide();
     });
  }

  function populateDevicesList() {
    $("#deviceEmptyListText").show(500);
    var options = {
      type: "GET",
      url: "/sitecore/shell/applications/pagescreenshots/ScreenshotsHandler.ashx?command=GetClients",           
      error: function (xhr, status, err) {        
        handleAjaxError(xhr);
        $("#devices").html("").attr("data-placeholder", scTexts.noDevicesAvailable).show().chosen();
      },

      complete: function() {
        $("#deviceEmptyListText").stop(true).hide();
      },

      success: function (data) {
        var length = data.length;
        var options = document.createDocumentFragment();
        var devicesToSelect = ($.util().getCookie(selectedDevicesCookieName) || "").split("|");      
        for (var i = 0; i < length; i++) {
          var deviceId = data[i].Id;
          var opt = $("<option/>").attr({ "id": deviceId, "value": deviceId }).text(data[i].Name);
          var deviceShouldBeSelected = $.inArray($.toShortId(deviceId), devicesToSelect) >= 0;
          if (deviceShouldBeSelected) {
            opt.attr("selected", "selected");
          }

          options.appendChild(opt[0]);
        }   
      
        $("#devices").html("").append(options).show().chosen().change(onDeviceChange);
        updateScreenshotsButtonState();
      }
     };

     $.ajax(options);
  }

  function populateSessions() {
    var dataContainer = $("#previews");
    if (!dataContainer.length) {
      console.error("Data not found");
      return;
    }

    var value = dataContainer.val();    
    var data = JSON.parse(value);

    var recentSession = $("#RecentSessions");
    renderSessionTemplate(data).appendTo(recentSession);
    recentSession.delegate(".session-header", "click", function () {
      $(this).closest(".session").toggleClass("collapsed");
    });

    startUpdateNonCompetedSessions(data);
  }

  function startUpdateNonCompetedSessions(sessions) {
    $.each(sessions, function (i, session) {
      if (!session.IsCompleted && session.Id) {
        updateSessionPreviews(session.Id);
      }
    });
  }

  function renderSessionTemplate(data) {
    var template = getSessionTemplate();
    return $.tmpl(template, data, { formatDate: formatDate, formatDateTime: formatDateTime, getThumbnailBackgroundImage: function(preview) {
        if (preview.State == "Complete") {
          return "url('" + preview.ThumbnailUrl + "')";
        }

        return "none";
      },

      getPreviewImageUrl: function(preview) {
        if (preview.State == "Complete") {
          return preview.ImageUrl;
        }

        return "";
      }
    });
  }

  function createPreviewImage() {
    return $("<img id='fullImage' />").load(onFullPreviewLoaded);

  }

  function onFullPreviewLoaded() {    
    $("#waitImageText").stop(true).fadeOut();           
  }

  function showFullPreview() {
    var idx = getCurrentPreviewIndex();
    var currentPreview = currentPreviews[idx];      
    var text = $("#waitImageText");
    $("#fullImage").remove();
    if (currentPreview.isCompleted) {      
      text.removeClass("notavailable").text(scTexts.previewWillAppearSoon).stop(true, true).fadeIn(500);
      var previewImg = createPreviewImage()
      previewImg[0].src = currentPreview.url;
       $("#fullImagePreview").append(previewImg);
    }
    else {
      text.addClass("notavailable").text(scTexts.previewIsNotAvailable).stop(true).show();      
    } 
       
    previewDisplayName.text(currentPreview.name + " (" + (idx + 1) + "/" + currentPreviews.length + ")");
    if (currentPreviewIdx >= currentPreviews.length - 1) {
      next.addClass("disabled");
    }
    else {
      next.removeClass("disabled");
    }

    if (currentPreviewIdx <= 0) {
      prev.addClass("disabled");
    }
    else {
      prev.removeClass("disabled");
    }
  }

  function getCurrentPreviewIndex() {
    return currentPreviewIdx || 0;
  }

  function getSessionTemplate() {
    var name = "sessiontmpl";
    return $.template[name] || $.template(name, $("#sessionTmpl"));
  }

  function toggleModes() {
    $("#RecentSessions").toggle();
    $("#fullImagePreview").toggle();
    $("#fullPreviewToolbar").toggle();
    $("#takeScreenshotToolbar").toggle();
  }

  function formatDate(value) {
    return $.convertUTCDateToLocal(new Date(Date.parse(value))).toLocaleDateString();
  }

  function formatDateTime(value) {
    var local = $.convertUTCDateToLocal(new Date(Date.parse(value)));
    return local.toLocaleDateString() + " " + local.toLocaleTimeString();
  }

  function updateScreenshotsButtonState() {
    var nonCompleteSessions = getNonCompletedSessions();
    if (nonCompleteSessions.length) {
      setScreenshotsButtonState(false);
      return
    }

    var target = document.getElementById("devices");
    if (target.selectedIndex >= 0) {
      setScreenshotsButtonState(true);
    }
    else {
      setScreenshotsButtonState(false);
    }
  }

  function setScreenshotsButtonState(enabled) {
    if (enabled) {
      screenshotsButton.removeClass("action-disabled");
    }
    else {
      screenshotsButton.addClass("action-disabled");
    }
  }

  function isScreenshotsButtonDisabled() {
    return screenshotsButton.hasClass("action-disabled");
  }

  function getNonCompletedSessions() {
    return $(".tile-container.Waiting").closest(".session");
  }
    
  function getSelectedDevices() {
    var selectedDevices = [];
    $("#devices option").each(function () {
      if (this.selected) {
        selectedDevices.push({ id: this.value, name: this.innerHTML });
      }
    });

    return selectedDevices;
  }

  function getInitialPreviewsData(devices) {
    var results = $.map(devices, function (d) {
      return {
        ImageUrl: "",
        ThumbnailUrl: "",
        PreviewClient: { Name: d.name, Id: "00000000-0000-0000-0000-000000000000" },
        State: "Waiting"
      };
    });

    return {
      Id: "initialSession",
      Date: new Date().toUTCString(),
      Results: results
    }
  }

  function getSessionElement(sessionId) {
    return $("#" + sessionId);
  }


  function onDeviceChange() {
    updateScreenshotsButtonState();
    var selectedDevices = getSelectedDevices();
    var shortIdList = $.map(selectedDevices, function (d) {
      return $.toShortId(d.id);
    }).join("|");
   
    $.util().setCookie(selectedDevicesCookieName, shortIdList, null, cookiePath);
  }

  function onTakeScreenshotsClick(evt) {
    if (isScreenshotsButtonDisabled()) {
      var nonCompletedSession = getNonCompletedSessions()[0];
      if (nonCompletedSession) {               
        return;
      }

      $("input.default").focus();
      return;
    }

    setScreenshotsButtonState(false);
    var itemUri = $("#itemUri").val();
    var selectedDevices = getSelectedDevices();
    var data = getInitialPreviewsData(selectedDevices);
    $("#welcomeText").hide();
    renderSessionTemplate(data).prependTo("#RecentSessions");
    var selectedDevicesIds = $.map(selectedDevices, function (d) {
      return $.toShortId(d.id);
    })

    var options = {
      type: "POST",
      url: "/sitecore/shell/applications/pagescreenshots/screenshotsHandler.ashx?command=GenerateScreenshots&" + itemUri,
      cache: false,
      data: {
        clientid: selectedDevicesIds.join("|")
      },

      complete: function () {
        updateScreenshotsButtonState();
      },

      error: function (xhr, status, err) {
        setSessionErrorState("initialSession")       
        handleAjaxError(xhr);
      },

      success: function (data) {
        $("#initialSession").replaceWith(renderSessionTemplate(data));
        if (!data.IsCompleted) {
          setTimeout(function () {
            var sessionId = data.Id;
            updateSessionPreviews(sessionId);
          }, updatePreviewInterval);
        }
      }
    };

    $.ajax(options);
  };

  function setSessionErrorState(sessionId) {
    var sessionContainer = $("#" + sessionId);    
    $(".Waiting", sessionContainer).removeClass("Waiting").addClass("Error");
    sessionContainer.addClass("session-error");
  };

  function updateSessionPreviews(sessionId) {
    var itemUri = $("#itemUri").val();
    var sessionContainer = getSessionElement(sessionId);
    var clientids = $("[data-client-id]", sessionContainer).map(function() {
      return $.toShortId($(this).attr("data-client-id"));
    });
        
    var options = {
      type: "POST",
      url: "/sitecore/shell/applications/pagescreenshots/ScreenshotsHandler.ashx?command=GetScreenshots&" + itemUri + "&sessionId={" + sessionId + "}",
      data: {
        clientid: clientids.get().join("|")
      },

      cache: false,
        error: function (xhr, status, err) {
        setSessionErrorState(sessionId);       
        handleAjaxError(xhr);
      },

      complete: function () {
        updateScreenshotsButtonState();
      },
      success: function (data) {
        if (!data.Id) {
          return;
        }
       
        getSessionElement(data.Id).replaceWith(renderSessionTemplate(data));
        if (!data.IsCompleted) {
          setTimeout(function () {
            var sessionId = data.Id;
            updateSessionPreviews(sessionId);
          }, updatePreviewInterval);
        }

      }
    };

    $.ajax(options);
  };

  return {
    init: init,
    setScreenshotsButtonState: setScreenshotsButtonState,
    isScreenshotsButtonDisabled: isScreenshotsButtonDisabled
  }
};