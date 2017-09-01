require.config({
  baseUrl: '/sitecore/shell/client/Applications/ContentTesting/Common/lib'
});

define(["DataUtil"], function (dataUtil) {
  var target = window;
  if (target.parent)
  {
    var parent = target.parent;
    while (target.location.href != parent.location.href)
    {
      target = parent;
      parent = target.parent;
    }
  }

  return {
    xOppAppPath: "/sitecore/client/Applications/ContentTesting/ExperienceOptimization",

    openExperienceEditor: function (uri, device) {
      var url = "/?sc_mode=edit";
      var parsedUri = new dataUtil.DataUri(uri);

      url = _sc.Helpers.url.addQueryParameters(url, {
        sc_itemid: parsedUri.id,
        sc_lang: parsedUri.lang,
        sc_version: parsedUri.ver,
        sc_device: device
      });
	  this.setExperienceEditorDeviceCookie(target, device);
      target.location.href = url;
    },
	
	setExperienceEditorDeviceCookie: function(wnd, deviceId)
	{
		var cookie = wnd.document.cookie;
		var newValue = "experienceeditor_deviceId="+deviceId+";";
		var startindex = cookie.indexOf("experienceeditor_deviceId");
		if (startindex > 0)
		{
			wnd.document.cookie = newValue;
		}
	}, 
	
    openPageTestPage: function (uri, showReport, load) {
      if (!showReport) {
        showReport = false;
      }

      if (!load) {
        load = false;
      }

      if (!(uri instanceof dataUtil.DataUri)) {
        uri = new dataUtil.DataUri(uri);
      }

      var url = this.xOppAppPath + "/Dashboard/PageTest";

      url = _sc.Helpers.url.addQueryParameters(url, {
        hostUri: uri.toString(),
        report: showReport,
        load: load
      });
      target.location.href = url;
    }
  };
});