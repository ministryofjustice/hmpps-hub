define("ListControl/IconListHeightInherited", [], function () {

  var IconListHeight = function (el) {
    this.el = el;
  };

  IconListHeight.prototype.destroy = function() {
    var itemsContainer = this.el.querySelector(".sc-listcontrol-icons");

    itemsContainer.style.height = "auto";
  };

  IconListHeight.prototype.render = function () {

    this.destroy();

    //DOM elements
    var parent = this.el.parentElement,
      itemsContainer = this.el.querySelector(".sc-listcontrol-icons"),
      paddingTop = parseFloat(window.getComputedStyle(parent, null).getPropertyValue("padding-top")),
      paddingBottom = parseFloat(window.getComputedStyle(parent, null).getPropertyValue("padding-bottom"));

    itemsContainer.style.height = (parent.clientHeight - paddingTop - paddingBottom) + "px";
  };

  return IconListHeight;
});