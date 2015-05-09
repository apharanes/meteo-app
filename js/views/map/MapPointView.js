/**
 * Created by jeanella on 5/6/2015.
 */

define([
    'marionette',
    'templates',
    'models/map/MapPoint',
    'utility',
    'weatherUtility'
], function (Marionette, templates, MapPoint, utility, WeatherUtility) {
    'use strict';

    return Marionette.ItemView.extend({
        template: templates.mapPoint,
        tagName: 'div',
        model: MapPoint,

        initialize: function (options) {
            var self = this;

            self.map = options.map;
            self.marker = options.marker;
            self.model = new MapPoint(self.marker);
            self.mapPoint = self.model.attributes;

            self.render();
        },

        render: function () {
            var self = this;

            self.marker.setMap(self.map);

            self.model.fetchWeatherInfo()
                .then(function () {
                    self.mapPoint.infoWindow.open(self.map, self.marker);
                });
        }
    });
});