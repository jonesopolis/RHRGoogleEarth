(function(app) {

    var apiService = function ($http, $log) {

        var getHouses = function(){
            return $http.get("http://localhost:56143/House/GetHouses").then(function(resp) {
               return resp.data;
            });
        };

        return {
          getHouses: getHouses
        }
    };

    app.factory('apiService', apiService);

}(angular.module('app')));