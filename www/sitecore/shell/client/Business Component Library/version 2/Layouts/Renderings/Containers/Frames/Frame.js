(function(speak) {
  speak.component([],function() {
    var oldSourceUrl = "";

    function updateSrc() {
      this.el.setAttribute("src", this.SourceUrl);
    }

    return {
      
      initialized: function () {

        if (this.IsDeferred) {
          oldSourceUrl = this.SourceUrl;
          this.SourceUrl = "";
        }

        this.on("change:SourceUrl", updateSrc, this);

      },
      afterRender: function() {
        if (this.IsDeferred) {
          this.SourceUrl = oldSourceUrl;
        }
      }
    };

  }, "Frame");

})(Sitecore.Speak);