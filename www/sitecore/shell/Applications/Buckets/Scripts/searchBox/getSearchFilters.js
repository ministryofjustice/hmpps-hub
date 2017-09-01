
define(['searchBox/clientSideHooks', 'searchBox/controlTypes', 'knockout', 'jquery'], function(clientSideHooks, controlTypes, ko, $) {
  return function() {
    var rawSearchFilters = $.ajax({
      type: 'POST',
      url: '/sitecore/shell/Applications/Buckets/ItemBucket.asmx/GetAllSearchFilters',
      data: '',
      async: false,
      contentType: 'application/json; charset=utf-8',
      dataType: 'json'
    }).responseJSON.d;

    var searchFilters = rawSearchFilters.map(function(filter) {
      var controlType = ko.utils.arrayFirst(controlTypes, function(x) { return x.name == filter.ControlType.toLowerCase(); });
      var clientSideHook = ko.utils.arrayFirst(clientSideHooks, function(x) { return x.name == filter.ClientSideHook.toLowerCase(); });

      return {
        name: filter.DisplayName,
        iconPath: filter.IconPath,
        webMethod: filter.WebMethod,
        controlType: controlType,
        clientSideHook: clientSideHook
      };
    });

    return searchFilters;
  };
});