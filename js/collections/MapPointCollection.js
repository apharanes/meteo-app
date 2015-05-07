/**
 * Created by jeanella on 5/6/2015.
 */

define([
    'backbone',
    'models/map/MapPoint'
], function (Backbone, MapPoint) {
    'use strict';

    return Backbone.Collection.extend({
        model: MapPoint
    });
});