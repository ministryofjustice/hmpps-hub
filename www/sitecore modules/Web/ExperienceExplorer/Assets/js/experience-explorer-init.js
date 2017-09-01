; (function ($, window, document, undefined) {

  $(document).ready(function () {

    $.cookie("sc_expview", "1");
    var pageEditorLink = $('.page-editor-link');

    pageEditorLink.click(function () {
      var url = [location.protocol, '//', location.host, location.pathname, '?sc_mode=edit'].join('');
      window.location = url;
      return false;
    });

    $('.editor .trigger').slideOut('left');
    $('.viewer .trigger').slideOut('right');
  });

})(jQuery, window, document);