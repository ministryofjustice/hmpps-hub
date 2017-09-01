require.config({
  paths: {
    prototype: "/sitecore/shell/controls/lib/prototype/prototype",
    sheerui: "/sitecore/shell/controls/sitecore",
    sheeruibrowser: "/sitecore/shell/controls/browser"
  },
  shim: {
    "sheerui": { deps: ["prototype", "sheeruibrowser"] }
  }
});

define(["jquery", "sitecore", "sheerui"], function ($, Sitecore) {
  var model = Sitecore.Definitions.Models.ComponentModel.extend({
    initialize: function (options) {
      this._super();
    }
  });

  var view = Sitecore.Definitions.Views.ComponentView.extend({
    initialize: function (options) {
      this._super();
    }
  });

  window.scSitecore.prototype.speakPostEvent = function (tag, evt, parameters, callback) {
    var result;

    evt.preventDefault();

    if (evt.type == "contextmenu") {
      if (evt.ctrlKey) {
        return null;
      }

      this.contextmenu = this.browser.getSrcElement(evt);
    }

    this.lastEvent = evt;

    if (parameters != null && parameters.substring(0, 11) == "javascript:") {
      result = eval(parameters.substr(11).replace(/#quote#|&quot;/gi, "'"));
    } else {
      var ctl = this.getEventControl(evt, tag);

      var request = new scRequest();
      request.evt = evt;
	    request.url = "/sitecore/shell/client/Business Component Library/Layouts/Renderings/Common/SheerUI/SheerUI.aspx?sc_bw=1";

      request.build(tag ? tag.id : "", (ctl != null ? ctl.id : ""), evt.type, parameters, true, this.contextmenu, this.modified);

      request.buildFields();

      request.onCloseModalDialogCallback = callback;

      result = request.execute();
    }

    this.lastEvent = null;

    this.browser.clearEvent(evt, true, result);

    return result;
  };

  window.scSitecore.prototype.broadcast = function (win, request, command) {

    if (command.framecommand == "Insert" && command.framename == "Shell") {
      var element = $(command.value);

      scForm.showModalDialog(element.get(0).src, new Array(window), "center:yes;help:no;resizable:yes;scroll:yes;status:no;dialogWidth:800;dialogHeight:600");
      return;
    }

    if (command.framecommand == "ShowModalDialog" && command.framename == "Shell") {
      scForm.showModalDialog(command.value, new Array(window), "center:yes;help:no;resizable:yes;scroll:yes;status:no;dialogWidth:800;dialogHeight:600");
    }

    return false;
  };

  window.scForm.onLoad();

  Sitecore.Factories.createComponent("SheerUI", model, view, "script[type='text/x-sitecore-sheerui']");
});

