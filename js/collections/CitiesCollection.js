/**
 * Created by jeanella on 5/6/2015.
 */

define([
    'backbone',
    'models/map/City'
], function(Backbone, City) {
    'use strict';

    return Backbone.Collection.extend({
        model: City
    });
});