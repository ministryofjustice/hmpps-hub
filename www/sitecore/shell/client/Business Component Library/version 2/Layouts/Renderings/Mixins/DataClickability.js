define(['sitecore'], function (Speak) {
  var DataClickability = function () { };
  DataClickability.prototype.constructor = DataClickability;

  DataClickability.prototype.itemClick = function (item) {
    item = item[0] || item; // See Bug #68028

    if (item.IsEnabled === false || item.IsDisabled === true) {
      return;
    }

    var clickInvocation = item.Click;
    if (clickInvocation) {
      Speak.Helpers.invocation.execute(clickInvocation, { app: this.app });
    }
  }

  DataClickability.prototype.itemClickAt = function(index) {
    this.itemClick(this.at(index));
  }

  return DataClickability;
});