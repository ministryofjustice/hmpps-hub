_sc.behavior("resizable", {
    afterRender: function () {
      this.$el.find("table").colResizable({
        liveDrag: true
      });
    }
});
