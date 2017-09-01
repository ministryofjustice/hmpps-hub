define(["sitecore"], function (Sitecore) {
  var SelectMediaDialog = Sitecore.Definitions.App.extend({
    initialized: function () {
      var border = $("div[data-sc-id='InfoBorder']");                  
      var heightToScroll = $(".sc-dialogContent-title").height() + 
                           $(".sc-dialogContent-toolbar").height() + 
                           parseInt($("div[data-sc-id='InfoBorderBox']").css("padding-top"),10);
      var top = parseInt(border.css('top'), 10);

      $(window).scroll(function() {
        var scrollTop = $(window).scrollTop();
        scrollTop = (scrollTop >= heightToScroll) ? heightToScroll : scrollTop;

        if(scrollTop <= heightToScroll){
          border.css('top', top - scrollTop);
        }
      });
    }
  });

  return SelectMediaDialog;
});