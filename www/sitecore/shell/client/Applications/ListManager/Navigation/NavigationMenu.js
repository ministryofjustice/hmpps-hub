define(["sitecore", "css!/-/speak/v1/listmanager/navigationmenu.css"], function (_sc) {
  var App = _sc.Definitions.App.extend({
    initialized: function () {
      this.addClickToBorder(this.ImportNewContactsBorder);
      this.addClickToBorder(this.CreateListsBorder);
      this.CreateListFromFileHyperlinkButton.on("click", this.closePopover, this);
      this.ContactListFromExistingListHyperlinkButton.on("click", this.closePopover, this);
      this.AddContactsToDatabaseHyperlinkButton.on("click", this.closePopover, this);
      this.SegmentedListFromExistingListHyperlinkButton.on("click", this.closePopover, this);
    },
    closePopover: function() {
      this.CreateButton.viewModel.$el.click();
    },
    addClickToBorder: function(border) {
      border.viewModel.$el.find("> div").css('cursor', 'pointer').on("click", function () {
        $(this).find(".sc-hyperlinkbutton")[0].click();
      });
      border.viewModel.$el.find(".sc-hyperlinkbutton").on("click", function (event) {
        event.stopPropagation();
      });
    }
  });
  return App;
});