/**
 * Created by avi on 8/8/2014.
 */
var app = angular.module('WhereIsIt', ['ngRoute', 'ngAnimate', 'ngSanitize', 'services', 'controllers']).run(['$rootScope', '$window', 'sessionService', 'geoLocationService', function ($rootScope, $window, sessionService, geoLocationService) {

  // these rootScope variables serves all inner controllers and views
  $rootScope.session = sessionService;
  $rootScope.position = null;
  $rootScope.loading = false;
  $rootScope.title = "";

  // authenticate and handle session and logged in user on app startup
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

  $rootScope.getPosition = function() {
    geoLocationService.getPosition();
  }

  $rootScope.hasPosition = function() {
    return ($rootScope.position != null);
  }

  $rootScope.getPosition();

}]);

app.config(['$routeProvider', '$locationProvider', 
  function($routeProvider, $locationProvider) {
    $routeProvider.
      when('/business/create/new', {
        templateUrl: '/views/partials/businessCreate.html',
        controller: 'businessController'
      })
      .when('/business/:businessId', {
        templateUrl: '/views/partials/business.html',
        controller: 'businessController'
      })
      .when('/business/:businessId/update', {
        templateUrl: '/views/partials/businessUpdate.html',
        controller: 'businessController'
      })
      .when('/search/keyword/:keyword', {
        templateUrl: '/views/partials/search.html',
        controller: 'searchController'
      })
      .when('/search/nearest', {
        templateUrl: '/views/partials/search.html',
        controller: 'searchController'
      })
      .when('/users/:id', {
        templateUrl: '/views/partials/user.html',
        controller: 'userController'
      })
      .otherwise({
        redirectTo: '/'
      });

      // use the HTML5 History API
      $locationProvider.html5Mode(true);
  }]);

app.directive('googleautocomplete', function() {
  return {
    require: 'ngModel',
    link: function(scope, element, attrs, model) {
      var options = {
        types: [],
        componentRestrictions: {}
      };
      scope.googlePlace = new google.maps.places.Autocomplete(element[0], options);

      google.maps.event.addListener(scope.googlePlace, 'place_changed', function() {
        scope.$apply(function() {
          model.$setViewValue(element.val());
        });
      });
    }
  };
});

app.directive('googledirections', function() {
  return {
    require: 'ngModel',
    link: function(scope, element, attrs, model) {
      var directionsService = new google.maps.DirectionsService();
      var directionsDisplay = new google.maps.DirectionsRenderer();
      var myPosition = scope.$root.position;
      if (!myPosition) {
        getPosition();        
      } else {
        init();
      }

      function getPosition() {
        if ("geolocation" in navigator) {
          var options = {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
          };
          navigator.geolocation.getCurrentPosition(success, null, options);
        }
      }

      function success(position) {
        myPosition = position.coords;
        init();
      }

      function init() {
        var mapOptions = {
          zoom: 18,
          center: new google.maps.LatLng(myPosition.latitude, myPosition.longitude)
        };
        scope.googleMap = new google.maps.Map(element[0], mapOptions);
        scope.googleDirections = {};
        directionsDisplay.setMap(scope.googleMap);
      }

      scope.$watch('business.address.coordinates', function(oldCoordinates, newCoordinates) {
        if (oldCoordinates || newCoordinates) {
          getDirections();
        }
      });

      function getDirections() {
        var start = myPosition.latitude + "," + myPosition.longitude;
        var end = scope.business.address.coordinates[1] + "," + scope.business.address.coordinates[0];
        var request = {
          origin: start,
          destination: end,
          travelMode: google.maps.TravelMode.DRIVING
        };
        directionsService.route(request, function(response, status) {
          if (status == google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(response);
          }
        });
      }
    }
  };
});
