require.config({
  paths: {   
    fixedFloatingContainerCSS: "vendors/FixedFloatingContainer/FixedFloatingContainer"
  }
});

define( ["sitecore", "bootstrap", "css!fixedFloatingContainerCSS"], function (_sc) {

  _sc.Factories.createBehavior("fixedFloatingContainer", {
    afterRender: function () {

      var that = this;
      // side bar
      this.$el.affix({
        offset: {
          top: 10,
          bottom: 10
        }
      });

//      this.$el.addClass("sc-fixedFloatingContainer");

//      var top = this.$el.offset().top - parseFloat(this.$el.css("marginTop").replace(/auto/, 0));
//      var elementWidth = this.$el.width();

//      var that = this;
//      $(window).scroll(function (event) {
//        // what the y position of the scroll is
//        var y =  $(event.currentTarget).scrollTop();
//        alert(y);
//        that.$el.width(elementWidth);

//        // whether that's below the form
//        if (y >= top) {
//          // if so, ad the fixed class
//          that.$el.addClass("fixed");
//        } else {
//          // otherwise remove it
//          that.$el.removeClass("fixed");
//        }
//      });
    }
  });
});