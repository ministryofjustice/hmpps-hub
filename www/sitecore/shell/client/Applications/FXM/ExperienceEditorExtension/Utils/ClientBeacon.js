define([], function () {

  var getBeacon = function () {
    return window.top.SCBeacon;
  }

  var getData = function (dataAttr) {
    return jQuery.makeArray(jQuery('[' + dataAttr + ']', window.top.document)
        .map(function (i, el) {
          return el.attributes[dataAttr].value;
        })
    );
  }

  return {
    bindReady: function (func) {
      getBeacon().push(['ready', func]);
    },
    bindError: function (func) {
      getBeacon().push(['error', func]);
    },
    clientActions: function () {
      return getData('data-sc-beaconaction');
    },
    fragments: function () {
      return getData('data-sc-beaconfragment');
    },
    placeholders: function () {
      return getData('data-sc-beaconcontent');
    },
    domainItem: function () {
      return getData('data-sc-beacondomain')[0];
    },
    matchers: function () {
      return getData('data-sc-beaconitem');
    },
    language: function () {
      var data = getData('data-sc-beaconlanguage')[0];
      if (data) {
        return JSON.parse(data);
      }
      return null;
    },
    allContent: function () {
      return [].concat(this.clientActions(),
          this.fragments(),
          this.placeholders()
      );
    },
    allMatchers: function () {
      return [].concat(this.domainItem(), this.matchers());
    }
  }
});