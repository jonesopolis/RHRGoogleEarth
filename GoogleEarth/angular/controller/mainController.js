(function (app) {

    var mainController = function ($scope, $q, $log, tourService, apiService) {

        var tourHouses = function () {
            $scope.houses.reduce(function (curr,next) {
                return curr.then(function(){
                    $scope.currentTour = null;
                    return tourHouse(next);
                });
            }, Promise.resolve()).then(function(){
                apiService.getHouses().then(function(data){
                    $scope.houses = data;
                });
            });
        };

        var tourHouse = function (item) {
            $scope.currentTour = item;
            document.getElementById('info').style.width = document.getElementById('info-inner').width + 'px';
            $log.log(document.getElementById('info').style.width);
            $log.log(document.getElementById('info-inner').width + 'px');

            return tourService.getLatLong(item.address).then(function (coords) {
                return tourService.getKmlForCoords(coords).then(function (kml) {

                    addPlacemark(coords);
                    _ge.getTourPlayer().setTour(kml);
                    _ge.getTourPlayer().play();

                    var counter = 0;
                    var d = $q.defer();
                    var waitForTour = function () {
                        if (counter < _ge.getTourPlayer().getDuration()) {
                            ++counter;
                            setTimeout(waitForTour, 1000);
                        } else {
                            d.resolve();
                        }
                    };

                    waitForTour();

                    return d.promise;
                });
            });
        };

        var addPlacemark = function(coords){
            var placemark = _ge.createPlacemark('');

            var icon = _ge.createIcon('');
            icon.setHref('http://jonesopolis.azurewebsites.net/style/rhr.png');
            var style = _ge.createStyle('');
            style.getIconStyle().setIcon(icon);
            placemark.setStyleSelector(style);

            var point = _ge.createPoint('');
            point.setLatitude(coords.lat);
            point.setLongitude(coords.lng);
            placemark.setGeometry(point);

            _ge.getFeatures().appendChild(placemark);
        }

        var starter = function(){
            apiService.getHouses().then(function(data){
                $scope.houses = data;
                setTimeout(function(){ tourHouses()}, 5000);
            });
        }();

    };

    app.controller('mainController', mainController);
}(angular.module('app')));