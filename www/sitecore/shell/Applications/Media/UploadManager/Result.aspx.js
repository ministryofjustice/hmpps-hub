/* Sitecore.Result */

Sitecore.Result = new function() {
  Sitecore.Dhtml.attachEvent(window, "onload", function() { Sitecore.Result.load(); });

  this.load = function() {
    if (Prototype.Browser.IE) {

      this.fixFileListSize();
      Event.observe(window, 'resize', this.fixFileListSize);

      $$('#FileList a').each(function (element) {
        Event.observe(element, 'mouseenter', function () {
          var titleElement = Element.select(element, '.scMediaTitle')[0];
          
          // If not IE8
          if (navigator.userAgent.indexOf('Trident/4.0') == -1) {
            titleElement.style['overflow-x'] = 'auto';
          }
          
          if (titleElement.scrollWidth != titleElement.clientWidth) {
            titleElement.style['padding-bottom'] = '20px';
          }
        });

        Event.observe(element, 'mouseleave', function () {
          var titleElement = Element.select(element, '.scMediaTitle')[0];
          titleElement.style['overflow-x'] = '';          
          titleElement.style['padding-bottom'] = '';
        });
      });
    }
  };

  this.fixFileListSize = function() {
    var fileList = $('FileList');
    var h = document.body.offsetHeight;
    if (h > 60 && fileList.h != h - 60) {
      fileList.style.height = fileList.h = (h - 60);
    }
  };

}
