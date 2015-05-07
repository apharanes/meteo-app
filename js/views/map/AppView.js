/**
 * Created by jeanella on 5/7/2015.
 */

define([
    'marionette',
    'underscore',
    'jquery',
    'templates',
    'views/map/MapPointView',
    'async!https://maps.googleapis.com/maps/api/js?v=3&key=AIzaSyDTqFR5xcTYxrD4vLWIwfaiqQMAXMWfzXQ&sensor=false&libraries=places'
], function (Marionette, _, $, templates, MapPointView) {
    'use strict';

    return Marionette.LayoutView.extend({
        template: templates.map,

        regions: {
            cityList: '#city-list'
        },

        initialize: function (options) {
            var self = this;

            console.log(options.collection);
            self.defaultCenterLocation = new google.maps.LatLng(45.7772, 3.087);
            self.cityCollection = options.collection;
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
        },

        initializeCityList:  function () {
            var self = this;

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
            self.setCitiesOnMap();
        }
    });
});