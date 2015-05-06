/**
 * Created by jeanella on 5/6/2015.
 */

define([
    'marionette',
    'views/map/CityView'
], function (Marionette, CityView) {
    'use strict';

    return Marionette.CollectionView.extend({
        itemView: CityView,
        tagName: 'div',
        className: 'list-group'
    });
});
