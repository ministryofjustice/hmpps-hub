define("ListControl/TileListHeightRow", [], function () {
  var setMaxHeight = function (itemsContainer, positions, rows) {
    var modelMaxRows = this.viewModel.maxRows();

    if (modelMaxRows && rows > modelMaxRows) {
      itemsContainer.style.maxHeight = positions[modelMaxRows] + "px";
    }
  };

  var setMinHeight = function (itemsContainer, positions, rows, tiles) {
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
          lastTile = tiles[lastIndex],
          marginBottom = parseInt(document.defaultView.getComputedStyle(lastTile).getPropertyValue("margin-bottom")),
          height = lastPosition + lastTile.offsetHeight + marginBottom,
          averageHeight = (height / rows);

        minimumHeight = averageHeight * minRows;
      }

      itemsContainer.style.minHeight = minimumHeight + "px";
    }
  };

  var setContainerHeight = function (isReady) {
    if (isReady) {
      var itemsContainer = this.el.querySelector(".sc-listcontrol-tiles"),
        tiles = Array.prototype.slice.call(this.el.querySelectorAll(".sc-listcontrol-tile")),
        rows = 0,
        position,
        positions = [];

      for (var i = 0; i < tiles.length; i++) {
        var tile = tiles[i],
          tilePosition = tile.offsetTop;

        if (position !== tilePosition) {
          rows++;
          position = tilePosition;
          positions.push(tilePosition);
        }
      }

      setMaxHeight.call(this, itemsContainer, positions, rows);
      setMinHeight.call(this, itemsContainer, positions, rows, tiles);
      this.heightChangedCallback();
    }
  };

  var TileListHeight = function (el, viewModel) {
    this.el = el;
    this.viewModel = viewModel;
  };

  TileListHeight.prototype.heightChangedCallback = function() {};

  TileListHeight.prototype.render = function () {
    var images = Array.prototype.slice.call(this.el.querySelectorAll(".sc-listcontrol-tile img")),
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

  return TileListHeight;
});
