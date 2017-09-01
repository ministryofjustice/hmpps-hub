define("ListControl/TileListHeightInherited", [], function () {

  var TileListHeight = function (el) {
    this.el = el;
  };

  TileListHeight.prototype.destroy = function() {
    var itemsContainer = this.el.querySelector(".sc-listcontrol-tiles");

    itemsContainer.style.height = "auto";
  };

  TileListHeight.prototype.render = function () {

    this.destroy();

    //DOM elements
    var parent = this.el.parentElement,
      itemsContainer = this.el.querySelector(".sc-listcontrol-tiles"),
      paddingTop = parseFloat(window.getComputedStyle(parent, null).getPropertyValue("padding-top")),
      paddingBottom = parseFloat(window.getComputedStyle(parent, null).getPropertyValue("padding-bottom"));

    itemsContainer.style.height = (parent.clientHeight - paddingTop - paddingBottom) + "px";
  };

  return TileListHeight;
});