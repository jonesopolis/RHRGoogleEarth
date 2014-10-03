(function (app) {

    var tourService = function ($http, $log) {

        var APIKEY = "AIzaSyCui5fi3atRBeE_JkgCfIZZVI2LGNB930E";

        var getLatLong = function (address) {
            address = address.replace(" ", "+");
            return $http.get("https://maps.googleapis.com/maps/api/geocode/json", { params: { address: address, key: APIKEY} })
                .then(function (resp) {
                    return {
                        lat: resp.data.results[0].geometry.location.lat,
                        lng: resp.data.results[0].geometry.location.lng
                    }
                });
        };

        var getKmlForCoords = function (coords) {
                return $http.get('/angular/tour.xml').then(function (resp) {
                    var kmlString = resp.data.replace(/\[LATITUDE\]/g, coords.lat).replace(/\[LONGITUDE\]/g, coords.lng);
                    return _ge.parseKml(kmlString);
                });

        };

        return {
            getLatLong: getLatLong,
            getKmlForCoords: getKmlForCoords
        }
    };

    app.factory('tourService', tourService);

}(angular.module('app')));

