"use strict";

var hideSidebar = function () {
  var $content = $("#help-content");
  var $sidebar = $("#help-sidebar");

  $content
    .removeClass("col-md-9")
    .removeClass("col-xs-9")
    .addClass("col-md-12")
    .addClass("col-xs-12");
  $sidebar.hide();
};

var showSidebar = function () {
  var $content = $("#help-content");
  var $sidebar = $("#help-sidebar");

  $content
    .removeClass("col-md-12")
    .removeClass("col-xs-12")
    .addClass("col-md-9")
    .addClass("col-xs-9");
  $sidebar.show();
};

!function ($) {
  $(function () {
    var $window = $(window);
    var $body   = $(document.body);

    $body.scrollspy({
      target: ".bs-docs-sidebar"
    });

    $window.on("load", function () {
      // build sidenav
      var $sidenav = $("ul.nav.bs-docs-sidenav");
      var $headers = $(".bs-docs-section h1,h2,h3");

      var $currentHeader, $currentSubheaders;
      $headers.each(function (header) {
        if (!this.id) {
          this.id = Math.floor(Math.random() * 10000000);
        }
        if(this.tagName.toUpperCase() === "H1" || this.tagName.toUpperCase() === "H2") {
          var cssClass = !$currentHeader ? "active" : "";
          $currentHeader = $("<li " + "class=" + cssClass + "><a href=#" + this.id + ">" + this.innerText + "</a></li>");
          $currentSubheaders = null;
          $sidenav.append($currentHeader);
        }
        else if(this.tagName.toUpperCase() === "H3" && $currentHeader) {
          if (!$currentSubheaders) {
            $currentSubheaders = $("<ul class=nav></ul>");
            $currentHeader.append($currentSubheaders);
          }
          $currentSubheaders.append("<li><a href=#" + this.id + ">" + this.innerText + "</a></li>");
        }
      });

      $("#help-toggle").click(function (event) {
        event.stopPropagation();

        var $sidebar = $("#help-sidebar");

        if ($sidebar.is(":visible")) {
          hideSidebar();
        }
        else {
          showSidebar();
        }

        $body.scrollspy("refresh");

        window.scrollTo(0, window.scrollY + 5);

        return false;
      });

      $body.scrollspy("refresh");

      if (!window.location.hash || window.location.hash === "#") {
        showSidebar();
      }
    });

    setTimeout(function () {
      $(".bs-docs-sidebar").affix("checkPosition");
    }, 100);

  });

}(jQuery);