define([], function () {
  return {
    idLoadingElement: "dvLoadingElement",
    pathLoadingImage: "/sitecore/shell/client/Speak/Assets/img/Speak/ProgressIndicator/sc-spinner32.gif",

    showElement: function () {
      $(parent.document.body).append("\
        <div id='" + this.idLoadingElement + "'>\
          <div style='background-color: #000000;opacity: 0.6;width: 100%;height: 100%;position: absolute;top: 0px;left: 0px;' ></div>\
          <div style='display:inline-table;padding: 30px;background-color: #FFFFFF;width: 32px;height: 32px;position: absolute;top: 50%;left: 50%;border-radius: 7px;'>\
            <img src='" + this.pathLoadingImage + "' style='height: 32px;width: 32px;'>\
          </div>\
        </div>");
    },

    hideElement: function () {
      var dvLoadingElem = $(parent.document.body).find("#" + this.idLoadingElement);
      if (typeof dvLoadingElem != 'undefined') {
        $(dvLoadingElem).remove();
      }
    },

    waitLoadingDialog: function (idFrameDialog, properties) {
      // waiting on "dialog-iframe" element in DOM-html
      var self = this;
      var invervalId = setInterval(function () {
        var arrFrames = parent.document.getElementsByTagName("IFRAME");
        for (var i = 0; i < arrFrames.length; i++) {
          if (arrFrames[i].id === idFrameDialog) {
            var internalFrame = $(arrFrames[i].contentDocument).find("iframe");
            if (internalFrame.length > 0 && $(internalFrame[0].contentDocument.body).html() != '') {

              if (typeof properties != 'undefined') {
                // setting of the height
                if (typeof properties.height != 'undefined')
                  internalFrame.height(properties.height + "px");

                // setting of the minWidth
                if (typeof properties.minWidth != 'undefined')
                  internalFrame.parent().css("min-width", properties.minWidth + "px");
              }

              // clear interval and remove loading image
              clearInterval(invervalId);
              self.hideElement();
            }
          }
        }
      }, 500);
    }
  };
});