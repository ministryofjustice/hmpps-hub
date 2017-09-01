define("ListControl/DetailListHeightInherited", [], function () {

  var DetailListHeight = function (el) {
    this.el = el;
  };

  DetailListHeight.prototype.destroy = function() {
    var itemsContainer = this.el.querySelector(".sc-listcontrol-body-wrapper"),
      fillersContainer = this.el.querySelector(".sc-filler-rows tbody");

    itemsContainer.classList.remove("sc-hide-scrollbar");
    itemsContainer.style.height = "auto";
    fillersContainer.innerHTML = "";
  };

  DetailListHeight.prototype.render = function () {

    this.destroy();

    //DOM elements
    var parent = this.el.parentElement,
      listContent = this.el.querySelector(".sc-listcontrol-content"),
      itemsContainer = this.el.querySelector(".sc-listcontrol-body-wrapper"),
      fillersContainer = this.el.querySelector(".sc-filler-rows tbody"),
      headerContainer = this.el.querySelector(".sc-listcontrol-header-wrapper"),
      paddingTop = parseFloat(window.getComputedStyle(parent, null).getPropertyValue("padding-top")),
      paddingBottom = parseFloat(window.getComputedStyle(parent, null).getPropertyValue("padding-bottom")),

      //Values
      fillerHeight = 40,
      fillerSpace = parent.offsetHeight - listContent.offsetHeight,
      numOfFillers = Math.ceil(fillerSpace / fillerHeight);

    fillersContainer.innerHTML = (numOfFillers > 0) ? new Array(numOfFillers + 1).join("<tr><td></td></tr>\n") : "";

    itemsContainer.style.height = (parent.clientHeight - paddingTop - paddingBottom - headerContainer.offsetHeight) + "px";
    itemsContainer.classList.toggle("sc-hide-scrollbar", numOfFillers > 0);
    
  };

  return DetailListHeight;
});