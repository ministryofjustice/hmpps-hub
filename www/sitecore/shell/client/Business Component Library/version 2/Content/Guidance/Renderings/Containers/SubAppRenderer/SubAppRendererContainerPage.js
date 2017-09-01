(function (speak) {
  speak.pageCode([], function () {
    return {
      initialized: function () {
         this.SubAppRenderer1.Text3.Text = "This text is added at client side by the JavaScript file defined in the SubAppRendererPage.PageCode.PageCodeScriptFileName.";
      }
    };
});
}(Sitecore.Speak));