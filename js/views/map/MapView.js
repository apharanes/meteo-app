/**
 * Created by jeanella on 5/6/2015.
 */

define([
    'marionette',
    'underscore',
    'jquery',
    'templates',
    'views/map/MapPointView',
    'collections/MapPointCollection',
    'async!https://maps.googleapis.com/maps/api/js?v=3&key=AIzaSyDTqFR5xcTYxrD4vLWIwfaiqQMAXMWfzXQ&sensor=false&libraries=places'
    //'async!https://maps.googleapis.com/maps/api/js?v=3&sensor=false'
], function (Marionette, _, $, templates, MapPointView, MapPointCollection) {
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
        },

        initializeMap: function () {
            var self = this;

            var mapOptions = {
                center: self.defaultCenterLocation,
                zoom: 6,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };

            self.map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
            self.places = new google.maps.places.PlacesService(self.map);
            self.autocomplete = new google.maps.places.Autocomplete(
                (document.getElementById('search-autocomplete')),
                { types: ['(cities)'] }
            );

            google.maps.event.addListener(self.map, 'idle', function () {
                google.maps.event.trigger(self.map, 'resize');
            });

            google.maps.event.addListener(self.autocomplete, 'place_changed', function () {
                var city = self.onPlaceChanged();
                self.addCity(city);
            });

            infowindow = new google.maps.InfoWindow({
                content: 'Test Info Data'
            });
        },

        setDefaultLocationOnMap: function () {
            var self = this;

            var marker = new google.maps.Marker({
                position: self.defaultCenterLocation,
                title: 'Default City'
            });
            self.addCity(marker);
            marker.setMap(self.map);
        },

        setCitiesOnMap: function () {
            var self = this;

            var mapPoints = [];
            _.each(self.cityCollection.models, function(city) {
                mapPoints.push(new MapPointView({map: self.map, model: city.attributes}));
            });
        },

        onShow: function () {
            var self = this;

            self.initializeMap();
            self.setDefaultLocationOnMap();
            self.setCitiesOnMap();
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

        addCity: function (city) {
            var self = this;

            self.cityCollection.add({ title: city.title, latitude: city.position.k, longitude: city.position.D});

            $.ajax({
                url: 'https://api.forecast.io/forecast/223ac36a3da5993f7f14cbf3e35a399a/'+city.position.k+','+city.position.D,
                dataType: 'jsonp',
                success: function (result) {
                    var latestWeatherInfo = self.parseWeatherResults(result);

                    var newMapPoint = {
                        title: city.title,
                        latitude: city.position.k,
                        longitude: city.position.D,
                        weatherInfo: latestWeatherInfo
                    };

                    google.maps.event.addListener(city, 'click', function () {
                        self.showMapPointInfo(city, newMapPoint);
                    });
                }
            });
        },

        parseWeatherResults: function (result) {
            return {
                time: result.currently.time,
                temp: result.currently.temperature,
                pressure: result.currently.pressure,
                summary: result.currently.summary,
                icon: result.currently.icon
            }
        },

        showMapPointInfo: function (city, mapPoint) {
            var self = this;

            var content = mapPoint.title +' '+ mapPoint.weatherInfo.summary +' '+ mapPoint.weatherInfo.icon + ' ' + mapPoint.weatherInfo.temp + ' ' + mapPoint.weatherInfo.time;
            infowindow.setContent(content);
            infowindow.open(self.map, city);
        }
    });
});