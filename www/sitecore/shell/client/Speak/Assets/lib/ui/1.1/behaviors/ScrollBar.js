require.config({
  paths: {
    jqueryMouseWheel: "/sitecore/shell/client/Speak/Assets/lib/ui/1.1/deps/CustomScrollbar/jquery.mousewheel.min",
    scrollPlugin: "/sitecore/shell/client/Speak/Assets/lib/ui/1.1/deps/CustomScrollbar/jquery.mCustomScrollbar"
  },
  shim: {
    'scrollPlugin': { deps: ['jqueryMouseWheel'] },
    'jqueryMouseWheel': { deps: ['jqueryui'] }
  }
});

var sizeUtil = {
  
}

define(["sitecore", "jqueryMouseWheel", "scrollPlugin"], function (_sc) {
  _sc.Factories.createBehavior("Scrollbar", {
    getCssSizeValue: function (value) {
      return value === undefined ? undefined : $("<div>").height(value).css("height");
    }, 
    beforeRender: function () {
      var that = this;

      this.on("didRender", this.update, this);

      // Applies the custom scrollbar after the DialogWindow render, if it is put inside a DialogWindow component
      if (this.$el.parents(".sc-dialogWindow").length) {
        this.$el.parents(".sc-dialogWindow").on("shown.bs.modal", function () {
          that.update();
        });
      }
    },
    update: function () {
      this.$el.mCustomScrollbar("update");
    },
    afterRender: function () {
      this.enableScroll();
    },
    enableScroll: function () {
      var hasScroll = this.$el.find(".totalScrollOffset").length > 0;
      var _this = this;
      
      if (!hasScroll) {
        var insertTheScrollArea = '<div style="height:0px;" class="totalScrollOffset"></div>',
          appendScrollTo = this.model.get("view") == "DetailList" ? this.$el.find(".sc-listcontrol-body") : this.$el;

        appendScrollTo.css({
          position: "relative",
          height: this.getCssSizeValue(this.model.get("height")),
          maxHeight: this.getCssSizeValue(this.model.get("maxHeight")),
          minHeight: this.getCssSizeValue(this.model.get("minHeight"))
        });
        appendScrollTo.append(insertTheScrollArea);
        appendScrollTo.mCustomScrollbar({
          advanced: {
            updateOnContentResize: true
          },
          callbacks: {
            onScroll: function (e) { _this.scrollHandler(e, _this); }
          }
        });
        this.model.get("view") == "DetailList" ? appendScrollTo.find(".mCustomScrollBox").css({ "position": "initial" }) : $.noop();
        if (this.lastScrollTop) {
          appendScrollTo.mCustomScrollbar("scrollTo", this.lastScrollTop, { scrollInertia: 0 });
        }
      }
      if (this.model.get("view") == "DetailList" && this.$el.find("thead tr th.scrollbar-spacer").length == 0) {
        // append new td to add additional space for sync header
        this.$el.find("thead tr").append("<th class='scrollbar-spacer'></th>");
        this.model.trigger("scrollheader:inserted");
      }
    },
    scrollHandler: function (e, _this) {
      var scrollPadding = 50;
      var scrollTop = _this.$el.find(".mCSB_container").position().top;
      if (_this.model.get("isEndlessScrollEnabled")) {
        var scrollHeight = _this.$el.find(".mCustomScrollBox").height();
        var totalScroll = _this.$el.find(".totalScrollOffset").position().top;

        scrollPadding = (totalScroll - scrollHeight - scrollPadding - 20) > 0 ? scrollPadding : 10;

        if (totalScroll + scrollTop - scrollHeight < scrollPadding) {
          
          this.lastScrollTop = -scrollTop;
          var invocation = _this.$el.data("sc-scrollmoredata");
          if (invocation) {
            _sc.Helpers.invocation.execute(invocation, { control: _this, app: _this.app });
          }
        }
      }
      // store scroll position
      this.lastScrollTop = -scrollTop;
    }
  });
});