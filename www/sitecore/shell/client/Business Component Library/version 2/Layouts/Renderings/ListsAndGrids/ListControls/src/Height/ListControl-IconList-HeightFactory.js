define("ListControl/IconListHeightFactory", ["ListControl/IconListHeightRow", "ListControl/IconListHeightDefault", "ListControl/IconListHeightInherited"], function (HeightRow, HeightDefault, HeightInherited) {

  return {
    create: function (el, viewModel) {
      switch (viewModel.getHeightMode()) {
        case "inherited":
          return new HeightInherited(el);
        case "rowHeight":
          return new HeightRow(el, viewModel);
        default:
          return new HeightDefault();
      }
    }
  };

});