/**
 * Created by jeanella on 5/7/2015.
 */

define([
    'underscore',
    'momentTz',
], function(_, Moment) {

    return {
        convertTemp: function () {

        },

        convertTimeToHumanReadableFormat: function (timeInSeconds, timezone) {
            var localTime = Moment.tz(new Date(timeInSeconds * 1000), timezone);

            return Moment(localTime).format('D MMM YYYY, h:mm a');
        }
    }
});
