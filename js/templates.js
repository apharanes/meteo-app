/*global define */

define(function (require) {
	'use strict';

	return {
        page: require('tpl!templates/page.html'),
        menuItem: require('tpl!templates/menuItem.html'),
		footer: require('tpl!templates/footer.html')
	};
});

