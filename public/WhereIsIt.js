/**
 * Created by avi on 8/8/2014.
 */
var app = angular.module('WhereIsIt', ['ngRoute', 'ngAnimate', 'ngSanitize', 'angularMoment', 'ui.bootstrap', 'services', 'controllers'])
                    .run(['$rootScope', '$window', '$location','sessionService', 'geoLocationService', 'amMoment', function ($rootScope, $window, $location, sessionService, geoLocationService, amMoment) {

  // these rootScope variables serves all inner controllers and views
  $rootScope.session = sessionService;
  $rootScope.position = null;
  $rootScope.loading = false;
  $rootScope.title = "";

        /*
  // register listener to watch route changes
  $rootScope.$on( "$routeChangeStart", function(event, next, current) {
    if ( $rootScope.isLoggedIn == null || $rootScope.isLoggedIn == false) {
        console.log("not logged in");


        // no logged user, we should be going to #index
        if ( next.templateUrl == "/views/index.html" ) {
            // already going to #index, no redirect needed
        } else {
            // not going to #index, we should redirect now
            $location.path( "/" );
        }
    }
  });
  */

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

  $rootScope.redirectToIndex = function() {
    $rootScope.title = "";
    $location.hash("");
    $location.path("/");
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
        controller: 'businessController',
        resolve: {
            factory: CheckIfLoggedIn
        }
      })
      .when('/business/:businessId', {
        templateUrl: '/views/partials/business.html',
        controller: 'businessController'
      })
      .when('/business/:businessId/update', {
        templateUrl: '/views/partials/businessUpdate.html',
        controller: 'businessController',
        resolve: {
            factory: CheckIfLoggedIn
        }
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
        controller: 'userController',
        resolve: {
            factory: CheckIfLoggedIn
        }
      })
      .when('/error', {
        templateUrl: '/views/partials/error.html'
      })
      .otherwise({
        redirectTo: '/'
      });

      // use the HTML5 History API
      $locationProvider.html5Mode(true);
  }]);


var CheckIfLoggedIn= function ($rootScope, $location) {
    if ($rootScope.isLoggedIn) {
        return true;
    } else {
        $location.path("/error");
    }
};

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

app.directive('scrolltoanchor', ['$timeout', '$location', '$anchorScroll', function($timeout, $location, $anchorScroll) {
  return {
    link: function(scope, element, attrs, model) {
      $timeout(function() {
        var currentHash = $location.hash();
        var anchored = $("#"+currentHash);
        if (currentHash && anchored) {
          if (anchored.offset()) {
            $('html, body').animate({scrollTop: anchored.offset().top}, 1000);
          }
        }
      }, 0);
    }
  };
}]);
