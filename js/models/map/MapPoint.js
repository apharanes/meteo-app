/**
 * Created by jeanella on 5/6/2015.
 */

define([
    'backbone'
], function (Backbone) {

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
        fetchForecastInfo: function () {
            console.log('fetchForecastInfo');
        }
    });
});