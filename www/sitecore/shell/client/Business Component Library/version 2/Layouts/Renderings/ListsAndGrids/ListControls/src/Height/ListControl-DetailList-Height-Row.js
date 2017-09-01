define("ListControl/DetailListHeightRow", [], function () {

  var DetailListHeight = function (el, viewModel) {
    this.el = el;
    this.viewModel = viewModel;
  };

  DetailListHeight.prototype.destroy = function () {
    var itemsContainer = this.el.querySelector(".sc-listcontrol-body-wrapper"),
      fillersContainer = this.el.querySelector(".sc-filler-rows tbody");

    itemsContainer.style.height = "auto";
    fillersContainer.innerHTML = "";
  };

  DetailListHeight.prototype.render = function () {
    var itemsContainer = this.el.querySelector(".sc-listcontrol-body-wrapper"),
      fillersContainer = this.el.querySelector(".sc-filler-rows tbody"),
      rows = Array.prototype.slice.call(this.el.querySelectorAll(".sc-listcontrol-item, .sc-nodata-row")),

      numItems = this.viewModel.getNumberOfItems(),
      hasScroll = (this.viewModel.maxRows() && this.viewModel.maxRows() < numItems);

    if (hasScroll) {

      var maxRowHeight = rows.slice(0, this.viewModel.maxRows()).reduce(function(previousValue, row) {
        return previousValue + row.offsetHeight;
      }, 0);
      
      itemsContainer.style.height = maxRowHeight + "px";
      fillersContainer.innerHTML = "";
    } else {
      var numOfFillers = this.viewModel.getNumberOfFillers();
      fillersContainer.innerHTML = new Array(numOfFillers + 1).join("<tr><td></td></tr>\n");
    }

  };

  return DetailListHeight;
});
