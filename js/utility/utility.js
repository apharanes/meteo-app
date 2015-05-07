/**
 * Created by jeanella on 5/7/2015.
 */

define([
    'underscore',
    'momentTz',
], function(_, Moment) {

    return {

        /**
         * Convert a temperature reading between indicated units
         *
         * @param temperature
         * @param fromUnit
         * @param toUnit
         */
        convertTemp: function (temperature, fromUnit, toUnit) {

        },

        /**
         * Returns a human readable format of the current time
         * based from a given timezone
         *
         * @param {String} timezone
         * @returns {*}
         */
        convertTimeZoneToHumanReadableFormat: function (timezone) {
            var localTime = Moment().tz(timezone);

            return Moment(localTime).format('D MMM YYYY, h:mm a');
        }
    }
});
