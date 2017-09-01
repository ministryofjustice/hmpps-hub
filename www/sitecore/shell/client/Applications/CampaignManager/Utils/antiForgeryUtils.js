define(['jquery', 'sitecore', '/-/speak/v1/client/entityservice.js'], function (jQuery, sitecore, EntityService) {
  "use strict";
  return {
    getSettings: function () {
      var csrtToken = sitecore.Helpers.antiForgery.getAntiForgeryToken();
      var settings = {};

      settings.headers = {};
      settings.headers[csrtToken.headerKey] = csrtToken.value;

      return settings;
    },
    getDecoratorFor: function (obj) {
      var self = this;

      var result = jQuery.extend({}, obj, {
        request: function(options) {
          jQuery.extend(options, self.getSettings());

          options.method = "POST";

          jQuery.ajax(options);
        },
      });

      if (typeof obj.execute !== 'undefined') {
        jQuery.extend(result, {
          getEntityServiceInstance: function(options) {
            return new EntityService(options);
          },
          refresh: function () {
            this.Service = this.getEntityServiceInstance(jQuery.extend({ url: this.get('serviceURL') }, self.getSettings()));
            this.Service.headers['X-Requested-With'] = 'XMLHttpRequest';

            this.query = this.Service.fetchEntity(this.get('entityID'));

            if (!this.IsDeferred) {
              this.execute();
            }
          }
        });

        result.off('change:entityID', obj.refresh);
        result.on('change:entityID', result.refresh, result);
      }

      return result;
    }
  };
});