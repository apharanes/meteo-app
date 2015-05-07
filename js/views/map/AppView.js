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
        template: templates.app,

        regions: {
            mapView: '#map-container',
            cityList: '#city-list'
        },

        initialize: function (options) {
            var self = this;

            self.defaultCenterLocation = new google.maps.LatLng(45.7772, 3.087);
            self.cityCollection = options.collection;
        },

        onShow: function () {
            var self = this;
        }
    });
});