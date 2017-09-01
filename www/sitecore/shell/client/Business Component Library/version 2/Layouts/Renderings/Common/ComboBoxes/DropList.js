(function (speak) {

    speak.component(["bclCollection", "bclSelection"], function (Collection, Selection) {
    return speak.extend({}, Collection.prototype, Selection.prototype, {
      name: "DropList",

      initialized: function () {
        Collection.prototype.initialized.call(this);
        Selection.prototype.initialized.call(this);
      }
    });
  }, "DropList");
})(Sitecore.Speak);