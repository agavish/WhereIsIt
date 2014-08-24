/**
 * Created by avi on 8/8/2014.
 */
var app = angular.module('WhereIsIt', [])
  .run(['$rootScope', '$window', 'sessionService',
    function ($rootScope, $window, sessionService) {
    $rootScope.session = sessionService;
    $window.app = {
      authState: function(state, user) {
        $rootScope.$apply(function() {
          switch (state) {
            case 'success':
              sessionService.authSuccess(user);
              break;
            case 'failure':
              sessionService.authFailed();
              break;
            }      
          });
        }
      };

      if ($window.user !== null) {
        sessionService.authSuccess($window.user);
      }
  }]);

app.service('nearestBusinessesService', ['$http', function($http) {
  return {
    getNearestBusinesses: function(position) {

      var latitude = position.latitude;
      var longitude = position.longitude;
      var coordinates = longitude + ',' + latitude;
      return $http({ method: 'GET', url: '/business/nearest/' + coordinates  });
    }
  };
}]);

app.controller("locationController", ['$scope', 'nearestBusinessesService', function($scope, nearestBusinessesService) {
  $scope.position = {
    latitude: "0",
    longitude: "0",
    accuracy: "0"
  }
  $scope.nearestBusinesses = [];
  $scope.error = "";

  $scope.getNearestBusinesses = function () {

    nearestBusinessesService.getNearestBusinesses($scope.position)
      .success(function(data, status) {
        $scope.nearestBusinesses = data;
      })
  }

  $scope.isGeolocationSupported = function () {
    return $scope.error == "";
  }

  $scope.setPosition = function (position) {
    $scope.position.latitude = position.coords.latitude;
    $scope.position.longitude = position.coords.longitude;
    $scope.position.accuracy = position.coords.accuracy;
    $scope.$apply();
  }

  $scope.initLocation = function () {
    if (navigator.geolocation) {
      var options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      };
      navigator.geolocation.getCurrentPosition($scope.setPosition, null, options);
    }
    else {
      $scope.error = "Geolocation is not supported by this browser.";
    }
  }

  $scope.initLocation();
}]);
