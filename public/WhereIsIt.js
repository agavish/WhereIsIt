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

app.directive('onEnter',function() {

  var linkFn = function(scope,element,attrs) {
    element.bind("keypress", function(event) {
      if(event.which === 13) {
        scope.$apply(function() {
      scope.$eval(attrs.onEnter);
        });
        event.preventDefault();
      }
    });
  };

  return {
    link:linkFn
  };
});

app.service('businessesService', ['$http', function($http) {
  return {
    getBusinessesByKeyword: function(keyword, position) {
      var latitude = position.latitude;
      var longitude = position.longitude;
      var coordinates = longitude + ',' + latitude;
      return $http({ method: 'GET', url: '/api/business/' + keyword + '?coordinates=' + coordinates });
    },

    getNearestBusinesses: function(position) {
      var latitude = position.latitude;
      var longitude = position.longitude;
      var coordinates = longitude + ',' + latitude;
      return $http({ method: 'GET', url: '/api/business/nearest/' + coordinates  });
    }
  };
}]);

app.controller("businessesController", ['$scope', 'businessesService', function($scope, businessesService) {
  $scope.position = {
    latitude: "0",
    longitude: "0",
    accuracy: "0"
  }
  $scope.title = "";
  $scope.error = "";
  $scope.loading = false;
  $scope.businesses = [];

  $scope.searchBusinesses = function(keyword) {
    if (keyword) {
      $scope.loading = true;
      $scope.getBusinessesByKeyword(keyword, $scope.position);      
    }
  }  

  $scope.hasBusinesses = function () {
    return $scope.businesses.length > 0;
  }

  $scope.getBusinessesByKeyword = function (keyword, postion) {
    businessesService.getBusinessesByKeyword(keyword, postion)
      .success(function(data, status) {
        $scope.businesses = data;
        $scope.title = 'תוצאות עבור: ' + keyword;
        $scope.loading = false;
      })
      .error(function(data, status) {
        $scope.businesses = [];
        $scope.title = 'לא נמצאו תוצאות עבור: ' + keyword;
        $scope.loading = false;
      });
  }

  $scope.getNearestBusinesses = function () {
    businessesService.getNearestBusinesses($scope.position)
      .success(function(data, status) {

        var businesses = [];
        for (i=0; i<data.length; i++) {
          var distanceMeters = data[i].distanceMeters;
          var business = data[i].obj;
          business['distanceMeters'] = distanceMeters;
          businesses.push(business);
        }

        $scope.businesses = businesses;
        $scope.title = 'עסקים במרחק של עד 1 ק"מ';
        $scope.loading = false;
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
    $scope.loading = true;
    $scope.getNearestBusinesses();
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