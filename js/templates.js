/*global define */

define(function (require) {
	'use strict';

	return {
        page: require('tpl!templates/page.html'),
		footer: require('tpl!templates/footer.html'),
        map: require('tpl!templates/map/map.html'),
        city: require('tpl!templates/map/city.html'),
        app: require('tpl!templates/map/app.html')
	};
});

