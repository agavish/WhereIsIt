/**
 * Created by avi on 8/8/2014.
 */
var app = angular.module('WhereIsIt', ['ngRoute', 'services', 'controllers'])
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

app.config(['$routeProvider', '$locationProvider', 
  function($routeProvider, $locationProvider) {
    $routeProvider.
      when('/business/:businessId', {
        templateUrl: '/views/partials/business.html',
        controller: 'businessController'
      })
      .when('/search/:keyword', {
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