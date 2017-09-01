define("ListControl/IconListHeightRow", [], function () {
  var setMaxHeight = function (itemsContainer, positions, rows) {
    var modelMaxRows = this.viewModel.maxRows();

    if (modelMaxRows && rows > modelMaxRows) {
      itemsContainer.style.maxHeight = positions[modelMaxRows] + "px";
    }
  };

  var setMinHeight = function (itemsContainer, positions, rows, icons) {
    var modelMinRows = this.viewModel.minRows();

    if (modelMinRows) {
      var modelMaxRows = this.viewModel.maxRows(),
        minRows = modelMaxRows === 0 || modelMinRows <= modelMaxRows ? modelMinRows : modelMaxRows,
        minimumHeight = 0;

      if (positions[minRows]) {
        minimumHeight = positions[minRows];
      } else {
        var lastIndex = positions.length - 1,
          lastPosition = positions[lastIndex],
          lastIcon = icons[lastIndex],
          marginBottom = parseInt(document.defaultView.getComputedStyle(lastIcon).getPropertyValue("margin-bottom")),
          height = lastPosition + lastIcon.offsetHeight + marginBottom,
          averageHeight = (height / rows);

        minimumHeight = averageHeight * minRows;
      }

      itemsContainer.style.minHeight = minimumHeight + "px";
    }
  };

  var setContainerHeight = function (isReady) {
    if (isReady) {
      var itemsContainer = this.el.querySelector(".sc-listcontrol-icons"),
        icons = Array.prototype.slice.call(this.el.querySelectorAll(".sc-listcontrol-icon")),
        rows = 0,
        position,
        positions = [];

      for (var i = 0; i < icons.length; i++) {
        var icon = icons[i],
          iconPosition = icon.offsetTop;

        if (position !== iconPosition) {
          rows++;
          position = iconPosition;
          positions.push(iconPosition);
        }
      }

      setMaxHeight.call(this, itemsContainer, positions, rows);
      setMinHeight.call(this, itemsContainer, positions, rows, icons);
      this.heightChangedCallback();
    }
  };

  var IconListHeight = function (el, viewModel) {
    this.el = el;
    this.viewModel = viewModel;
  };

  IconListHeight.prototype.heightChangedCallback = function() {};

  IconListHeight.prototype.render = function () {
    var images = Array.prototype.slice.call(this.el.querySelectorAll(".sc-listcontrol-icon img")),
      imagesLoaded = 0;

    if (images.length === 0) {
      setContainerHeight.call(this, true);

      return;
    }

    function onDone () {
      imagesLoaded++;
      setContainerHeight.call(this, imagesLoaded === images.length);
    }

    images.forEach(function (image) {
      if (!image.complete) {
        image.addEventListener("load", onDone.bind(this));
        image.addEventListener("error", onDone.bind(this));
      } else {
        onDone.call(this);
      }
    }, this);
  };

  return IconListHeight;
});
