/*- FixedTable Behavior - */
_sc.behavior("fixedTable", {
    afterRender: function () {
      var wrap = '<div class="headerFixed"><div class="tableHeader"><table class="table sc-table-footer"><thead>{0}</thead></table></div><div class="tableContent">{1}</div></div>';
      var html = this.$el.html();
      var header = this.$el.find("thead").html();
      wrap = wrap.replace("{0}", header);
      wrap = wrap.replace("{1}", html);
      this.$el.html(wrap);
      this.$el.find(".tableContent").mCustomScrollbar();
    }
  });