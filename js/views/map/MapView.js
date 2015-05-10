/**
 * Created by jeanella on 5/6/2015.
 */

define([
    'marionette',
    'underscore',
    'jquery',
    'templates',
    'utility',
    'weatherUtility',
    'views/map/MapPointView',
    'models/map/MapPoint',
    'collections/MapPointCollection',
    'async!https://maps.googleapis.com/maps/api/js?v=3&sensor=false&libraries=places'
], function (Marionette, _, $, templates, utility, WeatherUtility, MapPointView, MapPoint, MapPointCollection) {
    'use strict';

    // load google.maps
    return Marionette.ItemView.extend({
        template: templates.map,

        initialize: function(options) {
            var self = this;

            self.defaultCenter = options.defaultCenter;
            self.defaultCenterPosition = new google.maps.LatLng(self.defaultCenter.latitude, self.defaultCenter.longitude);
            self.cityCollection = options.collection;
            self.mapPointCollection = new MapPointCollection([]);

            // Timer for refreshing local time by minute
            self.timer = setInterval(function(){
                self.refreshWeatherData();
            }, 60000);
        },

        /**
         * Initialize Google Maps, Google Places, and Google Places Autocomplete search
         */
        initializeMap: function () {
            var self = this;

            var mapOptions = {
                center: self.defaultCenterPosition,
                zoom: 6,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };

            // Initialize Google Maps and Google Places
            self.map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
            self.places = new google.maps.places.PlacesService(self.map);

            // Initialize Google Places autocomplete search input
            self.autocomplete = new google.maps.places.Autocomplete(
                (document.getElementById('search-autocomplete')),

                // search only at the city level
                { types: ['(cities)'] }
            );

            // Tweak for manually refreshing map
            google.maps.event.addListener(self.map, 'idle', function () {
                google.maps.event.trigger(self.map, 'resize');
            });

            google.maps.event.addListener(self.autocomplete, 'place_changed', function () {
                var city = self.onPlaceChanged();
                self.addCity(city);
            });

            self.setDefaultLocationOnMap();
        },

        /**
         * Pan map to Default location
         */
        setDefaultLocationOnMap: function () {
            var self = this;

            var marker = new google.maps.Marker({
                position: self.defaultCenterPosition,
                title: self.defaultCenter.title
            });

            self.addCity(marker);
            self.addMapPoint(marker);

        },

        /**
         * Event handlers
         */
        onPlaceChanged: function () {
            var self = this;
            var place = self.autocomplete.getPlace();

            if(place.geometry){
                var newMarker = new google.maps.Marker({
                    title: place.name,
                    position: place.geometry.location
                });

                self.addMapPoint(newMarker);
                return newMarker;
            }
        },

        /**
         * Add City instance from Google Maps to CityCollection
         * @param city
         */
        addCity: function (city) {
            var self = this;

            var newCity = {
                title: city.title,
                latitude: city.position.k,
                longitude: city.position.D
            };

            self.cityCollection.add(newCity);
        },

        /**
         * Add MapPoint instance to Map and cache to MapPointCollection
         * @param mapPoint
         */
        addMapPoint: function (marker) {
            var self = this;

            //self.map.panTo(marker);
            var mapPoint = new MapPoint(marker);
            var mapPointView = new MapPointView({map: self.map, model: mapPoint, marker: marker});
            self.mapPointCollection.add(mapPoint);
        },

        /**
         * Refresh data of all MapPoints
         */
        refreshWeatherData: function () {
            var self = this;

            _.each(self.mapPointCollection.models, function(mapPoint) {
                mapPoint.renderMapPointInfoWindowContent();
            });
        },

        onShow: function () {
            var self = this;

            // Setup elements after bootstrapping of MapView
            self.initializeMap();
        }
    });
});