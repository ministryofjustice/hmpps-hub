(function(speak) {
  speak.pageCode([],function() {
    return {
      initialized: function() {
        this.EntityDataSourceBook.on("change:Entity", function() {
          var book = this.EntityDataSourceBook.Entity;
          this.AuthorText.Text = book.Author;
          this.TitleText.Text = book.Title;
        }, this);

        this.EntityDataSourceBook.refresh();
      }
    };
  }, "SubAppRenderer");
})(Sitecore.Speak);