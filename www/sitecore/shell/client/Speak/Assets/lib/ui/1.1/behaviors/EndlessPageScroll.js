define(["sitecore"], function (Sitecore) {
  var SCROLL_PADDING = 50,
    enteredHotZone = false,
    docHeight = 0;

  Sitecore.Factories.createBehavior("EndlessPageScroll", {
    setupEventHandlers: _.once(function () {
      $(document).on("scroll", this.scrollHandler.bind(this));
    }),

    beforeRender: function () {
      this.setupEventHandlers();
    },

    scrollHandler: function (e) {
      if (this.model.get("isEndlessScrollEnabled") && this.isScrolledToBottom()) {
        this.invokeMoreData();
      }
    },

    isScrolledToBottom: function () {

      var oldDocHeight = docHeight;
      docHeight = $(document).height();

      //See whether we are inside the hot zone
      if ($(window).scrollTop() + $(window).height() < docHeight - SCROLL_PADDING) {
        enteredHotZone = false;
        return false;
      }

      //See whether we have just entered the hot zone, or if the page has changed height
      if (!enteredHotZone || oldDocHeight !== docHeight) {
        enteredHotZone = true;
        return true;
      }

      return false;
    },

    invokeMoreData: function () {
      var invocation = this.$el.data("sc-scrollmoredata");
      if (invocation) {
        _sc.Helpers.invocation.execute(invocation, { control: this, app: this.app });
      }
    }
  });
});