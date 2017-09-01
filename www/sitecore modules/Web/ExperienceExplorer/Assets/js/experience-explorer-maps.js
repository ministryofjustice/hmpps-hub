; (function ($, window, document, undefined) {

    /**************** PLUGIN OPTIONS AND DATA ***********************/

    var pluginName = 'MapProvider',
        defaults = {
            provider: null,
            key: null,
            latitude: null,
            longitude: null,
            latitudeVal: 8,
            longitudeVal: 8,
            draggable: false
        },
        system = {
            latitudeReg: /^-?(?:90(?:(?:\.0{1,6})?)|(?:[0-9]|[1-8][0-9])(?:(?:\.[0-9]{1,6})?))$/i,
            longitudeReg: /^-?(?:180(?:(?:\.0{1,6})?)|(?:[0-9]|[1-9][0-9]|1[1-7][0-9])(?:(?:\.[0-9]{1,6})?))$/i
        };

    /**************** COMMON PLUGIN METHODS **********************/

    Plugin.prototype.init = function () {
        var self = this;

        self.SetOptions();

        switch (self.options.provider) {
            case "Google": self.RenderGoogleMaps(); break;
            case "Bing": self.RenderBingMaps(); break;
            default: return;
        }
    };

    Plugin.prototype.RenderBingMaps = function () {
        var self = this;

        // init bing map
        var map = new Microsoft.Maps.Map(self.element, {
            credentials: self.options.key,
            enableSearchLogo: false,
            showDashboard: false,
            showScalebar: false,
            center: new Microsoft.Maps.Location(self.options.latitudeVal, self.options.longitudeVal),
            mapTypeId: Microsoft.Maps.MapTypeId.road,
            zoom: 10
        });

        map.entities.clear();

        // init maker
        var markerOptions = { draggable: self.options.draggable };
        var marker = new Microsoft.Maps.Pushpin(map.getCenter(), markerOptions);

        map.entities.push(marker);
        marker.setLocation(new Microsoft.Maps.Location(self.options.latitudeVal, self.options.longitudeVal));

        // dragging
        if (self.options.draggable) {

            // move marker on click
            Microsoft.Maps.Events.addHandler(map, 'mousedown', function (e) {
                window.positionDown = new Microsoft.Maps.Point(e.getX(), e.getY());
            });

            Microsoft.Maps.Events.addHandler(map, 'mouseup', function (e) {
                var positionUp = new Microsoft.Maps.Point(e.getX(), e.getY());

                if (window.positionDown.x == positionUp.x && window.positionDown.y == positionUp.y) {
                    var position = new Microsoft.Maps.Point(e.getX(), e.getY());
                    var location = e.target.tryPixelToLocation(position);
                    marker.setLocation(location);

                    self.options.latitude.val(location.latitude);
                    self.options.longitude.val(location.longitude);
                }
            });

            // move marker on click  
            Microsoft.Maps.Events.addHandler(marker, 'drag', function () {
                var location = marker.getLocation();
                marker.setLocation(location);

                self.options.latitude.val(location.latitude);
                self.options.longitude.val(location.longitude);

            });
        }

        // on keyup event
        self.options.latitude.keyup(function () {

            var latitudeVal = self.options.latitude.val();
            var longitudeVal = self.options.longitude.val();

            if (self.system.latitudeReg.test(latitudeVal)) {
                marker.setLocation(new Microsoft.Maps.Location(latitudeVal, longitudeVal));
                map.setView({ center: new Microsoft.Maps.Location(latitudeVal, longitudeVal) });
            }
        });

        self.options.longitude.keyup(function () {

            var latitudeVal = self.options.latitude.val();
            var longitudeVal = self.options.longitude.val();

            if (self.system.longitudeReg.test(longitudeVal)) {
                marker.setLocation(new Microsoft.Maps.Location(latitudeVal, longitudeVal));
                map.setView({ center: new Microsoft.Maps.Location(latitudeVal, longitudeVal) });
            }
        });

    };

    Plugin.prototype.RenderGoogleMaps = function () {
        var self = this;

        // init google map
        latLng = new window.google.maps.LatLng(self.options.latitudeVal, self.options.longitudeVal);

        var mapOptions = {
            zoom: 10,
            center: latLng,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        
        map = new google.maps.Map(self.element, mapOptions);
        
        // init maker
        marker = new google.maps.Marker({
            position: latLng,
            map: map,
            draggable: self.options.draggable
        });

        // dragging
        if (self.options.draggable) {

            google.maps.event.addListener(map, 'click', function (e) {
                marker.setPosition(e.latLng);

                self.options.latitude.val(e.latLng.lat().toFixed(6));
                self.options.longitude.val(e.latLng.lng().toFixed(6));
            });

            google.maps.event.addListener(window.marker, 'drag', function () {
                self.options.latitude.val(marker.position.lat().toFixed(6));
                self.options.longitude.val(marker.position.lng().toFixed(6));
            });
        }

        // on keyup event
        self.options.latitude.keyup(function () {

            var latitudeVal = self.options.latitude.val();
            var longitudeVal = self.options.longitude.val();

            if (self.system.latitudeReg.test(latitudeVal)) {
                var latLng = new window.google.maps.LatLng(latitudeVal, longitudeVal);
                window.marker.setPosition(latLng);
                map.setCenter(latLng);
            }
        });

        self.options.longitude.keyup(function () {

            var latitudeVal = self.options.latitude.val();
            var longitudeVal = self.options.longitude.val();

            if (self.system.longitudeReg.test(longitudeVal)) {
                var latLng = new window.google.maps.LatLng(latitudeVal, longitudeVal);
                window.marker.setPosition(latLng);
                map.setCenter(latLng);
            }
        });
    };

    Plugin.prototype.SetOptions = function () {
        var self = this;

        self.options.provider = $(self.element).data("name");
        self.options.draggable = $(self.element).data("draggable");
        self.options.key = $(self.element).data("api-key");
        self.options.latitudeVal = self.options.latitude.val();
        self.options.longitudeVal = self.options.longitude.val();
    };

    /****************** PLUGIN UTILS ***********************/

    function Plugin(element, options) {
        this.element = element;
        this.options = $.extend({}, defaults, options);
        this.system = system;
        this._defaults = defaults;
        this._name = pluginName;
        this.init();
    }

    $.fn[pluginName] = function (options) {
        return this.each(function () {
            if (!$.data(this, 'plugin_' + pluginName)) {
                $.data(this, 'plugin_' + pluginName,
                    new Plugin(this, options));
            }
        });
    };

})(jQuery, window, document);