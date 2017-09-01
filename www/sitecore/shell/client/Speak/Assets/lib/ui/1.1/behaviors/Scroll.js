_sc.Factories.createBehavior("scroll", {
    initialize: function () {
      this.prevScrollY = 0;
      this.setup($(window));
      this.on("scroll", this.scroll, this);
    },
    scroll: function () {
      this.collection.add({ id: this.id, status: "Open", payment: "not paid", firstname: "New", lastname: "Added", date: "10/19/2012", currency: "USD", aciont: "action" });
    },
    setup: function ($target) {
      $target.on("scroll", { view: this }, this.watchScroll);
    },
    afterRender: function () {
      if (this.$el.height() < $(window).height()) {
        this.$el.find(".sc-table-footer tfoot tr td").append("<button class='more btn'>more</button>");
      }
      var view = this;
      this.$el.find(".sc-table-footer tfoot .more").click(function () {
        view.trigger("scroll");
      });
    },
    watchScroll: function (e) {
      var $target = $(window),
          scrollY = $target.scrollTop() + $target.height(),
          docHeight = $target.get(0).scrollHeight;

      if (!docHeight) {
        docHeight = $(document).height();
      }

      if (scrollY >= docHeight - 100 && e.data.view.prevScrollY <= scrollY) {
        e.data.view.trigger("scroll");
      }
      e.data.view.prevScrollY = scrollY;
    }
  });
