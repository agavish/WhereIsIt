/**
 * Created by avi on 8/8/2014.
 */
var app = angular.module('WhereIsIt', ['ngRoute', 'ngAnimate', 'ngSanitize', 'angularMoment', 'services', 'controllers'])
                    .run(['$rootScope', '$window', 'sessionService', 'geoLocationService', 'amMoment', function ($rootScope, $window, sessionService, geoLocationService, amMoment) {

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

  // angular moment is used to translate Date objetcs to meaningful strings.
  // it supports localization, and in particular, it has hebrew translations.
  // see business.html under partials, in the business reviews section. 
  amMoment.changeLocale('he');

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
