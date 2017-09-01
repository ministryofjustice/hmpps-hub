/// <reference path="../../../../../../assets/lib/dist/sitecore.js" />

define(["sitecore", "jquery"], function (sitecore, $) {
  "use strict";
  var viewSelf,
      pipe = "|",
      closeEventName = "treeListExEditor:close",
      classSelector = ".sc-treeListExEditor";

  var model = sitecore.Definitions.Models.BlockModel.extend({
    initialize: function () {
      this._super();
      this.set("sourceUrl", "");
      this.set("value", "");
      this.set("friendlyValue", "");
    }
  });

  var view = sitecore.Definitions.Views.BlockView.extend({
    initialize: function () {
      viewSelf = this;
      this._super();

      this.model.on("change:sourceUrl", function () {
        this.$el.attr("src", this.model.get("sourceUrl"));
      }, this);

      this.model.on("change:width change:height", function () {
        this.$el.width(this.model.get("width"));
        this.$el.height(this.model.get("height"));
      }, this);

      this.model.set("value", this.$el.data("sc-value") || "");
      this.model.set("sourceUrl", this.$el.data("sc-sourceurl") || "");
    },

    afterRender: function () {
      var iFrame = $(classSelector);
      if (iFrame) {
        iFrame.on("load", this.onIFrameLoad);
      }
    },

    onIFrameLoad: function () {
      var contentDocument = this.contentDocument;
      var okButton = contentDocument.getElementById("OK");
      var cancelButton = contentDocument.getElementById("Cancel");
      var treeListAllSelected = contentDocument.getElementById("TreeList_all_Selected");
      // attach events to OK/Cancel buttons
      okButton.on("click", function () { viewSelf.onIFrameOkClick(contentDocument); });
      cancelButton.on("click", viewSelf.onIFrameCancelClick);
      // select elements within tree
      var value = viewSelf.model.get("value");
      if (typeof value === "undefined" || value === null) {
        return;
      }
      var values = value.split(pipe);
      for (var i = 0; i < values.length; i++) {
        if (values[i] === "") {
          continue;
        }

        var currentValue = values[i].replace(/[-}{]/gm, "");
        treeListAllSelected.value = currentValue;
        this.contentWindow.scForm.postEvent(this, {}, 'TreeList.Add');
      }
    },

    onIFrameOkClick: function (contentDocument) {
      // get right window of the treelistex control
      var treeListSelected = contentDocument.getElementById("TreeList_selected");
      // get selected ids
      var options = treeListSelected.getElementsByTagName("option");
      var value = Array.prototype.map.call(options, function (el) {
        var pipeIndex = el.value.indexOf(pipe);
        return el.value.substring(pipeIndex + 1);
      }).join(pipe);
      var friendlyValue = Array.prototype.map.call(options, function (el) {
        return el.text;
      }).join(pipe);
      // store combined value
      viewSelf.model.set("value", value);
      // store friendly formatted value
      viewSelf.model.set("friendlyValue", friendlyValue);
      // close window
      viewSelf.app.trigger(closeEventName);
    },

    onIFrameCancelClick: function () {
      viewSelf.app.trigger(closeEventName);
    }
  });

  sitecore.Factories.createComponent("TreeListExEditor", model, view, classSelector);
});