/*global define */

define([
    'backbone',
	'marionette',
    'regions/notification',
    'regions/dialog',
	'collections/Nav',
    'collections/CitiesCollection',
    'views/Footer',
    'views/map/AppView',
    'views/map/MapView',
    'views/map/CityListView'
], function (Backbone, Marionette, NotifyRegion, DialogRegion, Nav, CitiesCollection, Footer, AppView, MapView, CityListView) {
	'use strict';

	var app = new Marionette.Application();
    var citiesSample = new CitiesCollection([{title:'Clermont', latitude:45.7772, longitude: 3.087},{title:'City 2', latitude:46.7772, longitude: 4.087}]);

    var cityList = new CityListView({collection: citiesSample});
    var appView = new AppView({collection: citiesSample});

	app.addRegions({
		main: '#main',
		footer: '#footer',
        notification: {
            selector: "#notification",
            regionType: NotifyRegion
        },
        dialog: {
            selector: "#dialog",
            regionType: DialogRegion
        },
        appView: '#app'
	});

	app.addInitializer(function () {
		app.footer.show(new Footer());
        app.appView.show(appView);

        appView.cityList.show(cityList);
	});

    app.on("initialize:after", function(options){
        if (Backbone.history){
            Backbone.history.start();
        }
    });

    app.vent.on('cityList:activate', function () {
        appView.render();
        cityList.render();
    });

    /**
     * Sample JSON Data
     * app.commands.execute("app:notify", {
     *           type: 'warning'    // Optional. Can be info(default)|danger|success|warning
     *           title: 'Success!', // Optional
     *           description: 'We are going to remove Team state!'
     *       });
     */
    app.commands.setHandler("app:notify", function(jsonData) {
        require(['views/NotificationView'], function(NotifyView) {
            app.notification.show(new NotifyView({
                model: new Backbone.Model(jsonData)
            }));
        });
    });

    /**
     * @example
     * app.commands.execute("app:dialog:simple", {
     *           icon: 'info-sign'    // Optional. default is (glyphicon-)bell
     *           title: 'Dialog title!', // Optional
     *           message: 'The important message for user!'
     *       });
     */
    app.commands.setHandler("app:dialog:simple", function(data) {
        require(['views/DialogView', 'models/Dialog', 'tpl!templates/simpleModal.html'],
            function(DialogView, DialogModel, ModalTpl) {

                app.dialog.show(new DialogView({
                    template: ModalTpl,
                    model: new DialogModel(data)
                }));
            });
    });

    /**
     * @example
     * app.commands.execute("app:dialog:confirm", {
     *           icon: 'info-sign'    // Optional. default is (glyphicon-)bell
     *           title: 'Dialog title!', // Optional
     *           message: 'The important message for user!'
     *           'confirmYes': callbackForYes, // Function to execute of Yes clicked
     *           'confirmNo': callbackForNo, // Function to execute of No clicked
     *       });
     */
    app.commands.setHandler("app:dialog:confirm", function(data) {
        require(['views/DialogView', 'models/Dialog', 'tpl!templates/confirmModal.html'],
            function(DialogView, DialogModel, ModalTpl) {

                app.dialog.show(new DialogView({
                    template: ModalTpl,
                    model: new DialogModel(data),
                    events: {
                        'click .dismiss': 'dismiss',
                        'click .confirm_yes': data.confirmYes,
                        'click .confirm_no': data.confirmNo
                    }
                }));
            });
    });

	return window.app = app;
});
