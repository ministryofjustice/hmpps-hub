define(["sitecore"], function (_sc) {
  _sc.Factories.createBehavior("AccordionRemoveCollapse", {
    initialize: function () {
    },
    beforeRender: function () {
      this.$el.find("td.sc-accordion-header-chevron").remove();
    }
  });
});
