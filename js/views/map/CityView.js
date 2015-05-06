/**
 * Created by jeanella on 5/6/2015.
 */

define([
    'marionette',
    'templates',
    'models/map/City'
], function (Marionette, templates, City) {
    'use strict';

    return Marionette.ItemView.extend({
        template: templates.city,
        tagName: 'div',
        className: 'city list-item-group',
        model: City
    });
});