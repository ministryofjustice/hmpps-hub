define(["sitecore", "/-/speak/v1/ExperienceEditor/ExperienceEditor.js"], function (Sitecore, ExperienceEditor) {
  var domHelper = {
    getNotificationOption: function (notificationTitle, notificationCommand, notificationId) {
      var notification = "<a href=\"#\" class=\"OptionTitle\" ";
      if (notificationCommand) {
        var notificationCommandCall = "window.scForm.postEvent(this, event, '" + notificationCommand + "');";
        if (notificationCommand.startsWith("webedit:workflowwithdatasourceitems(")) {
          notificationCommandCall = "window.parent.ExperienceEditor.processInModifiedHandlingMode(function(){" + notificationCommandCall + "});\"";
        }

        notification += "onclick=\"javascript: return " + notificationCommandCall+"\"";
      }

      if (notificationId && notificationId != "") {
        notification += "id=\"" + notificationId + "\"";
      }

      notification += ">" + notificationTitle + "</a>";
      return notification;
    },

    divideButtons: function (buttonsClass, wrapperClass) {
      var wrapper = "<div class='" + wrapperClass + "'/>";
      $("div.sc-chunk").each(function () {
        var buttons = $(this).find("." + buttonsClass);
        for (var i = 0; i < buttons.length; i += 2) {
          buttons.slice(i, i + 2).wrapAll(wrapper);
        }
      });
    },

    setRibbonHeight: function (height, app) {
      if (height === undefined) {
        height = app.ScopedEl.height();
      }

      var iframe = jQuery("#scWebEditRibbon", ExperienceEditor.getPageEditingWindow().document.body);
      if (!ExperienceEditor.getPageEditingWindow().document.getElementById("scCrossPiece")) {
        ExperienceEditor.getPageEditingWindow().$sc("<div id='scCrossPiece' style='visibility: hidden'> </div>").prependTo(window.parent.document.body);
      }

      var crossPiece = jQuery("#scCrossPiece", ExperienceEditor.getPageEditingWindow().document.body);
      iframe.height(height);
      crossPiece.height(height);
    },

    prepareHeaderButtons: function () {
      $(".sc-global-logo").attr("target", "_parent");

      var logoutLink = $(".logout");
      var logoutLinkFunc = logoutLink.click;
      logoutLink.click(function () {
        window.onbeforeunload = function (e) {
          try {
            ExperienceEditor.getPageEditingWindow().document.getElementById("scWebEditRibbon").style.display = "none";
            ExperienceEditor.getPageEditingWindow().location.reload();
            return;
          } catch (error) { }
        };

        try {
          logoutLinkFunc();
        } catch (err) { }
      });
    }
  };

  return domHelper;
});