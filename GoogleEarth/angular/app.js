var _ge;

(function() {

    var app = angular.module('app', []);


    app.init = function(){
        var ge;
        google.load("earth", "1", {"other_params": "sensor=true_or_false"});

        function init() {
            google.earth.createInstance('map', initCB, failureCB);
        }

        function initCB(instance) {
            ge = instance;
            ge.getWindow().setVisibility(true);
            ge.getOptions().setFlyToSpeed(.3);
            _ge = ge;
        }

        function failureCB(errorCode) {
        }

        google.setOnLoadCallback(init);
    };

    app.init();
}());