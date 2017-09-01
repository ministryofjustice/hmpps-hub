(function(speak) {
  speak.pageCode([],function() {
    return {
      initialized: function () {
        this.ConfirmationDialog1.on("close", function (data) {
          alert(data + " cliked");
        }, this);
      }
    };
  }, "SubAppRenderer");
})(Sitecore.Speak);