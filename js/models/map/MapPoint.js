/**
 * Created by jeanella on 5/6/2015.
 */

define([
    'backbone',
    'jquery',
    'utility',
    'weatherUtility',
    'async!https://maps.googleapis.com/maps/api/js?v=3&sensor=false&libraries=places'
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

        initialize: function (city) {
            var self = this;

            self.city = city;
            self.fetchWeatherInfo(city);
        },

        fetchWeatherInfo: function () {
            var self = this;
            var city = self.city;

            return $.ajax({
                url: 'https://api.forecast.io/forecast/223ac36a3da5993f7f14cbf3e35a399a/'+city.position.k+','+city.position.D,
                dataType: 'jsonp',
                success: function (result) {

                    // Fetch only latest weather data for city
                    var latestWeatherInfo = self.parseWeatherResults(result);

                    self.set({title: city.title});
                    self.set({latitude: city.position.k});
                    self.set({longitude: city.position.D});
                    self.set({weatherInfo: latestWeatherInfo});
                    self.set({timezone: result.timezone});
                    self.set({infoWindow: new google.maps.InfoWindow({
                        content: ''
                    })});

                    self.renderMapPointInfoWindowContent();
                }
            });
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
            var self = this,
                mapPoint = self.attributes;

            var content =
                '<label>City:</label> ' + mapPoint.title +'<br />' +
                ' <label>Weather:</label> '+
                self.renderWeatherIcon(mapPoint.weatherInfo.icon, Date.now(), mapPoint.timezone) + ' ' + mapPoint.weatherInfo.summary +'<br />' +
                '<label>Temperature:</label> ' + self.renderTemp(mapPoint.weatherInfo.temp,'celsius') + '<br />' +
                '<label>Time:</label> ' + utility.convertTimeZoneToHumanReadableFormat(mapPoint.timezone);

            mapPoint.infoWindow.setContent(content);
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