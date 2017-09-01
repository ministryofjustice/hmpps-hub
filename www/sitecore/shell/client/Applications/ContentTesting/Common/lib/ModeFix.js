define([],function(){
  return {
    fixModeCookies: function () {
      // hack: work around SPEAK sc_mode bug
      _.each(document.cookie.split("; "), function (cookie) {
        if (cookie.indexOf("sc_mode=") >= 0 && cookie.indexOf("shell#sc_mode=") < 0) {
          document.cookie = cookie.split("=")[0] + "=;path=/";
        }
      });
    }
  };
});