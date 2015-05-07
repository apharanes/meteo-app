/**
 * Created by jeanella on 5/6/2015.
 */

define([
    'marionette',
    'templates',
    'models/map/MapPoint'
], function (Marionette, templates, MapPoint) {
    'use strict';

    return Marionette.ItemView.extend({
        template: templates.mapPoint,
        tagName: 'div',
        model: MapPoint,

        initialize: function (options) {
            var self = this;

            self.map = options.map;
            self.model = options.model;

            self.marker = new google.maps.Marker({
                map: self.map,
                position: new google.maps.LatLng(self.model.latitude, self.model.longitude),
                title: self.model.title
            });

            self.marker.setMap(self.map);
        }
    });
});