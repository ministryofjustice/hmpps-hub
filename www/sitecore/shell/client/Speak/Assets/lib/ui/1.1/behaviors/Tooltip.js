_sc.behavior("toolTipOnCroppedText", {
    afterRender: function () {
      this.$el.find("th").on("mouseover", this.showTootlip);
      var view = this;
      this.$el.find("td").on("mouseover", view.showTootlip);
    },
    showTootlip: function (evt) {
      var $target = $(evt.currentTarget);
      //if it is sorted cell, we show the inner of the a element
      if ($target.attr("data-sc-sort") !== undefined) {
        $target = $target.find("a");
      }
      if ($target[0].offsetWidth < $target[0].scrollWidth && !$target.attr('title')) {
        $target.attr('title', $target.text());
      }
    }
});