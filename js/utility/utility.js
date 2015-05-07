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

        convertTimeToHumanReadableFormat: function (timezone) {
            var localTime = Moment().tz(timezone);

            return Moment(localTime).format('D MMM YYYY, h:mm a');
        }
    }
});
