/**
 * Created by jeanella on 5/7/2015.
 */

define([
    'underscore',
    'utility',
    'momentTz'
], function (underscore, utility, Moment) {

    var TimeOfDay = {
        DAY: 'day',
        NIGHT: 'night'
    };

    /**
     * Lookup table for ForecastIO weathernames and weather icon set
     * from @erikflowers
     */
    var forecastIconSet = [
        {name: 'clear-day', timeOfDay: 'day', icon: 'wi-day-sunny'},
        {name: 'clear-night', timeOfDay: 'night', icon: 'wi-night-clear'},
        {name: 'rain', timeOfDay: 'day', icon: 'wi-day-rain'},
        {name: 'snow', timeOfDay: 'day', icon: 'wi-day-snow'},
        {name: 'sleet', timeOfDay: 'day', icon: 'wi-day-snow'},
        {name: 'wind', timeOfDay: 'day', icon: 'wi-day-windy'},
        {name: 'fog', timeOfDay: 'day', icon: 'wi-day-fog'},
        {name: 'cloudy', timeOfDay: 'day', icon: 'wi-day-cloudy'},
        {name: 'partly-cloudy-day', timeOfDay: 'day', icon: 'wi-day-sunny-overcast'},
        {name: 'partly-cloudy-night', timeOfDay: 'night', icon: 'night-partly-cloudy'}
    ];

    return {
        /**
         * Get Icon Class based on weatherName and time of day
         * @param weatherName
         * @param time
         * @param timezone
         * @returns {string|exports.defaults.icon|exports.defaults.weatherInfo.icon|icon|exports.parseWeatherResults.icon|CSSStyleDeclaration.icon}
         */
        getIconClass: function (weatherName, time, timezone){
            return _.findWhere(forecastIconSet, {
                name: weatherName
            }).icon;
        },

        /**
         * Determine localized time of day
         * @param time
         * @param timezone
         * @returns {string}
         */
        getTimeOfDay: function (time, timezone) {
            var localTime = Moment(utility.getCurrentTimeByTimeZone(time, timezone));
            var hour = localTime.format('HH');

            if(hour >= 6 && hour < 18){
                return TimeOfDay.DAY;
            } else {
                return TimeOfDay.NIGHT;
            }
        }
    };
});