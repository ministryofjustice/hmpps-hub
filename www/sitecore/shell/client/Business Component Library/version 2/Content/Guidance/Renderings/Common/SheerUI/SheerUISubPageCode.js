(function (speak, $) {

  window.SheerUI = {};
  window.SheerUI.Demo = {
    closeModalDialogHandler: function (result) {
      if (result) {
        if (this.request.parameters == "globalization:untranslatedfields")
          scForm.showModalDialog("/sitecore/shell/Applications/Globalization/Untranslated Fields/Viewer.aspx?fi=" + result, "_blank", "getBestDialogSize:true;header:Untranslated Fields Viewer");

        if (this.request.parameters == "usermanager:resetmysettings" && result == "yes")
          scForm.showModalDialog("/sitecore/shell/default.aspx?xmlcontrol=Alert", { message: "Your settings have been reset.<br /><br />Some changes will first take effect, when the browser is refreshed." }, "dialogWidth:400px;dialogHeight:190px;help:no;scroll:no;resizable:no;maximizable:no;status:no;center:yes;autoIncreaseHeight:yes");
      }
    }
  };

  speak.pageCode([], function () {
    return {
      initialized: function () {
        var changeWallPaperLink = " <a href=\"javascript:;\" onclick=\"javascript:return scForm.speakPostEvent(this,event,&#39;preferences:changewallpaper&#39;, SheerUI.Demo.closeModalDialogHandler);\">Change desktop background dialog</a>",
          regionInfoLink = "<a href=\"javascript: void(0)\" onclick=\"javascript:return scForm.speakPostEvent(this,event,'preferences:changeregionalsettings', SheerUI.Demo.closeModalDialogHandler);\">Region and language options dialog</a>",
          licenseInfoLink = "<a href=\"javascript: void(0)\" onclick=\"javascript:return scForm.speakPostEvent(this,event,'system:showabout', SheerUI.Demo.closeModalDialogHandler);\">License details dialog</a>",
          demoWrap1 = $("div[data-sc-id='Border1'] .content"),
          demoWrap2 = $("div[data-sc-id='Border2'] .content"),
          demoWrap3 = $("div[data-sc-id='Border3'] .content");

        demoWrap1.append(changeWallPaperLink);
        demoWrap2.append(regionInfoLink);
        demoWrap3.append(licenseInfoLink);
        
      },
    };
  }, "DemoApp");
})(Sitecore.Speak, jQuery);