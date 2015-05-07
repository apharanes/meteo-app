/**
 * Created by jeanella on 5/7/2015.
 */

define([
    'underscore',
    'momentTz',
], function(_, Moment) {
    var Temp = {
        CELSIUS: 'celsius',
        FAHRENHEIT: 'fahrenheit',
        KELVIN: 'kelvin'
    };

    return {

        /**
         * Convert a temperature reading between indicated units
         *
         * @param temperature
         * @param fromUnit
         * @param toUnit
         */
        convertTemp: function (temperature, fromUnit, toUnit) {
            var converted = 0;

            if(toUnit === Temp.CELSIUS){
                if(fromUnit === Temp.FAHRENHEIT){
                    converted = (temperature - 32) * 5 / 9;
                }
                if(fromUnit === Temp.KELVIN){
                    converted = temperature - 273.15;
                }
            }

            if(toUnit === Temp.FAHRENHEIT){
                if(fromUnit === Temp.CELSIUS){
                    converted = (temperature * 1.8) + 32;
                }

                // Convert first to Celsius before converting Fahrenheit
                if(fromUnit === Temp.KELVIN){
                    converted = this.convertTemp(
                        this.convertTemp(temperature, Temp.KELVIN, Temp.CELSIUS),
                        Temp.CELSIUS, Temp.FAHRENHEIT
                    );
                }
            }

            if(toUnit === Temp.KELVIN){
                if(fromUnit === Temp.CELSIUS){
                    converted = temperature + 273.15;
                }

                // Convert first to Celsius before converting to Kelvin
                if(fromUnit == Temp.FAHRENHEIT){
                    converted = this.convertTemp(
                        this.convertTemp(temperature, Temp.FAHRENHEIT, Temp.CELSIUS),
                        Temp.CELSIUS, Temp.KELVIN
                    );
                }
            }

            return Math.floor(converted);
        },

        /**
         * Returns a human readable format of the current time
         * based from a given timezone
         *
         * @param {String} timezone
         * @returns {*}
         */
        convertTimeZoneToHumanReadableFormat: function (timezone) {
            var localTime = this.getCurrentTimeByTimeZone(Date.now(), timezone);

            return Moment(localTime).format('D MMM YYYY, h:mm a');
        },

        getCurrentTimeByTimeZone: function (time, timezone) {
            return Moment(time).tz(timezone);
        }
    }
});
