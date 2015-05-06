/**
 * Created by jeanella on 5/6/2015.
 */

define([
    'marionette',
    'templates',
    'async!https://maps.googleapis.com/maps/api/js?v=3&key=AIzaSyDTqFR5xcTYxrD4vLWIwfaiqQMAXMWfzXQ&sensor=false&libraries=places',
    //'async!https://maps.googleapis.com/maps/api/js?v=3&sensor=false'
], function (Marionette, templates) {
    'use strict';

    // load google.maps
    return Marionette.ItemView.extend({
        template: templates.map,

        onShow: function () {
            var mapOptions = {
                center: new google.maps.LatLng(45.7772, 3.087),
                zoom: 8,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };

            console.log(this.el);

            var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);


            var autocomplete = new google.maps.places.Autocomplete(
                (document.getElementById('search-autocomplete')),
                { types: ['(cities)'] }
            );
            var places = new google.maps.places.PlacesService(map);

            google.maps.event.addListener(map, 'idle', function () {
                google.maps.event.trigger(map, 'resize');
            });
        }
    });
});