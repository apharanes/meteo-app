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
            forecast: {}
        },
        fetchForecastInfo: function () {
            console.log('fetchForecastInfo');
        }
    });
});