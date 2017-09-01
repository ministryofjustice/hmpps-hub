/*
Also modify init.js file in Sitecore.Buckets.Client.Spec project if necessary
*/

require.config({
  paths: {
    jquery: '../libs/jquery/jquery-1.10.2',
    'jquery-noconflict': 'jquery.noconflict',
    'jquery-ui': '../libs/jquery-ui/js/jquery-ui-1.10.3.custom',
    'knockout-jqueryui': '../libs/knockout-jqueryui/knockout-jqueryui',
    'jquery-ui-culture': '../libs/jquery-ui/js/jquery-ui-culture',
    knockout: '../libs/knockout/knockout-3.0.0.debug',
  },
  shim: {
    'jquery-ui': { deps: ['jquery'], exports: 'jQuery' },
    'jquery-ui-culture': ['jquery-ui'],
  },
  preserveLicenseComments: false
});

require(
  ['searchBox/searchBoxViewModel', 'knockout', 'customBindings', 'knockout-jqueryui', 'jquery-ui-culture', 'jquery-noconflict'],
  function(searchBoxViewModel, ko) {
    $j(function () {
      window.SC = window.SC || {};
      SC.searchBoxViewModel = new searchBoxViewModel();
      ko.applyBindings(SC.searchBoxViewModel);

      SC.libsAreLoaded = true;
    });
  });