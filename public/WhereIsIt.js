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

  // try to get the user's geoLocation
  // if geoLocation is supported, the $rootScope.position will get populated
  geoLocationService.getPosition();

  $rootScope.hasPosition = function() {
    return ($rootScope.position != null);
  }

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