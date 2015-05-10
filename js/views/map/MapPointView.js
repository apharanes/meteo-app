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
            self.marker = options.marker;
            self.model = options.model;
            self.mapPoint = self.model.attributes;

            self.render();
        },

        render: function () {
            var self = this;

            self.marker.setMap(self.map);

            self.model.fetchWeatherInfo()
                .success(function (result) {
                    self.model.parseMapPoint(result);
                    self.model.renderMapPointInfoWindowContent();
                    self.mapPoint.infoWindow.open(self.map, self.marker);
                });
        }
    });
});