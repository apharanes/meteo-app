/**
 * Created by jeanella on 5/7/2015.
 */

define([
    'marionette',
    'jquery',
    'templates',
    'async!https://maps.googleapis.com/maps/api/js?v=3&key=AIzaSyDTqFR5xcTYxrD4vLWIwfaiqQMAXMWfzXQ&sensor=false&libraries=places'
], function (Marionette, $, templates) {
    'use strict';

    return Marionette.ItemView.extend({
        template: templates.map,

        initialize: function (options) {
            var self = this;

            self.defaultCenterLocation = new google.maps.LatLng(45.7772, 3.087);
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

        onShow: function () {
            var self = this;

            self.initializeMap();
        }
    });
});