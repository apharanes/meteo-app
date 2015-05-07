/**
 * Created by jeanella on 5/6/2015.
 */

define([
    'marionette',
    'underscore',
    'jquery',
    'templates',
    'utility',
    'views/map/MapPointView',
    'collections/MapPointCollection',
    'async!https://maps.googleapis.com/maps/api/js?v=3&key=AIzaSyDTqFR5xcTYxrD4vLWIwfaiqQMAXMWfzXQ&sensor=false&libraries=places'
    //'async!https://maps.googleapis.com/maps/api/js?v=3&sensor=false'
], function (Marionette, _, $, templates, utility, MapPointView, MapPointCollection) {
    'use strict';

    var places, autocomplete, infowindow;


    // load google.maps
    return Marionette.ItemView.extend({
        template: templates.map,

        initialize: function(options) {
            var self = this;

            self.defaultCenterLocation = new google.maps.LatLng(options.defaultCenter.latitude, options.defaultCenter.longitude);
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
                center: self.defaultCenterLocation,
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
        },

        /**
         * Pan map to Default location
         */
        setDefaultLocationOnMap: function () {
            var self = this;

            var marker = new google.maps.Marker({
                position: self.defaultCenterLocation,
                title: 'Default City'
            });
            self.addCity(marker);
            marker.setMap(self.map);
        },

        /**
         * Rerender Cities on map
         */
        setCitiesOnMap: function () {
            var self = this;

            var mapPoints = [];
            _.each(self.cityCollection.models, function(city) {
                mapPoints.push(new MapPointView({map: self.map, model: city.attributes}));
            });
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

                newMarker.setMap(self.map);
                self.map.panTo(place.geometry.location);

                return newMarker;
            }
        },

        /**
         * Add City instance to CityCollection and fetch weather data from weather API
         * @param city
         */
        addCity: function (city) {
            var self = this;

            self.cityCollection.add({ title: city.title, latitude: city.position.k, longitude: city.position.D});

            // Uses Forecast.IO API
            $.ajax({
                url: 'https://api.forecast.io/forecast/223ac36a3da5993f7f14cbf3e35a399a/'+city.position.k+','+city.position.D,
                dataType: 'jsonp',
                success: function (result) {

                    // Fetch only latest weather data for city
                    var latestWeatherInfo = self.parseWeatherResults(result);

                    var newMapPoint = {
                        title: city.title,
                        latitude: city.position.k,
                        longitude: city.position.D,
                        weatherInfo: latestWeatherInfo,
                        timezone: result.timezone,
                        infoWindow: new google.maps.InfoWindow({
                            content: ''
                        })
                    };

                    self.addMapPoint(newMapPoint, city);
                }
            });
        },

        /**
         * Add MapPoint instance to Map and cache to MapPointCollection
         * @param mapPoint
         */
        addMapPoint: function (mapPoint, city) {
            var self = this;

            self.renderMapPointInfoWindowContent(mapPoint);
            self.mapPointCollection.add(mapPoint);
            mapPoint.infoWindow.open(self.map, city);
        },

        /**
         * Custom parser for weather data fetched from the API
         * @param result
         * @returns {Object} weatherInfo field of MapPoint model
         */
        parseWeatherResults: function (result) {
            return {
                time: result.currently.time,
                temp: result.currently.temperature,
                pressure: result.currently.pressure,
                summary: result.currently.summary,
                icon: result.currently.icon
            }
        },

        /**
         * Render content for InfoWindow of a specific city on the map
         *
         * @param mapPoint
         */
        renderMapPointInfoWindowContent: function (mapPoint) {
            var content = mapPoint.title +' '+ mapPoint.weatherInfo.summary +' '+ mapPoint.weatherInfo.icon + ' ' + mapPoint.weatherInfo.temp + ' ' +
                utility.convertTimeZoneToHumanReadableFormat(mapPoint.timezone);

            mapPoint.infoWindow.setContent(content);
        },

        /**
         * Refresh data of all MapPoints
         */
        refreshWeatherData: function () {
            var self = this;

            _.each(self.mapPointCollection.models, function(mapPoint) {
                self.renderMapPointInfoWindowContent(mapPoint.attributes);
            });
        },

        onShow: function () {
            var self = this;

            // Setup elements after bootstrapping of MapView
            self.initializeMap();
            self.setDefaultLocationOnMap();
            self.setCitiesOnMap();
        }
    });
});