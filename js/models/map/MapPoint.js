/**
 * Created by jeanella on 5/6/2015.
 */

define([
    'backbone',
    'jquery',
    'utility',
    'weatherUtility'
], function (Backbone, $, utility, WeatherUtility) {

    return Backbone.Model.extend({
        defaults: {
            name: '',
            latitude: 0.0,
            longitude: 0.0,
            weatherInfo: {
                time: 0,
                temp: 0.0,
                pressure: 0.0,
                summary: '',
                icon: ''
            },
            infoWindow: {},
            timezone: ''
        },

        initialize: function (options) {
            var self = this;

            self.city = options.city;
            self.mapPoint = self.attributes;
            self.set({placeId: options.placeId});

            self.fetchWeatherInfo()
                .success(function (result) {
                    self.parseMapPoint(result);
                    self.renderMapPointInfoWindowContent();
                });
        },

        fetchWeatherInfo: function () {
            var self = this;
            var city = self.city;

            return $.ajax({
                url: 'https://api.forecast.io/forecast/223ac36a3da5993f7f14cbf3e35a399a/'+city.position.k+','+city.position.D,
                dataType: 'jsonp'
            });
        },

        parseMapPoint: function (result) {
            var self = this;
            var city = self.city;
            var latestWeatherInfo = self.parseWeatherResults(result);

            self.set({name: city.title});
            self.set({latitude: city.position.k});
            self.set({longitude: city.position.D});
            self.set({weatherInfo: latestWeatherInfo});
            self.set({timezone: result.timezone});
            self.set({infoWindow: new google.maps.InfoWindow({
                content: ''
            })});
        },

        /**
         * Custom parser for weather data fetched from the API
         * @param result
         * @returns {Object} weatherInfo field of MapPoint model
         */
        parseWeatherResults: function (result) {
            var current = result['currently'];

            return {
                time: current.time,
                temp: current.temperature,
                pressure: current.pressure,
                summary: current.summary,
                icon: current.icon
            }
        },

        /**
         * Render content for InfoWindow of a specific city on the map
         *
         * @param mapPoint
         */
        renderMapPointInfoWindowContent: function () {
            var self = this;

            var content =
                '<label>City:</label> ' + self.mapPoint.name +'<br />' +
                ' <label>Weather:</label> '+
                self.renderWeatherIcon(self.mapPoint.weatherInfo.icon, Date.now(), self.mapPoint.timezone) + ' ' + self.mapPoint.weatherInfo.summary +'<br />' +
                '<label>Temperature:</label> ' + self.renderTemp(self.mapPoint.weatherInfo.temp,'celsius') + '<br />' +
                '<label>Local Time:</label> ' + utility.convertTimeZoneToHumanReadableFormat(self.mapPoint.timezone);

            self.mapPoint.infoWindow.setContent(content);
        },

        /**
         * Generate html content based on weather conditions and time
         * @param icon
         * @param time
         * @param timezone
         * @returns {string}
         */
        renderWeatherIcon: function (icon, time, timezone){
            var weatherIcon = WeatherUtility.getIconClass(icon, time, timezone);

            return '<span class="wi ' + weatherIcon +'"></span>';
        },

        /**
         * Generate html content based on temperature and target unit
         * @param temperature
         * @param unit
         * @returns {string}
         */
        renderTemp: function(temperature, unit){
            var converted = utility.convertTemp(temperature, 'fahrenheit', unit);

            return converted + '&#176' + unit[0].toUpperCase();
        }
    });
});