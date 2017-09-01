/// <reference path="../../../../../../assets/lib/dist/sitecore.js" />


define(["sitecore"], function (_sc) {
  var ListPage = _sc.Definitions.App.extend({
    initialized: function () {            
    },

    okClicked: function () {     
      this.closeDialog();
    },

    close: function () {
      this.closeDialog(null);
    }
  });

  return ListPage;
});