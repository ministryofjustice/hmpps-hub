define(["sitecore"], function (sc) {
  var textProperty = "text";
  var contactIdParameter = "cid";

  return {

    getContactId: function () {
      return getQueryParam(contactIdParameter);
    },

    getQueryParam: function (paramName) {
      var paramValue = sc.Helpers.url.getQueryParameters(window.location.href)[paramName];
      return paramValue || "";
    },

    setText: function (control, text, allowEmpty) {
      if (allowEmpty || text) {
        control.set(textProperty, text);
      }
    },

    getFullName: function (data) {
      if (!data) return "";

      var fullName = data.firstName;
      data.middleName ? fullName += " " + data.middleName : $.noop();
      data.surName ? fullName += " " + data.surName : $.noop();
      return fullName;
    },
    
    setTitle: function (control, title) {
      control.viewModel.$el.attr("title", title);
    },

    getFullTelephone: function (data) {
      if (!data) return "";

      var fullTelephone = "";
      data.countryCode ? fullTelephone += data.countryCode : $.noop();
      data.extension ? fullTelephone += " (" + data.extension + ")" : $.noop();
      fullTelephone += " " + data.number;
      return fullTelephone;
    },

    removeBreadCrumbLastLink: function (breadCrumb) {
      var lastItem = breadCrumb.viewModel.$el.find("ul li:last a"),
          lastItemText = lastItem.text();

      lastItem.replaceWith(lastItemText);
    },
    
    changeUrlToDefault: function (detailList) {
      detailList.viewModel.$el.find("a.url").each(function () {
        $(this).html() == "/" ? $(this).html(document.domain) : $.noop();
      });
    },
    
    removeMailLink: function (listControl) {
      listControl.viewModel.$el.find("a").each(function () {
        $(this).attr("href") == "mailto:" || $(this).attr("href").indexOf('{{') > 0 ?
          $(this).removeAttr("href") : $.noop();
      });
    }
    
  };
  
});