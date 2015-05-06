/**
 * Created by jeanella on 5/6/2015.
 */

define([
    'marionette',
    'templates',
    'underscore',
    'jquery',
    'async!https://maps.googleapis.com/maps/api/js?v=3&key=AIzaSyDTqFR5xcTYxrD4vLWIwfaiqQMAXMWfzXQ&sensor=false&libraries=places',
    //'async!https://maps.googleapis.com/maps/api/js?v=3&sensor=false'
], function (Marionette, templates) {
    'use strict';

    var defaultCenterLocation = new google.maps.LatLng(45.7772, 3.087);
    var map, places, autocomplete, infowindow;


    // load google.maps
    return Marionette.ItemView.extend({


        template: templates.map,

        initialize: function(options) {
            this.CitiesCollection = options.collection;
        },

        initializeMap: function () {
            var self = this;

            var mapOptions = {
                center: defaultCenterLocation,
                zoom: 6,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };

            map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
            places = new google.maps.places.PlacesService(map);
            autocomplete = new google.maps.places.Autocomplete(
                (document.getElementById('search-autocomplete')),
                { types: ['(cities)'] }
            );

            google.maps.event.addListener(map, 'idle', function () {
                google.maps.event.trigger(map, 'resize');
            });

            google.maps.event.addListener(autocomplete, 'place_changed', function () {
                var city = self.onPlaceChanged();
                self.addCity(city);
            });

            infowindow = new google.maps.InfoWindow({
                content: 'Test Info Data'
            });
        },

        onShow: function () {
            this.initializeMap();
            var self = this;

            var markers = [];
            var marker = new google.maps.Marker({
                position: defaultCenterLocation,
                title: 'Default City'
            });
            self.addCity(marker);

            _.each(this.CitiesCollection.models, function(item){
                var newMarker = new google.maps.Marker({
                    position: new google.maps.LatLng(item.attributes.latitude, item.attributes.longitude),
                    title: item.attributes.title
                });
                newMarker.setMap(map);
                self.addCity(newMarker);
            });
            marker.setMap(map);
        },

        /**
         * Event handlers
         */

        onPlaceChanged: function () {
            var place = autocomplete.getPlace();

            if(place.geometry){
                var newMarker = new google.maps.Marker({
                    title: place.name,
                    position: place.geometry.location
                });

                newMarker.setMap(map);
                map.panTo(place.geometry.location);

                return newMarker;
            }
        },

        addCity: function (city) {
            var self = this;

            self.CitiesCollection.add({ title: city.title, latitude: city.position.k, longitude: city.position.D});

            $.ajax({
                url: 'http://api.openweathermap.org/data/2.5/forecast?APPID=020ad27651aa20936db3c2a857fd5052&lat=' + city.latitude +'&lon=' + city.longitude,
                success: function (result) {
                    // get Latest Weather Info

                    var latestWeatherInfo = result.list[result.list.length-1];

                    var cityInfo = _.extend(city, {
                        weatherInfo: {
                            temp: latestWeatherInfo.main.temp,
                            weather: {
                                main: latestWeatherInfo.weather[0].main,
                                icon: latestWeatherInfo.weather[0].icon
                            }
                        }
                    });

                    google.maps.event.addListener(city, 'click', function () {
                        infowindow.setContent(cityInfo.title +' '+ cityInfo.weatherInfo.weather.main +' '+ cityInfo.weatherInfo.weather.icon);
                        infowindow.open(map, city);
                    });
                }
            });
        }
    });
});